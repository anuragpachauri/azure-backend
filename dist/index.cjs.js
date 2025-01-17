'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rootHttpRouter = require('@backstage/backend-defaults/rootHttpRouter');
var express = require('express');
var Router = require('express-promise-router');
var armResourcegraph = require('@azure/arm-resourcegraph');
var identity = require('@azure/identity');
var backendPluginApi = require('@backstage/backend-plugin-api');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e : { default: e }; }

var express__default = /*#__PURE__*/_interopDefaultCompat(express);
var Router__default = /*#__PURE__*/_interopDefaultCompat(Router);

class AzureResourceGraphQuery {
  client;
  constructor(tenantId, clientId, clientSecret) {
    const credentials = new identity.ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret
    );
    this.client = new armResourcegraph.ResourceGraphClient(credentials);
  }
  async queryResourcesByTag(subscriptionId, tagKey, tagValue) {
    const query = `Resources
      | where tags['${tagKey}'] == '${tagValue}'`;
    const result = await this.client.resources({
      subscriptions: [subscriptionId],
      query
    });
    return result.data;
  }
}

async function createRouter(options) {
  const { logger, config } = options;
  const router = Router__default.default();
  router.use(express__default.default.json());
  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.json({ status: "ok" });
  });
  const subscriptionId = config.getString("azure.subscriptionId");
  const tenantId = config.getString("azure.tenantId");
  const clientId = config.getString("azure.clientId");
  const clientSecret = config.getString("azure.clientSecret");
  const azureResourceGraphQuery = new AzureResourceGraphQuery(
    tenantId,
    clientId,
    clientSecret
  );
  router.get("/resources", async (req, res) => {
    const { tagKey, tagValue } = req.query;
    try {
      const resources = await azureResourceGraphQuery.queryResourcesByTag(
        subscriptionId,
        tagKey,
        tagValue
      );
      res.json(resources);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to fetch Azure resources: ${error.message}`);
        res.status(500).json({ error: error.message });
      } else {
        logger.error(
          "An unknown error occurred while fetching Azure resources."
        );
        res.status(500).json({
          error: "An unknown error occurred while fetching Azure resources."
        });
      }
    }
  });
  const middleware = rootHttpRouter.MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());
  return router;
}

const azurePlugin = backendPluginApi.createBackendPlugin({
  pluginId: "azure",
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: backendPluginApi.coreServices.httpRouter,
        logger: backendPluginApi.coreServices.logger,
        config: backendPluginApi.coreServices.rootConfig
      },
      async init({ httpRouter, logger, config }) {
        const router = await createRouter({
          logger,
          config
        });
        httpRouter.use(router);
        httpRouter.addAuthPolicy({
          path: "/api/azure/resources",
          allow: "unauthenticated"
        });
        httpRouter.addAuthPolicy({
          path: "/api/azure/health",
          allow: "unauthenticated"
        });
      }
    });
  }
});

exports.createRouter = createRouter;
exports.default = azurePlugin;
//# sourceMappingURL=index.cjs.js.map
