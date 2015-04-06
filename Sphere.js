function Sphere(divisions) {

	this.divisions = divisions;

	this.PI_2 = Math.PI / 2.0;

	this.positions = [];
	this.tangents = [];
	this.bitangents = [];
	this.normals = [];
	this.texcoords = [];

	this.vbPositions;
	this.vbTangents;
	this.vbBitangents;
	this.vbNormals;
	this.vbTexcoords;

	this.numVerts = 0;

	this.basisPositions = [];
	this.vbBasisPositions;
	this.basisColors = [];
	this.vbBasisColors;
}

Sphere.prototype.init = function() {
	var dLon = 2.0 * Math.PI / this.divisions;
	var dLat = Math.PI / (this.divisions + 1);

	var lon = 0.0;
	for ( var i = 0; i <= this.divisions; i++) {
		var lat = -this.PI_2 + dLat;

		// bottom triangle
		this.addVertex(lon + dLon / 2, -this.PI_2);
		this.addVertex(lon + dLon, lat);
		this.addVertex(lon, lat);

		// middle triangles
		for ( var j = 0; j < this.divisions; j++) {
			this.addVertex(lon, lat);
			this.addVertex(lon + dLon, lat);
			this.addVertex(lon + dLon, lat + dLat);
			this.addVertex(lon, lat);
			this.addVertex(lon + dLon, lat + dLat);
			this.addVertex(lon, lat + dLat);
			lat += dLat;
		}

		// top triangle
		this.addVertex(lon, lat);
		this.addVertex(lon + dLon, lat);
		this.addVertex(lon + dLon / 2, this.PI_2);

		lon += dLon;
	}

	this.vbPositions = new VertexBuffer(gl);
	this.vbPositions.load(gl, this.positions);

	this.vbTangents = new VertexBuffer(gl);
	this.vbTangents.load(gl, this.tangents);

	this.vbBitangents = new VertexBuffer(gl);
	this.vbBitangents.load(gl, this.bitangents);

	this.vbNormals = new VertexBuffer(gl);
	this.vbNormals.load(gl, this.normals);

	this.vbTexcoords = new VertexBuffer(gl);
	this.vbTexcoords.load(gl, this.texcoords);

	this.vbBasisPositions = new VertexBuffer(gl);
	this.vbBasisPositions.load(gl, this.basisPositions);

	this.vbBasisColors = new VertexBuffer(gl);
	this.vbBasisColors.load(gl, this.basisColors);

};

Sphere.prototype.addVertex = function(lon, lat) {
	var normal = new PV(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math
			.cos(lat)
			* Math.sin(lon), false);
	normal.unitize();
	var tangent = new PV(-Math.sin(lon), 0, -Math.cos(lon), false);
	var bitangent = normal.cross(tangent);
	var texcoord = new PV(lon / (Math.PI * 2.0), lat / Math.PI + 0.5, 0, false);
	var position = new PV(true).plus(normal);

	// vertex information used for bump/normal mapping
	this.positions.push(position);
	this.tangents.push(tangent);
	this.bitangents.push(bitangent);
	this.normals.push(normal);
	this.texcoords.push(texcoord);

	// tangent basis for vertex (debug/illustration purposes only)
	this.basisPositions.push(position);
	this.basisColors.push(new PV(1, 0.25, 0.25, false));
	this.basisPositions.push(position.plus(tangent.times(0.05)));
	this.basisColors.push(new PV(1, 0.25, 0.25, false));
	this.basisPositions.push(position);
	this.basisColors.push(new PV(0.25, 1, 0.25, false));
	this.basisPositions.push(position.plus(bitangent.times(0.05)));
	this.basisColors.push(new PV(0.25, 1, 0.25, false));
	this.basisPositions.push(position);
	this.basisColors.push(new PV(0.25, 0.25, 1, false));
	this.basisPositions.push(position.plus(normal.times(0.05)));
	this.basisColors.push(new PV(0.25, 0.25, 1, false));

	this.numVerts++;
};

Sphere.prototype.draw = function(gl, vao, shader) {
	vao.enableAttribute(gl, shader, "vs_position", this.vbPositions, 3, gl.FLOAT);
	vao.enableAttribute(gl, shader, "vs_tangent", this.vbTangents, 3, gl.FLOAT);
	vao.enableAttribute(gl, shader, "vs_bitangent", this.vbBitangents, 3, gl.FLOAT);
	vao.enableAttribute(gl, shader, "vs_normal", this.vbNormals, 3, gl.FLOAT);
	vao.enableAttribute(gl, shader, "vs_texcoord", this.vbTexcoords, 3, gl.FLOAT);
	gl.drawArrays(gl.TRIANGLES, 0, this.numVerts);
};

Sphere.prototype.drawTangentBases =	function(gl, vao, shader) {
	vao.enableAttribute(gl, shader, "vs_position", this.vbBasisPositions, 3, gl.FLOAT);
	vao.enableAttribute(gl, shader, "vs_color", this.vbBasisColors, 3, gl.FLOAT);
	gl.drawArrays(gl.LINES, 0, this.numVerts * 6);
};
