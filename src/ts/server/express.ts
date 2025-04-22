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
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import session from 'cookie-session'
import cors from 'cors'
import path from 'path'               // use the standard Node path module
 
import { ServerConfig } from './config'
import { ServerEvent } from './events'
 
export function create(config: ServerConfig): Application {
  const app = express()
  app.set('config', config)
 
  // ─── CORS ──────────────────────────────────────────────────────────────
  const opts = config.expressOptions
  if (opts.cors) {
    console.info('> CORS are ENABLED:', opts.cors)
    app.use(cors({ origin: opts.cors }))
  }
 
  // ─── COMPRESSION & PARSERS ─────────────────────────────────────────────
  app.use(compression() as any)
  app.use(bodyParser.json({ limit: opts.jsonLimit }))
  app.use(bodyParser.text({  limit: opts.textLimit }))
  app.use(bodyParser.urlencoded({ limit: opts.urlencodedLimit }))
  console.info('> Session name:', opts.sessionName)
  app.use(cookieParser() as any)
  app.use(session({
    name:   opts.sessionName,
    secret: opts.sessionSecret,
  }) as any)
 
  // ─── DECODE PERCENT‑ENCODED URLs ────────────────────────────────────────
  // so Express can match UTF‑8 filenames (こんにちは.html, etc)
  app.use((req, _res, next) => {
    try {
      req.url = decodeURIComponent(req.url)
    } catch (err) {
      console.warn('Failed to decode URL:', req.url)
    }
    next()
  })
 
  // ─── STATIC SERVE `/en` ─────────────────────────────────────────────────
  // Points at your `silex/websites/en` folder
  const fsRoot = process.env.SILEX_FS_ROOT 
     || path.join(__dirname, '..', '..', 'silex', 'websites')
  app.use('/en', express.static(path.join(fsRoot, 'en')))
 
  return app
}
 
export async function start(app: Application): Promise<Application> {
  const config = app.get('config') as ServerConfig
 
  // Hook for any plugins to add routes
  config.emit(ServerEvent.STARTUP_START, { app })
 
  // Launch the server
  await new Promise<void>((resolve) =>
    app.listen(config.port, resolve)
  )
 
  // Signal that custom routes can now be registered
  config.emit(ServerEvent.STARTUP_END, { app })
  return app
}
 