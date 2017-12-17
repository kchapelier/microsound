# microsound (prototype)

The main objective of the project is to provide an editor and built-in function facilitating the generation of sound samples with code, as well as provide an example runtime for code-golfing projects (for js13k and the likes).

This project is more geared towards sound-effects synthesis than music generation / livecoding.

A secondary objective is to resurrect my [Algorithmic Synth](https://github.com/kchapelier/algorithmicsynthjs) project, although the state of the implementations of AudioWorklets is apparently still problematic.

## Serious warning : Avoid using headphones with this and other DIY audio synthesis experiments. You could be one typo away from eardrum rupture.

## Examples

 * [White noise](http://www.kchapelier.com/microsound/#duration=2&code=cmV0dXJuIFJBKCkgKiAwLjI7)
 * [Filtered white noise / rain](http://www.kchapelier.com/microsound/#duration=6&code=cmV0dXJuIEYoMCxSQSgpLDIwKSAqIDAuNTs%3D)
 * [Gunshot / Hitting a dumpster](http://www.kchapelier.com/microsound/#duration=10&code=dmFyIGMgPSAyK0VBKGksMSwxLjIpKjc1OwpyZXR1cm4gRigyLEYoMSxSQSgpLGMpLGMqLjY2KSpFQVIoaSxsLDEwMCwxMCwxMCk7)
 * [Sine for Midi value 69](http://www.kchapelier.com/microsound/#duration=2&code=cmV0dXJuIFNNKGksNjkpICogMC4yOw%3D%3D)
 * [Two sines with slight frequency difference](http://www.kchapelier.com/microsound/#duration=2&code=cmV0dXJuIChTTShpLDU5KStTTShpLDU5LDMzKSkqMC4xNTs%3D)
 * [Simple ring modulation](http://www.kchapelier.com/microsound/#duration=1&code=cmV0dXJuIFNNKGksNjQpICogU00oaSw1MikgKiBTTShpLDU5KSAqIDAuMg%3D%3D)
 * [Frequency modulation](http://www.kchapelier.com/microsound/#duration=3&code=dmFyIHAgPSBSbygwKTsKUmkoMCwgcCArIDEvc3IgKiBNKDcwIC0gU00oaSw3MC0xMio5KSkpOwp2YXIgcyA9IFMoUEltMiAqIHApOwpyZXR1cm4gcyAqIDAuMTs%3D)
 * [Early 90s sound effect](http://www.kchapelier.com/microsound/#duration=2&code=cmV0dXJuIChTTShpLDY1KSpTTShpKigwLjk1ICsgMC4wNSAqIFNNKChpL2wpKiouNSwyMikpLDY1KzI1KSkvNCooKDEtaS9sKSoqMykqKENMKGkqNCwgMCwgMSkqKi41KTs%3D)
 * [Square](http://www.kchapelier.com/microsound/#duration=2&code=cmV0dXJuIChTTShpLDY5KSA8IDAgPyAxIDogLTEpICogMC4yOw%3D%3D)
 * [Square with pulsewidth-modulation](http://www.kchapelier.com/microsound/#duration=2&code=dmFyIHB1bHNld2lkdGggPSAwLjk1ICogU00oaSw2OSAtIDEyKjgpOwpyZXR1cm4gKFNNKGksNjkpIDwgcHVsc2V3aWR0aCA%2FIDEgOiAtMSkgKiAwLjI7)
 * [A little bell](http://www.kchapelier.com/microsound/#duration=1&code=dmFyIG0gPSAyMDsKdmFyIHYgPSBTTShpLDUyK20pICogU00oaSw3OCttKSAqIFNNKGksODgrbSwgLWkvbCo5KTsKcmV0dXJuIHYqKjIqRUFSKGksbCw1MCwuNSw1K3YvMTApOw%3D%3D)
 * [A sinister church bell](http://www.kchapelier.com/microsound/#duration=2&code=dmFyIHYgPSAtMjQ7CnZhciBzID0gU00oaSw1Mit2KSAqIFNNKGksNTIrMjArdiwzMykgKiBTTShpLDg4K3YpOwpzICs9IFNNKGksNTIrNCt2KSAqIFNNKGksNTIrNCsyMCt2LDMzKSAqIFNNKGksODgrNCt2KTsKcyArPSBTTShpLDUyKzcrdikgKiBTTShpLDUyKzcrMjArdiwzMykgKiBTTShpLDg4Kzcrdik7CnMvPTI7CnJldHVybiBzKkVBUihpLGwsNTAsLjUsMyk7)
 * [Some synth](http://www.kchapelier.com/microsound/#duration=80&code=dmFyIG0gPSAzNzsKdmFyIHQgPSBpICogTShtLDApOwp0ID0gKHQgLSBNYXRoLmZsb29yKHQpKSAqIDIgLSAxOwp2YXIgdDIgPSBpICogTShtKzEyLDEwKkVBKGksbCwxMCkpOwp0MiA9ICh0MiAtIE1hdGguZmxvb3IodDIpKSAqIDIgLSAxOwp2YXIgdDMgPSBpICogTShtKzI0LDEwKkVBKGksbCwxMCkpOwp0MyA9ICh0MyAtIE1hdGguZmxvb3IodDMpKSAqIDIgLSAxOwp2YXIgYyA9ICgxLUVBUihpLGwsMC4yNSwwLjUsLjI4KSoqLjIpKjEwMDA7CnJldHVybiBGKDIsRigxLHQqMC42K3QyKjAuMjUrdDMqMC4xNSxjKSxjKTs%3D)
 * [Some other synth](http://www.kchapelier.com/microsound/#duration=4&code=dmFyIG09MjUKCnZhciBzID0gU00oaSxtKzIwKSAqIFNNKGksbSszMiw5KTsKcys9IFNNKGksbSs4KSpTTShpLG0rMjAsMTApOwpzKz0gU00oaSxtKzgpKlNNKGksbSsyMCwxMSk7CgpzLz0zOwoKcz1TaShzKSooQShzKSoqMC4zMyk7CgpyZXR1cm4gRig0LEYoMyxzKjIsMTAqcykqRUFSKGksbCwzMCwxLDkpLCgxLUVSKGksbCw5MCkpKjIwKTs%3D)
 * [Cheap digital tom drum](http://www.kchapelier.com/microsound/#duration=2&code=dmFyIHAgPSBSbygwKTsKUmkoMCwgcCArIDEvc3IgKiBNKDcwIC0gKChpL2wpKiouMDI1KSoyMCkpOwp2YXIgcyA9IFMoUEltMiAqIHApOwpyZXR1cm4gcyAqIEVSKGksbCw1KSAqIDAuNDs%3D)
 * [Believable percussion](http://www.kchapelier.com/microsound/#duration=2&code=dmFyIHYgPSA2MDsKdmFyIHAxID0gUm8oMCk7ClJpKDAsIHAxICsgMS9zciAqIE0odiAtICgoaS9sKSoqLjAxKSozMikpOwp2YXIgcDIgPSBSbygxKTsKUmkoMSwgcDIgKyAxL3NyICogTSh2IC0gKChpL2wpKiouMDQpKjEyKSk7CnZhciBwMyA9IFJvKDIpOwpSaSgyLCBwMyArIDEvc3IgKiBNKHYgLSAoKGkvbCkqKi4wMDAxKSoyNCkpOwp2YXIgcyA9IChTKFBJbTIgKiBwMSkgKiAoMC45NSArIDAuMDUgKiBTKFBJbTIgKiBwMykpKSpMKDEsUyhQSW0yICogcDIpLCgxLWkvbCkqKjIwKTsKdmFyIG4gPSBFQVIoTWF0aC5taW4oMC4xLGkpLDAuMSw0MDAwLC4wMDUsMTApOwpzKj0gKDEtbiArIEYoNCxSQSgpLDMwKSAqIG4gKiA2Lik7CnJldHVybiBGKDUscywzKSAqIDAuNCAqIEVBUihpLGwsMjAwLC42LDMpOw%3D%3D)

## Previous experiments from 2011 and 2012:

 * http://www.kchapelier.com/synthesis/ (generate WAV PCM as a data-url fed to an audio tag)
 * http://www.kchapelier.com/livecoding/ (livecoding the body of a ScriptProcessingNode)
