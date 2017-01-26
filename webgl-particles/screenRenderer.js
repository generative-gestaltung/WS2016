var ScreenRenderer = function (x, y, w, h, shaderProgram) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h

  this.shaderProgram = shaderProgram;

  this.mesh = new Mesh(24);
  this.mesh.addQuad (-1,-1, 2, 2);

  this.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertices, gl.STATIC_DRAW);
  this.positionBuffer.itemSize = 3;
  this.positionBuffer.numItems = 6;

  this.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.colors, gl.STATIC_DRAW);
  this.normalBuffer.itemSize = 3;
  this.normalBuffer.numItems = 6;

  this.textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.texcoords, gl.STATIC_DRAW);
  this.textureCoordBuffer.itemSize = 2;
  this.textureCoordBuffer.numItems = 6;

  this.time = 0;
}


ScreenRenderer.prototype.initTextureFramebuffer = function() {

    this.rttFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);
    this.rttFramebuffer.width = this.w;
    this.rttFramebuffer.height = this.h;

    this.rttTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.rttTexture);

    // when float texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    //gl.generateMipmap(gl.TEXTURE_2D);

    gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA,
                   this.rttFramebuffer.width, this.rttFramebuffer.height,
                   0, gl.RGBA, gl.FLOAT, null);

    var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

    gl.renderbufferStorage (gl.RENDERBUFFER, color_buffer_float_ext.RGBA32F_EXT,
                            this.rttFramebuffer.width, this.rttFramebuffer.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rttTexture, 0);
    //gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}



ScreenRenderer.prototype.draw = function (inputTextureA, inputTextureB, renderToTexture) {

    this.time += 0.01;
    gl.useProgram (this.shaderProgram);

    if (renderToTexture){
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);
    }
    else{
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    if (inputTextureA!=null) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, inputTextureA);
      gl.uniform1i(this.shaderProgram.samplerUniform0, 0);
    }

    if (inputTextureB!=null) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, inputTextureB);
      gl.uniform1i(this.shaderProgram.samplerUniform1, 1);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.positionBuffer.numItems);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
}
