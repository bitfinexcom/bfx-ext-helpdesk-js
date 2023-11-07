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
 * The worker input schema.
 *
 * @file
 */

/**
 * A namespace of all symbols in the input schema.
 *
 * @module schema
 */

/**
 * @class
 * @hideconstructor
 * @classdesc
 *
 * <p>
 * A simple wrapper class used as a schema builder; ensures that each built
 * schema is a null-prototype object.
 * </p>
 *
 * @access private
 */
class Schema {
  /**
   * The schema, as a null-prototype Object.
   *
   * @type {Object}
   * @access private
   */
  #schema

  /**
   * @constructs Schema
   *
   * @param {Schema?} schema
   *   An initialization schema.
   */
  constructor (schema = null) {
    this.#schema = Object.create(null)

    if (schema instanceof Schema) {
      Object.assign(this.#schema, schema.get())
    }
  }

  /**
   * Get current schema.
   *
   * @return {Object}
   *   The current schema, as a null-prototype Object.
   *
   * @access private
   */
  get () {
    return this.#schema
  }

  /**
   * Set schema property.
   *
   * @param {string} key
   *   A schema property name.
   * @param {Any} value
   *   A schema property value.
   *
   * @return {Schema}
   *   The current schema instance.
   *
   * @access private
   */
  set (key, value) {
    this.#schema[key] = value
    return this
  }
}

/**
 * A base schema, with common properties.
 *
 * @type {Schema}
 * @access private
 */
const baseSchema = new Schema()
  .set('$$root', true)
  .set('$$async', true)
  .set('strict', 'remove')

/**
 * A base schema, used for list parameters.
 *
 * @type {Schema}
 * @access private
 */
const listParamsSchema = new Schema(baseSchema)
  .set('type', 'object')
  .set('optional', true)
  .set('nullable', false)
  .set('label', 'params')
  .set('messages', new Schema()
    .set('required', "The '{field}' must be an Object.")
    .get()
  )

/**
 * A common set of list properties.
 *
 * @type {Schema}
 * @access private
 */
const listProperties = new Schema()
  .set('sort', 'sort_t|optional')
  .set('limit', 'uint_t|optional')
  .set('offset', 'uint_t|optional')

/**
 * <p>
 * This  is the  schema of  all user  inputs; any  symbol exported  by this
 * namespace is a null-prototype object.
 * </p>
 *
 * @property {Object} Type
 *   Schema of all custom types.
 *
 * @property {Object} Type.uint_t
 *   Schema of an unsigned integer type.
 * @property {Object} Type.bool_t
 *   Schema of a boolean type.
 * @property {Object} Type.string_t
 *   Schema of a string type.
 * @property {Object} Type.sort_t
 *   Schema of a sorting type.
 *
 * @property {Object} List
 *   Schema used by all list validators.
 *
 * @property {Object} List.Departments
 *   Schema of departments list.
 * @property {Object} List.Topics
 *   Schema of topics list.
 * @property {Object} List.Tags
 *   Schema of tags list.
 * @property {Object} List.Agents
 *   Schema of agents list.
 * @property {Object} List.Teams
 *   Schema of teams list.
 *
 * @namespace Schema
 * @type {Object}
 */
module.exports = {
  Schema: {
    Type: {
      uint_t: new Schema()
        .set('convert', true)
        .set('integer', true)
        .set('positive', true)
        .set('type', 'number')
        .set('nullable', false)
        .set('messages', new Schema()
          .set('required', "The '{field}' field must be a positive integer.")
          .get()
        )
        .get(),

      bool_t: new Schema()
        .set('convert', true)
        .set('type', 'boolean')
        .set('nullable', false)
        .set('messages', new Schema()
          .set('required', "The '{field}' field must be a boolean.")
          .get()
        )
        .get(),

      string_t: new Schema()
        .set('min', 0x01)
        .set('trim', true)
        .set('type', 'string')
        .set('nullable', false)
        .set('messages', new Schema()
          .set('required', "The '{field}' field must be a non-empty string.")
          .get()
        )
        .get(),

      sort_t: new Schema()
        .set('trim', true)
        .set('type', 'string')
        .set('nullable', false)
        .set('uppercase', true)
        .set('enum', ['ASC', 'DESC'])
        .set('messages', new Schema()
          .set('required', "The '{field}' field value does not match any of the allowed values.")
          .get()
        )
        .get()
    },
    List: {
      Departments: new Schema(listParamsSchema)
        .set('properties', new Schema(listProperties)
          .set('pid', 'uint_t|optional')
          .set('name', 'string_t|optional|singleLine|max:0x80')
          .get()
        )
        .get(),

      Topics: new Schema(listParamsSchema)
        .set('properties', new Schema(listProperties)
          .set('is_active', 'bool_t|optional')
          .set('name', 'string_t|optional|singleLine|max:0x20')
          .get()
        )
        .get(),

      Tags: new Schema(listParamsSchema)
        .set('properties', new Schema(listProperties)
          .set('is_active', 'bool_t|optional')
          .set('name', 'string_t|optional|singleLine|max:0xFF')
          .get()
        )
        .get(),

      Agents: new Schema(listParamsSchema)
        .set('properties', new Schema(listProperties)
          .set('is_locked', 'bool_t|optional')
          .set('on_vacation', 'bool_t|optional')
          .set('department_id', 'uint_t|optional')
          .set('name', 'string_t|optional|singleLine|max:0x40')
          .get()
        )
        .get(),

      Teams: new Schema(listParamsSchema)
        .set('properties', new Schema(listProperties)
          .set('is_empty', 'bool_t|optional')
          .set('is_active', 'bool_t|optional')
          .set('name', 'string_t|optional|singleLine|max:0x7D')
          .get()
        )
        .get()
    }
  }
}
