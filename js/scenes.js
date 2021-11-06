function testScene() {
    esferaRara = new Esfera(4);
    objeto_principal = new Objeto3D()

    geometria = ModuloGeometria.obtenerGeometriaObjeto3D(esferaRara,100,100)
    objeto_principal.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    objeto_principal.setPosicion(0,10,0);
    objeto_principal.setColor(0,1,0);

    poligono_control=[vec3.fromValues(1,0,0), vec3.fromValues(0,3,0), vec3.fromValues(-1,0,0)]
    curva_forma = new CurvaCircunferencia(1,[0,0,1.57])//new CurvaBezier(poligono_control);


    poligono_control=[vec3.fromValues(0,0,8),vec3.fromValues(0,0,-8)]
    curva_recorrido = new CurvaBezier(poligono_control);//new CurvaCircunferencia(3,[0,0,0])//////

    discretizacion_forma = obtenerDiscretizacionCurva(curva_forma, 10)
    discretizacion_recorrido = obtenerDiscretizacionCurva(curva_recorrido, 2)


    objeto_forma = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaCurva3D(curva_forma, 15)
    objeto_forma.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    objeto_forma.setColor(1,0,0)
    objeto_forma.setPosicion(0,-10,0)

    //
    objeto_tangentes_forma = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaTangentesCurva3D(discretizacion_forma);
    objeto_tangentes_forma.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    objeto_tangentes_forma.setColor(1,0,0)
    objeto_forma.agregarHijo(objeto_tangentes_forma)
    //


    objeto_recorrido = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaCurva3D(curva_recorrido, 20)
    objeto_recorrido.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    objeto_recorrido.setColor(0,1,0)


    //
    objeto_tangentes_recorrido = new ObjetoCurva3D();
    geometria = ModuloGeometria.obtenerGeometriaTangentesCurva3D(discretizacion_recorrido);
    objeto_tangentes_recorrido.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    objeto_tangentes_recorrido.setColor(0.5,1,0.5)
    objeto_recorrido.agregarHijo(objeto_tangentes_recorrido)
    //

    objeto_forma.agregarHijo(objeto_recorrido)

    objeto_principal.agregarHijo(objeto_forma)


    superficie_barrido = new Objeto3D()
    geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(discretizacion_forma, discretizacion_recorrido)
    superficie_barrido.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    superficie_barrido.setColor(0,1,1)
    superficie_barrido.setPosicion(0,-10,0)


    normales_sup_barrido = new ObjetoCurva3D()
    normales_sup_barrido.setGeometria(geometria.normalVertexBuffer, geometria.normalIndexBuffer)
    normales_sup_barrido.setColor(1,1,1)
    superficie_barrido.agregarHijo(normales_sup_barrido)
    objeto_principal.agregarHijo(superficie_barrido)

    return objeto_principal
}


function geometriaNucleoModuloVioleta(puntos_curvatura){

    p_control = [[-1,-0.5,0],[-1,-1,0],[-0.5,-1,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_modulo_violeta = obtenerDiscretizacionCurva(curva_cubo,puntos_curvatura)

    p_control = [[-0.5, -1,0],[0.5,-1,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurva(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0.5,-1,0],[1,-1,0],[1,-0.5,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurva(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[1, -0.5,0],[1,0.5,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurva(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)
    

    p_control = [[1,0.5,0],[1,1,0],[0.5,1,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurva(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[0.5, 1,0],[-0.5,1,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurva(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[-0.5,1,0],[-1,1,0],[-1,0.5,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurva(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[-1, 0.5,0],[-1,-0.5,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurva(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0,0,-1],[0,0,1]]
    curva_recorrido = new CurvaBezier(p_control)
    disc_curva_recorrido = obtenerDiscretizacionCurva(curva_recorrido,2)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_modulo_violeta, disc_curva_recorrido)
}

function geometriaNucleoCuerpo(puntos_curvatura){

    p_control = [[-2.5,-0.2,0],[-2.0,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurva(curva_forma,2)


    p_control = [[-1.8,0,0],[1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurva(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[2.0,0,0],[2.5,-0.2,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma3 = obtenerDiscretizacionCurva(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma3.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma3.tang_list)

    
    curva_recorrido = new CurvaCircunferencia(2.8,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurva(curva_recorrido,20)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
}

function geometriaNucleoCabeza(puntos_curvatura){

    p_control = [[-1.8,0,0],[0,1,0],[1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurva(curva_forma,puntos_curvatura)

    
    curva_recorrido = new CurvaCircunferencia(2.0,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurva(curva_recorrido,20)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
}


function mainScene(){
    var numero_filas_paneles = 2;
    var angulo_paneles = 0;
    var velocidad_rotacion_anillo = 0;
    var cantidad_modulos_anillo = 4;


    nodo_principal = new Objeto3D()

    var puntos_curvatura_modulo_violeta = 5
    
    nucleo = new Objeto3D()


    modulo_cuerpo = new Objeto3D()
    geometria = geometriaNucleoCuerpo()
    modulo_cuerpo.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    modulo_cuerpo.setColor(0.83,0.63,0.33)
    modulo_cuerpo.setPosicion(0,0,0)
    nucleo.agregarHijo(modulo_cuerpo)

    modulo_cuerpo2 = new Objeto3D()
    modulo_cuerpo2.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    modulo_cuerpo2.setColor(0.83,0.63,0.33)
    modulo_cuerpo2.setPosicion(0,0,-7)
    nucleo.agregarHijo(modulo_cuerpo2)

    modulo_violeta = new Objeto3D()
    geometria = geometriaNucleoModuloVioleta(puntos_curvatura_modulo_violeta)
    modulo_violeta.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    modulo_violeta.setColor(0.97,0.08,1.00)
    modulo_violeta.setPosicion(0,0,3.5)
    nucleo.agregarHijo(modulo_violeta)

    modulo_violeta2 = new Objeto3D()
    modulo_violeta2.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    modulo_violeta2.setColor(0.97,0.08,1.00)
    modulo_violeta2.setPosicion(0,0,-3.5)
    nucleo.agregarHijo(modulo_violeta2)
    nucleo.agregarHijo(modulo_violeta2)

    modulo_cabeza = new Objeto3D()
    geometria = geometriaNucleoCabeza(15)
    modulo_cabeza.setGeometria(geometria.vertexBuffer, geometria.indexBuffer)
    modulo_cabeza.setColor(0.83,0.63,0.33)
    modulo_cabeza.setPosicion(0,0,6.3)
    nucleo.agregarHijo(modulo_cabeza)



    nodo_principal.agregarHijo(nucleo)

    return nodo_principal;

}