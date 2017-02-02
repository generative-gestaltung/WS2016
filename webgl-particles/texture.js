function createTexture (calcPixels, N, W, H) {

	var tmp = new Array(W*H*4).fill(0);
  	calcPixels (tmp, N);
  
 	var txt = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, txt);

  	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA,
                 W, H,
                 0, gl.RGBA, gl.FLOAT, new Float32Array(tmp));


	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);

	return txt;
}