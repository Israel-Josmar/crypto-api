require('babel-register')
require('regenerator-runtime/runtime')

global.fetch = require('node-fetch')

require('./index-express')
