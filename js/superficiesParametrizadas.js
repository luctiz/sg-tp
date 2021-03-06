class SuperficieParametrizada {
    constructor(){}
    getPosicion(){}
    getNormal(){}
    getTangente(){}
    getBinormal(u,v){
        var result = this.getNormal(u,v)
        var t = this.getTangente(u,v)
        vec3.cross(result,result,t)
        return result
    }

    getCoordenadasTextura(){}
}


class Plano extends SuperficieParametrizada {
    constructor(ancho,largo=ancho){
        super()
        this.ancho = ancho;
        this.largo = largo;
    }
    getPosicion=function(u,v){
        var x=(u-0.5)*this.ancho;
        var z=(v-0.5)*this.largo;
        return [x,0,z];
    }

    getNormal=function(u,v){
        return [0,1,0];
    }

    getTangente=function(u,v){
        return [1,0,0];
    }

    getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}


class Esfera extends SuperficieParametrizada{
    constructor(radio, porcion_tita = Math.PI, porcion_fi=Math.PI*2){
        super()
        this.radio = radio;
        this.porcion_tita = porcion_tita;
        this.porcion_fi = porcion_fi;

    }
    getPosicion=function(u,v){
        var tita = v*this.porcion_tita
        var fi = u*this.porcion_fi
        var x = this.radio*Math.sin(tita)*Math.cos(fi)
        var y = this.radio*Math.sin(tita)*Math.sin(fi)
        var z = this.radio*Math.cos(tita)
        var p = vec3.fromValues(x,y,z)
        return p;
    }

    getNormal=function(u,v){
        var posicion = this.getPosicion(u,v)
        
        var n=vec3.fromValues(posicion[0],posicion[1],posicion[2]);
        vec3.normalize(n,n)
        
        return n                
    }

    getTangente=function(u,v){
        var p0 = this.getPosicion(u,v)
        var p1 = this.getPosicion(u,v+0.02)
        vec3.sub(p1,p1,p0)
        return p1;
    }
    

    getCoordenadasTextura=function(u,v){
        return [u*(this.porcion_fi/(Math.PI*2)),v*(this.porcion_tita/(Math.PI))];
    }
}

/*class EsferaRara extends SuperficieParametrizada{
    constructor(radio){
        super()
        this.radio = radio;
    }
    getPosicion= function(u,v){
        var alfa=v*Math.PI*2;
        var beta=(0.1+u*0.8)*Math.PI;
        var r=this.radio;
        var nx=Math.sin(beta)*Math.sin(alfa);
        var ny=Math.sin(beta)*Math.cos(alfa);
        var nz=Math.cos(beta);


        var g=beta%0.5;
        var h=alfa%1;
        var f=1;

        if (g<0.25) f=0.95;
        if (h<0.5) f=f*0.95;

        var x=nx*r*f;
        var y=ny*r*f;
        var z=nz*r*f;

        return [x,y,z];
    }

    getNormal=function(u,v){
        var delta=0.016;
        var p1=this.getPosicion(u,v);
        var p2=this.getPosicion(u,v+delta);
        var p3=this.getPosicion(u+delta,v);

        var v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
        var v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);

        vec3.normalize(v1,v1);
        vec3.normalize(v2,v2);
        
        var n=vec3.create();
        vec3.cross(n,v1,v2);
        vec3.normalize(n,n)
        return n;
    }

    getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}*/
