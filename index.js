
var ac=new AudioContext,
    sr=ac.sampleRate;

/*
function func (i,l) {
    return SM(i,69) * 0.5;
}

function func2 (i,l) {
    var pulsewidth = 0.52 * S(i / 0.1 + 0.05 * SM(i,69+48));
    return (L(SM(i,33), SM(i,57), (i/l)**.25) < pulsewidth ? 1 : -1) / 5 * (l - i) / l;
}

function func3 (i,l) {
    return (SM(i,59)+SM(i,59,33))/4*((1-i/l)**3)*(CL(i*2, 0, 1)**.5);
}

function func4 (i,l) {
    return (SM(i,65)*SM(i*(0.95 + 0.05 * SM((i/l)**.5,22)),65+25))/4*((1-i/l)**3)*(CL(i*4, 0, 1)**.5);
}

func5 = (i,l,v) => {
    var v = SM(i,52+v) * SM(i,78+v) * SM(i,88+v, -i/l*9);
    return v**2*EAR(i,l,50,.5,5+v/10);
}

func6 = (i,l,v) => {
    var s = SM(i,52+v) * SM(i,52+20+v,33) * SM(i,88+v);
    s += SM(i,52+4+v) * SM(i,52+4+20+v,33) * SM(i,88+4+v);
    s += SM(i,52+7+v) * SM(i,52+7+20+v,33) * SM(i,88+7+v);
    s/=2;
    return s*EAR(i,l,50,.5,3);
}

function gunshot (i,l) {
    var c = 2+EA(i,1,1.2)*50;
    return F(2,F(1,RA(),c),c*.66)*EAR(i,l,100,10,10);
}

function synth01(i,l) {
    var m = 35;
    var t = i * M(m,0);
    t = (t - Math.floor(t)) * 2 - 1;
    var t2 = i * M(m+12,10*EA(i,l,10));
    t2 = (t2 - Math.floor(t2)) * 2 - 1;
    var t3 = i * M(m+24,10*EA(i,l,10));
    t3 = (t3 - Math.floor(t3)) * 2 - 1;
    var c = (1-EAR(i,l,0.25,0.5,.28)**.2)*1000;
    return F(2,F(1,t*0.6+t2*0.25+t3*0.15,c),c);
}

function synth02(i,l) {
    v=25

    var s = SM(i,v+20) * SM(i,v+32,9);
    s+= SM(i,v+8)*SM(i,v+20,10);
    s+= SM(i,v+8)*SM(i,v+20,11);

    s/=3;

    s=Si(s)*(A(s)**0.33);

    return F(4,F(3,s*2,10*s)*EAR(i,l,30,1,9),(1-ER(i,l,90))*20);
}

function synth03(i,l) {
    var p = i * M(50);
    p+=SM(i,50-7);
    p+=SM(i,50+5)*0.2;
    return S(PIm2*p)
}

function synth04(i,l,sr) {
    var p = Ro(0);
    Ri(0, p + 1/sr * M(70 - ((i/l)**.1)*20));
    var s = S(PIm2 * p);
    return s * 0.1;
}

function synth05(i,l,sr) {
    var v = 60;
    var p1 = Ro(0);
    Ri(0, p1 + 1/sr * M(v - ((i/l)**.06)*24));
    var p2 = Ro(1);
    Ri(1, p2 + 1/sr * M(v - 24 - ((i/l)**.04)*12));

    var s = S(PIm2 * p1)*L(1,S(PIm2 * p2),(1-i/l)**20);
    return F(2,s,1) * 0.8 * EAR(i,l,200,.6,3);
}

function synth06(i,l,sr) {
    var v = 60;
    var p1 = Ro(0);
    Ri(0, p1 + 1/sr * M(v - ((i/l)**.01)*32));
    var p2 = Ro(1);
    Ri(1, p2 + 1/sr * M(v - ((i/l)**.04)*12));
    var p3 = Ro(2);
    Ri(2, p3 + 1/sr * M(v - ((i/l)**.0001)*24));
    var s = (S(PIm2 * p1) * (0.95 + 0.05 * S(PIm2 * p3)))*L(1,S(PIm2 * p2),(1-i/l)**20);
    var n = EAR(Math.min(0.1,i),0.1,4000,.005,10);
    s*= (1-n + F(4,RA(),30) * n * 6.);
    return F(5,s,3) * 0.4 * EAR(i,l,200,.6,3);
}
*/

var codeEditor = new Editor('return RA();'),
    lengthElement = document.querySelector('[name=length]'),
    zoomPlusElement = document.querySelector('.zoom-widget-button-plus'),
    zoomMinusElement = document.querySelector('.zoom-widget-button-minus'),
    form = document.querySelector('form'),
    canvas = document.querySelector('#canvas'),
    soundCanvas = new SoundCanvas(canvas);

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

var zoom = 0;

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
    zoom = Math.min(7, Math.max(-1, zoom + 1));
    soundCanvas.setZoom(zoom);
});

zoomMinusElement.addEventListener('click', function () {
    zoom = Math.min(7, Math.max(-1, zoom - 1));
    soundCanvas.setZoom(zoom);
});

update();

var data = url.parseHash();

codeEditor.setContent(data.code);
lengthElement.value = +data.duration;
