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
			console.log("t1 - resolve1", data);
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
			console.log("t1 - reject1", data);
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
			console.log("t2 - reject", data);
		}

		t2.then(function(data) {
			console.log("t2 - resolve", data);
		},x);

		t2.catch(x);


		// #### TEST 3 ####
		var t3 = new MPromise(function(resolve, reject) {
			setTimeout(function() {
				resolve({d: true, e: false, f: 2});
			}, 3000);
		});

		MPromise.all(t1, t3)
		.then(function(data) {
			console.log("t1+t3 resolve", data);
		}, function(data) {
			console.log("t1+t3 reject", data);
		});


		// #### TEST 4 ####
		var t4 = new MPromise(function(resolve, reject) {
			setTimeout(function() {
				resolve({d: true, e: false, f: 3});
			}, 5000);
		});

		MPromise.all([t3, t4])
		.then(function(data) {
			console.log("t3+t4 resolve", data);
		}, function(data) {
			console.log("t3+t4 reject", data);
		});

		// #### TEST 5 ####
		var t5 = new MPromise(function(resolve, reject) {
			resolve({d: true, e: false, f: 5});
		});
		
		t5.then(function(data) {
			console.log("t5 resolve", data);
		});

		MPromise.all([t3, t5])
		.then(function(data) {
			console.log("t3+t5 resolve", data);
		}, function(data) {
			console.log("t3+t5 reject", data);
		});

		// #### TEST 6 ####
		var t6 = new MPromise(function(resolve, reject) {
			reject({d: true, e: false, f: 6});
		});
		
		t6.catch(function(data) {
			console.log("t6 reject", data);
		});
	}
	test();

})();
