BumpShader.BUMP_STYLE = {
	NORMAL : 0,
	INVERTED : 1,
	OFF : 2
};

function BumpShader() {

	this.program;
	this.depthScale = 3.0;
	this.style = BumpShader.BUMP_STYLE.NORMAL;

};

BumpShader.prototype.init = function(gl) {
	this.program = ShaderProgram.create(gl, "bump.vs", "bump.fs");
};

BumpShader.prototype.toggleBumps = function() {
	this.style = (this.style + 1) % 3;
};

BumpShader.prototype.enable = function(gl, heightMap, model, view, projection,
		light) {
	this.program.enable(gl);

	gl.uniformMatrix4fv(this.program.getUniform(gl, "model"), false, model
			.getBuffer());
	gl.uniformMatrix4fv(this.program.getUniform(gl, "view"), false, view
			.getBuffer());
	gl.uniformMatrix4fv(this.program.getUniform(gl, "projection"), false,
			projection.getBuffer());

	var multiplier = 1.0;

	switch (this.style) {
	case BumpShader.BUMP_STYLE.NORMAL:
		multiplier = 1.0;
		break;
	case BumpShader.BUMP_STYLE.INVERTED:
		multiplier = -1.0;
		break;
	case BumpShader.BUMP_STYLE.OFF:
		multiplier = 0.0;
		break;
	}

	gl.uniform1f(this.program.getUniform(gl, "depthScale"), multiplier
			* this.depthScale);

	// scaling the texture coordinates to make the texture repeat
	// scale the width by 2x the height because the image is square yet U
	// covers 2pi and V covers pi
	gl.uniform2f(this.program.getUniform(gl, "texcoordScale"), 8, 4);

	var texelSize = [ 1.0 / heightMap.width, 1.0 / heightMap.height ];
	gl.uniform2fv(this.program.getUniform(gl, "texelSize"), new Float32Array(
			texelSize));

	gl.uniform3f(this.program.getUniform(gl, "light_ws"), light.get(0), light
			.get(1), light.get(2));

	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(this.program.getUniform(gl, "texHeight"), 0);
	heightMap.bind(gl);
};
