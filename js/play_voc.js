if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}

var context = new AudioContext();
var audioBuffer;
var sourceNode1;
var sourceNode2;
var javascriptNode;
var dist = 0;
var play = 0;

// When genre is clicked, play from start
function playAudio() {
  file = document.getElementById('genre').value;
  setupAudioNodes();
  loadSound(sourceNode1,"audio/normal/"+file+'.wav');
  loadSound(sourceNode2,"audio/vocoded/"+file+'.wav');
  sourceNode1.start(0); sourceNode2.start(0);
  muter();  
  play = 1;
  document.getElementById("play").innerHTML = "Stop";
  document.getElementById("play").setAttribute('onclick',"stopAudio()");
}

function stopAudio() {
  sourceNode1.stop();
  sourceNode2.stop();
  play = 0;
  document.getElementById("play").innerHTML = "Play";
  document.getElementById("play").setAttribute('onclick',"playAudio()");
}

function switcher() {
  dist = (dist + 1) % 2 
  if (dist == 1) {    
    document.getElementById("vocode").style = "background-color:#66d9ff";
  } else {
    document.getElementById("vocode").style="background-color:white";
  }
  if (play == 1) {
    muter();
  }
}

function muter() {
  if (dist == 1) {
    mute(gainNode1); unmute(gainNode2);
  } else {
    mute(gainNode2); unmute(gainNode1); 
  }
}

function mute(gainNode) {
    gainNode.gain.setValueAtTime(0, context.currentTime);
    //mute.id = "activated";
    //mute.innerHTML = "Unmute";
}

function unmute(gainNode) {
    gainNode.gain.setValueAtTime(1, context.currentTime);
}
 
function setupAudioNodes() {
  
    // setup a javascript node
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // create a buffer source node
    sourceNode1 = context.createBufferSource();
    //sourceNode1.connect(context.destination);
    sourceNode2 = context.createBufferSource();
    //sourceNode2.connect(context.destination);
    
    // create gain nodes
    gainNode1 = context.createGain();
    sourceNode1.connect(gainNode1);
    gainNode1.connect(context.destination);
    gainNode2 = context.createGain();
    sourceNode2.connect(gainNode2);
    gainNode2.connect(context.destination);
    
}
 
// load the specified sound
function loadSound(sourceNode,url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {
        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            //playSound(sourceNode,buffer);
            sourceNode.buffer = buffer;
        }, onError);
    }
    request.send();
}
 
function playSound(sourceNode,buffer) {
    sourceNode.start();
}

// log if an error occurs
function onError(e) {
    console.log(e);
}

function crlabel() {
  var text;
  genre = document.getElementById('genre').value;
  console.log(genre);
  switch(genre) {
    case "speech":
      text = "The Adventures of Pinocchio by Carlo Collodi, translated by Carol Della, read by Sherry Crowther; librivox.org";
      break;
    case "piano":
      text = "The Christmas Waltz by Lena Orsa (c) copyright 2017 Licensed under a Creative Commons Attribution (3.0) license. http://dig.ccmixter.org/files/lena_orsa/57003";
      break;
    case "rap":
      text = "SUCKS FOR ME, GOOD 4 U by reiswerk (c) copyright 2018 Licensed under a Creative Commons Attribution Noncommercial license. http://dig.ccmixter.org/files/Reiswerk/57640 Ft: Ms.Vybe";
      break;
    case "trance":
      text = "Skyline by Stefan Kartenberg (c) copyright 2018 Licensed under a Creative Commons Attribution Noncommercial  (3.0) license. http://dig.ccmixter.org/files/JeffSpeed68/57138";
      break;
    case "country":
      text = "Wired but disconnected by reiswerk (c) copyright 2017 Licensed under a Creative Commons Attribution Noncommercial  (3.0) license. http://dig.ccmixter.org/files/Reiswerk/56595 Ft: duckett";
      break;
  }
  
  document.getElementById("copyright").innerHTML = text;
  console.log(text);
  
}
