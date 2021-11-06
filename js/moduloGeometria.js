class ModuloGeometria {
    static obtenerGeometriaObjeto3D(superficie, filas, columnas){
        var vertexBuffer = this._getVertexBufferSuperficie(superficie,filas,columnas);
        var indexBuffer = this._getIndexBufferSuperficie(filas,columnas)

        return {vertexBuffer, indexBuffer}
    }


    static obtenerGeometriaCurva3D(curva, cant_puntos){
        var vertexBuffer = this._getVertexBufferCurva(curva,cant_puntos);
        var indexBuffer = this._getIndexBufferCurva(cant_puntos)

        return {vertexBuffer, indexBuffer}
    }


    static obtenerGeometriaTangentesCurva3D(curva_discretizada){
        var vertexBuffer = this._getVertexBufferTangentes(curva_discretizada);
        var indexBuffer = this._getIndexBufferTangentes(curva_discretizada.position_list.length * 2 / 3)
        return {vertexBuffer, indexBuffer}
    }

    static obtenerGeometriaSuperficieBarrido(forma_discretizada, recorrido_discretizado){
        var vertexBuffer = this._getVertexBufferSuperficieBarrido(forma_discretizada,recorrido_discretizado);
        var columnas = forma_discretizada.position_list.length / 3
        var filas = recorrido_discretizado.position_list.length / 3
        var indexBuffer = this._getIndexBufferSuperficie(filas, columnas)

        var webgl_position_buffer = vertexBuffer.webgl_normallinesposition_buffer
        var webgl_normal_buffer = vertexBuffer.webgl_normallinesnormals_buffer
        var normalIndexBuffer = this._getIndexBufferTangentes(forma_discretizada.position_list.length * recorrido_discretizado.position_list.length)

        var normalVertexBuffer = {webgl_position_buffer, webgl_normal_buffer}

        return {vertexBuffer, indexBuffer, normalVertexBuffer, normalIndexBuffer}
    }


    static _getVertexBufferSuperficie(superficie, rows,cols)
        {
            var pos=[];
            var uv = [];
            var normal=[];

            for (var i=0;i<rows;i++){
                for (var j=0;j<cols;j++){

                    var u=i/(rows-1); //esto capaz se tenga que cambiar despues (creo que los nombres u y v no son representativos)
                    var v=j/(cols-1); //Ademas en mi tp de grillas esto lo tenia un poco distinto, no se si va a estar del todo bien

                    var p=superficie.getPosicion(u,v);

                    pos.push(p[0]);
                    pos.push(p[1]);
                    pos.push(p[2]);
                    
                    var n=superficie.getNormal(u,v);

                    normal.push(n[0]);
                    normal.push(n[1]);
                    normal.push(n[2]);

                    var uvs=superficie.getCoordenadasTextura(u,v);

                    uv.push(uvs[0])
                    uv.push(uvs[1])
                }

            }
            var webgl_position_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
            webgl_position_buffer.itemSize = 3;
            webgl_position_buffer.numItems = pos.length / 3;

            var webgl_uvs_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
            webgl_uvs_buffer.itemSize = 2;
            webgl_uvs_buffer.numItems = uv.length / 2;
        

            var webgl_normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
            webgl_normal_buffer.itemSize = 3;
            webgl_normal_buffer.numItems = normal.length / 3;
            
            return {
                webgl_position_buffer,
                webgl_normal_buffer,
                webgl_uvs_buffer
            }
        }
    static _getIndexBufferSuperficie(rows,cols){
        var index=[];

            for (var i=0;i<rows-1;i++){
                index.push(i*cols);
                for (var j=0;j<cols-1;j++){
                    index.push(i*cols+j);
                    index.push((i+1)*cols+j);
                    index.push(i*cols+j+1);
                    index.push((i+1)*cols+j+1);
                }
                index.push((i+1)*cols+cols-1);
            }
            var webgl_index_buffer = gl.createBuffer();
            webgl_index_buffer.itemSize = 1;
            webgl_index_buffer.numItems = index.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);  
            return webgl_index_buffer;
    }

    static _getVertexBufferCurva(curva, cant_puntos)
    {
        var discretizacion = obtenerDiscretizacionCurva(curva,cant_puntos)

        var curva_secuencia = discretizacion.position_list
        var tangs_secuencia = discretizacion.tang_list


        var webgl_position_buffer = gl.createBuffer();
        webgl_position_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curva_secuencia), gl.STATIC_DRAW);

        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangs_secuencia), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
        }
    }

    static _getVertexBufferTangentes(curva_discretizada)
    {
        var new_position_list = []
        var normal_list = []

        for (var i = 0; i < (curva_discretizada.position_list.length / 3); i++){
            var index = i*3

            new_position_list.push(curva_discretizada.position_list[index])
            new_position_list.push(curva_discretizada.position_list[index+1])
            new_position_list.push(curva_discretizada.position_list[index+2])
            
            new_position_list.push(curva_discretizada.position_list[index] +  curva_discretizada.tang_list[index])
            new_position_list.push(curva_discretizada.position_list[index+1] + curva_discretizada.tang_list[index+1])
            new_position_list.push(curva_discretizada.position_list[index+2] + curva_discretizada.tang_list[index+2])

            normal_list.push(1) // normales irrelevantes en este caso
            normal_list.push(1)
            normal_list.push(1)
            normal_list.push(1)
            normal_list.push(1)
            normal_list.push(1)

        }

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new_position_list), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;


        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_list), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
        }
    }

    static _getIndexBufferTangentes(position_buffer_length){
        var curve_index=[]

        for (var i = 0; i < position_buffer_length; i++){
            curve_index.push(i)
        }

        var curve_index_buffer = gl.createBuffer();
        curve_index_buffer.itemSize = 1;
        curve_index_buffer.numItems = curve_index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, curve_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(curve_index), gl.STATIC_DRAW); 

        return curve_index_buffer
    }

    static _getIndexBufferCurva(cant_puntos){
        var curve_index=[]

        curve_index.push(0)
        for (var i = 1; i < cant_puntos -1; i++){
            curve_index.push(i)
            curve_index.push(i)
        }
        curve_index.push(cant_puntos-1)

        var curve_index_buffer = gl.createBuffer();
        curve_index_buffer.itemSize = 1;
        curve_index_buffer.numItems = curve_index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, curve_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(curve_index), gl.STATIC_DRAW); 

        return curve_index_buffer
    }

    static _getVertexBufferSuperficieBarrido(forma_discretizada,recorrido_discretizado){

        var pos_buffer = []
        var normal_buffer = []

        // codigo solamente por si se quiere dibujar normales
        var normallines_pos_buffer = []
        var normallines_normal_buffer = []
        //

        var p0 = vec3.fromValues(recorrido_discretizado.position_list[0],recorrido_discretizado.position_list[0+1],recorrido_discretizado.position_list[0+2])
        var p1 = vec3.fromValues(recorrido_discretizado.position_list[0+3],recorrido_discretizado.position_list[0+4],recorrido_discretizado.position_list[0+5])
        var p2 = vec3.fromValues(recorrido_discretizado.position_list[0+6],recorrido_discretizado.position_list[0+7],recorrido_discretizado.position_list[0+8])
        if (Number.isNaN(p2[0])){
            p2 = p1;
        }

        var v0 =vec3.create()
        var v1 = vec3.create()
        var nm = vec3.create()
        // asumo que la normal es constante (los puntos de la curva recorrido estan contenidos en un plano)

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm,v0,v1)
        if ((nm[0] == 0) & (nm[1] == 0) & (nm[2] == 0)){ // en este caso me quedo con un vector normal cualquiera a la recta
            if (v0[0] != 0) {
                nm = vec3.fromValues((-v0[1]*2 - v0[2]*2)/v0[0], 2, 2)
            } else if (v0[1] != 0){
                nm=  vec3.fromValues(2,(-v0[0]*2 - v0[2]*2)/v0[1],2)
            } else {
                nm=  vec3.fromValues(2,2,(-v0[0]*2 - v0[1]*2)/v0[2])
            }
            

        }
        vec3.normalize(nm,nm)


        for (var j = 0; j<(recorrido_discretizado.position_list.length); j+=3){
            var punto_recorrido = vec3.fromValues(recorrido_discretizado.position_list[j], recorrido_discretizado.position_list[j+1], recorrido_discretizado.position_list[j+2])
            var tg = vec3.fromValues(recorrido_discretizado.tang_list[j],recorrido_discretizado.tang_list[j+1],recorrido_discretizado.tang_list[j+2])
            var binormal = vec3.create()
            vec3.cross(binormal, tg, nm) //producto vectorial entre tangente y normal

            for (var i = 0; i<(forma_discretizada.position_list.length); i+=3){
                var forma_pos = vec3.fromValues(forma_discretizada.position_list[i],forma_discretizada.position_list[i+1],forma_discretizada.position_list[i+2])
                
                var aux1 = vec3.create() 
                var aux2 = vec3.create() 
                var aux3 = vec3.create();

                vec3.scale(aux1, nm, forma_pos[0]) 
                vec3.scale(aux2, binormal,forma_pos[1])
                vec3.scale(aux3, tg, forma_pos[2])

                var new_forma_pos = vec3.create()
                vec3.add(new_forma_pos, new_forma_pos, punto_recorrido)
                vec3.add(new_forma_pos, new_forma_pos, aux1)
                vec3.add(new_forma_pos, new_forma_pos, aux2)
                vec3.add(new_forma_pos, new_forma_pos, aux3)

                pos_buffer.push(new_forma_pos[0])
                pos_buffer.push(new_forma_pos[1])
                pos_buffer.push(new_forma_pos[2])



                var forma_tg = vec3.fromValues(forma_discretizada.tang_list[i],forma_discretizada.tang_list[i+1],forma_discretizada.tang_list[i+2])
                vec3.scale(aux1, nm, forma_tg[0]) 
                vec3.scale(aux2, binormal,forma_tg[1])
                vec3.scale(aux3, tg, forma_tg[2])
                var new_forma_tg = vec3.create()
                vec3.add(new_forma_tg, new_forma_tg, aux1)
                vec3.add(new_forma_tg, new_forma_tg, aux2)
                vec3.add(new_forma_tg, new_forma_tg, aux3)
                var sup_normal = vec3.create()
                vec3.cross(sup_normal, new_forma_tg, tg)
                vec3.normalize(sup_normal,sup_normal)
                normal_buffer.push(sup_normal[0])
                normal_buffer.push(sup_normal[1])
                normal_buffer.push(sup_normal[2])

                // codigo solamente por si se quiere dibujar normales
                normallines_pos_buffer.push(pos_buffer.at(-3))
                normallines_pos_buffer.push(pos_buffer.at(-2))
                normallines_pos_buffer.push(pos_buffer.at(-1))
                normallines_pos_buffer.push(pos_buffer.at(-3) + normal_buffer.at(-3))
                normallines_pos_buffer.push(pos_buffer.at(-2) + normal_buffer.at(-2))
                normallines_pos_buffer.push(pos_buffer.at(-1) + normal_buffer.at(-1))

                normallines_normal_buffer.push(1)
                normallines_normal_buffer.push(1)
                normallines_normal_buffer.push(1)
                normallines_normal_buffer.push(1)
                normallines_normal_buffer.push(1)
                normallines_normal_buffer.push(1)
                //

            }
        }

        var webgl_position_buffer = gl.createBuffer();
        webgl_position_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos_buffer), gl.STATIC_DRAW);

        
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        //
        var webgl_normallinesposition_buffer = gl.createBuffer();
        webgl_normallinesposition_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normallinesposition_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normallines_pos_buffer), gl.STATIC_DRAW);

        
        var webgl_normallinesnormals_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normallinesnormals_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normallines_normal_buffer), gl.STATIC_DRAW);
        webgl_normallinesnormals_buffer.itemSize = 3;
        //

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_normallinesposition_buffer,
            webgl_normallinesnormals_buffer,
        }
    }

                        
}


function obtenerDiscretizacionCurva(curva, cantidad_puntos_a_discretizar){
    var position_list = []
    var tang_list = []
    
    let auxn = (cantidad_puntos_a_discretizar -1)
    for (let i = 0; i <= auxn; i++){
        punto = curva.evaluarPunto(i/auxn)
        position_list.push(punto[0])
        position_list.push(punto[1])
        position_list.push(punto[2])

        if (i == 0){
            p0 = punto;
        } else {
            p0 = curva.evaluarPunto((i-0.01)/auxn);
        }
        if (i == 1){
            p1 = punto
        } else {
            p1 = curva.evaluarPunto((i+0.01)/auxn)
        }
        tang_vec = vec3.create()
        vec3.sub(tang_vec,p1,p0)  
        vec3.normalize(tang_vec,tang_vec)
        tang_list.push(tang_vec[0])
        tang_list.push(tang_vec[1])
        tang_list.push(tang_vec[2])
    }

    return {position_list, tang_list}
}