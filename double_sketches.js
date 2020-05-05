const twoD = function(p) {

  let audio

  p.preload = function() {
    audio = p.loadSound("assets/softSound2.mp3")

  }
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.analyzer = new p5.Amplitude();
    p.analyzer.setInput(audio);
    p.fft = new p5.FFT();
    audio.amp(0.5);
  }
  p.draw = function() {
    let audioDraw = audio.currentTime();
    let rms = p.analyzer.getLevel();
    let y = (p.height / audio.currentTime())*25;
    let waveform = p.fft.waveform();

    p.CENTER;
    p.background((p.map(audio.currentTime(), 0, audio.duration(), 0, 1510)), (p.map(audio.currentTime(), 0, audio.duration(), 0, 255)), (p.map(audio.currentTime(), 0, audio.duration(), 0, 127)))
    p.fill(0);
    p.stroke(p.random(0,255),p.random(0,127),p.random(0, 255));
    p.line((p.width/2)-rms*5000,y,(p.width/2)+rms*5000,y);
    p.noFill();
    p.beginShape();
    p.stroke(255);
    for (let i = 0; i < waveform.length; i++){
    let x = p.map(i, 0, waveform.length, 0, p.width);
    let y = p.map( waveform[i], -1, 1, 0, p.height/8);
    p.vertex(x,y);
  }
    p.endShape();
  }
  p.mousePressed = function(){
    
    audio.stop()
    audio.reverseBuffer()
    audio.play()
  }
}

const threeD = function(p) {
  let softy
  let spinAngle = 0.002
  let rotationAngle = 0
  let rotationTarget = 0
  let easing = 0.02
  // let mx = 0
  // let my = 0
  p.preload = function() {
    softy = p.loadModel('assets/softy3.obj')
  }
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.canvas.style.zIndex = 2 
  }
  p.draw = function() {
    p.clear()
    p.translate(0, 0, -200)
    rotationAngle += ease(rotationAngle, rotationTarget, easing)
    p.rotateY(p.frameCount * spinAngle)
    
    p.rotateX(rotationAngle)
    p.normalMaterial();
    p.model(softy)
  }

  p.mousePressed = function() {
    if ( rotationTarget == 0 ) {
      rotationTarget = p.PI
    } else {
      rotationTarget = 0
    }
  }

  function ease(value, target, easing) {
    let dx = target - value;
    return dx * easing; 
  }
}

new p5(twoD)
new p5(threeD)
