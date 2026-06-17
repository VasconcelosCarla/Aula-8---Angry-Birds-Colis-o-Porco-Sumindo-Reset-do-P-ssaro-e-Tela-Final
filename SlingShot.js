class SlingShot {

  constructor(body, pointB, options) {

    options = options || {};

    this.body = body;
    this.pointB = pointB;

    this.scale = options.scale || 1;
    this.x = options.x || 150;
    this.y = options.y || 255;

    this.forkLeftOffsetX = options.forkLeftOffsetX || 20;
    this.forkLeftOffsetY = options.forkLeftOffsetY || 30;
    this.forkRightOffsetX = options.forkRightOffsetX || 60;
    this.forkRightOffsetY = options.forkRightOffsetY || 30;

    this.attached = true;
    this.dragging = false;
    this.maxStretch = options.maxStretch || 180;
    this.launchPower = options.launchPower || 0.17;
    this.grabRadius = options.grabRadius || 55;

    this.imageBack = new Image();
    this.imageBack.src = "assets/estilingue-tras.png";

    this.imageFront = new Image();
    this.imageFront.src = "assets/estilingue-frente.png";

    this.imagePouch = new Image();
    this.imagePouch.src = "assets/estilingue.png";

    this.constraint = Constraint.create({
      bodyA: body,
      pointB: pointB,
      stiffness: options.stiffness || 0.04,
      length: options.length || 1,
      render: {
        visible: false
      }
    });

  }

  addToWorld(world) {
    Composite.add(world, this.constraint);
  }

  attach(newBody, world) {

    this.body = newBody;
    this.attached = true;
    this.dragging = false;

    this.constraint = Constraint.create({
      bodyA: this.body,
      pointB: this.pointB,
      stiffness: 0.04,
      length: 1,
      render: {
        visible: false
      }
    });

    Composite.add(world, this.constraint);

  }

  isAttached() {
    return this.attached;
  }

  isOnBird(mouseX, mouseY) {

    var dx = mouseX - this.body.position.x;
    var dy = mouseY - this.body.position.y;

    return dx * dx + dy * dy <= this.grabRadius * this.grabRadius;

  }

  tryStartDrag(mouseX, mouseY) {

    if (!this.attached || !this.isOnBird(mouseX, mouseY)) {
      return false;
    }

    this.dragging = true;

    Body.setVelocity(this.body, { x: 0, y: 0 });
    Body.setAngularVelocity(this.body, 0);

    this.dragTo(mouseX, mouseY);

    return true;

  }

  dragTo(mouseX, mouseY) {

    if (!this.dragging || !this.attached) {
      return;
    }

    var dx = mouseX - this.pointB.x;
    var dy = mouseY - this.pointB.y;

    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.maxStretch && dist > 0) {
      var scale = this.maxStretch / dist;

      dx *= scale;
      dy *= scale;
    }

    Body.setPosition(this.body, {
      x: this.pointB.x + dx,
      y: this.pointB.y + dy
    });

    Body.setVelocity(this.body, { x: 0, y: 0 });
    Body.setAngularVelocity(this.body, 0);

  }

  release(world) {

    if (!this.attached) {
      this.dragging = false;
      return false;
    }

    var estavaArrastando = this.dragging;
    this.dragging = false;

    if (!estavaArrastando) {
      return false;
    }

    var dx = this.body.position.x - this.pointB.x;
    var dy = this.body.position.y - this.pointB.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var minimoArrasto = 15;

    if (dist < minimoArrasto) {
      Body.setPosition(this.body, {
        x: this.pointB.x,
        y: this.pointB.y
      });
      Body.setVelocity(this.body, { x: 0, y: 0 });
      Body.setAngularVelocity(this.body, 0);
      return false;
    }

    this.attached = false;

    var forcaX = this.pointB.x - this.body.position.x;
    var forcaY = this.pointB.y - this.body.position.y;

    Composite.remove(world, this.constraint);
    this.constraint = null;

    Body.setSleeping(this.body, false);

    Body.setVelocity(this.body, {
      x: forcaX * this.launchPower,
      y: forcaY * this.launchPower
    });

    return true;

  }

  drawBack(ctx) {

    if (!this.imageBack.complete || this.imageBack.naturalWidth === 0) {
      return;
    }

    ctx.drawImage(
      this.imageBack,
      this.x,
      this.y,
      80 * this.scale,
      130 * this.scale
    );

  }

  drawFront(ctx) {

    if (!this.imageFront.complete || this.imageFront.naturalWidth === 0) {
      return;
    }

    ctx.drawImage(
      this.imageFront,
      this.x,
      this.y,
      80 * this.scale,
      130 * this.scale
    );

  }

  drawBands(ctx) {

    ctx.beginPath();

    ctx.moveTo(
      this.x + this.forkLeftOffsetX,
      this.y + this.forkLeftOffsetY
    );

    ctx.lineTo(
      this.body.position.x,
      this.body.position.y
    );

    ctx.moveTo(
      this.x + this.forkRightOffsetX,
      this.y + this.forkRightOffsetY
    );

    ctx.lineTo(
      this.body.position.x,
      this.body.position.y
    );

    ctx.strokeStyle = "#3b1f0f";
    ctx.lineWidth = 6;
    ctx.stroke();

  }

  drawPouch(ctx) {

    if (!this.imagePouch.complete || this.imagePouch.naturalWidth === 0) {
      return;
    }

    ctx.drawImage(
      this.imagePouch,
      this.body.position.x - 25,
      this.body.position.y - 20,
      50,
      40
    );

  }

}