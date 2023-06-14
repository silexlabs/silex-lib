/**
 * @fileoverview
 * Defines the entry point of Silex client side application
 *
 */

import { SilexConfig } from './config'
import { initEditor, getEditor } from './grapesjs/index'

/**
 * Start Silex, called from host HTML page with window.silex.start()
 */
export async function start(options = {}) {
  const config = new SilexConfig()
  Object.assign(config, options)

  // Config file in root folder which can be generated by the server
  console.log('Loading config', config.clientConfigUrl)
  //import(/* webpackIgnore: true */ config.clientConfigUrl)
  //.then((configFile) => console.log('Config loaded', configFile))
  //.catch((e) => console.error('Config error', config.clientConfigUrl, e))
  await config.addPlugin(config.clientConfigUrl, {})

  // Debug mode
  if (config.debug) {
    console.warn('Silex starting in debug mode.', {config})
  }

  // Start grapesjs
  initEditor(config.editor, config.grapesJsPlugins)

  // End of loading
  getEditor().on('load', () => {
    document.querySelector('.silex-loader').classList.add('silex-dialog-hide')
    document.querySelector('#gjs').classList.remove('silex-dialog-hide')
  })
}
