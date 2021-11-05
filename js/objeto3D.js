var modo = "smooth"
class Objeto3D {
    // atributos privados
    constructor(){

        this.vertexBuffer = null; // position, normal & uvs
        this.indexBuffer = null;
        this.matModelado = mat4.create(); // transformacion respecto de su padre
        this.posicion = vec3.fromValues(0,0,0); //a partir de estos atributos se calcula la matriz respectiva
        this.rotacion = vec3.fromValues(0,0,0);
        this.escala = vec3.fromValues(1,1,1);
        this.color = vec3.fromValues(1,1,1);
        this.hijos=[];

    }

    // metodo privado, usa posicion, rotacion y escala. Se actualiza cada vez que se dibuja el objeto
    _actualizarMatrizModelado() {
        let m = mat4.create(); // crear una matriz identidad

        mat4.translate(m,m, this.posicion);
        mat4.rotate(m,m,Math.PI/2,this.rotacion);
        mat4.scale(m,m, this.escala);
        this.matModelado = m;
    } 

    // metodos publicos
    dibujar(matPadre) { // (matPadre es la matriz identidad si es el objeto principal de la escena)
        this._actualizarMatrizModelado();
        var m = mat4.create();

        // concatenamos las transformaciones padre/hijo
        mat4.multiply(m, matPadre, this.matModelado);

        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, m);

        if (this.vertexBuffer && this.indexBuffer) {
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


            /*if (modo!="wireframe"){
                //gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
                gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            
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

    agregarHijo = function(h) {
        this.hijos.push(h);
    }

    hijos = function(){
        return this.hijos
    }

    quitarHijo = function(h) {
        index = this.hijos.indexOf(h);
        if (index > -1) {
            this.hijos.splice(index, 1);
        }
    }

    setPosicion = function (x,y,z) {
        this.posicion = vec3.fromValues(x,y,z)
    }
    setRotacion = function(x,y,z) {
        this.rotacion = vec3.fromValues(x,y,z)
    }
    setEscala = function (x,y,z) {
        this.escala = vec3.fromValues(x,y,z)
    }

    setColor = function (r,g,b) {
        this.color = vec3.fromValues(r,g,b)
    }

    animate = function() {
                
        rotate_angle += 0.01;
        //mat4.identity(matModelado);
        //mat4.rotate(matModelado,matModelado, rotate_angle, [1.0, 0.0, 1.0]);
        this.setRotacion(Math.cos(rotate_angle), 0, Math.sin(rotate_angle))


        //mat4.identity(normalMatrix);
        //mat4.multiply(normalMatrix,viewMatrix,matModelado);
        //mat4.invert(normalMatrix,normalMatrix);
        //mat4.transpose(normalMatrix,normalMatrix);

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