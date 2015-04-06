//The shader object
function ShaderProgram(id) {
	this.id = id;
}

ShaderProgram.prototype.enable = function(gl) {
	gl.useProgram(this.id);
};

ShaderProgram.prototype.disable = function(gl) {
	gl.useProgram(0);
};

ShaderProgram.prototype.getAttribute = function(gl, name) {
	return gl.getAttribLocation(this.id, name);
};

ShaderProgram.prototype.getUniform =function(gl, name) {
	return gl.getUniformLocation(this.id, name);
};

//"Static" function to create a shader
//returns a shader object
ShaderProgram.create = function(gl, vs, fs) {
	
	//see the getShader() function below
	var fragmentShader = getShader(gl, vs);
    var vertexShader = getShader(gl, fs);

    //generate the program
    var id = gl.createProgram();
    
    //initialize the object to be returned
    var shaderProgram = new ShaderProgram(id);
    
    //attach and link the compiled shaders
    gl.attachShader(id, vertexShader);
    gl.attachShader(id, fragmentShader);
    gl.linkProgram(id);

    //See if the link was successful
    if (!gl.getProgramParameter(id, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    
    //set this as the enabled program
    shaderProgram.enable(gl);
    
    return shaderProgram;
};

ShaderProgram.createFromFile = function(gl, vs_file, fs_file) {

    var fragmentShader = getShaderFromFile(gl, fs_file, false);
    var vertexShader   = getShaderFromFile(gl, vs_file, true );

 
    //generate the program
    var id = gl.createProgram();
    
    //initialize the object to be returned
    var shaderProgram = new ShaderProgram(id);
    
    //attach and link the compiled shaders
    gl.attachShader(id, vertexShader);
    gl.attachShader(id, fragmentShader);
    gl.linkProgram(id);

    //See if the link was successful
    if (!gl.getProgramParameter(id, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    
    //set this as the enabled program
    shaderProgram.enable(gl);
    
    return shaderProgram;
 

};

function getShaderFromFile(gl, filename, vertex) {
 
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send();
    var str = xhr.responseText;

 
    //The "shader". It's really just an id object for now
    var shader;
    
    //create the apropriate shader
    if (vertex) {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }

    //set the source of this shader to the string we pulled
    gl.shaderSource(shader, str);
    //compile it
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
 
}

function getShader(gl, id) {
	
	//In this implementation we'll require the FS and VS source 
	//to be put in a <script> tag on the page

	//conventions: type="x-shader/x-fragment" or type="x-shader/x-vertex"

	//grab the script DOM element
    var shaderScript = document.getElementById(id);
    
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    
    //Go through and add all the Text Nodes from the element to a string
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    //The "shader". It's really just an id object for now
    var shader;
    
    //create the apropriate shader
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    //set the source of this shader to the string we pulled
    gl.shaderSource(shader, str);
    //compile it
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}
