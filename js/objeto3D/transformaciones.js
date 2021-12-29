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

class TransformacionOrbital extends Transformacion{
    constructor(orbital_refs){
        super()
        this.orbital_refs = orbital_refs;
    }
    transform(m){
        mat4.rotate(m,m,this.orbital_refs.alfa * Math.PI*2,vec3.fromValues(0,0,1))
        mat4.rotate(m,m,this.orbital_refs.beta * Math.PI + Math.PI/2,vec3.fromValues(0,1,0))

        mat4.translate(m,m, vec3.fromValues(1*this.orbital_refs.distancia,0,0));

        mat4.rotate(m,m,-Math.PI/2,vec3.fromValues(0,1,0))

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