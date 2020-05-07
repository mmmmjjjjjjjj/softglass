const twoD = function(p) {

    let audio
    let reverse = true;
  
    let rateTarget = 1.0;
    let currentRate = 1.0;

    let timeClicked;
    let timeToWait = 2000;

    let audioTime = 0.0;

    let playing = false;
    let reachedBufferEnd = true;
  
    p.preload = function() {
      audio = p.loadSound("assets/softSound2.mp3")
      audio.playMode('restart');
      // audio.setLoop(true);
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

      let playheadPercentage = audio.duration() / audio.currentTime();
      let y = p.height / playheadPercentage;
      let waveform = p.fft.waveform();

      let tx = audio.currentTime() - audioTime;
      audioTime += tx * 0.05;

      let red = p.map(audioTime, 0, audio.duration(), 0, 1510);
      let green = p.map(audioTime, 0, audio.duration(), 0, 255);
      let blue = p.map(audioTime, 0, audio.duration(), 0, 127);
  
      p.CENTER;
      p.background(red, green, blue);
      p.fill(0);
      p.strokeWeight(10);
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
  
      let dx = rateTarget - currentRate;
      currentRate += dx * 0.05;

      audio.rate(currentRate);

      if (audio.currentTime() < 0.1 || audio.currentTime() > audio.duration() - 0.1){
        reachedBufferEnd = true;
        playing = false;
      } else {
        reachedBufferEnd = false;
      }
    }
  
    p.mousePressed = function(){
      reverse = !reverse;
  
      if (reverse){
        rateTarget = -1.0;
      } else {
        rateTarget = 1.0;
      }

      if (!playing && reachedBufferEnd){

        if (audio.currentTime() < 0.1){
          currentRate = 1.0;
          rateTarget = 1.0;
        }

        if (audio.currentTime() > audio.duration() - 0.1){
          currentRate = -1.0;
          rateTarget = -1.0;
        }

        audio.play();
        playing = true;
      }
    }
  }
  
  const threeD = function(p) {
    let softy
    let spinAngle = 0.002
    let breathSize = 0.002
    let rotationAngle = 0
    let rotationTarget = 0
    let easing = 0.02
    // let mx = 0
    // let my = 0
    p.preload = function() {
      softy = p.loadModel('assets/softy4.obj')
    }
    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
      p.canvas.style.zIndex = 2 
    }
    p.draw = function() {
      p.clear()
      p.translate(0, 0, -200)
      // if ((p.frameCount * breathSize) >= 0.1){
      //   breathSize == 0;
      // }p.frameCount * breathSize
      p.scale(1.5, 1.5, 1.5);
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
