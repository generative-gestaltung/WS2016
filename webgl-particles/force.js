var target_force_vertex = `
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

var target_force_fragment = `
  precision mediump float;

  varying vec2 vTextureCoord;
  varying vec3 vColor;

  uniform sampler2D uSampler0;
  uniform sampler2D uSampler1;
  uniform sampler2D uSampler2;
  uniform sampler2D uSampler3;

  void main(void) {
    vec3 pos = texture2D (uSampler0, vTextureCoord).xyz;
    vec3 force = texture2D (uSampler1, vTextureCoord).xyz;

    vec3 dir = pos - force;
    float d = length(dir);
    float sign = 1.0;
    if (d<0.4) {
      d = 0.4;
      //sign = -1.0;
    }
    vec3 f = sign * dir / d / d * 1.0;1;


    gl_FragColor = vec4 (f, 1.0);
  }
`;

