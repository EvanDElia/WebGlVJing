var canvasWidth, canvasHeight;

var clickX;
var clickY;
var viewRadius = 3.0;
var light = new PV(0.75, 0.25, 0.5, false).unit();
var bumpShader = new BumpShader();
var colorShader = new ColorShader();
var normalShader = new NormalShader();
var vertexArray;
var heightMap, diffuseMap, specularMap, normalMap;
var model = new Mat();
var view = new Mat();
var projection = perspective(60, 1.33, 0.2, 20);
var yaw = 0, pitch = 0;
var showTangentBases = false;
var useBumpShader = false;
var sphere1;
var sphere2;
var sphereArray = [];
var viewArray = [];
var fast = false;

var window2clip, clip2window;

var rect;

var client2canvas;
var canvas2client;

function tick() {

	// asks the browser to use this callback on the next animation
	// this function is redefined in WebGLUtils to behave in a cross
	// browser way
	requestAnimFrame(tick);// set the key functions

	// call the render function
	try {
		render();
	} catch (err) {
		console.log(err.message);
	}
};

function webGLStart() {

	// get the canvas DOM element
	var canvas = document.getElementById("canvas");

	canvas.width = 1000;
	canvas.height = 560;

	rect = canvas.getBoundingClientRect();

	client2canvas = Mat.transMatrix(new PV(-rect.left, -rect.top, 0, false));
	canvas2client = Mat.transMatrix(new PV(rect.left, rect.top, 0, false));

	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	
	projection = perspective(60, canvasWidth/canvasHeight, 0.2, 20);

	// Using the google provided WebGLUtils to grab the gl
	// context in the safest way possible
	gl = WebGLUtils.setupWebGL(canvas);

	// load shader programs
	bumpShader.init(gl);
	colorShader.init(gl);
	normalShader.init(gl);

	// load geometry
	vertexArray = new VertexArray();
	
	sphere1 = new Sphere(7);
	sphere1.init();
	sphere2 = new Sphere(2);
	sphere2.init();
	for (var i = 2; i < 33; i++){
		sphereArray[i - 2] = new Sphere(i);
		sphereArray[i - 2].init();
		console.log("" + sphereArray[i - 2]);
	}

	var metal_hm = new Image();
	var moon_diffuse = new Image();
	var moon_sm = new Image();
	var moon_nm = new Image();

	// Only this texture can have REPEAT and TRILINEAR settings because it is a
	// POT
	
	//Also flip all of the textures on their Y axis
	
	metal_hm.onload = function() {
		heightMap = Texture2D.create(gl, Texture2D.Filtering.TRILINEAR,
				Texture2D.Wrap.REPEAT, metal_hm.width, metal_hm.height,
				gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, metal_hm, true);
	};

	moon_diffuse.onload = function() {
		diffuseMap = Texture2D.create(gl, Texture2D.Filtering.BILINEAR,
				Texture2D.Wrap.CLAMP_TO_EDGE, moon_diffuse.width,
				moon_diffuse.height, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
				moon_diffuse, true);
	};
	moon_sm.onload = function() {
		specularMap = Texture2D.create(gl, Texture2D.Filtering.BILINEAR,
				Texture2D.Wrap.CLAMP_TO_EDGE, moon_sm.width, moon_sm.height,
				gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, moon_sm, true);
	};
	moon_nm.onload = function() {
		normalMap = Texture2D.create(gl, Texture2D.Filtering.BILINEAR,
				Texture2D.Wrap.CLAMP_TO_EDGE, moon_nm.width, moon_nm.height,
				gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, moon_nm, true);
	};

	// load textures
	metal_hm.src = "metal_hm.png";
	moon_diffuse.src = "moon_diffuse.jpg";
	moon_sm.src = "moon_sm.png";
	moon_nm.src = "moon_nm.png";
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	gl.enable(gl.CULL_FACE);

	// set the mouse functions
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	canvas.onmousemove = handleMouseMove;
	
	document.addEventListener("mousewheel", handleMouseWheel, false);
	// Firefox
	document.addEventListener("DOMMouseScroll", handleMouseWheel, false);
	
//	document.mousewheel = handleMouseWheel;
//	document.DOMMouseScroll = handleMouseWheel;

	// set the key functions
	// for some reason certain keys only respond
	// with the keycode for keypress events
	// and others only on keydown event.
	// Also it's different for various browsers
	// This method is not at all comprehensive,
	// but seems to work on Firefox and Chrome
	// which I'm ok with.
	document.onkeypress = handleKeyPress;
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	var w = canvasWidth;
	var h = canvasHeight;

	window2clip = Mat.transMatrix(new PV(-1, 1, 0, false)).times(
			Mat.scaleMatrix(new PV(2.0 / w, -2.0 / h, 1, true)));

	clip2window = Mat.scaleMatrix(new PV(w / 2.0, -h / 2.0, 1, true)).times(
			Mat.transMatrix(new PV(1, -1, 0, false)));


	
	// start the drawing loop
	tick();
};

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	view = Mat.transMatrix(new PV(0, 2., -viewRadius, false));
	view2 = Mat.transMatrix(new PV(0, 0., -viewRadius, false));

	if (useBumpShader) {
		for (var i = 0; i < 5; i ++){
			for (var j = 0; j < 5; j++){
				view = Mat.transMatrix(new PV(-5. + j/0.5, 5. - i/0.5, -viewRadius, false));
				bumpShader.enable(gl, heightMap, model, view, projection, light);
				sphereArray[j + i * 5].draw(gl, vertexArray, normalShader.program);
			}			
		}
	} else {
		for (var i = 0; i < 3; i ++){
			for (var j = 0; j < 3; j++){
				for (var z = 0; z < 17; z++){
				view = Mat.transMatrix(new PV(-2.5 + j/0.4, 3.75 - i/0.4, -viewRadius + z/0.4, false));
				normalShader.enable(gl, diffuseMap, normalMap, specularMap, model,
				view, projection, light);
				sphereArray[j * 3 + i * 3 + z].draw(gl, vertexArray, normalShader.program);
				}
			}			
		}
		/*normalShader.enable(gl, diffuseMap, normalMap, specularMap, model,
				view, projection, light);
		sphere1.draw(gl, vertexArray, normalShader.program);
		normalShader.enable(gl, diffuseMap, normalMap, specularMap, model,
				view2, projection, light);
		sphere2.draw(gl, vertexArray, normalShader.program);
		*/
		if (fast)
		viewRadius += 0.3;
		else
		viewRadius += 0.1;
	}

	if (showTangentBases) {
		colorShader.enable(gl, model, view, projection);
		sphere1.drawTangentBases(gl, vertexArray, colorShader.program);
		sphere2.drawTangentBases(gl, vertexArray, colorShader.program);
	}

};

var controlPressed = false;

function handleKeyPress(e) {

	var up = 38;
	var down = 40;
	var right = 39;
	
	
	
	switch (e.keyCode) {
	case up:
		bumpShader.depthScale = bumpShader.depthScale + 0.25;
		fast = true;
		break;
	case down:
		bumpShader.depthScale = bumpShader.depthScale - 0.25;
		fast = false;
		break;
	case right:
		useBumpShader = !useBumpShader;
		break;
	}

}

function handleKeyUp(e) {
	var control = 17;
	
	console.log(e.keyCode);
	
	switch(e.keyCode) {
	case control:
		controlPressed = false;
		break;
	}
}

function handleKeyDown(e) {
	var b = 66;
	var t = 84;
	var control = 17;
	
	switch(e.keyCode) {
	case b:
		bumpShader.toggleBumps();
		break;
	case t:
		showTangentBases = !showTangentBases;
		break;
	case control:
		controlPressed = true;
		break;
	}
}

var mouseDown = false;
var windowPress;

function handleMouseDown(e) {
	mouseDown = true;

	clickX = e.clientX;
	clickY = e.clientY;

}

function handleMouseUp(event) {
	mouseDown = false;
}

function handleMouseMove(e) {
	if (!mouseDown) {
		return;
	}

	if (!controlPressed) {
		// rotate the sphere1			
		yaw += (e.clientX - clickX) * 0.005;		
		pitch = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, pitch
				+ (e.clientY - clickY) * 0.005));
		model = Mat.rotMatrix(0, pitch).times(Mat.rotMatrix(1, yaw));
		clickX = e.clientX;
		clickY = e.clientY;
	} else {
		// set the light direction
		var l = window2clip.times(new PV(e.clientX, e.clientY, 0, true));
		l.set(2, 0.5);
		l.set(3, 0.0);
		light = l.unit();
	}

}

function handleMouseWheel(e) {
	// zoom view in/out

	var direction;

	if (e.wheelDelta !== undefined) {
		direction = e.wheelDelta < 0 ? -1 : 1;
	} else {
		direction = e.detail < 0 ? -1 : 1;
	}
	viewRadius = Math.max(1.25, Math.min(15, viewRadius + direction * 0.1));
}

function perspective(fovY, aspect, near, far) {
	var f = 1.0 / Math.tan(toRad(fovY) / 2);
	var m = new Mat();
	m.set(0, 0, f / aspect);
	m.set(1, 1, f);
	m.set(2, 2, (far + near) / (near - far));
	m.set(3, 2, -1);
	m.set(2, 3, (2 * far * near) / (near - far));
	m.set(3, 3, 0);
	return m;
};

/** Converts numeric degrees to radians */
function toRad(num) {
	return num * Math.PI / 180;
};
