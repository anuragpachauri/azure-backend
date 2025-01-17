import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { AzureResourceGraphQuery } from './AzureResourceGraphQuery';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  // Health check endpoint
  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  // Azure configuration
  const subscriptionId = config.getString('azure.subscriptionId');
  const tenantId = config.getString('azure.tenantId');
  const clientId = config.getString('azure.clientId');
  const clientSecret = config.getString('azure.clientSecret');

  const azureResourceGraphQuery = new AzureResourceGraphQuery(
    tenantId,
    clientId,
    clientSecret,
  );

  // Azure resources endpoint
  router.get('/resources', async (req, res) => {
    const { tagKey, tagValue } = req.query;

    try {
      const resources = await azureResourceGraphQuery.queryResourcesByTag(
        subscriptionId,
        tagKey as string,
        tagValue as string,
      );
      res.json(resources);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to fetch Azure resources: ${error.message}`);
        res.status(500).json({ error: error.message });
      } else {
        logger.error(
          'An unknown error occurred while fetching Azure resources.',
        );
        res.status(500).json({
          error: 'An unknown error occurred while fetching Azure resources.',
        });
      }
    }
  });

  // Middleware
  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());

  return router;
}
