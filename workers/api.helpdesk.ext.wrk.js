/*
 * This file is part of bfx-ext-helpdesk-js.
 *
 * Copyright (C) 2023 Davide Scola <davide@bitfinex.com>
 *
 * Licensed under the Apache License,  Version 2.0 (the "License"); you may
 * not use this file except in  compliance with the License. You may obtain
 * a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless  required by  applicable law  or agreed  to in  writing, software
 * distributed  under the  License  is  distributed on  an  "AS IS"  BASIS,
 * WITHOUT  WARRANTIES  OR  CONDITIONS  OF  ANY  KIND,  either  express  or
 * implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
'use strict'

/**
 * The worker.
 *
 * @file
 */

const { WrkApi } = require('bfx-wrk-api')
const { got4hd } = require('../facilities/got4hd')
const { RESTful } = require('../facilities/restful')
const { Scheduler } = require('../facilities/scheduler')

/**
 * @class
 * @hideconstructor
 * @classdesc
 *
 * <p>
 * Worker implementation.
 * </p>
 *
 * @augments WrkApi
 * @see https://github.com/bitfinexcom/bfx-wrk-api
 */
class WrkExtHelpdeskApi extends WrkApi {
  /**
   * @inheritdoc
   */
  constructor (conf, ctx) {
    super(conf, ctx)

    this.loadConf('helpdesk.ext', 'ext')

    this.init()
    this.start()
  }

  /**
   * @inheritdoc
   */
  getPluginCtx (type) {
    const ctx = super.getPluginCtx(type)

    switch (type) {
      case 'api_bfx':
        ctx.helpdesk = this.helpdesk
        break
    }

    return ctx
  }

  /**
   * @inheritdoc
   */
  init () {
    super.init()

    this.helpdesk = new Map()

    for (const [name, options] of this.#parseConfiguration(this.conf.ext.helpdesk)) {
      const { baseUrl, revision, publicKey, privateKey } = options

      this.helpdesk.set(name, {
        ua: got4hd.extend({
          context: {
            pubkey: publicKey,
            seckey: privateKey
          },
          prefixUrl: `${baseUrl}${RESTful.Revision[revision] ?? RESTful.Revision.v2}`
        }),
        scheduler: new Scheduler()
      })
    }
  }

  /**
   * @inheritdoc
   */
  start (cb = () => {}) {
    this.on('started', () => {
      ['SIGCONT', 'SIGTSTP'].forEach((signal) => {
        process.on(signal, (sname) => {
          for (const [name, context] of this.helpdesk.entries()) {
            switch (sname) {
              case 'SIGTSTP':
                context?.scheduler?.pause()
                break

              case 'SIGCONT':
                context?.scheduler?.resume()
                break
            }

            process.stderr.write(`WRN: ${name} scheduler is now ${context?.scheduler?.isPaused() ? 'paused' : 'resumed'} due to ${sname}\n`)
          }
        })
      })
    })

    super.start(cb)
  }

  /**
   * @inheritdoc
   */
  stop (cb) {
    ['SIGCONT', 'SIGTSTP'].forEach(
      (signal) => process.removeAllListeners(signal)
    )

    Promise.allSettled(
      Array.from(this.helpdesk, ([name, context]) => {
        return context?.scheduler?.pause().getQueue()
      })
    ).then(
      () => super.stop(cb)
    )
  }

  /**
   * Parse configuration file.
   *
   * @param {Object} configuration
   *   The worker configuration.
   *
   * @generator
   * @yields {Array}
   *   A configuration item.
   *
   * @access private
   */
  * #parseConfiguration (configuration) {
    for (const name in configuration) {
      yield [name, configuration[name]]
    }
  }
}

module.exports = WrkExtHelpdeskApi
