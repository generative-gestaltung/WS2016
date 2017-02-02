var ParticleRenderer = function (N) {

  var render_vertex = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;
    attribute vec2 aTextureCoord;

    uniform sampler2D uSampler0;

    varying vec2 vTextureCoord;
    varying vec3 vColor;

    void main(void) {
        vColor = aVertexColor;
        vTextureCoord = aTextureCoord;
        vec2 pos = texture2D (uSampler0, aVertexPosition.xy).xy;
        gl_Position = vec4(pos+aTextureCoord, 0.0, 1.0);
    }
`;

var render_fragment = `
  precision mediump float;

  varying vec2 vTextureCoord;
  varying vec3 vColor;

  void main(void) {
    gl_FragColor = vec4(1.0);
  }
`;


  this.N = N;
  this.mesh = new Mesh(24*2*this.N);

  var x0 = 0;
  var y0 = 0;

  var x1 = 0;
  var y1 = 0;

  for (var i=0; i<this.N; i++) {

    x1 = (x0+1)%1024;
    if (x1==0)
      y1 = (y1+1)%1024;

    this.mesh.addVertex (x0/1024, y0/1024, 0, 0, 0);
    this.mesh.addVertex (x1/1024, y1/1024, 0, 0, 0);

    x0 = (x0+1)%1024;
    if (x0==0)
      y0 = (y0+1)%1024;
  }
  /*
  for (var i=0; i<N; i++) {
    for (var j=0; j<N; j++) {
      //this.mesh.addQuad (i*2.0/N-1, j*2.0/N-1, 0.0, 0.0);
      this.mesh.addVertex (i/N, j/N, 0 ,0, 0);
      this.mesh.addVertex (i/N,j/N, 0, 0, 0);
    }
  }
  */

  this.shader = new Shader2 (render_vertex, render_fragment);
  this.shaderProgram = this.shader.shaderProgram;

  this.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertices, gl.STATIC_DRAW);
  this.positionBuffer.itemSize = 3;
  this.positionBuffer.numItems = this.N*2*3;

  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.colors, gl.STATIC_DRAW);
  this.colorBuffer.itemSize = 3;
  this.colorBuffer.numItems = this.N*2*3;

  this.textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, this.mesh.texcoords, gl.STATIC_DRAW);
  this.textureCoordBuffer.itemSize = 2;
  this.textureCoordBuffer.numItems = this.N*2*3;
}


ParticleRenderer.prototype.draw = function (inputTexture) {

    gl.useProgram (this.shaderProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTexture);
    gl.uniform1i(this.shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, this.positionBuffer.numItems);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    gl.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
}
