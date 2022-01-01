    function obtenerViewMatrixFirstPerson(o_camara)
    {   
        var mat = o_camara.getMatTransformations();
        var vec_position = vec3.create();
        mat4.getTranslation(vec_position,mat);

        var vec_direccion = vec3.fromValues(radio * Math.cos(alfa) * Math.sin(beta) ,radio * Math.sin(alfa) * Math.sin(beta), radio * Math.cos(beta));	
        vec3.transformMat4(vec_direccion, vec_direccion, mat)

        var vec3upvector = vec3.fromValues(0,0,1)
        vec3.transformMat4(vec3upvector, vec3upvector, mat)
        vec3.sub(vec3upvector,vec3upvector,vec_position)
        //

        var result = mat4.create()
        mat4.lookAt(result, vec_position, vec_direccion, vec3upvector)

        //setear curva vista:
        vec3.add(vec3upvector,vec3upvector,vec_position)

        vista_pos_buffer = [vec_position[0],vec_position[1],vec_position[2],vec_direccion[0],vec_direccion[1],vec_direccion[2],vec_position[0],vec_position[1],vec_position[2],vec3upvector[0],vec3upvector[1],vec3upvector[2]]
        console.log(vista_pos_buffer)
        var webgl_position_buffer = gl.createBuffer();
        webgl_position_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vista_pos_buffer), gl.STATIC_DRAW);

        vista_nm_buffer = [1,1,1,1,1,1,1,1,1,1,1,1]
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vista_nm_buffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        vista_idx_buffer = [0,1,2,3]
        var vidxbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vidxbuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vista_idx_buffer), gl.STATIC_DRAW);
        vidxbuffer.itemSize = 1;
        vidxbuffer.numItems = 4;

        curva_vista.setGeometria({webgl_position_buffer,webgl_normal_buffer}, vidxbuffer)
        
        return result
    }



    /*function testScene() {
    esferaRara = new Esfera(4);
    objeto_principal = new Objeto3D()

    geometria = ModuloGeometria.obtenerGeometriaSuperficieParametrizada(esferaRara,100,100)
    objeto_principal.setGeometria(geometria)
    objeto_principal.addTraslacion(0,10,0);
    objeto_principal.setColor(0,1,0);

    poligono_control=[vec3.fromValues(1,0,0), vec3.fromValues(0,3,0), vec3.fromValues(-1,0,0)]
    curva_forma = new CurvaCircunferencia(1,[0,0,1.57])//new CurvaBezier(poligono_control);


    poligono_control=[vec3.fromValues(0,0,8),vec3.fromValues(0,0,-8)]
    curva_recorrido = new CurvaBezier(poligono_control);//new CurvaCircunferencia(3,[0,0,0])//////

    discretizacion_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma, 10)
    discretizacion_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido, 2)


    objeto_forma = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaCurvaParametrizada(curva_forma, 15)
    objeto_forma.setGeometria(geometria)
    objeto_forma.setColor(1,0,0)
    objeto_forma.addTraslacion(0,-10,0)

    //
    objeto_tangentes_forma = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaTangentesCurvaParametrizada(discretizacion_forma);
    objeto_tangentes_forma.setGeometria(geometria)
    objeto_tangentes_forma.setColor(1,0,0)
    objeto_forma.agregarHijo(objeto_tangentes_forma)
    //


    objeto_recorrido = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaCurvaParametrizada(curva_recorrido, 20)
    objeto_recorrido.setGeometria(geometria)
    objeto_recorrido.setColor(0,1,0)


    //
    objeto_tangentes_recorrido = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaTangentesCurvaParametrizada(discretizacion_recorrido);
    objeto_tangentes_recorrido.setGeometria(geometria)
    objeto_tangentes_recorrido.setColor(0.5,1,0.5)
    objeto_recorrido.agregarHijo(objeto_tangentes_recorrido)
    //

    objeto_forma.agregarHijo(objeto_recorrido)

    objeto_principal.agregarHijo(objeto_forma)


    superficie_barrido = new Objeto3D()
    geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(discretizacion_forma, discretizacion_recorrido)
    superficie_barrido.setGeometria(geometria)
    superficie_barrido.setColor(0,1,1)
    superficie_barrido.addTraslacion(0,-10,0)

    normales_sup_barrido = new ObjetoCurva3D()
    normales_sup_barrido.setGeometria(geometria.normalVertexBuffer, geometria.normalIndexBuffer)
    normales_sup_barrido.setColor(1,1,1)
    superficie_barrido.agregarHijo(normales_sup_barrido)
    objeto_principal.agregarHijo(superficie_barrido)




    p_control = [[-1.8,0,0],[0,1,0],[1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,15)

    
    curva_recorrido = new CurvaCircunferencia(2.0,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)


    superficie_barrido = new Objeto3D()
    geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    superficie_barrido.setGeometria(geometria)
    superficie_barrido.setColor(0,1,1)
    superficie_barrido.addTraslacion(0,-10,0)
    

    normales_sup_barrido = new ObjetoCurva3D()
    normales_sup_barrido.setGeometria(geometria.normalVertexBuffer, geometria.normalIndexBuffer)
    normales_sup_barrido.setColor(1,1,1)
    superficie_barrido.agregarHijo(normales_sup_barrido)
    objeto_principal.agregarHijo(superficie_barrido)

    var capsula = new Objeto3DControlable()

    camera3 = capsula
    objeto_principal.agregarHijo(capsula)


    return objeto_principal
}*/
