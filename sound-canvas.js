
// TODO allow moving along the waveform cannot be done by drag-dropping or scrolling
// TODO support window resize

var SoundCanvas = function SoundCanvas (canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.buffer = null;
    this.zoom = 0;
    this.offset = 0;
    this.dirty = true;
};

SoundCanvas.prototype.setBuffer = function (buffer) {
    this.dirty = true;
    this.buffer = buffer;
};

SoundCanvas.prototype.setZoom = function (zoom) {
    this.dirty = this.dirty || zoom !== this.zoom;
    this.zoom = zoom;
};

SoundCanvas.prototype.setOffset = function (offset) {
    offset = Math.max(0, offset|0);
    this.dirty = this.dirty || offset !== this.offset;
    this.offset = offset ;
};

SoundCanvas.prototype.drawOverlay = function (ctx) {
    ctx.fillStyle = 'rgba(50,50,255,0.1)';
    ctx.fillRect(0,125,1400,250);
    ctx.fillStyle = 'rgba(20,20,255,0.1)';
    ctx.fillRect(0,187.5,1400,125);
};

SoundCanvas.prototype.drawAxis = function (ctx) {
    ctx.lineWidth = 1.;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(1400,250);
    ctx.stroke();

    ctx.setLineDash([5,4]);
    ctx.beginPath();
    ctx.moveTo(0, 125);
    ctx.lineTo(1400, 125);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 375);
    ctx.lineTo(1400, 375);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 62.5|0);
    ctx.lineTo(1400, 62.5|0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 187.5|0);
    ctx.lineTo(1400, 187.5|0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 312.5|0);
    ctx.lineTo(1400, 312.5|0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 437.5|0);
    ctx.lineTo(1400, 437.5|0);
    ctx.stroke();

    ctx.setLineDash([]);
};

SoundCanvas.prototype.refresh = function () {
    if (this.dirty) {
        var ctx = this.context,
            channel = this.buffer,
            i;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 1460, 500);

        this.drawAxis(ctx);

        if (channel) {
            ctx.fillStyle = '#FFFF00';
            ctx.strokeStyle = '#FFFF00';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 2.1;

            ctx.beginPath();
            ctx.moveTo(0, channel[this.offset] * 250 + 250);
            var max = Math.ceil(canvas.width / Math.pow(2, this.zoom));
            for (i = 1; i < max; i++) {
                ctx.lineTo(i * canvas.width / max, channel[this.offset + i] * -250 + 250);
            }
            ctx.stroke();
        }

        this.drawOverlay(ctx);

        this.dirty = false;
    }
};