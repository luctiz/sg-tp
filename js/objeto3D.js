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

class RotacionSegunTiempo extends Rotacion{
    constructor(radianes, eje){
        super(radianes,eje)
    }
    transform(m){
        mat4.rotate(m,m,this.radianes * global_t,this.eje)
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


var modo = "smooth"
class Objeto3D {
    // atributos privados
    constructor(){
        this.vertexBuffer = null; // position, normal & uvs
        this.indexBuffer = null;
        this.matModelado = mat4.create(); // transformacion respecto de su padre
        this.matTransformations = mat4.create();
        //this.posicion = vec3.fromValues(0,0,0); //a partir de estos atributos se calcula la matriz respectiva
        //this.rotacion = vec3.fromValues(0,0,0);
        //this.rotaciones = [];
        this.transformaciones = []
        //this.escala = vec3.fromValues(1,1,1);
        this.color = vec3.fromValues(1,1,1);
        this.hijos=[];
    }

    // metodo privado, usa posicion, rotacion y escala. Se actualiza cada vez que se dibuja el objeto
    _actualizarMatrizModelado() {
        let m = mat4.create(); // crear una matriz identidad
        //mat4.translate(m,m, this.posicion);
        for (var i = 0; i < this.transformaciones.length; i++) {
            this.transformaciones[i].transform(m)
        }
        //mat4.scale(m,m, this.escala);
        this.matModelado = m;
    } 

    // metodos publicos
    dibujar(matPadre) { // (matPadre es la matriz identidad si es el objeto principal de la escena)
        this._actualizarMatrizModelado();
        var m = mat4.create();

        // concatenamos las transformaciones padre/hijo
        mat4.multiply(m, matPadre, this.matModelado);
        // para mantener la concatenacion en objetos que actuan como camara
        this.matTransformations = m;
        //
        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, m);


        var uniformTime = gl.getUniformLocation(glProgram, "uTime");
        gl.uniform1f(uniformTime, Math.PI*15/8);     
        //var viewMatrixUniform = gl.getUniformLocation(glProgram, "viewMatrix");
        //gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);

        //var projMatrixUniform = gl.getUniformLocation(glProgram, "projMatrix");
        //gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);

        if ((this.vertexBuffer !=null) & (this.indexBuffer!= null)) {
            // Dibujamos la malla de triangulos con WebGL
            // si el objeto tiene geometria asociada.
            // Se configuran los buffers que alimentaron el pipeline

            vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.vertexBuffer.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.webgl_uvs_buffer);
            //gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexBuffer.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

            vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, this.vertexBuffer.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            let difuseColorUniform = gl.getUniformLocation(glProgram, "difuseColor")
            gl.uniform3f(difuseColorUniform, this.color[0],this.color[1], this.color[2])
            
            gl.drawElements( gl.TRIANGLE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

            /*
            
            if (modo!="smooth") {
                //gl.uniform1i(shaderProgram.useLightingUniform,false);
                gl.drawElements(gl.LINE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }*/
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(m)
        }
    }

    setGeometria(newVertexBuffer, newIndexBuffer) {
        this.vertexBuffer = newVertexBuffer;
        this.indexBuffer = newIndexBuffer;
    }

    getMatTransformations(){
        return this.matTransformations;
    }

    agregarHijo = function(h) {
        this.hijos.push(h);
    }

    quitarHijo = function(h) {
        index = this.hijos.indexOf(h);
        if (index > -1) {
            this.hijos.splice(index, 1);
        }
    }

    addTraslacion = function (x,y,z) {
        this.transformaciones.push(new Traslacion(vec3.fromValues(x,y,z)));
    }

    addEscalado = function (x,y,z) {
        this.transformaciones.push(new Escalado(vec3.fromValues(x,y,z)));
    }

    addRotacion = function(radianes, x,y,z) {
        //this.rotacion = vec3.fromValues(x,y,z)
        var eje = vec3.fromValues(x,y,z)
        this.transformaciones.push(new Rotacion(radianes,eje));
    }

    addRotacionSegunTiempo = function(radianes, x,y,z) {
        var eje = vec3.fromValues(x,y,z)
        this.transformaciones.push(new RotacionSegunTiempo(radianes,eje));
    }

    setColor = function (r,g,b) {
        this.color = vec3.fromValues(r,g,b)
    }

}


class ObjetoCurva3D extends Objeto3D{
    constructor(){
        super()
    }

    dibujar(matPadre) {
        this._actualizarMatrizModelado();
        var m = mat4.create();

        // concatenamos las transformaciones padre/hijo
        mat4.multiply(m, matPadre, this.matModelado);

        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, m);

        if (this.vertexBuffer && this.indexBuffer) {
            // Dibuja cada segmento de linea con WEBGL
            //console.log(this.indexBuffer)
            //console.log(this.vertexBuffer.webgl_position_buffer)
            //console.log(this.vertexBuffer.webgl_normal_buffer)
            vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.vertexBuffer.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, this.vertexBuffer.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            let difuseColorUniform = gl.getUniformLocation(glProgram, "difuseColor")
            gl.uniform3f(difuseColorUniform, this.color[0],this.color[1], this.color[2])
            
            gl.drawElements( gl.LINES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(m)
        }
    }

}