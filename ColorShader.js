function ColorShader() {

	this.program;

};

ColorShader.prototype.init = function(gl) {
	this.program = ShaderProgram.create(gl, "color.vs", "color.fs");
};

ColorShader.prototype.enable = function(gl, model, view, projection) {
	this.program.enable(gl);
	gl.uniformMatrix4fv(this.program.getUniform(gl, "model"), false, model.getBuffer());
	gl.uniformMatrix4fv(this.program.getUniform(gl, "view"), false, view.getBuffer());
	gl.uniformMatrix4fv(this.program.getUniform(gl, "projection"), false, projection.getBuffer());
};
