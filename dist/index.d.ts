import * as _backstage_backend_plugin_api from '@backstage/backend-plugin-api';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';

interface RouterOptions {
    logger: LoggerService;
    config: Config;
}
declare function createRouter(options: RouterOptions): Promise<express.Router>;

/**
 * azurePlugin backend plugin
 *
 * @public
 */
declare const azurePlugin: _backstage_backend_plugin_api.BackendFeatureCompat;

export { type RouterOptions, createRouter, azurePlugin as default };
