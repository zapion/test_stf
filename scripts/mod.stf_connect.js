var Swagger = require('swagger-client');

var SWAGGER_URL = 'http://172.30.66.59:7100/api/v1/swagger.json'
var AUTH_TOKEN  = '55e213835dba4c67871bb15a3cceeb9d9f1edf0043b74038a911ffeb4f0fb5f8';
var Promise = require('bluebird')

var client = new Swagger({
  url: SWAGGER_URL
, usePromise: true
, authorizations: {
    accessTokenAuth: new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + AUTH_TOKEN, 'header')
  }
})

var serial = process.argv.slice(2)[0]

serialCheck = new Promise(function() {
  if(!serial) {
    client.then(function(api) {
      return api.devices.getDevices().then(function(res) {
        serial = res.obj.devices.find(x => x.using === false).serial
        console.log("get device " + serial)
      })
    })
  }
  return serial
})

serialCheck.then(function(result) {
  console.log("pass serial check:" + result)
  // client.then(function(api) {
  //   console.log("finally run " + serial)
  //   return api.devices.getDeviceBySerial({
  //     serial: serial
  //   , fields: 'serial,present,ready,using,owner'
  //   }).then(function(res) {
  //     // check if device can be added or not
  //     var device = res.obj.device
  //     if (!device.present || !device.ready || device.using || device.owner) {
  //       console.log("Device not available")
  //       throw new Error('Device is not available')
  //     }

  //     return api.user.addUserDevice({
  //       device: {
  //         serial: device.serial
  //       , timeout: 900000
  //       }
  //     }).then(function(res) {
  //       if (!res.obj.success) {
  //         throw new Error('Could not connect to device')
  //       }

  //       return api.user.remoteConnectUserDeviceBySerial({
  //         serial: device.serial
  //       }).then(function(res) {
  //         console.log(res.obj.remoteConnectUrl)
  //       })
  //     })
  //   })
  // })
}, function(error) { console.log("unknown failure")})
