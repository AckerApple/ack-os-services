module.exports = function(name, options){
	return new OsService(name, options)
}

var domain = require('domain'),//we use a domain because node-mac and node-windows runs async attempts to root file system access which causes uncaught errors
	ack = require('ack-node'),//promise & folder delete
	path = require('path'),
	osType = require('os').type()//node module

switch(osType){
	case 'Darwin':
		var Service = require('node-mac').Service
		break;

	case 'Windows_NT':
		var Service = require('node-windows').Service
		break;
}

/**
	@name - name of service to install/start/stop
	@options - see npm node-man or node-windows
*/
function OsService(name,options){
	this.data = options || {}
	if(name)this.data.name = name
  this.data.cwd = this.data.cwd || __dirname//temp-fix because node-mac fails without
	return this
}

OsService.prototype.getService = function(){
	if(this.Service!=null)return this.Service
	this.Service = new Service(this.data)
	return this.Service
}

OsService.prototype.start = function(){
	return ack.promise()
	.next(function(next){
		var svc = this.getService()
		svc.on('start',next)
		svc.start()
	},this)
}

OsService.prototype.stop = function(){
	return ack.promise()
	.next(function(next){
		var svc = this.getService()
		svc.on('stop',next)
		svc.stop()
	},this)
}

OsService.prototype.exists = function(){
	return this.getService().exists
}

OsService.prototype.install = function(){
	return ack.promise().bind(this)
	.then(function(){
		if(this.data.script==null)throw 'script path required';
		if(this.data.name==null)throw 'service name required';
	})
	.callback(function(callback){
		if(this.getService().exists){//?already installed
			return this.asyncUninstall(callback)
		}
		callback()
	})
	.callback(this.asyncInstall)
}

OsService.prototype.uninstall = function(){
	return ack.promise().bind(this).callback(this.asyncUninstall)
}

OsService.prototype.asyncInstall = function(callback){
	var domain = createDomain()
	var Service = this.getService()
	Service.on('install',function(x){
		callback(null,x)
	})
	Service.on('invalidinstallation',function(ii){
		console.log('invalidinstallation',ii)
	})
	Service.on('error',function(err){
		console.log('error',err)
	})

	domain.run(function(){
		Service.install()
	})
}

OsService.prototype.cleanupLogs = function(){
	var dPath = path.join(this.data.script,'../','daemon')
	return ack.path(dPath).delete()
}

OsService.prototype.asyncUninstall = function(callback){
	var domain = createDomain()
	var Service = this.getService()

	domain.callback = callback

	Service.on('uninstall', function(){
		if(this.data.script){
			this.cleanupLogs()
			.then(function(){
				callback()
			})
		}else{
			callback()
		}
	}.bind(this))

	Service.on('invalidinstallation',function(ii){
		console.log('invalidinstallation',ii)
	})
	Service.on('error', callback)

	domain.run(function(){
		Service.uninstall()
	})
}


/** node-mac and node-windows maybe denied file access, lets help give helpful errors */
function createDomain(){
	var dom = domain.create()

	dom.on('error', function(err) {
		if(this.callback){
			this.callback(err);return
		}

		throw err
	})

	return dom
}