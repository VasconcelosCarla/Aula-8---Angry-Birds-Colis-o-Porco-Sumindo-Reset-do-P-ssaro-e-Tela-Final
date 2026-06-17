class Bird {
  constructor(x, y) {
    this.body = Bodies.circle(x, y, 25, {
      restitution: 0.6,
      density: 0.004,
      label: "bird",
      render: { visible: false }
    });

    this.image = new Image();
    this.image.src = "assets/passaro-animacao/passaro.png";

    this.frame = 0;
  }

  addToWorld(world) {
    Composite.add(world, this.body);
  }

  draw(ctx) {
    var larguraFrame = 900;
    var alturaFrame = 900;

    var xSprite = this.frame * larguraFrame;

    ctx.drawImage(
      this.image,
      xSprite,
      0,
      larguraFrame,
      alturaFrame,
      this.body.position.x - 45,
      this.body.position.y - 45,
      90,
      90
    );
  }

  animate() {
    this.frame++;

    if (this.frame > 1) {
      this.frame = 0;
    }
  }
}