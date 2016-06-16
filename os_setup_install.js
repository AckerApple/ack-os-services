var osType = require('os').type()//node module
var exec = require('child_process').exec

function paramOnComplete(){
  console.log(osType+' service dependents installed')
}

function runMacInstall(onComplete){
  var cmdProc = function(error, stdout, stderr){
    console.log(error ? error : stdout)
    onComplete()
  }
  console.log('\x1b[34mInstalling Mac OS service dependents\x1b[0m')
  exec('npm install node-mac@^0.1.3', cmdProc)
}

function runWinInstall(onComplete){
  var cmdProc = function(error, stdout, stderr){
    console.log(error ? error : stdout)
    onComplete()
  }
  console.log('\x1b[34mInstalling Windows OS service dependents\x1b[0m')
  exec('npm install node-windows@^0.1.11', cmdProc)
}

function paramOsInstalls(onComplete){
  onComplete = onComplete || paramOnComplete

  if(osType=='Darwin'){
    return runMacInstall(onComplete)
  }

  //only install service options for windows
  if(osType=='Windows_NT'){
    return runWinInstall(onComplete)
  }

  console.log('Os services skipped. Uknown OS: '+osType)
}

module.exports = paramOsInstalls