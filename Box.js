class Box {

  constructor(x,y,width,height,imagem){

    this.body = Bodies.rectangle(x, y, width, height, {

      restitution: 0.2,

      render:{
        sprite:{
          texture: imagem,

          xScale: 1,
          yScale: 1
        }
      }

    });

  }

  addToWorld(world) {
    Composite.add(world, this.body);
  }

}