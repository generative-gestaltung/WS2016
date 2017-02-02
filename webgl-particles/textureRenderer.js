var TextureRenderer = function (x, y, w, h, shader) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h

  this.shaderProgram = shader.shaderProgram;

  this.mesh = new Mesh(24);
  this.mesh.setColor(1.0, 1.0, 1.0, 1.0);
  this.mesh.addQuad (-1,-1, 2, 2);

  this.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertices, gl.STATIC_DRAW);
  this.positionBuffer.itemSize = 3;
  this.positionBuffer.numItems = 6;

  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.colors, gl.STATIC_DRAW);
  this.colorBuffer.itemSize = 3;
  this.colorBuffer.numItems = 6;

  this.textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.texcoords, gl.STATIC_DRAW);
  this.textureCoordBuffer.itemSize = 2;
  this.textureCoordBuffer.numItems = 6;

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

  this.shaderProgram.samplerUniform0 = gl.getUniformLocation(this.shaderProgram, "uSampler0");
  this.shaderProgram.samplerUniform1 = gl.getUniformLocation(this.shaderProgram, "uSampler1");
  this.shaderProgram.samplerUniform2 = gl.getUniformLocation(this.shaderProgram, "uSampler2");
  this.shaderProgram.samplerUniform3 = gl.getUniformLocation(this.shaderProgram, "uSampler3");

  this.createUniforms();
}



TextureRenderer.prototype.draw = function (textures, renderToTexture) {

    gl.useProgram (this.shaderProgram);

    if (renderToTexture){
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);
    }
    else{
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);


    if (textures.length>0) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      gl.uniform1i(this.shaderProgram.samplerUniform0, 0);
    }

    if (textures.length>1) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[1]);
      gl.uniform1i(this.shaderProgram.samplerUniform1, 1);
    }

    if (textures.length>2) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[2]);
      gl.uniform1i(this.shaderProgram.samplerUniform2, 2);
    }

    if (textures.length>3) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[3]);
      gl.uniform1i(this.shaderProgram.samplerUniform3, 3);
    }

    this.updateUniforms();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.positionBuffer.numItems);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
}

TextureRenderer.prototype.updateUniforms = function() {

}

TextureRenderer.prototype.createUniforms = function() {

}
