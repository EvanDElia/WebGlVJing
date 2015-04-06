function PV(x, y, z, w) {
	this.array = [];

	if (typeof x === "boolean") {
		this.array.push(0.0);
		this.array.push(0.0);
		this.array.push(0.0);
		if (x) {
			this.array.push(1.0);
		} else {
			this.array.push(0.0);
		}
	} else if (typeof x === "number") {
		this.array.push(x);
		this.array.push(y);
		this.array.push(z);
		if (w) {
			this.array.push(1.0);
		} else {
			this.array.push(0.0);
		}
	}
}

PV.prototype.get = function(i) {
	if (typeof i === "number") {
		if (i >= 0 && i < 4) {
			return this.array[i];
		} else {
			throw "Out of Bounds";
		}
	} else {
		throw "Illegal Argument";
	}
};

PV.prototype.set = function(i, n) {
	if (typeof i !== "number" || typeof n !== "number") {
		throw "Illegal Argument";
	}
	if (i < 0 || i > 3) {
		throw "Out of Bounds";
	}
	this.array[i] = n;
};

PV.prototype.times = function(v) {
	if (v === undefined) {
		throw "Illegal Argument";
	}

	var ret = new PV(false);

	if (typeof v === "number") {

		for ( var i = 0; i < 4; i++) {
			ret.set(i, this.get(i) * v);
		}

		return ret;
	} else {

		for ( var i = 0; i < 4; i++) {
			ret.set(i, this.get(i) * v.get(i));
		}
		return ret;
	}
};

PV.prototype.plus = function(v) {
	if (v === undefined) {
		throw "Illegal Argument";
	}

	var ret = new PV(false);

	for ( var i = 0; i < 4; i++) {
		ret.set(i, this.get(i) + v.get(i));
	}
	return ret;
};

PV.prototype.minus = function(v) {

	var ret = new PV(false);

	if (v === undefined) {

		for ( var i = 0; i < 4; i++) {
			ret.set(i, -this.get(i));
		}
		return ret;
	} else {

		for ( var i = 0; i < 4; i++) {
			ret.set(i, this.get(i) - v.get(i));
		}
		return ret;
	}
};

PV.prototype.dot = function(v) {
	if (v === undefined) {
		throw "Illegal Argument";
	}

	var sum = 0;

	for ( var i = 0; i < 4; i++) {
		sum += this.get(i) * v.get(i);
	}

	return sum;
};

PV.prototype.cross = function(v) {

	if (v === undefined) {
		throw "Illegal Argument";
	}

	var pv = new PV(false);

	for ( var i = 0; i < 3; i++) {
		var j = (i + 1) % 3;
		var k = (i + 2) % 3;
		pv.set(i, this.get(j) * v.get(k) - this.get(k) * v.get(j));
	}
	return pv;
};

PV.prototype.length = function() {
	return Math.sqrt(this.dot(this));
};

PV.prototype.distance = function(v) {
	if (v === undefined) {
		throw "Illegal Argument";
	}

	return v.minus(this).length();
};

PV.prototype.unit = function() {
	return this.times(1. / this.length());
};

PV.prototype.unitize = function() {
	var v = this.unit();
	for ( var i = 0; i < 4; i++) {
		this.set(i, v.get(i));
	}
};

PV.prototype.homogenize = function() {
	if (this.get(3) == 0) {
		return;
	}
	
	for (var i = 0; i < 4; i++) {
		this.set(i, this.get(i) / this.get(3));
	}
};

PV.prototype.toString = function() {
	var s = "[";
	for ( var i = 0; i < 4; i++) {
		s += (i != 3) ? this.get(i) + ", " : this.get(i);
	}
	s += "]";
	return s;
};