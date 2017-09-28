> # Deprecation Notice
>
> Development on this project has stopped.
>
> If you are searching for Promises that can be resolved multiple times, I highly encurage you to take a look at [RxJS](https://github.com/Reactive-Extensions/RxJS).
> When I started working on this project, I was new to the concept of Promises and did not know of ReactiveExtensions. ReactiveExtensions are available for more languages, they have an active community and a richer set of features than this little project.
>
> If I had known of RxJS at the time, this project would not have been started.

[![Code Climate](https://codeclimate.com/github/lucianw/mpromise/badges/gpa.svg)](https://codeclimate.com/github/lucianw/MPromise)
[![npm version](https://badge.fury.io/js/mpromisejs.svg)](http://badge.fury.io/js/mpromisejs)
[![Bower version](https://badge.fury.io/bo/mpromisejs.svg)](http://badge.fury.io/bo/mpromisejs)
# mpromise.js
Mpromise (from multiple-promise) is a library that serves a promise-like structure with one main difference to ordinary promises:  
Mpromises can be resolved or rejected multiple times. 

Since the structure and the overall behaviour of mpromises is heavily based on promises you should be familiar with promises befor using mpromises. I recommend [this article](https://developers.google.com/web/fundamentals/primers/promises) by Jake Archibald!

**Caution**: There currently is no stable version of mpromises. Even though I test my work continuously, you probably should not use it for production purposes.

## Installation

### Download

- [Mpromise](https://raw.githubusercontent.com/LucianW/MPromise/master/build/mpromise.js)
- [Mpromise-Min](https://raw.githubusercontent.com/LucianW/MPromise/master/build/mpromise.min.js)

### NPM & Bower

You can either use `npm install mpromisejs` to install mpromises with npm or you can use bower via `bower install mpromisejs`!

## Why use mpromise.js?
If you need a promise-like structure that can be resolved multiple times, you might want to consider trying mpromises over standard promises.

**Tradeoffs**: As of Version 0.2.0 mpromises do support queuing like a+ conform promises. But obviously mpromises are still not the best solution for every purpose. And since mpromises are still work-in-progress, you should not use mpromises for production.

**Future**: Since this is still in early stages I am not completely shure where this is going. But since its very likely that a project might want to use promises and mpromises at the same time I thought about combining the two things in future to reduce the overhead that is produced by using a simple polyfill and mpromises.

## How to use mpromise.js?
On first sight mpromise looks like a normal promise:

```js
var promise = new MPromise(function(resolve, reject) {
	// do something
	
	if (/* everything turned out fine */) {
		resolve("Stuff worked!");
	} else {
		reject(new Error("It broke"));
	}
});

promise.then(function(data) {
	// react to resolve
}, function(data) {
	// react to reject
});
```
And the `catch(function)` function as shortcut to `then(undefined, function)` will work too.

### Resolving and Rejecting
The main difference being that you can resolve or reject multiple times is pretty easy to use. Take a look at the following slightly modified example.

```js
var promise = new MPromise(function(resolve, reject) {
	// load data from cache
	if (/* got data */) {
		resolve(cacheData);
	} 
	
	// load data from server A
	if (/* server A was available */) {
		if (/* data changed */) {
			resolve(serverAData);
		}
	} else {
		// load data from server B
		if(/* server B was available and data changed */) {
			resolve(serverBData);
		}
	}
	
	if(/* nothing worked */) {
		reject(new Error("Sorry, no data"));
	}
});
```
**Note**: After you resolved the mpromise once, you will not be able to reject it afterwards. The same rules apply to rejecting first. The call to `resolve(data)` and `reject(data)` returns a boolean to indicate if it was successful.

### Handlers
You can also add multiple handlers to an mpromise. The handlers will be called in the order they were applied to the mpromise.

```js
var always = function(data) {
	// react always
}
promise.then(always, always);

promise.then(function(data) {
	// react to resolve
});

promise.catch(function(data) {
	// react to reject
});
```

### Static Functions
Currently mpromises only support `MPromise.all(mpromises)` to combine several mpromises. They can be provided as array or seperated arguments.

```js
var promiseA = new MPromise(function(resolve, reject) {
	// do stuff
});
var promiseB = new MPromise(function(resolve, reject) {
	// do other stuff
});

MPromise.all(promiseA, promiseB)
.then(function(dataArray) {
	// handle data
})
```
**Note**: The Handler will be given an array with the response objects of all mpromises. They are in the same order as the mpromises are given to `MPromise.all()`.

## License
MIT
