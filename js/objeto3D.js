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
    }
    transform(m){
        mat4.rotate(m,m,this.radianes * this.container_ref.variable * global_t,this.eje)
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
        this.transformaciones = []
        this.color = vec3.fromValues(1,1,1);
        this.hijos=[];
        this.iluminacionSimple=0.0;
        this.texture = textures.default;
        this.lightPositionUpdater = null;
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
        // para mantener la concatenacion en objetos que actuan como camara:
        this.matTransformations = m;
        //
        var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
        gl.uniformMatrix4fv(modelMatrixUniform, false, m);
        


        if (this.lightPositionUpdater != null){
            var vec_position = vec3.create();
            mat4.getTranslation(vec_position,this.matTransformations);
            this.lightPositionUpdater.updateLightPos(vec_position);
        }

        if ((this.vertexBuffer !=null) & (this.indexBuffer!= null)) { //Los binds aca son innecesarios???
            // Dibujamos la malla de triangulos con WebGL
            // si el objeto tiene geometria asociada.
            // Se configuran los buffers que alimentaron el pipeline

            vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.vertexBuffer.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);



            let textureCoordAttribute = gl.getAttribLocation(glProgram, 'aTextureCoord');
            gl.enableVertexAttribArray(textureCoordAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_uvs_buffer);
            gl.vertexAttribPointer(textureCoordAttribute, this.vertexBuffer.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);


            let samplerUniform = gl.getUniformLocation(glProgram, 'uSampler')
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(samplerUniform, 0);  
            

            vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, this.vertexBuffer.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);


            let simpleColorUniform = gl.getUniformLocation(glProgram, "simpleColor")
            gl.uniform1f(simpleColorUniform, this.iluminacionSimple)
            
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

    setGeometria(geometria, ver_normales=false) {
        var binded_geometry = geometria.bind()

        this.vertexBuffer = binded_geometry.vertexBuffer;
        this.indexBuffer = binded_geometry.indexBuffer;

        if (ver_normales){
            //PARA CHEQUEAR NORMALES
            var normals_geometry = geometria.obtenerGeometriaNormales()
            var normales_sup_barrido = new ObjetoCurva3D()
            normales_sup_barrido.setGeometria(normals_geometry, false)
            normales_sup_barrido.setColor(Math.random(),Math.random(),Math.random())
            this.agregarHijo(normales_sup_barrido)
        }
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
        var eje = vec3.fromValues(x,y,z)
        this.transformaciones.push(new Rotacion(radianes,eje));
    }

    addRotacionSegunVariable = function(radianes, x,y,z, variable) {
        var eje = vec3.fromValues(x,y,z)
        this.transformaciones.push(new RotacionSegunVariable(radianes,eje,variable));
    }

    addRotacionSegunVariablePorTiempo = function(radianes, x,y,z, variable) {
        var eje = vec3.fromValues(x,y,z)
        this.transformaciones.push(new RotacionSegunVariablePorTiempo(radianes,eje, variable));
    }

    setColor = function (r,g,b) {
        this.color = vec3.fromValues(r,g,b)
    }

    setIluminacionSimple(){
        this.iluminacionSimple = 1.0;
    }

    setTexture(texture){
        this.texture = texture;
    }

    setLightPositionUpdater(uniformName){
        this.lightPositionUpdater = new LightPositionUpdater(uniformName);
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

            let difuseColorUniform = gl.getUniformLocation(glProgram, "objectColor")
            gl.uniform3f(difuseColorUniform, this.color[0],this.color[1], this.color[2])

            let simpleColorUniform = gl.getUniformLocation(glProgram, "simpleColor")
            gl.uniform1f(simpleColorUniform, 1.0)
            
            gl.drawElements( gl.LINES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        for (var i = 0; i < this.hijos.length; i++) {
            this.hijos[i].dibujar(m)
        }
    }

}

class LightPositionUpdater{
    constructor(uniformName){
        this.uniformName = uniformName;
    }
    updateLightPos(vec_position){
        let ulightPos = gl.getUniformLocation(glProgram, this.uniformName)
        gl.uniform3f(ulightPos, vec_position[0],vec_position[1], vec_position[2])
    }
}