var Receive = require('./index')
var nock = require('nock')
var expect = require('chai').expect

describe('Receive', function () {
  describe('.balanceupdate()', function () {
    var key = 'akeyisme'
    var xpub = 'wakandaxpub'
    var callback = 'https://mystore.com'
    var addr = '183qrMGHzMstARRh2rVoRepAd919sGgMHb'
    var id = 70
    var orderId = 2

    var balanceUpdate = {
      id: id,
      addr: addr,
      op: 'RECEIVE',
      confs: 3,
      callback: callback + '?orderId=' + orderId,
      onNotification: 'KEEP'
    }

    nock('https://api.blockchain.info')
      .post('/v2/receive/balance_update').times(1)
      .reply(200, function (uri, requestBody) {
        var request = JSON.parse(requestBody)
        delete request.key
        request.id = id
        return JSON.stringify(request)
      })

    it('should successfully receive a balance update', function (done) {
      var receive = new Receive(xpub, callback, key)
      receive.balanceupdate(addr, { orderId: orderId })
        .then(function (data) {
          expect(data).to.deep.equal(balanceUpdate)
          done()
        })
        .catch(done)
    })
  })
})
