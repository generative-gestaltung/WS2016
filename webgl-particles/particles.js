  var Particles = function (initPositions, initVelocities, N) {

  var passThru_vertex = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;
    attribute vec2 aTextureCoord;

    varying vec2 vTextureCoord;
    varying vec3 vColor;

    void main(void) {
        vColor = aVertexColor;
        gl_Position = vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
    }
  `;

  var passThru_fragment = `
    precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vColor;

    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;

    void main(void) {
      gl_FragColor = vec4(texture2D (uSampler0, vTextureCoord).xyz, 1.0);
    }
  `;


  var passVel_vertex = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;
    attribute vec2 aTextureCoord;

    varying vec2 vTextureCoord;
    varying vec3 vColor;

    void main(void) {
        vColor = aVertexColor;
        gl_Position = vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
    }
`;

  var passVel_fragment = `
    precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vColor;

    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;
    uniform float uDt;

    void main(void) {
      vec3 vel = texture2D (uSampler0, vTextureCoord).xyz;
      vec3 acc = texture2D (uSampler1, vTextureCoord).xyz;

      vel = (vel + acc*0.0002*uDt)*0.5;
      gl_FragColor = vec4 (vel, 1.0);
    }
  `;

  var passPos_vertex = `
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexColor;

    varying vec2 vTextureCoord;
    varying vec3 vColor;

    void main(void) {
        vColor = aVertexColor;
        gl_Position = vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
    }
  `;

  var passPos_fragment = `
    precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vColor;

    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;
    uniform float uDt;

    void main(void) {
      vec3 pos = texture2D(uSampler0, vTextureCoord).xyz;
      vec3 vel = texture2D(uSampler1, vTextureCoord).xyz;


      vec3 newPos = pos + vel*uDt*0.01;
      gl_FragColor = vec4(newPos, 1.0);
    }
  `;


  this.passVel  = new TextureRenderer (0, 0, 1024, 1024,
                                    new Shader2 (passVel_vertex, passVel_fragment));
  this.passPos  = new TextureRenderer (0, 0, 1024, 1024,
                                    new Shader2 (passPos_vertex, passPos_fragment));
  this.passThru0 = new TextureRenderer (0, 0, 1024, 1024,
                                    new Shader2 (passThru_vertex, passThru_fragment));
  this.passThru1 = new TextureRenderer (0, 0, 1024, 1024,
                                    new Shader2 (passThru_vertex, passThru_fragment));

  this.passVel.shaderProgram.uDt = gl.getUniformLocation(this.passVel.shaderProgram, "uDt");
  this.passPos.shaderProgram.uDt = gl.getUniformLocation(this.passPos.shaderProgram, "uDt");
  
  this.passVel.updateUniforms = function() {
    gl.uniform1f(this.shaderProgram.uDt, dt);
  }

  this.passPos.updateUniforms = function() {
    gl.uniform1f(this.shaderProgram.uDt, dt);
  }
  
  this.passRender;

  this.texturePos;
  this.textureVel; 
  this.textureInfo;

  this.W = 1024;
  this.H = 1024;

  this.float_textures_ext;
  this.color_buffer_float_ext;
  
  this.texturePos = createTexture (initPositions, 4096, 1024, 1024);
  this.textureVel = createTexture (initVelocities, 4096, 1024, 1024);
}

Particles.prototype.update = function (forceTexture, dt) {

  this.passVel.draw ([this.textureVel, forceTexture], true);
  this.passThru0.draw ([this.passVel.rttTexture], true);
  this.textureVel = this.passThru0.rttTexture;

  this.passPos.draw ([this.texturePos, this.passVel.rttTexture], true);
  this.passThru1.draw ([this.passPos.rttTexture], true);
  this.texturePos = this.passThru1.rttTexture;
}
