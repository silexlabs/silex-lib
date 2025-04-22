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

import grapesjs, { Editor, EditorConfig } from 'grapesjs'
import openImport from './openImport'

/**
 * @fileoverview This is where grapes config gets created
 * Handle plugins, options and initialization of the editor
 */

const notificationContainer = document.createElement('div')

// ////////////////////
// Plugins
// ////////////////////
import blocksBasicPlugin from 'grapesjs-blocks-basic'
import styleFilterPlugin from 'grapesjs-style-filter'
import formPlugin from 'grapesjs-plugin-forms'
import codePlugin from 'grapesjs-custom-code'
import uiSuggestClasses from '@silexlabs/grapesjs-ui-suggest-classes'
import filterStyles from '@silexlabs/grapesjs-filter-styles'
import symbolsPlugin from '@silexlabs/grapesjs-symbols'
import loadingPlugin from '@silexlabs/grapesjs-loading'
import fontsDialogPlugin from '@silexlabs/grapesjs-fonts'
import symbolDialogsPlugin, { cmdPromptAddSymbol } from './symbolDialogs'
import loginDialogPlugin, { LoginDialogOptions, cmdLogout } from './LoginDialog'
import footerPlugin from './footer'
import breadcrumbsPlugin from './breadcrumbs'
import imgPlugin from './img'
import cssPropsPlugin from './css-props'
import rateLimitPlugin from '@silexlabs/grapesjs-storage-rate-limit'
import borderPugin from 'grapesjs-style-border'
import backgroundPlugin from 'grapesjs-style-bg'
import resizePanelPlugin from './resize-panel'
import notificationsPlugin, { NotificationEditor } from '@silexlabs/grapesjs-notifications'

// import keymapsDialogPlugin, { cmdKeymapsDialog, defaultOptions as keymapsDialogOpts } from '@silexlabs/grapesjs-keymaps-dialog'

import { pagePanelPlugin, cmdTogglePages, cmdAddPage } from './page-panel'
import { newPageDialog, cmdOpenNewPageDialog } from './new-page-dialog'
import { PROJECT_BAR_PANEL_ID, projectBarPlugin } from './project-bar'
import { settingsDialog, cmdOpenSettings } from './settings'
import { blocksPlugin } from './blocks'
import { semanticPlugin } from './semantic'
import { orderedList, richTextPlugin, unorderedList } from './rich-text'
import { internalLinksPlugin } from './internal-links'
import {defaultKms, keymapsPlugin} from './keymaps'
import publicationManagerPlugin, { PublicationManagerOptions } from './PublicationManager'
import ViewButtons from './view-buttons'
import { storagePlugin } from './storage'
import { API_PATH, API_WEBSITE_ASSETS_WRITE, API_WEBSITE_PATH } from '../../constants'
import { ClientConfig } from '../config'
import { titleCase } from '../utils'

const plugins = [
  {name: './project-bar', value: projectBarPlugin}, // has to be before panels and dialogs
  {name: 'grapesjs-style-bg', value: backgroundPlugin},
  {name: './settings', value: settingsDialog},
  {name: '@silexlabs/grapesjs-fonts', value: fontsDialogPlugin},
  {name: './new-page-dialog', value: newPageDialog},
  {name: './page-panel', value: pagePanelPlugin},
  {name: 'grapesjs-blocks-basic', value: blocksBasicPlugin},
  {name: './blocks', value: blocksPlugin},
  {name: './view-buttons', value: ViewButtons},
  {name: './semantic', value: semanticPlugin},
  {name: './rich-text', value: richTextPlugin},
  {name: 'grapesjs-style-filter', value: styleFilterPlugin},
  {name: 'grapesjs-plugin-forms', value: formPlugin},
  {name: 'grapesjs-custom-code', value: codePlugin},
  {name: './internal-links', value: internalLinksPlugin},
  {name: './keymaps', value: keymapsPlugin},
  {name: '@silexlabs/grapesjs-ui-suggest-classes', value: uiSuggestClasses},
  {name: '@silexlabs/grapesjs-filter-styles', value: filterStyles},
  {name: './symbolDialogs', value: symbolDialogsPlugin},
  {name: '@silexlabs/grapesjs-symbols', value: symbolsPlugin},
  {name: './PublicationManager', value: publicationManagerPlugin},
  {name: './storage', value: storagePlugin},
  {name: './LoginDialog', value: loginDialogPlugin},
  {name: '@silexlabs/grapesjs-loading', value: loadingPlugin},
  {name: './breadcrumbs', value: breadcrumbsPlugin},
  {name: './img', value: imgPlugin},
  {name: './css-props', value: cssPropsPlugin},
  {name: './footer', value: footerPlugin},
  {name: '@silexlabs/grapesjs-storage-rate-limit', value: rateLimitPlugin},
  {name: 'grapesjs-style-border', value: borderPugin},
  {name: './resize-panel', value: resizePanelPlugin},
  {name: '@silexlabs/grapesjs-notifications', value: notificationsPlugin},
  // {name: '@silexlabs/grapesjs-keymaps-dialog', value: keymapsDialogPlugin},  // removed
]

// Check that all plugins are loaded correctly
plugins
  .filter(p => typeof p.value !== 'function')
  .forEach(p => {
    throw new Error(`Plugin ${p.name} could not be loaded correctly (${p.value})`)
  })

// Constants
const PRIMARY_COLOR = '#333333'
const SECONDARY_COLOR = '#ddd'
const TERTIARY_COLOR = '#8873FE'
const QUATERNARY_COLOR = '#A291FF'
const DARKER_PRIMARY_COLOR = '#363636'
const LIGHTER_PRIMARY_COLOR = '#575757'

// Commands
export const cmdToggleLayers = 'open-layers'
export const cmdToggleBlocks = 'open-blocks'
export const cmdToggleSymbols = 'open-symbols'
export const cmdToggleNotifications = 'open-notifications'

// ////////////////////
// Config
// ////////////////////
const catBasic = 'Containers'
const catComponents = 'Components'

export function getEditorConfig(config: ClientConfig): EditorConfig {
  const { websiteId, storageId, rootUrl } = config
  return {
    container: '#gjs',
    height: '100%',
    showOffsets: true,
    showDevices: true,

    layerManager: {
      appendTo: '.layer-manager-container',
    },

    blockManager: {
      appendTo: '.block-manager-container',
    },

    assetManager: {
      upload: `${rootUrl}${API_PATH}${API_WEBSITE_PATH}${API_WEBSITE_ASSETS_WRITE}/?websiteId=${websiteId}${ storageId ? `&connectorId=${storageId}` : ''}`,
    },

    storageManager: {
      autoload: false,
      type: 'connector',
      options: {
        connector: {
          id: websiteId,
          connectorId: storageId,
        },
      },
    },

    cssIcons: './css/all.min.css',

    richTextEditor: {
      // @ts-ignore
      actions: ['bold', 'italic', 'underline', 'strikethrough', 'link', 'wrap', orderedList, unorderedList],
    },

    plugins: plugins.map(p => p.value),

    pluginsOpts: {
      [blocksBasicPlugin.toString()]: {
        blocks: ['text', 'image', 'video', 'map'],
        category: catBasic,
      },
      [projectBarPlugin.toString()]: {
        panels: [
          // ... your panel config ...
        ],
      },
      [publicationManagerPlugin.toString()]: {
        appendTo: 'options',
        websiteId,
      } as PublicationManagerOptions,
      [pagePanelPlugin.toString()]: {
        cmdOpenNewPageDialog,
        cmdOpenSettings,
        appendTo: '.page-panel-container',
      },
      [uiSuggestClasses.toString()]: {
        enableCount: false,
        enablePerformance: false,
      },
      [filterStyles.toString()]: {
        appendBefore: '.gjs-sm-sectors',
      },
      [internalLinksPlugin.toString()]: {
        onError: (errors) => console.warn('Links errors:', errors),
      },
      [keymapsPlugin.toString()]: {
        disableKeymaps: false,
      },
      [codePlugin.toString()]: {
        blockLabel: 'HTML',
        blockCustomCode: {
          category: catComponents,
        },
        codeViewOptions: {
          autoFormat: false,
        },
      },
      [symbolsPlugin.toString()]: {
        appendTo: '.symbols-list-container',
        emptyText: 'No symbol yet.',
        primaryColor: PRIMARY_COLOR,
        secondaryColor: SECONDARY_COLOR,
        highlightColor: TERTIARY_COLOR,
      },
      [fontsDialogPlugin.toString()]: {
        api_key: config.fontsApiKey,
        server_url: config.fontsServerUrl,
        api_url: config.fontsApiUrl,
      },
      [loginDialogPlugin.toString()]: {
        id: websiteId,
      } as LoginDialogOptions,
      [rateLimitPlugin.toString()]: {
        time: 5000,
      },
      [imgPlugin.toString()]: {
        replacedElements: config.replacedElements,
      },
      [notificationsPlugin.toString()]: {
        container: notificationContainer,
        reverse: true,
      },
      // [keymapsDialogPlugin.toString()]: { longPressDuration: null, shortcut: 'shift+h' }, // removed
    },
  }
}

// ////////////////////
// Initialize editor
// ////////////////////
let editor: Editor
export async function initEditor(config: EditorConfig) {
  if (editor) throw new Error('Grapesjs editor already created')
  return new Promise<Editor>((resolve, reject) => {
    try {
      editor = grapesjs.init(config)
    } catch (e) {
      console.error('Error initializing GrapesJs with plugins:', plugins, e)
      reject(e)
    }

    // ... rest of your init code ...

    editor.on('load', () => {
      // ... your on-load customizations ...

      resolve(editor)
    })
  })
}

export function getEditor() {
  return editor
}
