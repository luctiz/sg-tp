
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
        this.texture_nm = textures.createSolidTexture(0.5,0.5,1,1);

        this.lightPositionUpdater = null;
        this.spotlightUpdater = null;
        this.materialShininess = 100.0;
    }

    // metodo privado, usa posicion, rotacion y escala. Se actualiza cada vez que se dibuja el objeto
    _actualizarMatrizModelado() {
        let m = mat4.create(); // crear una matriz identidad
        for (var i = 0; i < this.transformaciones.length; i++) {
            this.transformaciones[i].transform(m)
        }
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

        if (this.spotlightUpdater != null){
            var vec_position = vec3.create();
            mat4.getTranslation(vec_position,this.matTransformations);

            var vec_dir= vec3.fromValues(0,0,1)
            vec3.transformMat4(vec_dir, vec_dir, this.matTransformations)
            vec3.sub(vec_dir,vec_dir,vec_position)

            this.spotlightUpdater.updateSpotlight(vec_position, vec_dir);
        }

        if ((this.vertexBuffer !=null) & (this.indexBuffer!= null)) { //Los binds aca son innecesarios???
            // Dibujamos la malla de triangulos con WebGL
            // si el objeto tiene geometria asociada.
            // Se configuran los buffers que alimentaron el pipeline

            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.vertexBuffer.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, this.vertexBuffer.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            let vertexTangentAttribute = gl.getAttribLocation(glProgram, "aVertexTangent");
            gl.enableVertexAttribArray(vertexTangentAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_tangent_buffer);
            gl.vertexAttribPointer(vertexTangentAttribute, this.vertexBuffer.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

            let vertexBinormalAttribute = gl.getAttribLocation(glProgram, "aVertexBinormal");
            gl.enableVertexAttribArray(vertexBinormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_binormal_buffer);
            gl.vertexAttribPointer(vertexBinormalAttribute, this.vertexBuffer.webgl_binormal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            let textureCoordAttribute = gl.getAttribLocation(glProgram, 'aTextureCoord');
            gl.enableVertexAttribArray(textureCoordAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_uvs_buffer);
            gl.vertexAttribPointer(textureCoordAttribute, this.vertexBuffer.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

            let materialShininess = gl.getUniformLocation(glProgram, "materialShininess")
            gl.uniform1f(materialShininess, this.materialShininess)

            let samplerUniform = gl.getUniformLocation(glProgram, 'uSampler')
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(samplerUniform, 0);  
            


            // setup normal map:
            let uNMsamplerUniform = gl.getUniformLocation(glProgram, 'uNMSampler')
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.texture_nm);
            gl.uniform1i(uNMsamplerUniform, 1);    
            //

            // setup reflection map:
            let uRMsamplerUniform = gl.getUniformLocation(glProgram, 'uRMSampler')
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, textures.refmap);
            gl.uniform1i(uRMsamplerUniform, 2);    
            //

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            
            let simpleColorUniform = gl.getUniformLocation(glProgram, "simpleColor")
            gl.uniform1f(simpleColorUniform, this.iluminacionSimple)
            
            gl.drawElements( gl.TRIANGLE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

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
            //PARA CHEQUEAR NORMALES VISUALMENTE
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

    addTransformacionOrbital = function(orbital_values) {
        this.transformaciones.push(new TransformacionOrbital(orbital_values));
    }

    setColor = function (r,g,b) {
        this.color = vec3.fromValues(r,g,b)
    }

    setIluminacionSimple(){
        this.iluminacionSimple = 1.0;
    }

    setTexture(texture, texture_nm = null){
        this.texture = texture;
        if (texture_nm != null){
            this.texture_nm = texture_nm;
        }
    }

    setLightPositionUpdater(uniformName){
        this.lightPositionUpdater = new LightPositionUpdater(uniformName);
    }

    setSpotlightUpdater(){
        this.spotlightUpdater = new SpotlightUpdater();
    }

    setMaterialShininess(shininess){
        this.materialShininess = shininess;
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
            let vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.vertexBuffer.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            let vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
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


class SpotlightUpdater{
    constructor(){}
    updateSpotlight(vec_position, vec_direction){
        let ulightPos = gl.getUniformLocation(glProgram, "spotlightPos")
        gl.uniform3f(ulightPos, vec_position[0],vec_position[1], vec_position[2])

        let uLightDir = gl.getUniformLocation(glProgram, "spotlightDir")
        gl.uniform3f(uLightDir, vec_direction[0],vec_direction[1], vec_direction[2])
    }
}