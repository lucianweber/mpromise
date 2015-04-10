(function () {

	function test() {
		
		// #### TEST 1 ####
		var t1 = new MPromise(function(resolve, reject) {
			setTimeout(function() {
				var x = resolve({ a: true, b: false, c: 1});
				console.log("resolve", x);
			}, 500);
			// throw Error("test");
			// setTimeout(function() {
			// 	var x = reject({ a: false, b: true, c: 1});
			// 	console.log("reject", x);
			// }, 1500);
		});

		t1.then(function(data) {
			console.log("t1 - resolve1");
			console.log(data);
			return "t1 - resolve1 - return";
		}).then(function(data) {
			console.log(data);
		}).then(function(data) {
			console.log(data);
		})

		t1.then(function(data) {
			console.log("t1 - resolve2");
		});
		
		t1.catch(function(data) {
			console.log("t1 - reject1");
			console.log(data);
		});
		
		
		// #### TEST 2 ####
		var t2 = new MPromise(function(resolve, reject) {
			setTimeout(function() {
				reject({
					data: "faildata"
				});
			}, 2000);
		})
		
		var x = function(data) {
			console.log("t2 - reject");
			console.log(data);
		}
		
		t2.then(function(data) {
			console.log("t2 - resolve");
		},x);
		
		t2.catch(x);
		
		
		// #### TEST 3 ####
		var t3 = new MPromise(function(resolve, reject) {
			setTimeout(function() {
				resolve({d: true, e: false, f: 2});
			}, 5000);
		});
		
		MPromise.all(t1, t3)
			.then(function(data) {
				console.log("t1+t3 resolve");
				console.log(data);
			}, function(data) {
				console.log("t1+t3 reject");
				console.log(data);
			});
		
		
		// #### TEST 4 ####
		var t4 = new MPromise(function(resolve, reject) {
			setTimeout(function() {
				resolve({d: true, e: false, f: 3});
			}, 5000);
		});
		
		MPromise.all([t3, t4])
			.then(function(data) {
				console.log("t3+t4 resolve");
				console.log(data);
			}, function(data) {
				console.log("t3+t4 reject");
				console.log(data);
			});
	}
	test();

})();