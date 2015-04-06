function VertexBuffer(gl, points) {
	
	//Have gl create a buffer for us
	//keeps it's id
	this.id = gl.createBuffer();

}

VertexBuffer.prototype.bind = function(gl) {
	//set this buffer as the active buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
};

VertexBuffer.prototype.load = function(gl, points) {

	this.bind(gl);

	//convert from a list of pv to an array of Numbers
	var pointData = [];
	
	for (var i = 0; i < points.length; i++) {
		for ( var j = 0; j < 3; j++) {
			pointData.push(points[i].get(j));
		}
	}

	//load the buffer data, wrap the pv data in a Float32Array
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointData), gl.STATIC_DRAW);
};