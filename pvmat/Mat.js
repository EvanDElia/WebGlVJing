function Mat(x, y, z, w) {

	this.array = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];

	for ( var i = 0; i < 4; i++) {
		if (x !== undefined)
			this.set(i, 0, x.get(i));

		if (y !== undefined)
			this.set(i, 1, y.get(i));

		if (z !== undefined)
			this.set(i, 2, z.get(i));

		if (w !== undefined)
			this.set(i, 3, w.get(i));
	}
}

Mat.prototype.get = function(i, j) {
	if (i === undefined || j === undefined || typeof i !== "number"
			|| typeof j !== "number") {
		throw "Illegal Argument";
	}

	if (i < 0 || i > 3 || j < 0 || j > 3) {
		throw "Illegal Argument";
	}

	return this.array[i + 4 * j];
};

Mat.prototype.set = function(i, j, value) {

	if (i === undefined || j === undefined || value === undefined
			|| typeof i !== "number" || typeof j !== "number"
			|| typeof value !== "number") {
		throw "Illegal Argument";
	}

	if (i < 0 || i > 3 || j < 0 || j > 3) {
		throw "Illegal Argument";
	}
	this.array[i + 4 * j] = value;
};

Mat.prototype.transpose = function() {

	var m = new Mat();

	for ( var i = 0; i < 4; i++) {
		for ( var j = 0; j < 4; j++) {
			m.set(i, j, this.get(j, i));
		}
	}

	return m;
};

Mat.prototype.times = function(pv) {

	if (pv === undefined) {
		throw "Illegal Argument";
	}

	if (pv.array.length == 4) {

		var mpv = new PV(false);

		for ( var i = 0; i < 4; i++) {
			for ( var j = 0; j < 4; j++) {
				mpv.set(i, mpv.get(i) + this.get(i, j) * pv.get(j));
			}
		}

		mpv.homogenize();

		return mpv;

	} else if (pv.array.length == 16) {

		var mat = new Mat();

		for ( var i = 0; i < 4; i++) {
			for ( var j = 0; j < 4; j++) {

				var sum = 0;

				for ( var k = 0; k < 4; k++) {
					sum += this.get(i, k) * pv.get(k, j);
				}

				mat.set(i, j, sum);
			}
		}

		return mat;
	}
};

Mat.prototype.toString = function() {
	s = "";
	for ( var i = 0; i < 4; i++) {
		s += this.get(i, 0);
		for ( var j = 1; j < 4; j++) {
			s += " " + this.get(i, j);
		}
		s += "\n";
	}
	return s;
};

Mat.prototype.getBuffer = function() {
	return new Float32Array(this.array);
};

Mat.rotMatrix = function(i, angle) {

	if (i === undefined || angle === undefined || typeof i !== "number"
			|| typeof angle !== "number") {
		throw "Illegal Argument";
	}

	var j = (i + 1) % 3;
	var k = (i + 2) % 3;
	var c = Math.cos(angle);
	var s = Math.sin(angle);

	var mat = new Mat();

	mat.set(j, j, c);
	mat.set(k, j, s);
	mat.set(j, k, -s);
	mat.set(k, k, c);

	return mat;
};

Mat.transMatrix = function(v) {

	if (v === undefined || typeof v !== "object") {
		throw "Illegal Argument";
	}

	var mat = new Mat();

	for ( var i = 0; i < 3; i++) {
		mat.set(i, 3, v.get(i));
	}

	return mat;
};

Mat.scaleMatrix = function(s) {

	var mat = new Mat();

	var scalar = (typeof s === "number");

	for ( var i = 0; i < 3; i++) {
		mat.set(i, i, (scalar ? s : s.get(i)));
	}

	return mat;

};