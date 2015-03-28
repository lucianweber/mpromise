/**
 * @author Lucian Weber [lucian@weber.xyz]
 */

(function () {
	var root;
	
	"use strict";
	
	/* Helper Functions */
	function isFn(fn) { return typeof fn === "function"; }
	function isObj(obj) { return typeof obj === "object"; }
	
	/* Setting root variable */
	if (isObj(window) && window) {
		root = window;
	} else {
		root = global;
	}
	
	
	function bind(fn, array) {
		var lastState;
		try {
			fn(function (obj) {
				if(lastState === false) return false;
				lastState = true;
				for(var i = 0; i < array.length; i++) {
					if(isFn(array[i].resolve))
						array[i].resolve(obj);
				}
				return true;
			}, function (obj) {
				if(lastState === true) return false;
				lastState = false;
				for(var i = 0; i < array.length; i++) {
					if(isFn(array[i].reject))
						array[i].reject(obj);
				}
				return true;
			})
		} catch (ex) {
			if (lastState === true) return;
			lastState = false;
			for (var i = 0; i < array.length; i++) {
				if(isFn(array[i].reject))
					array[i].reject(ex);
			}
		}
	}
	
	function pushFn(array, resolve, reject) {
		for(var i = 0; i < array.length; i++) {
			if((isFn(array[i].resolve) && isFn(resolve) && array[i].resolve === resolve) || (isFn(array[i].reject) && isFn(reject) && array[i].reject === reject))
				return;
		}
		array.push({
			resolve: resolve,
			reject: reject
		});
	}
	
	function Promise(fn) {
		var prom = this;
		
		if (!isObj(this))
			throw new TypeError('Promises must be constructed via new');
		if (!isFn(fn))
			throw new TypeError('not a function');
		
		this.listeners = new Array();
		
		setTimeout(function() {
			bind(fn, prom.listeners);
		}, 1);
		
		return this;
	}
	
	Promise.prototype.then = function(done, fail) {
		pushFn(this.listeners, done, fail);
	}
	
	Promise.prototype.catch = function(fn) {
		pushFn(this.listeners, null, fn);
	}
	
	
	function bindA(j, type, tracker, resolve, reject) {
		return function(value) {
			tracker[j].status = (type === 1);
			tracker[j].value = value;
			
			var values = tracker.map(function(v) { return v.value; });
			for(var i = 0; i < tracker.length; i++) {
				if(tracker[i].status === null)
					return;
				if (tracker[i].status === false) {
					reject(values);
					return;
				}
			}
			resolve(values);
		}
	}
	
	Promise.all = function() {
		var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);
		
		if(args.length === 0)
			return Error("insufficient arguments")
		
		if(args.length === 1)
			return args[0];
		
		return new Promise(function(resolve, reject) {
			var tracker = new Array();
			for(var i = 0; i < args.length; i++) {
				tracker[i] = {
					status: null,
					value: null
				};
				args[i].then(bindA(i, 1, tracker, resolve, reject), bindA(i, 2, tracker, resolve, reject));
			}
		});
		
	}
	
	if (!root.MPromise) {
		root.MPromise = Promise;
	}
	
})();