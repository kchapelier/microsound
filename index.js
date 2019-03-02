"use strict";

var ac = null,
    sr = null;

var codeEditor = new Editor('return RA();'),
    lengthElement = document.querySelector('[name=length]'),
    zoomPlusElement = document.querySelector('.zoom-widget-button-plus'),
    zoomMinusElement = document.querySelector('.zoom-widget-button-minus'),
    form = document.querySelector('form'),
    canvas = document.querySelector('#canvas'),
    timelineTracker = document.querySelector('#timelineTracker'),
    soundCanvas = new SoundCanvas(canvas, timelineTracker);

codeEditor.appendTo(document.querySelector('#editor'));
codeEditor.show();

var busy = false;

function setBusy(bool) {
    busy = bool;

    if (busy) {
        document.body.classList.add('busy');
    } else {
        document.body.classList.remove('busy');
    }
}

var zoom = 1;

var ww = new Worker('./webworker.js?cache=' + Date.now());

ww.onmessage = function (e) {
    if (e.data.type === 'error') {
        console.error(e.data.message);
        console.warn(e.data.stack);
    } else if (e.data.type === 'result') {
        var buffer = new Float32Array(e.data.buffer);

        soundCanvas.setBuffer(buffer);
        soundCanvas.setOffset(0);
        soundCanvas.setZoom(zoom);

        var ab = ac.createBuffer(1, buffer.length, sr);
        ab.getChannelData(0).set(buffer);
        var s = ac.createBufferSource();
        s.buffer = ab;
        s.connect(ac.destination);
        s.start();
    }

    setBusy(false);
};

function generateSound () {
    if (ac === null) {
      ac = new AudioContext;
      sr = ac.sampleRate;
    }
    if (!busy) {
        setBusy(true);

        ww.postMessage({
            type: 'generate',
            code: codeEditor.getContent().trim(),
            duration: lengthElement.value,
            sampleRate: sr
        });

        url.updateHash(lengthElement.value, codeEditor.getContent())
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    generateSound();
});

document.body.addEventListener('keyup', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
        e.preventDefault();
        generateSound();
    }
});

function update () {
    soundCanvas.refresh();
    requestAnimationFrame(update);
}

zoomPlusElement.addEventListener('click', function () {
    zoom = Math.min(4, Math.max(0, zoom + 1));
    soundCanvas.setZoom(zoom);
});

zoomMinusElement.addEventListener('click', function () {
    zoom = Math.min(4, Math.max(0, zoom - 1));
    soundCanvas.setZoom(zoom);
});

update();

var data = url.parseHash();

if (data.code !== null) {
  codeEditor.setContent(data.code);
}

if (data.duration !== null) {
  lengthElement.value = +data.duration;
}
