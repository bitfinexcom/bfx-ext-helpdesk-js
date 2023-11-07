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

const got = require('got')
const crypto = require('node:crypto')
const Bourne = require('@hapi/bourne')
const { RESTful } = require('./restful')

/**
 * The worker user agent.
 *
 * @file
 */

/**
 * Convenience wrapper for Got to interact with helpdesk RESTful APIs.
 *
 * @module got4hd
 */

/**
 * Sign request.
 *
 * @param {string} message
 *   The request payload.
 * @param {string} privateKey
 *   The secret key of the helpdesk RESTful API.
 * @param {string} [hashAlgorithm = sha384]
 *   The hashing algorithm to be used.
 * @param {string} [digestAlgorithm = hex]
 *   The digest algorithm to be used.
 *
 * @return {string}
 *   The request signature.
 *
 * @access private
 */
const sign = (message, privateKey, hashAlgorithm = 'sha384', digestAlgorithm = 'hex') => {
  return crypto
    .createHmac(hashAlgorithm, privateKey)
    .update(message)
    .digest(digestAlgorithm)
}

/**
 * <p>
 * This wrapper  automatically handles  both pagination  and authentication
 * (both version 1 and 2); credentials need to be passed via context (using
 * pubkey and seckey properties).
 * </p>
 *
 * <p>
 * For  more information  on  how authentication  works,  see the  official
 * [Bitfinex API documentation]{@link https://docs.bitfinex.com/docs/}.
 * </p>
 *
 * @namespace got4hd
 * @type {Object}
 * @augments got
 * @see {@link https://github.com/sindresorhus/got}
 */
const got4hd = got.extend({
  responseType: 'json',
  handlers: [
    (options, next) => {
      const nonce = Date.now().toString()

      if (options?.url?.pathname?.startsWith(`${RESTful.Revision.v2}/`)) {
        const payload = `${options?.url?.pathname || ''}${nonce}${options?.body?.toString() || ''}`

        options.headers['bfx-nonce'] = nonce
        options.headers['bfx-apikey'] = options?.context?.pubkey
        options.headers['bfx-signature'] = sign(payload, options?.context?.seckey)
      } else if (options?.url?.pathname?.startsWith(`${RESTful.Revision.v1}/`)) {
        const body = Object.assign(Bourne.safeParse(options?.body || '{}'), {
          nonce,
          request: options?.url?.pathname
        })

        const payload = Buffer.from(JSON.stringify(body)).toString('base64')

        options.headers['x-bfx-payload'] = payload
        options.headers['x-bfx-apikey'] = options?.context?.pubkey
        options.headers['x-bfx-signature'] = sign(payload, options?.context?.seckey)

        options.body = undefined
        options.headers['content-length'] = 0
      }

      return next(options)
    }
  ],
  pagination: {
    backoff: 250,
    paginate: (response) => {
      const searchParams = {
        offset: response?.request?.options?.searchParams.has('offset')
          ? +response?.request?.options?.searchParams.get('offset')
          : +0
      }

      searchParams.offset += +response?.headers['pagination-limit']

      if (searchParams.offset > +response?.headers['pagination-count']) {
        return false
      }

      if (response?.request?.options?.searchParams.has('limit')) {
        searchParams.limit = +response?.request?.options?.searchParams.get('limit') - +response?.headers['pagination-limit']

        if (searchParams.limit < 1) {
          return false
        }
      }

      return {
        searchParams
      }
    }
  }
})

module.exports = {
  got4hd
}
