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

const util = require('node:util')
const Link = require('grenache-nodejs-link')
const { PeerRPCClient: Peer } = require('grenache-nodejs-http')

const link = new Link({
  grape: 'http://127.0.0.1:30002'
})
link.start()

const peer = new Peer(link, {})
peer.init()

const actions = [
  'getDepartments',
  'getTopics',
  'getTags',
  'getAgents',
  'getTeams'
]

const request = async (client, payload, service = 'rest:ext:helpdesk') => {
  return new Promise((resolve) => {
    client.request(service, payload, { timeout: 10000 }, (err, data) => {
      if (err) {
        process.stderr.write(`${err}\n`)
      } else {
        process.stdout.write(`query response (${payload.action} on ${service}):\n${util.inspect(data, { colors: true, depth: 0x10 })}\n---\n`)
      }

      return resolve()
    })
  })
}

Promise.all([
  ...actions.map(
    (action) => request(peer, { action }, 'rest:ext:helpdesk:foo')
  ),
  ...actions.map(
    (action) => request(peer, { action, args: [{ sort: 'desc' }] }, 'rest:ext:helpdesk:bar')
  )
]).then(
  () => process.exit(0)
)
