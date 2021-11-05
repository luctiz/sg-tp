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
        return {vertexBuffer, indexBuffer}
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

        for (i = 0; i < position_buffer_length; i++){
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

        var p0 = vec3.fromValues(recorrido_discretizado.position_list[0],position_list[0+1],position_list[0+2])
        var p1 = vec3.fromValues(recorrido_discretizado.position_list[0+3],position_list[0+4],position_list[0+5])
        var p2 = vec3.fromValues(recorrido_discretizado.position_list[0+6],position_list[0+7],position_list[0+8])

        var v0 =vec3.create()
        var v1 = vec3.create()
        var nm = vec3.create()

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm,v0,v1)
        vec3.normalize(nm,nm)

        for (var j = 0; j<(recorrido_discretizado.position_list.length); j+=3){
            var punto_recorrido = vec3.fromValues(recorrido_discretizado.position_list[j],position_list[j+1],position_list[j+2])
            var tg = vec3.fromValues(recorrido_discretizado.tang_list[j],recorrido_discretizado.tang_list[j+1],recorrido_discretizado.tang_list[j+2])
            for (var i = 0; i<(forma_discretizada.position_list.length); i+=3){
                var position = vec3.fromValues(forma_discretizada.position_list[i],forma_discretizada.position_list[i+1],forma_discretizada.position_list[i+2])
                
                var aux1 = vec3.create() 
                vec3.scale(aux1, nm, position[0]) 


                var aux2 = vec3.create() 
                vec3.cross(aux2, tg, nm) //producto vectorial entre tangente y normal
                
                normal_buffer.push(aux2[0])
                normal_buffer.push(aux2[1])
                normal_buffer.push(aux2[2])
                
                vec3.scale(aux2, aux2,position[1])

                var aux3 = vec3.create();
                vec3.scale(aux3, tg, position[2])

                var new_position = vec3.fromValues(0,0,0);
                vec3.add(new_position, new_position, punto_recorrido)
                vec3.add(new_position, new_position, aux1)
                vec3.add(new_position, new_position, aux2)
                vec3.add(new_position, new_position, aux3)

                pos_buffer.push(new_position[0])
                pos_buffer.push(new_position[1])
                pos_buffer.push(new_position[2])
            }
        }
        console.log(pos_buffer)
        console.log(pos_buffer.length / (recorrido_discretizado.position_list.length)) 

        var webgl_position_buffer = gl.createBuffer();
        webgl_position_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos_buffer), gl.STATIC_DRAW);

        
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_buffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
        }
    }

                        
}