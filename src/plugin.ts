import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';

/**
 * azurePlugin backend plugin
 *
 * @public
 */
export const azurePlugin = createBackendPlugin({
  pluginId: 'azure',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({
        httpRouter,
        logger,
        config,
      }) {
        const router = await createRouter({
          logger,
          config,
        });

        httpRouter.use(router);

        httpRouter.addAuthPolicy({
          path: '/api/azure/resources',
          allow: 'unauthenticated',
        });
        
        httpRouter.addAuthPolicy({
          path: '/api/azure/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});