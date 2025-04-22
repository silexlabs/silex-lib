import grapesjs, { Editor, EditorConfig } from 'grapesjs'
import openImport from './openImport'

const notificationContainer = document.createElement('div')

// Plugins
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

import { pagePanelPlugin, cmdTogglePages, cmdAddPage } from './page-panel'
import { newPageDialog, cmdOpenNewPageDialog } from './new-page-dialog'
import { PROJECT_BAR_PANEL_ID, projectBarPlugin } from './project-bar'
import { settingsDialog, cmdOpenSettings } from './settings'
import { blocksPlugin } from './blocks'
import { semanticPlugin } from './semantic'
import { orderedList, richTextPlugin, unorderedList } from './rich-text'
import { internalLinksPlugin } from './internal-links'
import { defaultKms, keymapsPlugin } from './keymaps'
import publicationManagerPlugin, { PublicationManagerOptions } from './PublicationManager'
import ViewButtons from './view-buttons'
import { storagePlugin } from './storage'
import { API_PATH, API_WEBSITE_ASSETS_WRITE, API_WEBSITE_PATH } from '../../constants'
import { ClientConfig } from '../config'
import { titleCase } from '../utils'
import uploadProgress from './upload-progress'

const plugins = [
  { name: './project-bar', value: projectBarPlugin },
  { name: 'grapesjs-style-bg', value: backgroundPlugin },
  { name: './settings', value: settingsDialog },
  { name: '@silexlabs/grapesjs-fonts', value: fontsDialogPlugin },
  { name: './new-page-dialog', value: newPageDialog },
  { name: './page-panel', value: pagePanelPlugin },
  { name: 'grapesjs-blocks-basic', value: blocksBasicPlugin },
  { name: './blocks', value: blocksPlugin },
  { name: './view-buttons', value: ViewButtons },
  { name: './semantic', value: semanticPlugin },
  { name: './rich-text', value: richTextPlugin },
  { name: 'grapesjs-style-filter', value: styleFilterPlugin },
  { name: 'grapesjs-plugin-forms', value: formPlugin },
  { name: 'grapesjs-custom-code', value: codePlugin },
  { name: './internal-links', value: internalLinksPlugin },
  { name: './keymaps', value: keymapsPlugin },
  { name: '@silexlabs/grapesjs-ui-suggest-classes', value: uiSuggestClasses },
  { name: '@silexlabs/grapesjs-filter-styles', value: filterStyles },
  { name: './symbolDialogs', value: symbolDialogsPlugin },
  { name: '@silexlabs/grapesjs-symbols', value: symbolsPlugin },
  { name: './PublicationManager', value: publicationManagerPlugin },
  { name: './storage', value: storagePlugin },
  { name: './LoginDialog', value: loginDialogPlugin },
  { name: '@silexlabs/grapesjs-loading', value: loadingPlugin },
  { name: './breadcrumbs', value: breadcrumbsPlugin },
  { name: './img', value: imgPlugin },
  { name: './css-props', value: cssPropsPlugin },
  { name: './footer', value: footerPlugin },
  { name: '@silexlabs/grapesjs-storage-rate-limit', value: rateLimitPlugin },
  { name: 'grapesjs-style-border', value: borderPugin },
  { name: './resize-panel', value: resizePanelPlugin },
  { name: '@silexlabs/grapesjs-notifications', value: notificationsPlugin },
  { name: './upload-progress', value: uploadProgress },
]

plugins
  .filter(p => typeof p.value !== 'function')
  .forEach(p => {
    throw new Error(`Plugin ${p.name} could not be loaded correctly (${p.value})`)
  })

const PRIMARY_COLOR = '#333333'
const SECONDARY_COLOR = '#ddd'
const TERTIARY_COLOR = '#8873FE'
const QUATERNARY_COLOR = '#A291FF'
const DARKER_PRIMARY_COLOR = '#363636'
const LIGHTER_PRIMARY_COLOR = '#575757'

export const cmdToggleLayers = 'open-layers'
export const cmdToggleBlocks = 'open-blocks'
export const cmdToggleSymbols = 'open-symbols'
export const cmdToggleNotifications = 'open-notifications'

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
      upload: `${rootUrl}${API_PATH}${API_WEBSITE_PATH}${API_WEBSITE_ASSETS_WRITE}/?websiteId=${websiteId}${storageId ? `&connectorId=${storageId}` : ''}`,
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
      [imgPlugin.toString()]: {
        replacedElements: config.replacedElements,
      },
      [rateLimitPlugin.toString()]: {
        time: 5000,
      },
    },
  }
}

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

    editor.on('load', () => {
      resolve(editor)
    })
  })
}

export function getEditor() {
  return editor
}
