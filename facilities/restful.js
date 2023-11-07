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
 * The helpdesk RESTful APIs.
 *
 * @file
 */

/**
 * A namespace of all the helpdesk RESTful APIs attributes.
 *
 * @module restful
 */

/**
 * <p>
 * This is the namespace of all the helpdesk RESTful APIs attributes; using
 * these constants improves code maintainability.
 * </p>
 *
 * @property {Object} Verb
 *   HTTP verbs used by the helpdesk RESTful API.
 *
 * @property {string} Verb.Create
 *   HTTP verb used to create an item.
 * @property {string} Verb.Delete
 *   HTTP verb used to delete an item.
 * @property {string} Verb.Update
 *   HTTP verb used to update an item.
 * @property {string} Verb.List
 *   HTTP verb used to retrieve a list of items.
 * @property {string} Verb.Read
 *   HTTP verb used to retrieve a single item.
 *
 * @property {Object} Endpoint
 *   HTTP endpoints used by the helpdesk RESTful API.
 *
 * @property {string} Endpoint.Tickets
 *   Tickets endpoint.
 * @property {string} Endpoint.Messages
 *   Thread entries endpoint.
 * @property {string} Endpoint.Departments
 *   Departments endpoint.
 * @property {string} Endpoint.Topics
 *   Topics endpoint.
 * @property {string} Endpoint.Tags
 *   Tags endpoint.
 * @property {string} Endpoint.Agents
 *   Staff endpoint.
 * @property {string} Endpoint.Users
 *   Users endpoint.
 * @property {string} Endpoint.Agreements
 *   SLAs endpoint.
 * @property {string} Endpoint.Teams
 *   Teams endpoint.
 *
 * @property {Object} Revision
 *   Available helpdesk RESTful API revisions.
 *
 * @property {string} Revision.v1
 *   Version 1 of the helpdesk RESTful API.
 * @property {string} Revision.v2
 *   Version 2 of the helpdesk RESTful API.
 *
 * @namespace RESTful
 * @type {Object}
 */
module.exports = {
  RESTful: {
    Verb: {
      List: 'GET',
      Read: 'GET',
      Create: 'POST',
      Update: 'PATCH',
      Delete: 'DELETE'
    },
    Endpoint: {
      Tickets: 'tickets',
      Messages: 'thread-entries',
      Departments: 'departments',
      Topics: 'topics',
      Tags: 'tags',
      Agents: 'staff',
      Users: 'users',
      Agreements: 'agreements',
      Teams: 'teams'
    },
    Revision: {
      v1: '/api/v1',
      v2: '/api/v2'
    }
  }
}
