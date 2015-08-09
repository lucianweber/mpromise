/**
 * @author Lucian Weber [lucian@weber.xyz]
 */

(function () {
	var root;
	
	'use strict';
	
	/* Helper Functions */
	function isFn(fn) { return typeof fn === 'function'; }
	function isObj(obj) { return typeof obj === 'object'; }
	var isArray = (Array.isArray || function(value) { return Object.prototype.toString.call(value) === '[object Array]' });
	
	/* Setting root variable */
	if (isObj(window) && window) {
		root = window;
	} else {
		root = global;
	}
	
	
	function bind(fn, promise) {
		var array = promise.listeners;
		try {
			fn(function (obj) {
				if(promise.lastAction.type === false) { return false; }
				promise.lastAction.type = true;
				promise.lastAction.data = obj;
				for(var i = 0; i < array.length; i++) {
					if(isFn(array[i].resolve)) {
						try {
							var retval = array[i].resolve(obj);
							array[i].onResolve(retval);
						} catch (ex) {
							array[i].onReject(retval);
						}
					}
				}
				return true;
			}, function (obj) {
				if(promise.lastAction.type === true) { return false; }
				promise.lastAction.type = false;
				promise.lastAction.data = obj;
				for(var i = 0; i < array.length; i++) {
					if(isFn(array[i].reject)) {
						try {
							var retval = array[i].reject(obj);
							array[i].onResolve(retval);
						} catch (ex) {
							array[i].onReject(retval);
						}
					}
				}
				return true;
			});
		} catch (ex) {
			if (promise.lastAction.type === true) { return; }
			promise.lastAction.type = false;
				promise.lastAction.data = ex;
			for (var i = 0; i < array.length; i++) {
				if(isFn(array[i].reject)) {
					array[i].reject(ex);
				}
			}
		}
	}
	
	function pushFn(resolve, reject, onResolve, onReject) {
		var array = this.listeners;
		for(var i = 0; i < array.length; i++) {
			if((isFn(array[i].resolve) && isFn(resolve) && array[i].resolve === resolve) || (isFn(array[i].reject) && isFn(reject) && array[i].reject === reject)){
				return;
			}
		}
		array.push({
			resolve: resolve,
			reject: reject,
			onResolve: onResolve,
			onReject: onReject
		});
	}
	
	function _promise(fn) {
		var prom = this;
		
		if (!isObj(this)) {
			throw new TypeError('MPromises must be constructed via new');
		}
		if (!isFn(fn)) {
			throw new TypeError('not a function');
		}
		
		this.listeners = [];
		this.lastAction = {
			type: null,
			data: null
		};
		
		setTimeout(function() {
			bind(fn, prom);
		}, 1);
		
		return this;
	}
	
	_promise.prototype.then = function(done, fail) {
		var me = this;
		setTimeout(function() {
			if(me.lastAction.type === true && isFn(done)) {
				done(me.lastAction.data);
			} else if(me.lastAction.type === false && isFn(fail)) {
				fail(me.lastAction.data);
			}
		}, 1);
		return new _promise(function(resolve, reject) {
			pushFn.call(me, done, fail, resolve, reject);
		});
	};
	
	_promise.prototype.catch = function(fn) {
		var me = this;
		setTimeout(function() {
			if(me.lastAction.type === false && isFn(fn)) {
				fn(me.lastAction.data);
			}
		}, 1);
		return new _promise(function(resolve, reject) {
			pushFn.call(me, null, fn, resolve, reject);
		});
	};
	
	
	function bindA(j, type, tracker, resolve, reject) {
		return function(value) {
			tracker[j].status = (type === 1);
			tracker[j].value = value;
			
			var values = tracker.map(function(v) { return v.value; });
			for(var i = 0; i < tracker.length; i++) {
				if(tracker[i].status === null){
					return;
				}
				if (tracker[i].status === false) {
					reject(values);
					return;
				}
			}
			resolve(values);
		};
	}
	
	_promise.all = function() {
		var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);
		
		if(args.length === 0) {
			return Error('insufficient arguments');
		} else if(args.length === 1) {
			return args[0];
		}
		
		return new _promise(function(resolve, reject) {
			var tracker = [];
			for(var i = 0; i < args.length; i++) {
				tracker[i] = {
					status: null,
					value: null
				};
				args[i].then(bindA(i, 1, tracker, resolve, reject), bindA(i, 2, tracker, resolve, reject));
			}
		});
	};
	
	if (!root.MPromise) {
		root.MPromise = _promise;
	}
	
})();