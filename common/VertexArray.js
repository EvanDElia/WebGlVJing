function VertexArray() {

  this.enableAttribute = function(gl, shader, name, vb, vecSize, coordType) {
	
	//bind the vertex buffer
    vb.bind(gl);
    
    //get the attribute location
    var loc = shader.getAttribute(gl, name);
    
    //enable that location as the input for the vertex array
    gl.enableVertexAttribArray(loc);
    
    //pint the buffer as the vertex attribute input
    gl.vertexAttribPointer(loc, vecSize, coordType, false, 0, 0);
  }
}


  
