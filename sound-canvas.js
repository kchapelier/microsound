"use strict";

var SoundCanvas = function SoundCanvas (canvas, timelineTracker) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d', { alpha: false });
  this.timelineTracker = timelineTracker;
  this.buffer = null;
  this.zoom = 0;
  this.offset = 0;
  this.dirty = true;

  this.resize();

  this.dragging = false;

  this.canvas.addEventListener('wheel', e => {
    this.offset += e.deltaY * this.pixelRatio / Math.pow(2, this.zoom);
    this.restrictOffset();
    this.dirty = true;
  }, { passive: true });

  this.timelineTracker.addEventListener('mousedown', e => {
    e.preventDefault();
    this.draggingTracker = true;
  });

  this.canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    this.dragging = true;
  });

  window.addEventListener('mouseup', e => {
    this.dragging = false;
    this.draggingTracker = false;
  });

  window.addEventListener('mousemove', e => {
    if (this.buffer) {
      if (this.dragging) {
        this.offset -= e.movementX * this.pixelRatio / Math.pow(2, this.zoom);
        this.restrictOffset();
        this.dirty = true;
      } else if (this.draggingTracker) {
        this.offset += e.movementX / window.innerWidth * this.buffer.length;
        this.restrictOffset();
        this.dirty = true;
      }
    }
  }, { passive: true });

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
  this.height = this.canvas.height = (window.innerHeight / 2 - 10) * this.pixelRatio | 0;
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
  ctx.fillStyle = '#020222';
  ctx.fillRect(0, this.height / 8, this.width, this.height / 8 * 6);
  ctx.fillStyle = '#050544';
  ctx.fillRect(0, this.height / 4, this.width, this.height / 2);
  ctx.fillStyle = '#0B0B66';
  ctx.fillRect(0, this.height / 8 * 3, this.width, this.height / 4);
  ctx.fillStyle = '#111188';
  ctx.fillRect(0, this.height / 32 * 15, this.width, this.height / 16);
};

SoundCanvas.prototype.drawAxis = function (ctx) {
    ctx.lineWidth = 1.;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = '#FFFFFF';
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

    this.drawOverlay(ctx);
    this.drawAxis(ctx);

    if (channel) {
      ctx.fillStyle = '#DDFF66';
      ctx.strokeStyle = '#DDFF66';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1.7;

      const max = Math.ceil(this.width / Math.pow(2, this.zoom));

      const halfHeight = this.height / 2;
      const widthDivMax = this.width / max;
      ctx.beginPath();
      ctx.moveTo(0, (1. - channel[offset]) * halfHeight);
      for (i = 1; i < max; i++) {
        ctx.lineTo(i * widthDivMax, (1. - channel[offset + i]) * halfHeight);
      }
      ctx.stroke();
      ctx.closePath();

      this.timelineTracker.style.transform = 'translateX(' + (offset/channel.length*100).toFixed(3) + '%) scale('+Math.max(max / channel.length, 0.0075).toFixed(3)+', 1.0)';
    }

    this.dirty = false;
  }
};