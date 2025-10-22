const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Cargar imágenes PNG
const trianguloImg = new Image();
const cuadradoImg = new Image();

// Reemplaza estas rutas con las de tus imágenes PNG
trianguloImg.src = 'sandia.png'; // Ruta a tu imagen de triángulo
cuadradoImg.src = 'sandia.png';   // Ruta a tu imagen de cuadrado

const notes = [
  {f:262,d:.5,t:"Fe",p:p1},
  {f:262,d:.5,t:"liz&nbsp",p:p1},
  {f:294,d:1,t:"Cumple",p:p1},
  {f:262,d:1,t:"años&nbsp",p:p1},
  {f:349,d:1,t:"A&nbsp",p:p1},
  {f:330,d:2,t:"Ti",p:p1},
  
  {f:262,d:.5,t:"Fe",p:p2},
  {f:262,d:.5,t:"liz&nbsp",p:p2},
  {f:294,d:1,t:"Cumple",p:p2},
  {f:262,d:1,t:"años&nbsp",p:p2},
  {f:392,d:1,t:"A&nbsp;",p:p2},
  {f:349,d:2,t:"Ti",p:p2},
  
  {f:262,d:.5,t:"Fe",p:p3},
  {f:262,d:.5,t:"liz&nbsp;",p:p3},
  {f:523,d:1,t:"Cumple",p:p3},
  {f:440,d:1,t:"años&nbsp;",p:p3},
  {f:349,d:1,t:"Querida&nbsp;",p:p3},
  {f:330,d:1,t:"Zu",p:p3},
  {f:294,d:3,t:"ri",p:p3},
  
  {f:466,d:.5,t:"Fe",p:p4},
  {f:466,d:.5,t:"liz&nbsp;",p:p4},
  {f:440,d:1,t:"Cumple",p:p4},
  {f:349,d:1,t:"años&nbsp;",p:p4},
  {f:392,d:1,t:"A&nbsp;",p:p4},
  {f:349,d:2,t:"Ti",p:p4},
];

//DOM
notes.map((n) => createSpan(n));

function createSpan(n){
  n.sp = document.createElement("span");
  n.sp.innerHTML = n.t;
  n.p.appendChild(n.sp);
}

// SOUND
let speed = inputSpeed.value;
let flag = false;
let sounds = [];

class Sound{
  constructor(freq,dur,i){
    this.stop = true;
    this.frequency = freq;
    this.waveform = "triangle";
    this.dur = dur;
    this.speed = this.dur*speed;
    this.initialGain = .15;
    this.index = i;
    this.sp = notes[i].sp
  }
  
  cease(){
    this.stop = true;
    this.sp.classList.remove("jump");
    if(this.index < sounds.length-1){sounds[this.index+1].play();}
    if(this.index == sounds.length-1){flag = false;}
  }
  
  play(){
   this.oscillator = audioCtx.createOscillator();
   this.gain = audioCtx.createGain();
   this.gain.gain.value = this.initialGain;
   this.oscillator.type = this.waveform;
   this.oscillator.frequency.value = this.frequency;
   this.gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + this.speed);
   this.oscillator.connect(this.gain);
   this.gain.connect(audioCtx.destination);
   this.oscillator.start(audioCtx.currentTime);
   this.sp.setAttribute("class", "jump");
   this.stop = false;
   this.oscillator.stop(audioCtx.currentTime + this.speed); 
   this.oscillator.onended = ()=> {this.cease();}
  }  
}

for(let i=0; i < notes.length; i++){
  let sound = new Sound(notes[i].f, notes[i].d,i);
  sounds.push(sound);
}


// EVENTS
wishes.addEventListener("click",function(e){
  if(e.target.id != "inputSpeed" && !flag){
  sounds[0].play();
  flag = true;}
  },false);
                        
                        
inputSpeed.addEventListener("input",function(e){
  speed = this.value;
  sounds.map((s) => {
    s.speed = s.dur*speed
  });
},false);

// CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cw = canvas.width = window.innerWidth,
  cx = cw / 2;
let ch = canvas.height = window.innerHeight,
  cy = ch / 2;

let requestId = null;

const colors = ["#93DFB8","#FFC8BA","#E3AAD6","#B5D8EB","#FFBDD8"];

class Particle{
  constructor(){
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;
    this.r = 15 + ~~(Math.random() * 20); // tamaño
    this.isTriangulo = Math.random() > 0.5; // elegir entre triángulo o cuadrado
    this.rot = Math.random() * Math.PI; // rotación
    this.speed = .05 + Math.random() / 2;
    this.rotSpeed = 0.005 + Math.random() * .005;
    this.color = colors[~~(Math.random() * colors.length)];
  }
  
  update(){
    if(this.y < -this.r){
      this.y = ch + this.r;
      this.x = Math.random() * cw;
    }
    this.y -= this.speed;
  }
  
  draw(){
    // Seleccionar la imagen según el tipo
    const img = this.isTriangulo ? trianguloImg : cuadradoImg;
    
    // Verificar si la imagen está cargada
    if (!img.complete) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    
    // Dibujar la imagen PNG
    const size = this.r * 3;
    ctx.drawImage(img, -size/2, -size/2, size, size);
    
    ctx.restore();
  }
}

let particles = [];
for(let i = 0; i < 20; i++){
  let p = new Particle();
  particles.push(p);
}

function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  ctx.clearRect(0,0,cw,ch);
  particles.map((p) => {
    p.rot += p.rotSpeed;
    p.update();
    p.draw();
  });
}

function Init() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }

  cw = canvas.width = window.innerWidth;
  cx = cw / 2;
  ch = canvas.height = window.innerHeight;
  cy = ch / 2;

  Draw();
};

setTimeout(function() {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);