function NormalShader() {

	this.program;

};

NormalShader.prototype.init = function(gl) {
	this.program = ShaderProgram.create(gl, "normal.vs", "normal.fs");
};

NormalShader.prototype.enable = function(gl, diffuseMap, normalMap, specMap,
		model, view, projection, light) {
	this.program.enable(gl);

	gl.uniformMatrix4fv(this.program.getUniform(gl, "model"), false, model.getBuffer());
	gl.uniformMatrix4fv(this.program.getUniform(gl, "view"), false, view.getBuffer());
	gl.uniformMatrix4fv(this.program.getUniform(gl, "projection"), false, projection.getBuffer());

	gl.uniform3f(this.program.getUniform(gl, "light_ws"), light.get(0), light.get(1), light.get(2));

	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(this.program.getUniform(gl, "texDiffuse"), 0);
	diffuseMap.bind(gl);

	gl.activeTexture(gl.TEXTURE1);
	gl.uniform1i(this.program.getUniform(gl, "texNormal"), 1);
	normalMap.bind(gl);

	gl.activeTexture(gl.TEXTURE2);
	gl.uniform1i(this.program.getUniform(gl, "texSpecular"), 2);
	specMap.bind(gl);
};
