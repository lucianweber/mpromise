# mpromise.js
Mpromise (from multiple-promise) is a library that serves a promise-like structure with one main difference to ordinary promises:  
Mpromises can be resolved or rejected multiple times. 

Since the structure and the overall behaviour of mpromises is heavily based on promises you should be familiar with promises befor using mpromises. I recommend [this article](http://www.html5rocks.com/en/tutorials/es6/promises/) by Jake Archibald on html5rocks.com!


## Downloads
- [Mpromise](https://github.com/LucianW/MPromise/blob/master/build/mpromise.js)
- [Mpromise-Min](https://github.com/LucianW/MPromise/blob/master/build/mpromise.min.js)


## Why use mpromise.js?
If you need a promise-like structure that can be resolved multiple times, you might want to consider trying mpromises over standard promises.

**Tradeoffs**: Mpromises are not able to fully replace promises. For instance, mpromises do not return a new mpromise when `then(function, function)` is called. Queuing mpromises is therefor not possible at this time.

**Future**: I am not shure right now if queuing will be possible in future versions, since the multiple resolvings might cause some hickups. I will investigate this issue later.


## How to use mpromise.js?
On first sight mpromise looks like a normal promise:
```
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
An the `catch(function)` function as shortcut to `then(undefined, function)` will work too.

### Resolving and Rejecting
The main difference being that you can resolve or reject multiple times is pretty easy to use. Take a look at the following slightly modified example.
```
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
**Note**: After you resolved the mpromise once you will not be able to reject it afterwards. The same rules apply to rejecting first. The call to `resolve(data)` and `reject(data)` returns a boolean to indicate if it was successful.

### Handlers
You can also add multiple handlers to an mpromise. The handlers will be called in the order they were applied to the mpromise.
```
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
```
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
In detail: [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)  
In short: Do what ever you want, as long as you put my name on it.
