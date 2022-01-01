class CurvaParametrizada{
    constructor(){}
    evaluarPunto(t){}
}

class CurvaBezier extends CurvaParametrizada{
    constructor(poligono_control){
        super()
        this.poligono_control=poligono_control
    }

    _fact(num)
    {
        var rval=1;
        for (var i = 2; i <= num; i++)
            rval = rval * i;
        return rval;
    }

    _combinations(n,k) {
        return (this._fact(n) / ((this._fact(k)) * this._fact(n - k)))
    }

    _B(i,n,t) {
        return (this._combinations(n,i)*((1-t)**(n-i)) *(t**i))
    }

    evaluarPunto= function(t){
        var resultado = vec3.fromValues(0,0,0);
        var n = this.poligono_control.length;
        for (var i = 0; i< n; i++){
            var auxvec = vec3.create();
            vec3.scale(auxvec,this.poligono_control[i],this._B(i,n-1,t));

            vec3.add(resultado,resultado, auxvec);
        }
        return resultado;
    }

}

            
// crea una circunferencia en el plano xy rotada segun vec_rot
class CurvaCircunferencia extends CurvaParametrizada{
    constructor(radio, vec_rot, parametrizacion = Math.PI*2){
        super()
        this.radio = radio;
        this.vec_rot = vec_rot;
        this.parametrizacion = parametrizacion;
    }
    evaluarPunto= function(t){
        var position = vec3.fromValues(Math.cos(this.parametrizacion*t),Math.sin(this.parametrizacion*t),0)
        vec3.scale(position, position, this.radio)
        vec3.rotateX(position, position, vec3.fromValues(0,0,0), this.vec_rot[0])
        vec3.rotateY(position, position, vec3.fromValues(0,0,0), this.vec_rot[1])
        vec3.rotateZ(position, position, vec3.fromValues(0,0,0), this.vec_rot[2])

        return position;
    }
}