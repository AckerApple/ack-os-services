# ack-os-services
Operating System install/start/stop types of services, wrapped the Acker way

## Install
```
$ npm install https://github.com/AckerApple/ack-node.git --save
```

## Example Usage
```
  var script = require('path').join(__dirname,'application.js')//file to run on service start
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