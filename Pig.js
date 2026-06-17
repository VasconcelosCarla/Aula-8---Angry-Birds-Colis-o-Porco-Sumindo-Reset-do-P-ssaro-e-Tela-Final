class Pig {
  constructor(x, y) {
    this.body = Bodies.circle(x, y, 28, {
      restitution: 0.3,
      label: "pig",
      render: { visible: false }
    });

    this.image = new Image();
    this.image.src = "assets/porco-animacao/porco.png";

    this.frame = 0;
    this.alpha = 1;
    this.fading = false;
    this.removed = false;
  }

  addToWorld(world) {
    Composite.add(world, this.body);
  }

  startFade() {
    this.fading = true;
    Body.setStatic(this.body, true);
  }

  updateFade(world, callbackFinal) {
    if (!this.fading || this.removed) return;

    this.alpha -= 0.03;

    if (this.alpha <= 0) {
      this.alpha = 0;
      this.removed = true;
      Composite.remove(world, this.body);

      if (callbackFinal) {
        callbackFinal();
      }
    }
  }

  draw(ctx) {
    if (this.removed) return;

    var larguraFrame = 900;
    var alturaFrame = 900;

    var xSprite = 0;
    var ySprite = this.frame * alturaFrame;

    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);

    ctx.drawImage(
      this.image,
      xSprite,
      ySprite,
      larguraFrame,
      alturaFrame,
      -45,
      -45,
      90,
      90
    );

    ctx.restore();
  }

  animate() {
    this.frame++;

    if (this.frame > 1) {
      this.frame = 0;
    }
  }
}