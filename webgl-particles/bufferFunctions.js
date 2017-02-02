function sinp (x, p) {
  var v = Math.sin(x);
  var s = Math.sign(v);

  return s*Math.pow(Math.abs(v), p);
}

function pos (buf, i, x, y) {
  buf[i*4] = x;
  buf[i*4+1] = y;
  buf[i*4+2] = 0;
  buf[i*4+3] = 1;
}


function pos0 (buf, N) {

  var rep = 128;
  for (var i=0; i<N; i++) {

    var ph = i/N*rep*Math.PI;
    var A = 0.5 - Math.floor(i/N*rep)*0.001;
    var x = sinp(ph, 2)*A;
    var y = sinp(ph+Math.PI/2, 2)*A;
    pos (buf, i, x, y);
  }
}

function pos1 (buf, N) {

  var rep = 32;
  for (var i=0; i<N; i++) {

    var ph = i/N*rep*Math.PI;
    var A = 0.5 - Math.floor(i/N*rep)*0.01;
    var x = sinp(ph+Math.PI, 2)*A;
    var y = sinp(ph+Math.PI/4, 2)*A;
    pos (buf, i, x, y);
  }
}

function pos2 (buf, N) {

  var rep = 65;
  for (var i=0; i<N; i++) {

    var ph = i/N*rep*Math.PI;
    var A = 0.2;
    var x = sinp(ph+Math.PI, 2)*A;
    var y = sinp(ph+Math.PI/2, 2)*A;
    pos (buf, i, x, y);
  }
}



    function createPosBuffer (tmp, N) {

      var phi = 0;
      var R = 1;

      for (var i=0; i<N; i++) {
        tmp[i*4+0] = (Math.sin(phi)*0.5*(0.5+R));
        tmp[i*4+1] = (Math.cos(phi)*0.5*(0.5+R));
        tmp[i*4+2] = (0);
        tmp[i*4+3] = (1.0);
        R = Math.sin(phi*3)*0.5;
        phi += 0.01;
      }
    }

    function createVelBuffer (tmp, N) {

      for (var i=0; i<N; i++) {

        var ph = Math.floor(i/128)*0.4;
        var x = Math.sin(i/64*Math.PI*2);
        x = x*x*Math.sign(x);

        var y = Math.sin(i/64*Math.PI*2+Math.PI/2);
        y = y*y*Math.sign(y);

        tmp[i*4+0] = x * 0.25 + Math.sin(Math.round(ph))*0.5;
        tmp[i*4+1] = y * 0.25+ Math.sin(Math.round(ph+Math.PI/2))*0.5;
        tmp[i*4+2] = 0;
        tmp[i*4+3] = 0;
      }
    }

function posRand (buf, N) {
  for (var i=0; i<N; i++) {
    var x = Math.random()*2-1;
    var y = Math.random()*2-1;
    pos (buf, i*2, x, y);
    pos (buf, i*2+1, x+Math.random()*0.01-0.005, y+Math.random()*0.01-0.005);
  }
}

function posZero (buf, N) {
  for (var i=0; i<N; i++) {
    pos (buf, i, 0, 0);
  }
}

function posNoise (buf, N) {
  for (var i=0; i<N; i++) {
    var x = Math.sin(i*0.01)*0.4 + Math.sin(i*0.1)*0.2;
    var y = Math.sin(i*0.01+Math.PI/2)*0.4 + Math.sin(i*0.2)*0.2;
    x = Math.round(x*20)/20;
    y +=  Math.sin(i*0.001)*0.02;;
    pos (buf, i, x, y); //Math.random()*2-1, Math.random()*2-1);
  }
}