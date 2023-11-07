'use strict'

const { Api } = require('bfx-wrk-api')

class ExtHelpdesk extends Api {
  getHelloWorld (space, args, cb) {
    const name = args.name
    const res = 'Hello ' + name

    cb(null, res)
  }
}

module.exports = ExtHelpdesk
