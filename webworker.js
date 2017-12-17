// shortcuts
Ma = Math
R = Ma.random
A = Ma.abs
C = Ma.cos
S = Ma.sin
Si = Ma.sign

// Math.random remapped to [-1,1]
RA=a=>R()*2-1

// registers
re={}

// register input (place a value in a register)
Ri=(i,v)=>re[i]=v

// register output (retrieve a value from a register)
Ro=i=>re[i]||0

// apply a cheap filter to the sound (cf. https://twitter.com/kchplr/status/941377227123544070 )
// use a register internally to retrieve the previous frame
F=(i,v,c)=>re[i]=(v+(re[i]||0)*c)/(A(c)+1)

// PI * 2
PIm2=2*Ma.PI

// Clamp(value, min, max)
CL=(v,a,b)=>Ma.min(Ma.max(v,a),b)

// Lerp(value1, value2, ratio)
L=(a,b,m)=>a*(1-m)+b*m

// getFrequencyFromMidi(midi, cents)
M=(m,c)=>440*2**((m-69+((c||0)/100))/12)

// sineBasedOnMidi(frameNumber, midi, cents)
SM=(i,m,c)=>S(PIm2*i*M(m,c))

// Crude envelope release using exponentiation
ER=(i,l,r)=>(1-i/l)**(r||1)

// Crude envelope attack using exponentiation
EA=(i,a,p)=>CL(i*a,0,1)**(p||1)

// Mix of the crude envelope attack and release
EAR=(i,l,a,p,r)=>ER(i,l,r)*EA(i,a,p)

// Waveshaping using exponentiation (like Math.pow(s,c) but keeping the sign of the original signal)
Sh=(s,c)=>(A(s)**c)*Si(s)

var actions = {
    generate: function (data) {
        var buffer = new Float32Array((data.sampleRate * data.duration) | 0),
            error = null;

        // reset the registers
        re = {};

        try {
            // m and v would be the midi value and the velocity in a synth, currently unused
            var func = new Function('i', 'l', 'sr', 'm', 'v', data.code);
            for (var i = 0; i < buffer.length; i++) {
                buffer[i] = func(i / data.sampleRate, data.duration, data.sampleRate, 0, 0);
            }
        } catch (e) {
            error = e;
        }

        if (error !== null) {
            postMessage({
                type: 'error',
                message: error.message,
                stack: error.stack
            });
        } else {
            postMessage({
                type: 'result',
                buffer: buffer.buffer
            }, [buffer.buffer]);
        }

    }
};

self.addEventListener('message', function onMessage (e) {
    if (actions.hasOwnProperty(e.data.type)) {
        actions[e.data.type](e.data);
    }
});