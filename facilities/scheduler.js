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
 * The worker scheduler.
 *
 * @file
 */

/**
 * Simple and effective FIFO scheduler for Grenache requests.
 *
 * @module scheduler
 */

/**
 * @callback SchedulerCallback
 *
 * @param {Error?} error
 *   The SchedulerAction reject value, as an Error instance.
 * @param {Any?} payload
 *   The SchedulerAction resolve value; can be anything.
 *
 * @return {void}
 *   Nothing is returned.
 */

/**
 * @callback SchedulerAction
 *
 * @return {Promise}
 *   A promise.
 */

/**
 * @class
 * @classdesc
 *
 * <p>
 * Due to the strictly incremental nonce, API requests cannot be completely
 * asynchronous; this scheduler helps  serialize API requests while keeping
 * a non-blocking worker.  In other words, an API request  can be scheduled
 * instead of waiting for it to return.
 * </p>
 *
 * <p>
 * When managing  multiple helpdesks,  each instance  should be  assigned a
 * different scheduler; this  will make API requests for  a single helpdesk
 * serialized, but requests for different helpdesks asynchronous.
 * </p>
 *
 * <p>
 * Last but not least, this scheduler makes  it fairly easy to wait for all
 * requests that have  already been accepted to complete and  also to pause
 * and resume service delivery as needed.
 * </p>
 */
class Scheduler {
  /**
   * The sceduler's queue.
   *
   * @type {Promise}
   * @access private
   */
  #queue

  /**
   * Whether the scheduler is paused.
   *
   * @type {boolean}
   * @access private
   */
  #pause

  /**
   * @constructs Scheduler
   */
  constructor () {
    this.#pause = false
    this.#queue = Promise.resolve()
  }

  /**
   * Returns whether the scheduler is paused.
   *
   * @return {boolean}
   *   True if the scheduler is paused, false otherwise.
   */
  isPaused () {
    return this.#pause === true
  }

  /**
   * Get scheduler queue.
   *
   * @return {Promise}
   *   The scheduler queue.
   */
  getQueue () {
    return this.#queue
  }

  /**
   * Put a request on scheduler queue.
   *
   * @param {SchedulerCallback} cb
   *   The scheduler callback.
   * @param {SchedulerAction} action
   *   The scheduling action.
   *
   * @return {Scheduler}
   *   The current scheduler instance.
   */
  put (cb, action) {
    if (this.isPaused() === true) {
      cb(new Error('ERR_API_ACTION: Worker unavailable'))
    } else {
      this.#queue = this.#queue.then(action)
        .then((payload) => cb(null, payload))
        .catch((error) => cb(error))
    }

    return this
  }

  /**
   * Pause scheduler.
   *
   * @return {Scheduler}
   *   The current scheduler instance.
   */
  pause () {
    this.#pause = true
    return this
  }

  /**
   * Resume scheduler.
   *
   * @return {Scheduler}
   *   The current scheduler instance.
   */
  resume () {
    this.#pause = false
    return this
  }
}

module.exports = {
  Scheduler
}
