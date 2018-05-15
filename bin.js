#!/usr/bin/env node
var fs = require('fs');
const {createClient} = require('./index')

const config = JSON.parse(fs.readFileSync('/Users/pv/.dat/pinning.config', 'utf8'));
debugger;

go(...(process.argv.slice(2)))

function go (action, ...args) {
  console.log('Connecting to', config["serverUrl"])
  createClient(config["serverUrl"], {username: config["username"], password: config["password"]}, (err, client) => {
    if (err) return onerror(err)

    console.log(action, '(', args.map(JSON.stringify), ')')
    switch (action) {
      case 'add': return client.addDat({url: args[0], name: args[1], domains: args.slice(2)}, cb)
      case 'update': return client.updateDat(args[0], {name: args[1], domains: args.slice(2)}, cb)
      case 'remove': return client.removeDat(args[0], cb)
      case 'get': return client.getDat(args[0], cb)
      case 'list': return client.listDats(cb)
      default: return client[action](cb)
    }
    function cb (err, res) {
      if (err) return onerror(err)
      console.log(res)
    }
  })
}

function onerror (e) {
  console.log('Usage:', process.argv[1], '[service] [username] [password] [action] [args...]')
  console.log('')
  console.log(e)
}
