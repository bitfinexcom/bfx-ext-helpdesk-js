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
 * The API.
 *
 * @file
 */

const util = require('node:util')
const { Api } = require('bfx-wrk-api')
const Bourne = require('@hapi/bourne')
const { RESTful } = require('../../facilities/restful')
const { Validator } = require('../../facilities/validator')

/**
 * @class
 * @hideconstructor
 * @classdesc
 *
 * <p>
 * API implementation.
 * </p>
 *
 * @augments Api
 * @see https://github.com/bitfinexcom/bfx-facs-api
 */
class ExtHelpdesk extends Api {
  /**
   * Action: get departments list ordered by name in ascending order.
   *
   * @param {Object} space
   *   The request namespace.
   * @param {Object} params
   *   The request parameters.
   * @param {SchedulerCallback} cb
   *   The scheduler callback.
   *
   * @return {void}
   *   Nothing is returned.
   */
  getDepartments (space, params, cb) {
    this._getList(
      space,
      Validator.List.Departments,
      RESTful.Endpoint.Departments,
      params,
      cb
    )
  }

  /**
   * Action: get topics list ordered by name in ascending order.
   *
   * @param {Object} space
   *   The request namespace.
   * @param {Object} params
   *   The request parameters.
   * @param {SchedulerCallback} cb
   *   The scheduler callback.
   *
   * @return {void}
   *   Nothing is returned.
   */
  getTopics (space, params, cb) {
    this._getList(
      space,
      Validator.List.Topics,
      RESTful.Endpoint.Topics,
      params,
      cb
    )
  }

  /**
   * Action: get tags list ordered as on helpdesk in ascending order.
   *
   * @param {Object} space
   *   The request namespace.
   * @param {Object} params
   *   The request parameters.
   * @param {SchedulerCallback} cb
   *   The scheduler callback.
   *
   * @return {void}
   *   Nothing is returned.
   */
  getTags (space, params, cb) {
    this._getList(
      space,
      Validator.List.Tags,
      RESTful.Endpoint.Tags,
      params,
      cb
    )
  }

  /**
   * Action: get agents list ordered by username in ascending order.
   *
   * @param {Object} space
   *   The request namespace.
   * @param {Object} params
   *   The request parameters.
   * @param {SchedulerCallback} cb
   *   The scheduler callback.
   *
   * @return {void}
   *   Nothing is returned.
   */
  getAgents (space, params, cb) {
    this._getList(
      space,
      Validator.List.Agents,
      RESTful.Endpoint.Agents,
      params,
      cb
    )
  }

  /**
   * Action: get teams list ordered by name in ascending order.
   *
   * @param {Object} space
   *   The request namespace.
   * @param {Object} params
   *   The request parameters.
   * @param {SchedulerCallback} cb
   *   The scheduler callback.
   *
   * @return {void}
   *   Nothing is returned.
   */
  getTeams (space, params, cb) {
    this._getList(
      space,
      Validator.List.Teams,
      RESTful.Endpoint.Teams,
      params,
      cb
    )
  }

  /**
   * @inheritdoc
   */
  handle (service, msg, cb) {
    /*
     * Ensure that `args` in the message is an array with the proper number
     * of elements for  the invoked method, assuming that  all methods that
     * require more than  one parameter are a  valid action. Authorizations
     * are still left to the parent.
     */
    if (msg?.action) {
      const argc = this[msg.action]?.length ?? 0

      if (msg?.args instanceof Array === false) {
        msg.args = []
      }

      if (argc > 1) {
        msg.args.length = argc - 2
      }
    }

    super.handle(service, msg, cb)
  }

  /**
   * Get the helpdesk context.
   *
   * @param {Object} space
   *   The request namespace.
   *
   * @return {Object}
   *   The helpdesk context the request is addressed to.
   *
   * @access private
   */
  _getContext (space) {
    const { helpdesk } = this.ctx

    if (helpdesk.has(space.svp[3]) === false) {
      throw new Error('Internal worker error')
    }

    return helpdesk.get(space.svp[3])
  }

  /**
   * Fetch a complete list.
   *
   * @param {got4hd} ua
   *   The user agent.
   * @param {string} endpoint
   *   The API endpoint.
   * @param {Object} searchParams
   *   The request parameters.
   *
   * @return {Promise}
   *   A fetch promise.
   *
   * @access private
   */
  _fetchList (ua, endpoint, searchParams = {}) {
    return new Promise((resolve, reject) => {
      ua.paginate.all(endpoint, {
        searchParams,
        method: RESTful.Verb.List,
        parseJson: (text) => Bourne.parse(text, (key, value) => {
          return key === 'href' ? undefined : value
        })
      }).then((payload) => {
        return resolve(payload)
      }).catch((ex) => {
        const error = 'ERR_API_HELPDESK_LIST_' + endpoint.toUpperCase() + ': ' + ex.message

        process.stderr.write(`ERR: ${error}\n${util.inspect(ex, { depth: 0x10 })}\n`)
        return reject(new Error(error))
      })
    })
  }

  /**
   * Get a complete list.
   *
   * @param {Object} space
   *   The request namespace.
   * @param {Object} validator
   *   The request validator.
   * @param {string} endpoint
   *   The API endpoint.
   * @param {Object} params
   *   The request parameters.
   * @param {SchedulerCallback} cb
   *   The scheduler callback.
   *
   * @return {void}
   *   Nothing is returned.
   *
   * @access private
   */
  _getList (space, validator, endpoint, params, cb) {
    const { ua, scheduler } = this._getContext(space)

    validator.check(params).then((success) => {
      if (success === true) {
        scheduler.put(cb, () => this._fetchList(ua, endpoint, params))
      } else {
        cb(new Error(`ERR_API_ACTION: ${success[0].message}`))
      }
    })
  }
}

module.exports = ExtHelpdesk
