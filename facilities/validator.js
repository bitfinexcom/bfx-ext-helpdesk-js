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
 * The worker input validator.
 *
 * @file
 */

const { Schema } = require('./schema')
const Validator = require('fastest-validator')

/**
 * A namespace of all exported input validators.
 *
 * @module validator
 */

/**
 * A validator instance, used to compile a schema.
 *
 * @type {Validator}
 * @access private
 */
const v = new Validator({
  aliases: Schema.Type,
  haltOnFirstError: true,
  considerNullAsAValue: true
})

/**
 * <p>
 * This is  a simple input  validator. It  checks whether the  user's input
 * complies with the schema; it returns an error if it does not.
 * </p>
 *
 * <p>
 * Unrecognized input properties are  discarded without raising errors. The
 * exported validation functions are asynchronous.
 * </p>
 *
 * @property {Object} List
 *   All list validators.
 *
 * @property {Object} List.Departments
 *   Departments list validator.
 * @property {Object} List.Topics
 *   Topics list validator.
 * @property {Object} List.Tags
 *   Tags list validator.
 * @property {Object} List.Agents
 *   Agents list validator.
 * @property {Object} List.Teams
 *   Teams list validator.
 *
 * @namespace Validator
 * @type {Object}
 */
module.exports = {
  Validator: {
    List: {
      Departments: {
        check: v.compile(Schema.List.Departments)
      },
      Topics: {
        check: v.compile(Schema.List.Topics)
      },
      Tags: {
        check: v.compile(Schema.List.Tags)
      },
      Agents: {
        check: v.compile(Schema.List.Agents)
      },
      Teams: {
        check: v.compile(Schema.List.Teams)
      }
    }
  }
}
