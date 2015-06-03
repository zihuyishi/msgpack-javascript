document.writeln('Hello, world!');

Function.prototype.method = function (name, func) {
	if (!this.prototype[name]) {
		this.prototype[name] = func;
	}
	return this;
};

Object.method('superior', function (name) {
	var that = this,
		method = that[name];
	return function () {
		return method.apply(that, arguments);
	};
});

function alert_assert(test, msg) {
	if (!test) {
		alert(msg);
	}
}

function alert_ensure(test, msg) {
	if (test) {
		alert(msg);
	}
}

var empty_object = {};

var stooge = {
	"fist-name" : "Jerome",
	"last-name" : "Hooward"
};

var flight = {
	airline: "Oceanic",
	number: 815,
	departure: {
		IATA: "SYD",
		time: "2015-2-12 13:23",
		city: "Sydney"
	},
	arrival: {
		IATA: "LAX",
		time: "2013-2-21 12:32",
		city: "Los Angeles"
	}
};

if (typeof Object.beget !== 'function') {
	Object.create = function(o) {
		var F = function() {};
		F.prototype = o;
		return new F();
	};
}
var another_stooge = Object.create(stooge);

var box = msgpack.pack(another_stooge);
var third_stooge = msgpack.unpack(box);

alert_assert(third_stooge['fist-name'] === another_stooge['fist-name'], "fist-name equal");
alert_assert(third_stooge['last-name'] === another_stooge['last-name'], "last-name equal");

var add = function(num1, num2) {
	return num1 + num2;
}

var increaseObj = (function() {
	var value = 0;

	return {
		increment: function (inc) {
			value += typeof inc === 'number' ? inc : 1;
		},
		getValue: function() {
			return value;
		}
	};
}());

increaseObj.increment(3);
document.writeln(increaseObj.getValue());

/**
 这种方式不被推荐
*/
var Quo = function (string) {
	this.status = string;
};

Quo.prototype.get_status = function() {
	return this.status;
}

var myQuo = new Quo("confused");
document.writeln(myQuo.get_status());

var statusObject = {
	status: 'A-OK'
}

var status = Quo.prototype.get_status.apply(statusObject);
document.writeln(status);

Number.method('integer', function() {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});

document.writeln((-10 / 3).integer());

var quo = function(status) {
	return {
		get_status: function() {
			return status;
		}
	};
};

var myQuo = quo("amazed");
document.writeln(myQuo.get_status());

var fade = function (node) {
	var level = 1;
	var step = function() {
		var hex = level.toString(16);
		node.style.backgroundColor = '#FFFF' + hex + hex;
		if (level < 15) {
			level += 1;
			setTimeout(step, 100);
		}
	};
	setTimeout(step, 100);
};

fade(document.body);

var serial_maker = function () {
	var prefix = '';
	var seq = 0;
	return {
		set_prefix: function (p) {
			prefix = String(p);
		},
		set_seq: function (s) {
			seq = s;
		},
		gensym: function () {
			var result = prefix + seq;
			seq += 1;
			return result;
		}
	};
};

var seqer = serial_maker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym();

var memoizer = function (memo, formula) {
	var recur = function (n) {
		var result = memo[n];
		if (typeof result != 'number') {
			result = formula (recur, n);
			memo[n] = result;
		}
		return result;
	};
	return recur;
};

var factorial = memoizer([1, 1], function (recur, n) {
	return n * recur (n - 1);
})

var rrrrr = factorial(10);

/*
 继承
*/
var Mammal = function (name) {
	this.name = name;
};

Mammal.prototype.get_name = function () {
	return this.name;
};

Mammal.prototype.says = function () {
	return this.saying || '';
};

var Cat = function (name) {
	this.name = name;
	this.saying = 'meow';
};

Cat.prototype = new Mammal();

Cat.prototype.purr = function (n) {
	var i, s = '';
	for (i = 0; i < n; i += 1) {
		if (s) {
			s += '-';
		}
		s += 'r';
	}
	return s;
};
Cat.prototype.get_name = function () {
	return this.says() + ' ' + this.name + ' ' + this.says();
};
Cat.prototype.type = 'Cat';


var msg_encoder = function () {
	var that = {};
	var obj = new Object();

	that.push = function (name, data) {
		obj[name] = (typeof data === 'function' && undefined) || data;
	};

	that.toString = function () {
		return msgpack.pack(obj, true);
	};
	that.toArray = function () {
		return msgpack.pack(obj);
	}

	return that;
};
var msg_decoder = function (data) {
	var that = {};
	var obj = msgpack.unpack(data);

	that.get = function (name) {
		return obj[name];
	}

	return that;
};

var mammal = function (spec) {
	var that = {};

	that.get_name = function () {
		return spec.name;
	};

	that.says = function() {
		return spec.saying || '';
	};
	that.encode = function(encoder) {
		encoder.push('name', spec.name);
		encoder.push('saying', spec.saying);
	}
	that.decode = function (decoder) {
		spec.name = decoder.get('name');
		spec.saying = decoder.get('saying');
	}

	return that;
};

var myMammal = mammal ({name: 'Herb'});

var cat = function (spec) {
	spec.saying = spec.saying || 'meow';
	var that = mammal(spec);
	that.purr = function (n) {
		var i, s = '';
		for (i = 0; i < n; i += 1) {
			if (s) {
				s += '-';
			}
			s += 'r';
		}
		return s;
	};
	that.get_name = function() {
		return that.says() + ' ' + spec.name + ' ' + that.says();
	}
	return that;
};


var myCat = cat ({name: 'Babel', saying: 'ba'});
document.writeln(myCat.get_name());
var encoder = msg_encoder();
myCat.encode(encoder);
var boxCat = encoder.toArray();

var unboxCat = cat({});
unboxCat.decode(msg_decoder(boxCat));

document.writeln(unboxCat.get_name());

var pureBoxCat = msgpack.pack(new Cat('saye'));
var pureUnboxCat = msgpack.unpack(pureBoxCat);
