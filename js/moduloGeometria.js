var modo = "smooth"
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
            var normal_secuencia = discretizacion.normal_list


            var curve_position_buffer = gl.createBuffer();
            curve_position_buffer.itemSize = 3;
            gl.bindBuffer(gl.ARRAY_BUFFER, curve_position_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curva_secuencia), gl.STATIC_DRAW);

            var curve_normal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, curve_normal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_secuencia), gl.STATIC_DRAW);
            curve_normal_buffer.itemSize = 3;
            
            var webgl_position_buffer = curve_position_buffer
            var webgl_normal_buffer = curve_normal_buffer

            return {
                webgl_position_buffer,
                webgl_normal_buffer,
            }
        }
        static _getIndexBufferCurva(cant_puntos){
            var curve_index=[]

            curve_index.push(0)
            for (i = 1; i < cant_puntos -1; i++){
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

                        
}