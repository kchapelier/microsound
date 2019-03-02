"use strict";

var SoundCanvas = function SoundCanvas (canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.buffer = null;
  this.zoom = 0;
  this.offset = 0;
  this.dirty = true;

  this.resize();

  this.dragging = false;

  this.canvas.addEventListener('wheel', e => {
    e.preventDefault();
    this.offset += e.deltaY * this.pixelRatio / Math.pow(2, this.zoom);
    this.restrictOffset();
    this.dirty = true;
  });

  this.canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    this.dragging = true;
  });

  window.addEventListener('mouseup', e => {
    this.dragging = false;
  });

  window.addEventListener('mousemove', e => {
    if (this.dragging) {
      this.offset -= e.movementX * this.pixelRatio / Math.pow(2, this.zoom);
      this.restrictOffset();
      this.dirty = true;
    }
  });

  window.addEventListener('resize', () => {
    this.resize();
  });
};

SoundCanvas.prototype.restrictOffset = function () {
  this.offset = Math.max(0, Math.min(this.buffer ? this.buffer.length : 0, this.offset));
};

SoundCanvas.prototype.resize = function () {
  this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  this.width = this.canvas.width = window.innerWidth * this.pixelRatio;
  this.height = this.canvas.height = (window.innerHeight / 2) * this.pixelRatio | 0;
  this.restrictOffset();
  this.dirty = true;
};

SoundCanvas.prototype.setBuffer = function (buffer) {
  this.dirty = true;
  this.buffer = buffer;
  this.restrictOffset();
};

SoundCanvas.prototype.setZoom = function (zoom) {
  this.dirty = this.dirty || zoom !== this.zoom;
  this.zoom = zoom;
  this.restrictOffset();
};

SoundCanvas.prototype.setOffset = function (offset) {
    offset = Math.max(0, offset|0);
    this.dirty = this.dirty || offset !== this.offset;
    this.offset = offset ;
};

SoundCanvas.prototype.drawOverlay = function (ctx) {
  console.log('drawOverlay');

    ctx.fillStyle = 'rgba(50,50,255,0.1)';
    ctx.fillRect(0, this.height / 4, this.width, this.height / 2);
    ctx.fillStyle = 'rgba(20,20,255,0.1)';
    ctx.fillRect(0, this.height / 8 * 3, this.width, this.height / 4);

};

SoundCanvas.prototype.drawAxis = function (ctx) {
    ctx.lineWidth = 1.;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2 | 0);
    ctx.lineTo(this.width, this.height / 2 | 0);
    ctx.stroke();

    ctx.setLineDash([5,4]);

    ctx.beginPath();

    for (var x = 1; x < 8; x++) {
      if (x !== 4) {
        ctx.moveTo(0, this.height / 8 * x | 0);
        ctx.lineTo(this.width, this.height / 8 * x | 0);
      }
    }

    ctx.stroke();

    ctx.setLineDash([]);
};

SoundCanvas.prototype.refresh = function () {
  if (this.dirty === true) {
    var ctx = this.context,
      channel = this.buffer,
      i;

    var offset = this.offset | 0;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.width, this.height);

    this.drawAxis(ctx);
    this.drawOverlay(ctx);

    if (channel) {
      ctx.fillStyle = '#FFFF00';
      ctx.strokeStyle = '#FFFF00';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1.75;

      const max = Math.ceil(this.width / Math.pow(2, this.zoom));

      ctx.beginPath();
      ctx.moveTo(0, channel[offset] * -this.height / 2 + this.height / 2);
      for (i = 1; i < max; i++) {
        ctx.lineTo(i * this.width / max, channel[offset + i] * -this.height / 2 + this.height / 2);
      }
      ctx.stroke();
    }


    this.dirty = false;
  }
};