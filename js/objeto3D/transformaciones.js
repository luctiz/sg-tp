class Transformacion{
    constructor(){};
    transform(m){
    }
}


class Rotacion extends Transformacion{
    constructor(radianes, eje){
        super()
        this.radianes = radianes;
        this.eje = eje
    }
    transform(m){
        mat4.rotate(m,m,this.radianes,this.eje)
    }
}


class RotacionSegunVariable extends Rotacion{
    constructor(radianes, eje, container_ref){
        super(radianes,eje)
        this.container_ref = container_ref;
    }
    transform(m){
        mat4.rotate(m,m,this.radianes * this.container_ref.variable,this.eje)
    }
}

class RotacionSegunVariablePorTiempo extends RotacionSegunVariable{
    constructor(radianes, eje, container_ref){
        super(radianes,eje, container_ref)
        this.acum_rot = 0;
    }
    transform(m){
        this.acum_rot+= this.container_ref.variable/10;
        mat4.rotate(m,m,this.radianes * this.acum_rot,this.eje)
    }
}

class Traslacion extends Transformacion{
    constructor(posicion){
        super()
        this.posicion = posicion;
    }
    transform(m){
        mat4.translate(m,m, this.posicion);
    }
}

class Escalado extends Transformacion{
    constructor(escala){
        super()
        this.escala = escala;
    }
    transform(m){
        mat4.scale(m,m, this.escala);
    }
}