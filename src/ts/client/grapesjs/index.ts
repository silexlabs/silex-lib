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
import filterStyles from '@silexlabs/grapesjs-filter-styles'
import symbolsPlugin from '@silexlabs/grapesjs-symbols'
import loadingPlugin from '@silexlabs/grapesjs-loading'
import fontsDialogPlugin from '@silexlabs/grapesjs-fonts'
import selectorPlugin from '@silexlabs/grapesjs-advanced-selector'
import symbolDialogsPlugin, { cmdPromptAddSymbol } from './symbolDialogs'
import loginDialogPlugin, { LoginDialogOptions, cmdLogout } from './LoginDialog'
import footerPlugin from './footer'
import breadcrumbsPlugin from './breadcrumbs'
import imgPlugin from './img'
import liPlugin from './li'
import cssPropsPlugin from './css-props'
import rateLimitPlugin from '@silexlabs/grapesjs-storage-rate-limit'
import borderPugin from 'grapesjs-style-border'
import backgroundPlugin from 'grapesjs-style-bg'
import resizePanelPlugin from './resize-panel'
import notificationsPlugin, { NotificationEditor } from '@silexlabs/grapesjs-notifications'
import keymapsDialogPlugin, { cmdKeymapsDialog } from '@silexlabs/grapesjs-keymaps-dialog'

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
import { API_PATH, API_WEBSITE_ASSETS_WRITE, API_WEBSITE_PATH, SILEX_VERSION } from '../../constants'
import { ClientConfig } from '../config'
import { titleCase } from '../utils'
import uploadProgress from './upload-progress'

const plugins = [
  {name: './project-bar', value: projectBarPlugin}, // has to be before panels and dialogs
  {name: 'grapesjs-style-bg', value: backgroundPlugin},
  {name: './settings', value: settingsDialog},
  {name: '@silexlabs/grapesjs-fonts', value: fontsDialogPlugin},
  {name: '@silexlabs/grapesjs-advanced-selector', value: selectorPlugin},
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
  {name: '@silexlabs/grapesjs-filter-styles', value: filterStyles},
  {name: './symbolDialogs', value: symbolDialogsPlugin},
  {name: '@silexlabs/grapesjs-symbols', value: symbolsPlugin},
  {name: './PublicationManager', value: publicationManagerPlugin},
  {name: './storage', value: storagePlugin},
  {name: './LoginDialog', value: loginDialogPlugin},
  {name: '@silexlabs/grapesjs-loading', value: loadingPlugin},
  {name: './breadcrumbs', value: breadcrumbsPlugin},
  {name: './img', value: imgPlugin},
  {name: './li', value: liPlugin},
  {name: './css-props', value: cssPropsPlugin},
  {name: './footer', value: footerPlugin},
  {name: '@silexlabs/grapesjs-storage-rate-limit', value: rateLimitPlugin},
  {name: 'grapesjs-style-border', value: borderPugin},
  {name: './resize-panel', value: resizePanelPlugin},
  {name: '@silexlabs/grapesjs-notifications', value: notificationsPlugin},
  {name: '@silexlabs/grapesjs-keymaps-dialog', value: keymapsDialogPlugin},
  {name: './upload-progress', value: uploadProgress},
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

    //pageManager: {},

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

    cssIcons: `./css/all.min.css?${SILEX_VERSION}`,

    richTextEditor: {
      // @ts-ignore
      actions: ['bold', 'italic', 'underline', 'strikethrough', 'link', 'wrap', orderedList, unorderedList],
    },

    selectorManager: {
      custom: true, // This should not be needed, check index.js
      escapeName: (name) => `${name}`,
    },

    plugins: plugins.map(p => p.value),

    pluginsOpts: {
      [blocksBasicPlugin.toString()]: {
        blocks: ['text', 'image', 'video', 'map'],
        category: catBasic,
        //flexGrid: true,
      },
      [projectBarPlugin.toString()]: {
        panels: [
          {
            id: 'dash',
            className: 'logo',
            attributes: { title: 'Dashboard' },
            command: () => {
              window.location.href = '/'
            },
          }, {
            id: 'block-manager-btn',
            className: 'block-manager-btn fa fa-fw fa-plus',
            name: 'Blocks',
            attributes: { title: `Blocks (${titleCase(defaultKms.kmBlocks.keys, '+')})`, containerClassName: 'block-manager-container', },
            command: cmdToggleBlocks,
          }, {
            id: 'symbols-btn',
            className: 'symbols-btn fa-regular fa-gem',
            name: 'Symbols',
            attributes: { title: `Symbols (${titleCase(defaultKms.kmSymbols.keys, '+')})`, containerClassName: 'symbols-list-container', },
            command: cmdToggleSymbols,
            buttons: [
              {
                id: 'symbol-create-button',
                className: 'gjs-pn-btn',
                command: cmdPromptAddSymbol,
                text: '\u271A',
              },
            ],
          }, {
            id: 'page-panel-btn',
            className: 'page-panel-btn fa fa-fw fa-file',
            name: 'Pages',
            attributes: { title: `Pages (${titleCase(defaultKms.kmPages.keys, '+')})`, containerClassName: 'page-panel-container', },
            command: cmdTogglePages,
            buttons: [{
              className: 'gjs-pn-btn',
              command: cmdAddPage,
              text: '\u271A',
            }],
          }, {
            id: 'layer-manager-btn',
            className: 'layer-manager-btn fa-solid fa-layer-group',
            name: 'Layers',
            attributes: { title: `Layers (${titleCase(defaultKms.kmLayers.keys, '+')})`, containerClassName: 'layer-manager-container', },
            command: cmdToggleLayers,
          }, {
            id: 'font-dialog-btn',
            className: 'font-manager-btn fa-solid fa-font',
            name: 'Fonts',
            attributes: { title: `Fonts (${titleCase(defaultKms.kmOpenFonts.keys, '+')})` },
            command: () => {
              editor.runCommand('open-fonts')
            },
          }, {
            id: 'settings-dialog-btn',
            className: 'page-panel-btn fa-solid fa-gears',
            name: 'Settings',
            attributes: { title: `Settings (${titleCase(defaultKms.kmOpenSettings.keys, '+')})` },
            command: cmdOpenSettings,
          }, {
            id: 'spacer',
            attributes: {},
            className: 'project-bar-spacer',
          }, {
            id: 'keymaps-btn',
            className: 'keymaps-btn fa-solid fa-keyboard',
            name: 'Shortcuts',
            attributes: { title: 'Keyboard Shortcuts (Shift+H)' },
            command: cmdKeymapsDialog,
          }, {
            id: 'notifications-btn',
            className: 'notifications-btn fa-regular fa-bell',
            name: 'Notifications',
            attributes: { title: `Notifications (${titleCase(defaultKms.kmNotifications.keys, '+')})`, containerClassName: 'notifications-container', },
            command: cmdToggleNotifications,
            buttons: [{
              className: 'gjs-pn-btn',
              command: 'notifications:clear',
              text: '\u2716',
            }],
          }, {
            id: 'dash2',
            className: 'fa-solid fa-house',
            attributes: { title: 'Dashboard' },
            command: () => {
              window.location.href = '/'
            },
          }, {
            id: 'help',
            className: 'fa fa-fw fa-question-circle',
            attributes: { title: 'Documentation' },
            command: () => {
              window.open('https://docs.silex.me/', '_blank')
            },
          }, {
            id: 'logout-button',
            className: 'page-panel-btn fa fa-fw fa-sign-out',
            attributes: { title: 'Sign out' },
            command: cmdLogout,
          },
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
      [filterStyles.toString()]: {
        appendBefore: '.gjs-sm-sectors',
      },
      [internalLinksPlugin.toString()]: {
        // FIXME: warn the user about links in error
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
        websiteId,
        storageId,
      },
      [notificationsPlugin.toString()]: {
        container: notificationContainer,
        reverse: true,
      },
      [keymapsDialogPlugin.toString()]: {
        longPressDuration: null,
        shortcut: 'shift+h',
      },
    },
  }
}

// ////////////////////
// Initialize editor
// ////////////////////
// Keep a ref to the editor singleton
let editor: Editor
export async function initEditor(config: EditorConfig) {
  if(editor) throw new Error('Grapesjs editor already created')
  return new Promise<Editor>((resolve, reject) => {
    try {
      /* @ts-ignore */
      editor = grapesjs.init(config)

      // Remove default map block and component
      editor.Blocks.remove('map')
      editor.DomComponents.removeType('map')

      // Add custom Leaflet map block using iframe
      editor.Blocks.add('map', {
        label: 'Map',
        category: 'Composants',
        content: {
          type: 'map',
          tagName: 'iframe',
          attributes: {
            style: 'width: 100%; height: 400px; border: none; display: block;',
            frameborder: '0',
            scrolling: 'no',
            allowfullscreen: 'true',
            'data-lat': '0',
            'data-lng': '0',
            'data-zoom': '2',
            'data-height': '400',
            'data-width': '100%',
          },
          traits: [
            { type: 'text', name: 'lat', label: 'Latitude', value: '0' },
            { type: 'text', name: 'lng', label: 'Longitude', value: '0' },
            { type: 'number', name: 'zoom', label: 'Zoom', min: 1, max: 19, value: 2 },
            { type: 'text', name: 'height', label: 'Height (px)', value: '400' },
            { type: 'text', name: 'width', label: 'Width', value: '100%' },
          ],
        },
        attributes: { class: 'fa fa-map' },
        select: true,
      })

      // Define custom map component
      editor.DomComponents.addType('map', {
        model: {
          defaults: {
            type: 'map',
            tagName: 'iframe',
            classes: ['leaflet-map'],
            attributes: {
              style: 'width: 100%; height: 400px; border: none;',
              frameborder: '0',
              scrolling: 'no',
              'data-lat': '0',
              'data-lng': '0',
              'data-zoom': '2',
              'data-height': '400',
              'data-width': '100%',
            },
            traits: [
              { type: 'text', name: 'lat', label: 'Latitude', value: '0' },
              { type: 'text', name: 'lng', label: 'Longitude', value: '0' },
              { type: 'number', name: 'zoom', label: 'Zoom', min: 1, max: 19, value: 2 },
              { type: 'text', name: 'height', label: 'Height (px)', value: '400' },
              { type: 'text', name: 'width', label: 'Width', value: '100%' },
            ],
          },
          init() {
            this.on('change:lat', this.updateIframe)
            this.on('change:lng', this.updateIframe)
            this.on('change:zoom', this.updateIframe)
            this.on('change:height', this.updateIframe)
            this.on('change:width', this.updateIframe)
            this.updateIframe()
          },
          updateIframe() {
            const lat = this.get('lat') || '0'
            const lng = this.get('lng') || '0'
            const zoom = this.get('zoom') || '2'
            const height = this.get('height') || '400'
            const width = this.get('width') || '100%'

            const attrs = {
              ...this.getAttributes(),
              'data-lat': lat,
              'data-lng': lng,
              'data-zoom': zoom,
              'data-height': height,
              'data-width': width,
              style: `width: ${width}; height: ${height}px; border: none; display: block;`,
              frameborder: '0',
              scrolling: 'no',
              allowfullscreen: 'true',
              srcdoc: this.generateMapHtml(lat, lng, zoom, height, width),
            }
            this.setAttributes(attrs)
          },
          generateMapHtml(lat, lng, zoom, height, width) {
            return `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <style>
                  html, body, #map { width: ${width}; height: ${height}px; margin: 0; padding: 0; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <script>
                  var map = L.map('map').setView([${lat}, ${lng}], ${zoom});
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxZoom: 19,
                  }).addTo(map);
                  map.invalidateSize();
                  setTimeout(() => map.invalidateSize(), 500);
                  map.on('moveend', () => {
                    const center = map.getCenter();
                    parent.postMessage({
                      type: 'updateMap',
                      lat: center.lat.toString(),
                      lng: center.lng.toString(),
                      zoom: map.getZoom().toString()
                    }, '*');
                  });
                  map.on('zoomend', () => {
                    parent.postMessage({
                      type: 'updateMap',
                      lat: map.getCenter().lat.toString(),
                      lng: map.getCenter().lng.toString(),
                      zoom: map.getZoom().toString()
                    }, '*');
                  });
                  new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById('map'));
                </script>
              </body>
              </html>
            `
          },
          toJSON() {
            const { srcdoc, ...rest } = this.getAttributes()
            return {
              type: this.get('type'),
              tagName: this.get('tagName'),
              classes: this.get('classes'),
              attributes: {
                ...rest,
                'data-lat': this.get('lat') || '0',
                'data-lng': this.get('lng') || '0',
                'data-zoom': this.get('zoom') || '2',
                'data-height': this.get('height') || '400',
                'data-width': this.get('width') || '100%',
              },
              traits: [
                { type: 'text', name: 'lat', value: this.get('lat') || '0' },
                { type: 'text', name: 'lng', value: this.get('lng') || '0' },
                { type: 'number', name: 'zoom', value: parseInt(this.get('zoom')) || 2 },
                { type: 'text', name: 'height', value: this.get('height') || '400' },
                { type: 'text', name: 'width', value: this.get('width') || '100%' },
              ],
            }
          },
        },
        view: {
          onRender({ el, model }) {
            el.style.width = model.get('width') || '100%'
            el.style.height = `${model.get('height') || '400'}px`
            el.style.border = 'none'
            el.style.display = 'block'
            el.style.overflow = 'hidden'

            const handleMessage = (event) => {
              if (event.data.type === 'updateMap') {
                model.set({
                  lat: event.data.lat,
                  lng: event.data.lng,
                  zoom: event.data.zoom,
                }, { silent: false })
                model.trigger('change:lat')
                model.trigger('change:lng')
                model.trigger('change:zoom')
              }
            }
            window.addEventListener('message', handleMessage)
            this.listenTo(model, 'remove', () => {
              window.removeEventListener('message', handleMessage)
            })
            this.listenTo(model, 'change:height', () => {
              el.style.height = `${model.get('height')}px`
            })
            this.listenTo(model, 'change:width', () => {
              el.style.width = model.get('width')
            })
          },
        },
      })

      // Update map on trait changes
      editor.on('component:trait:change', (component, trait) => {
        if (component.get('type') === 'map' && ['lat', 'lng', 'zoom', 'height', 'width'].includes(trait.get('name'))) {
          component.getView().model.updateIframe()
        }
      })

      // Add global initialization script for published site
      editor.on('load', () => {
        const script = document.createElement('script')
        script.textContent = `
          document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('iframe.leaflet-map').forEach(iframe => {
              const lat = parseFloat(iframe.dataset.lat) || 0;
              const lng = parseFloat(iframe.dataset.lng) || 0;
              const zoom = parseInt(iframe.dataset.zoom) || 2;
              const height = iframe.dataset.height || '400';
              const width = iframe.dataset.width || '100%';
              iframe.style.width = width;
              iframe.style.height = height + 'px';
              iframe.srcdoc = \`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                  <style>
                    html, body, #map { width: \${width}; height: \${height}px; margin: 0; padding: 0; }
                  </style>
                </head>
                <body>
                  <div id="map"></div>
                  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                  <script>
                    var map = L.map('map').setView([\${lat}, \${lng}], \${zoom});
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                      maxZoom: 19,
                    }).addTo(map);
                    map.invalidateSize();
                    setTimeout(() => map.invalidateSize(), 500);
                    new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById('map'));
                  </script>
                </body>
                </html>
              \`;
            });
          });
        `
        document.body.appendChild(script)
      })
    } catch(e) {
      console.error('Error initializing GrapesJs with plugins:', plugins, e)
      reject(e)
    }

    // customize the editor
    ['text']
      .forEach(id => editor.Blocks.get(id)?.set('category', 'Basics'))
    ;['image', 'video']
      .forEach(id => editor.Blocks.get(id)?.set('category', 'Media'))
    ;['map']
      .forEach(id => editor.Blocks.get(id)?.set('category', 'Components'))
    editor.Blocks.render([])

    editor.Commands.add('gjs-open-import-webpage', openImport(editor, {
      modalImportLabel: '',
      modalImportContent: 'Paste a web page HTML code here.',
      modalImportButton: 'Import',
      modalImportTitle: 'Import from website',
    }))

    // Detect loading errors
    // Display a useful notification
    const typeConfig = {
      view: {
        onRender({editor, el, model}) {
          const src = model.getAttributes().src
          el.addEventListener('error', () => {
            editor.runCommand('notifications:add', {
              type: 'error',
              group: 'Image loading error',
              message: `Error loading image: ${src}`,
              componentId: model.getId(),
            })
          })
        },
      },
    }
    editor.DomComponents.addType('image', typeConfig)
    editor.DomComponents.addType('iframe', typeConfig)

    // Adjustments to do when the editor is ready
    editor.on('load', () => {
      const views = editor.Panels.getPanel('views')

      // Remove blocks and layers buttons from the properties
      // This is because in Silex they are on the left
      views.buttons.remove(cmdToggleBlocks)
      views.buttons.remove(cmdToggleLayers)

      // Remove useless buttons
      editor.Panels.getPanel('options').buttons.remove('export-template')
      editor.Panels.getPanel('options').buttons.remove('fullscreen')

      // Render the block manager, otherwise it is empty
      editor.BlockManager.render(null)

      // Use the style filter plugin
      editor.StyleManager.addProperty('extra', { extend: 'filter' })

      // Add the notifications container
      document.body.querySelector('.notifications-container')?.appendChild(notificationContainer)
      // Mark the button as dirty when there are notifications
      // TODO: move this in the notifications plugin options
      editor.on(
        'notifications:changed',
        () => {
          const notificationButton = editor.Panels.getPanel(PROJECT_BAR_PANEL_ID).view?.el.querySelector('.notifications-btn')
          ;(editor as unknown as NotificationEditor)
            ? notificationButton?.classList.add('project-bar__dirty')
            : notificationButton?.classList.remove('project-bar__dirty')
        }
      )

      // GrapesJs editor is ready
      resolve(editor)
    })
  })
}

export function getEditor() {
  return editor
}