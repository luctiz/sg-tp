var modo = "smooth"
function Objeto3D (){
    // atributos privados
    var vertexBuffer = null; // position, normal & uvs
    var indexBuffer = null;
    var matModelado = mat4.create(); // transformacion respecto de su padre
    var posicion = vec3.create(); //a partir de estos atributos se calcula la matriz respectiva
    var rotacion = vec3.create();
    var escala = vec3.create();
    var color = vec3.fromValues(1,1,1);
    var hijos=[];

    // metodo privado, usa posicion, rotacion y escala. Se actualiza cada vez que se dibuja el objeto
    function actualizarMatrizModelado() {
        m = mat4.create(); // crear una matriz identidad

        mat4.translate(m,m, posicion);
        mat4.rotate(m,m,Math.PI/2,rotacion);
        //console.log(rotacion)
        mat4.scale(m,m, escala);
        matModelado = m;
        //console.log(matModelado)
    } 

    // metodos publicos
    this.dibujar = function(matPadre) { // (matPadre es la matriz identidad si es el objeto principal de la escena)
        actualizarMatrizModelado();
        var m = mat4.create();

        // concatenamos las transformaciones padre/hijo
        mat4.multiply(m, matPadre, matModelado);

        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, m);

        if (vertexBuffer && indexBuffer) {
            // Dibujamos la malla de triangulos con WebGL
            // si el objeto tiene geometria asociada.
            // Se configuran los buffers que alimentaron el pipeline

            vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, vertexBuffer.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.webgl_uvs_buffer);
            //gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexBuffer.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

            vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, vertexBuffer.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

            difuseColorUniform = gl.getUniformLocation(glProgram, "difuseColor")
            gl.uniform3f(difuseColorUniform, color[0],color[1], color[2])
            
            gl.drawElements( gl.TRIANGLE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


            /*if (modo!="wireframe"){
                //gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
                gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
            
            if (modo!="smooth") {
                //gl.uniform1i(shaderProgram.useLightingUniform,false);
                gl.drawElements(gl.LINE_STRIP, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }*/
        }

        for (var i = 0; i < hijos.length; i++) {
            hijos[i].dibujar(m)
        }
    }

    this.setGeometria = function(newVertexBuffer, newIndexBuffer) {
        vertexBuffer = newVertexBuffer;
        indexBuffer = newIndexBuffer;
    }

    this.agregarHijo = function(h) {
        hijos.push(h);
    }
    this.quitarHijo = function(h) {
        index = hijos.indexOf(h);
        if (index > -1) {
            hijos.splice(index, 1);
        }
    }

    this.setPosicion = function (x,y,z) {
        posicion = vec3.fromValues(x,y,z)
    }
    this.setRotacion = function(x,y,z) {
        rotacion = vec3.fromValues(x,y,z)
    }
    this.setEscala = function (x,y,z) {
        escala = vec3.fromValues(x,y,z)
    }

    this.setColor = function (r,g,b) {
        color = vec3.fromValues(r,g,b)
    }

    this.animate = function() {
                
        rotate_angle += 0.01;
        //mat4.identity(matModelado);
        //mat4.rotate(matModelado,matModelado, rotate_angle, [1.0, 0.0, 1.0]);
        this.setRotacion(Math.cos(rotate_angle), 0, Math.sin(rotate_angle))


        mat4.identity(normalMatrix);
        mat4.multiply(normalMatrix,viewMatrix,matModelado);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);

    }
}