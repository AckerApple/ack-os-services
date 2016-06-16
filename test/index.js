var isUninstall = true
var isStop = true

var scriptPath = require('path').join(__dirname,'application.js')

var Ws = require('../index.js')('AAAAA',{
	description: 'Launches the AAAAA server',
  script: scriptPath
})

function stop(){
  return Ws.stop().then(()=>console.log('successfully stopped'))
}

function uninstall(){
  return Ws.uninstall().then( ()=>console.log('successfully uninstalled') )
}

Ws.install()
.then( ()=>console.log('service installed') )
.then( ()=>Ws.start() )
.then( ()=>console.log('successfully started') )
.if(()=>isStop, ()=>stop() )
.if(()=>isUninstall, ()=>uninstall() )
.catch('EACCES',e=>{
  console.log('\x1b[31m! FILE ACCESS ERROR !\x1b[0m')
  console.log('\x1b[34m> Try process again in sudo mode\x1b[0m')
  console.log('\x1b[34m> Try altering permissions of target file\x1b[0m')
  throw e
})
.catch(e=>{
  console.error(e)
})