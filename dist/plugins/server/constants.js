"use strict";
/*
 * Silex website builder, free/libre no-code tool for makers.
 * Copyright (c) 2023 lexoyo and Silex Labs foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEV_MESSAGE = exports.SILEX_VERSION = exports.API_WEBSITE_META_WRITE = exports.API_WEBSITE_META_READ = exports.API_WEBSITE_ASSETS_WRITE = exports.API_WEBSITE_ASSET_READ = exports.API_WEBSITE_LIST = exports.API_WEBSITE_DUPLICATE = exports.API_WEBSITE_DELETE = exports.API_WEBSITE_CREATE = exports.API_WEBSITE_WRITE = exports.API_WEBSITE_READ = exports.API_WEBSITE_PATH = exports.API_PUBLICATION_STATUS = exports.API_PUBLICATION_PUBLISH = exports.API_PUBLICATION_PATH = exports.API_CONNECTOR_LOGIN_CALLBACK = exports.API_CONNECTOR_SETTINGS = exports.API_CONNECTOR_LOGIN = exports.API_CONNECTOR_LOGOUT = exports.API_CONNECTOR_LIST = exports.API_CONNECTOR_USER = exports.API_CONNECTOR_PATH = exports.API_PATH = exports.CLIENT_CONFIG_FILE_NAME = exports.DEFAULT_LANGUAGE = exports.DEFAULT_WEBSITE_ID = exports.WEBSITE_PAGES_FOLDER = exports.WEBSITE_META_DATA_FILE = exports.WEBSITE_DATA_FILE = void 0;
/**
 * @fileoverview define constants for Silex client and server
 */
exports.WEBSITE_DATA_FILE = 'website.json';
exports.WEBSITE_META_DATA_FILE = 'meta.json';
exports.WEBSITE_PAGES_FOLDER = 'src';
exports.DEFAULT_WEBSITE_ID = 'default';
exports.DEFAULT_LANGUAGE = 'en';
exports.CLIENT_CONFIG_FILE_NAME = 'silex.js';
exports.API_PATH = '/api';
exports.API_CONNECTOR_PATH = '/connector';
exports.API_CONNECTOR_USER = '/user';
exports.API_CONNECTOR_LIST = '/';
exports.API_CONNECTOR_LOGOUT = '/logout';
exports.API_CONNECTOR_LOGIN = '/login';
exports.API_CONNECTOR_SETTINGS = '/settings';
exports.API_CONNECTOR_LOGIN_CALLBACK = '/login/callback';
exports.API_PUBLICATION_PATH = '/publication';
exports.API_PUBLICATION_PUBLISH = '/';
exports.API_PUBLICATION_STATUS = '/publication/status';
exports.API_WEBSITE_PATH = '/website';
exports.API_WEBSITE_READ = '/';
exports.API_WEBSITE_WRITE = '/';
exports.API_WEBSITE_CREATE = '/';
exports.API_WEBSITE_DELETE = '/';
exports.API_WEBSITE_DUPLICATE = '/duplicate';
exports.API_WEBSITE_LIST = '/';
exports.API_WEBSITE_ASSET_READ = '/assets';
exports.API_WEBSITE_ASSETS_WRITE = '/assets';
exports.API_WEBSITE_META_READ = '/meta';
exports.API_WEBSITE_META_WRITE = '/meta';
try {
    exports.SILEX_VERSION = SILEX_VERSION_ENV;
}
catch (e) {
    // fallback to default value
    exports.SILEX_VERSION = exports.SILEX_VERSION || '3.0.0';
}
exports.DEV_MESSAGE = `
__________________________________________________________

  Create static websites visually, with dynamic content,
  in the free spirit of the web.

  ███████ ██ ██      ███████ ██   ██     ██    ██ ██████
  ██      ██ ██      ██       ██ ██      ██    ██      ██
  ███████ ██ ██      █████     ███       ██    ██  █████
       ██ ██ ██      ██       ██ ██       ██  ██       ██
  ███████ ██ ███████ ███████ ██   ██       ████   ██████ ${exports.SILEX_VERSION.slice(1)}

  Users are expected to contribute:

  * Web designers: https://docs.silex.me/en/user/contribute
  * Developers: https://docs.silex.me/en/dev/contribute

__________________________________________________________
`;
//# sourceMappingURL=constants.js.map