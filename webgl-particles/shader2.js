var Shader2 = function (vShaderSource, fShaderSource) {

  this.fShader = gl.createShader(gl.FRAGMENT_SHADER);
  this.vShader = gl.createShader(gl.VERTEX_SHADER);

  gl.shaderSource (this.fShader, fShaderSource);
  gl.compileShader (this.fShader);

  if (!gl.getShaderParameter (this.fShader, gl.COMPILE_STATUS)) {
    alert (gl.getShaderInfoLog(this.fShader));
  }

  gl.shaderSource (this.vShader, vShaderSource);
  gl.compileShader (this.vShader);

  if (!gl.getShaderParameter (this.vShader, gl.COMPILE_STATUS)) {
    alert (gl.getShaderInfoLog(this.vShader));
  }

  this.shaderProgram = gl.createProgram();
  gl.attachShader (this.shaderProgram, this.vShader);
  gl.attachShader (this.shaderProgram, this.fShader);
  gl.linkProgram  (this.shaderProgram);

  gl.useProgram(this.shaderProgram);

  this.shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

  this.shaderProgram.vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

  this.shaderProgram.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

  gl.disableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
  gl.disableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
  gl.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
}
