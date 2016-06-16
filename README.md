# ack-os-services
Operating system install/start/stop types of services for Mac and Windows, wrapped the Acker way

## Install
```
$ npm install ack-os-services --save
```

## Example Usage
Examples written in ECMA6. Actual code is written in CommonJS
```
//file to run on service start
var script = require('path').join(__dirname,'application.js')

//Object to govern service
var osService = require('ack-os-services')('AAAAA',{
  description: 'Launches AAAAA server',
  script: script
})

//Example:Install
osService.install().then( ()=>console.log('service installed') )

//Example:Start
osService.start().then( ()=>console.log('service started') )

//Example:Stop
osService.stop().then(()=>console.log('service stopped'))

//Example:Uninstall
osService.uninstall().then(()=>console.log('service uninstalled'))

//Example:Catch
osService.install()
.catch('EACCES',e=>{
  console.log('\x1b[31m! FILE ACCESS ERROR !\x1b[0m')
  console.log('\x1b[34m> Try process again in sudo mode\x1b[0m')
  console.log('\x1b[34m> Try altering permissions of target file\x1b[0m')
  throw e
})
.catch(e=>{throw e})
```

## HEADS UP
#### Terminal/CMD commands often have to be run as a root user when performing install/uninstall because access to system services is required.

## Test
Again, sudo for Mac OR run-as-administrator for Windows, maybe required
```
$ npm test
```
- OR -
```
$ sudo npm test
```