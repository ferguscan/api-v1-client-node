var API = require('../api')
var parse = require('url-parse')
var UrlPattern = require('url-pattern')

var endpoints = {
  receive: new UrlPattern('/receive?xpub=:xpub&callback=:callback&key=:key(&gap_limit=:gapLimit)'),
  balanceupdate: new UrlPattern('/receive/balance_update'),
  checkgap: new UrlPattern('/receive/checkgap?xpub=:xpub&key=:key')
}

var api = new API('https://api.blockchain.info/v2', endpoints)

function Receive (xpub, callback, key, options) {
  options = options || {}
  this.xpub = xpub
  this.callback = callback
  this.key = key
  // A gap limit greater than 20 is in violation of the BIP44 spec
  this.gapLimit = options.__unsafe__gapLimit
}

Receive.prototype.generate = function (query) {
  var callbackUrl = parse(this.callback).set('query', query).toString()
  var callbackEnc = encodeURIComponent(callbackUrl)
  var params = { xpub: this.xpub, key: this.key, callback: callbackEnc, gapLimit: this.gapLimit }
  return api.request('receive', params)
}

Receive.prototype.balanceupdate = function (addr, query) {
  var callbackUrl = parse(this.callback).set('query', query).toString()
  var data = {
    key: this.key,
    callback: callbackUrl,
    addr,
    onNotification: 'KEEP',
    op: 'RECEIVE',
    confs: 3
  }
  return api.post('balanceupdate', {}, JSON.stringify(data))
}

Receive.prototype.checkgap = function () {
  var params = { xpub: this.xpub, key: this.key }
  return api.request('checkgap', params)
}

module.exports = Receive
