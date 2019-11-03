    function spectro() {
    
    if (! window.AudioContext) {
        if (! window.webkitAudioContext) {
            alert('no audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }
    
    var context = new AudioContext();
    var audioBuffer;
    var sourceNode;
    var analyser;
    var javascriptNode;

    // get the context from the canvas to draw on
    var cvs = document.getElementById('canvas');
    var ctx = cvs.getContext("2d");

    // create a gradient for the fill. Note the strange
    // offset, since the gradient is calculated based on
    // the canvas, not the specific element we draw
    //var gradient = ctx.createLinearGradient(0,0,0,300);
    //gradient.addColorStop(1,'#000000');
    //gradient.addColorStop(0.75,'#ff0000');
    //gradient.addColorStop(0.25,'#ffff00');
    //gradient.addColorStop(0,'#ffffff');
    
    // create a temp canvas we use for copying and scrolling
    var tempCanvas = document.createElement("canvas"),
        tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width=400;
    tempCanvas.height=200;
 
    // used for color distribution
    var hot = chroma.scale(['#000000', '#ff0000', '#ffff00', '#ffffff']);
 
    // load the sound
    setupAudioNodes();
    loadSound("test.mp3");
 
    function setupAudioNodes() {
      
        // FOR SPECTROGRAM
        // setup a javascript node
        javascriptNode = context.createScriptProcessor(2048, 1, 1);
        // connect to destination, else it isn't called
        javascriptNode.connect(context.destination);
 
        // setup a analyzer
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 512;
 
        // create a buffer source node
        sourceNode = context.createBufferSource();
        sourceNode.connect(analyser);
        analyser.connect(javascriptNode);

        sourceNode.connect(context.destination);
    }
    
    // when the javascript node is called
    // we use information from the analyzer node
    // to draw the volume
    javascriptNode.onaudioprocess = function () {
 
        // get the average for the first channel
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
 
        // draw the spectrogram
        if (sourceNode.playbackState == sourceNode.PLAYING_STATE) {
            drawSpectrogram(array);
        }
    }
 
    // load the specified sound
    function loadSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
 
        // When loaded decode the data
        request.onload = function() {
 
            // decode the data
            context.decodeAudioData(request.response, function(buffer) {
                // when the audio is decoded play the sound
                playSound(buffer);
            }, onError);
        }
        request.send();
    }
 
 
    function playSound(buffer) {
        sourceNode.buffer = buffer;
        sourceNode.start(0);
    }
 
    // log if an error occurs
    function onError(e) {
        console.log(e);
    }
    
    function drawSpectrogram(array) {
 
        // copy the current canvas onto the temp canvas
        var canvas = document.getElementById("canvas");
 
        tempCtx.drawImage(canvas, 0, 0, 400, 200);
 
        // iterate over the elements from the array
        for (var i = 0; i < array.length; i++) {
            // draw each pixel with the specific color
            var value = array[i]/analyser.fftSize;
            console.log(value);
            ctx.fillStyle = hot(value);
 
            // draw the line at the right side of the canvas
            ctx.fillRect(400 - 1, 200 - i, 1, 1);
        }
 
        // set translate on the canvas
        ctx.translate(-1, 0);
        // draw the copied image
        ctx.drawImage(tempCanvas, 0, 0, 400, 200, 0, 0, 400, 200);
 
        // reset the transformation matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    }
    