var Swagger = require('swagger-client');

var SWAGGER_URL = 'http://172.30.66.59:7100/api/v1/swagger.json'
var AUTH_TOKEN  = '55e213835dba4c67871bb15a3cceeb9d9f1edf0043b74038a911ffeb4f0fb5f8';


var client = new Swagger({
  url: SWAGGER_URL
, usePromise: true
, authorizations: {
    accessTokenAuth: new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + AUTH_TOKEN, 'header')
  }
})

var serial = process.argv.slice(2)[0]

client.then(function(api) {
  new Promise(function (resolve) {
    if(!serial) {
      return api.devices.getDevices().then(function(res) {
        available_devices = res.obj.devices.filter(x => x.using === false)
        serial = available_devices[~~(Math.random() * available_devices.length)].serial
        resolve()
      })
    }
    resolve()
  }).then(function() {
    return api.devices.getDeviceBySerial({
      serial: serial
    , fields: 'serial,present,ready,using,owner'
    }).then(function(res) {
      // check if device can be added or not
      var device = res.obj.device
      if (!device.present || !device.ready || device.using || device.owner) {
        throw new Error('Device is not available')
      }

      return api.user.addUserDevice({
        device: {
          serial: device.serial
        , timeout: 900000
        }
      }).then(function(res) {
        if (!res.obj.success) {
          throw new Error('Could not connect to device')
        }

        return api.user.remoteConnectUserDeviceBySerial({
          serial: device.serial
        }).then(function(res) {
          console.log(res.obj.remoteConnectUrl + " " + serial)
        })
      })
    })
  })
})

