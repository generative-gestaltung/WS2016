vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
];

var vertexNormals = [
    // Front face
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back face
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top face
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom face
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right face
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left face
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
];

var textureCoords = [
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
];


var Mesh = function (N) {
  this.cnt = 0;
  this.N = N;
  this.vertices = new Float32Array(N*3);
  this.colors = new Float32Array(N*3);
  this.texcoords = new Float32Array(N*2);

  this.r = 1.0;
  this.g = 1.0;
  this.b = 1.0;
  this.a = 1.0;
}

Mesh.prototype.setColor = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}


Mesh.prototype.addCube = function (x, y, z, s0, s1, s2) {
  //if (this.cnt >= this.N-24) return;
  var size = [s0, s1, s2];
  var pos = [x,y,z];
  for (var i=0; i<24; i++) {
    for (var j=0; j<3; j++) {
      this.vertices[(this.cnt+i)*3+j] = vertices[i*3+j]*size[j]+pos[j];
      this.colors[(this.cnt+i)*3+j] = vertexNormals[i*3+j];
      if (j<2)
        this.texcoords[(this.cnt+i)*2+j] = textureCoords[i*2+j];
    }
  }
  this.cnt += 24;
}

Mesh.prototype.addVertex = function (x, y, z, u, v) {
  this.vertices[this.cnt*3] = x;
  this.vertices[this.cnt*3+1] = y;
  this.vertices[this.cnt*3+2] = z;

  this.colors[this.cnt*3] = this.r;
  this.colors[this.cnt*3+1] = this.g;
  this.colors[this.cnt*3+2] = this.b;

  this.texcoords[this.cnt*2] = u;
  this.texcoords[this.cnt*2+1] = v;

  this.cnt += 1;
}

Mesh.prototype.addQuad = function (x, y, w, h, args) {
  var z = 0;
  //if (this.cnt>=this.N-6) return;

  this.vertices[this.cnt*3] = x;
  this.vertices[this.cnt*3+1] = y;
  this.vertices[this.cnt*3+2] = z;
  //this.texcoords[this.cnt+2] = 0;

  this.vertices[this.cnt*3+3] = x+w;
  this.vertices[this.cnt*3+4] = y;
  this.vertices[this.cnt*3+5] = z;
  //this.texcoords[this.cnt+5] = 0;

  this.vertices[this.cnt*3+6] = x+w;
  this.vertices[this.cnt*3+7] = y+h;
  this.vertices[this.cnt*3+8] = z;

  this.vertices[this.cnt*3+9] = x;
  this.vertices[this.cnt*3+10] = y;
  this.vertices[this.cnt*3+11] = z;
  //this.texcoords[this.cnt+11] = 0;

  this.vertices[this.cnt*3+12] = x+w;
  this.vertices[this.cnt*3+13] = y+h;
  this.vertices[this.cnt*3+14] = z;
  //this.texcoords[this.cnt+14] = 0;

  this.vertices[this.cnt*3+15] = x;
  this.vertices[this.cnt*3+16] = y+h;
  this.vertices[this.cnt*3+17] = z;

  this.colors[this.cnt*3] = this.r;
  this.colors[this.cnt*3+1] = this.g;
  this.colors[this.cnt*3+2] = this.b;

  this.colors[this.cnt*3+3] = this.r;
  this.colors[this.cnt*3+4] = this.g;
  this.colors[this.cnt*3+5] = this.b;

  this.colors[this.cnt*3+6] = this.r;
  this.colors[this.cnt*3+7] = this.g;
  this.colors[this.cnt*3+8] = this.b;

  this.colors[this.cnt*3+9] = this.r;
  this.colors[this.cnt*3+10] = this.g;
  this.colors[this.cnt*3+11] = this.b;

  this.colors[this.cnt*3+12] = this.r;
  this.colors[this.cnt*3+13] = this.g;
  this.colors[this.cnt*3+14] = this.b;

  this.colors[this.cnt*3+15] = this.r;
  this.colors[this.cnt*3+16] = this.g;
  this.colors[this.cnt*3+17] = this.b;


  if (args==null) {
    this.texcoords[this.cnt*2] = 0;
    this.texcoords[this.cnt*2+1] = 0;
    this.texcoords[this.cnt*2+2] = 1;
    this.texcoords[this.cnt*2+3] = 0;
    this.texcoords[this.cnt*2+4] = 1;
    this.texcoords[this.cnt*2+5] = 1;
    this.texcoords[this.cnt*2+6] = 0;
    this.texcoords[this.cnt*2+7] = 0;
    this.texcoords[this.cnt*2+8] = 1;
    this.texcoords[this.cnt*2+9] = 1;
    this.texcoords[this.cnt*2+10] = 0;
    this.texcoords[this.cnt*2+11] = 1;
  }
  else if (args.texCoords){
    this.texcoords[this.cnt*2]   = args.texCoords[0][0];
    this.texcoords[this.cnt*2+1] = args.texCoords[0][1];
    this.texcoords[this.cnt*2+2] = args.texCoords[1][0];
    this.texcoords[this.cnt*2+3] = args.texCoords[1][1];
    this.texcoords[this.cnt*2+4] = args.texCoords[2][0];
    this.texcoords[this.cnt*2+5] = args.texCoords[2][1];
    this.texcoords[this.cnt*2+6] = args.texCoords[0][0];
    this.texcoords[this.cnt*2+7] = args.texCoords[0][1];
    this.texcoords[this.cnt*2+8] = args.texCoords[2][0];
    this.texcoords[this.cnt*2+9] = args.texCoords[2][1];
    this.texcoords[this.cnt*2+10] = args.texCoords[3][0];
    this.texcoords[this.cnt*2+11] = args.texCoords[3][1];
  }

  this.cnt += 6;
}

Mesh.prototype.addQuadZ = function (x, y, z, w, h) {
  if (this.cnt>=this.N-6) return;

  this.vertices[this.cnt*3] = x;
  this.vertices[this.cnt*3+1] = y;
  this.vertices[this.cnt*3+2] = z;

  this.vertices[this.cnt*3+3] = x+w;
  this.vertices[this.cnt*3+4] = y;
  this.vertices[this.cnt*3+5] = z;

  this.vertices[this.cnt*3+6] = x+w;
  this.vertices[this.cnt*3+7] = y+h;
  this.vertices[this.cnt*3+8] = z;

  this.vertices[this.cnt*3+9] = x;
  this.vertices[this.cnt*3+10] = y;
  this.vertices[this.cnt*3+11] = z;

  this.vertices[this.cnt*3+12] = x+w;
  this.vertices[this.cnt*3+13] = y+h;
  this.vertices[this.cnt*3+14] = z;

  this.vertices[this.cnt*3+15] = x;
  this.vertices[this.cnt*3+16] = y+h;
  this.vertices[this.cnt*3+17] = z;


  this.texcoords[this.cnt*2] = 0;
  this.texcoords[this.cnt*2+1] = 0;
  this.texcoords[this.cnt*2+2] = 1;
  this.texcoords[this.cnt*2+3] = 0;
  this.texcoords[this.cnt*2+4] = 1;
  this.texcoords[this.cnt*2+5] = 1;
  this.texcoords[this.cnt*2+6] = 0;
  this.texcoords[this.cnt*2+7] = 0;
  this.texcoords[this.cnt*2+8] = 1;
  this.texcoords[this.cnt*2+9] = 1;
  this.texcoords[this.cnt*2+10] = 0;
  this.texcoords[this.cnt*2+11] = 1;

  this.cnt += 6;
}
