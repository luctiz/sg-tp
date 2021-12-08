function testScene() {
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
}


function geometriaNucleoModuloVioleta(puntos_curvatura){

    p_control = [[-1,-0.5,0],[-1,-1,0],[-0.5,-1,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_modulo_violeta = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)

    p_control = [[-0.5, -1,0],[0.5,-1,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0.5,-1,0],[1,-1,0],[1,-0.5,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[1, -0.5,0],[1,0.5,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)
    

    p_control = [[1,0.5,0],[1,1,0],[0.5,1,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[0.5, 1,0],[-0.5,1,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[-0.5,1,0],[-1,1,0],[-1,0.5,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[-1, 0.5,0],[-1,-0.5,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0,0,-1],[0,0,1]]
    curva_recorrido = new CurvaBezier(p_control)
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_modulo_violeta, disc_curva_recorrido)
    geometria.agregarFilasTapas()
    return geometria
}

function geometriaNucleoCuerpo(puntos_curvatura){

    p_control = [[-2.5,-0.2,0],[-2.0,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)


    p_control = [[-1.8,0,0],[1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[2.0,0,0],[2.5,-0.2,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma3 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma3.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma3.tang_list)

    
    curva_recorrido = new CurvaCircunferencia(2.8,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()
    return geometria
}

function geometriaNucleoCabeza(puntos_curvatura){

    p_control = [[-1.8,0,0],[0,1,0],[1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,puntos_curvatura)

    
    curva_recorrido = new CurvaCircunferencia(2.0,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()
    return geometria
}

function geometriaBaseAnillo(){

    p_control = [[-0.5,-0.2,0],[-0.3,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    p_control = [[-0.3,0,0],[0.3,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[0.3,0,0],[0.5,-0.2,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma3 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma3.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma3.tang_list)

    
    curva_recorrido = new CurvaCircunferencia(3.8,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()
    return geometria
}


function geometriaAnillo(){

    curva_forma = new CurvaCircunferencia(1,[0,0,0])
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,12)
    
    curva_recorrido = new CurvaCircunferencia(16.8,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,36)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido, new UVMapping(0,0,1,1,0.10, 10))
}

function geometriaVigaSoporteAnillo(){

    p_control = [[-0.1, -0.05 ,0],[-0.1, 0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)


    p_control = [[-0.1, 0.05 ,0],[0.1, 0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[0.1, 0.05 ,0],[0.1, -0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[0.1, -0.05 ,0],[-0.1, -0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[3.7, 0 ,0],[16,0,0]]
    curva_recorrido = new CurvaBezier(p_control)

    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,30)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)

}

function geometriaTuboVigaAnillo(){

    curva_forma = new CurvaCircunferencia(0.05,[0,0,0])
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,4)

    p_control = [[-0.4, -0.8 ,0],[0.4,0.8,0]]
    curva_recorrido = new CurvaBezier(p_control)

    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
}

function geometriaAnilloAgarreSoporte(cant_modulos,puntos_curvatura){

    let hor_scale = 2.5;
    let ver_scale = 1.2;
    p_control = [[-1*hor_scale,-0.5*ver_scale,0],[-1*hor_scale,-1*ver_scale,0],[-0.5*hor_scale,-1*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_modulo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)

    p_control = [[-0.5*hor_scale, -1*ver_scale,0],[0.5*hor_scale,-1*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0.5*hor_scale,-1*ver_scale,0],[1*hor_scale,-1*ver_scale,0],[1*hor_scale,-0.5*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[1*hor_scale, -0.5*ver_scale,0],[1*hor_scale,0.5*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)
    

    p_control = [[1*hor_scale,0.5*ver_scale,0],[1*hor_scale,1*ver_scale,0],[0.5*hor_scale,1*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[0.5*hor_scale, 1*ver_scale,0],[-0.5*hor_scale,1*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[-0.5*hor_scale,1*ver_scale,0],[-1*hor_scale,1*ver_scale,0],[-1*hor_scale,0.5*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[-1*hor_scale, 0.5*ver_scale,0],[-1*hor_scale,-0.5*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)


    curva_recorrido = new CurvaCircunferencia(16.8,[0,0,0],Math.PI/(cant_modulos))
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,7)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_modulo, disc_curva_recorrido)
    geometria.agregarFilasTapas()
    return geometria
}

function geometriaTuboSoportePaneles(cant_paneles){
    p_control = [[0,0,0],[-5 - 5*cant_paneles,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    
    curva_recorrido = new CurvaCircunferencia(0.5,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,9)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()
    return geometria
}

function geometriaTuboFilaPaneles(){
    curva_forma = new CurvaCircunferencia(0.2,[0,0,0])
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,6)

    p_control = [[-10,0,0],[10,0,0]]
    curva_recorrido = new CurvaBezier(p_control)
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarFilasTapas()
    return geometria
}

function geometriaPanel(){
    grosor_panel = 0.05
    ancho_panel = 2
    largo_panel = 5
    p_control = [[-grosor_panel,ancho_panel,0],[grosor_panel,ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    p_control = [[grosor_panel,ancho_panel,0],[grosor_panel,-ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[grosor_panel,-ancho_panel,0],[-grosor_panel,-ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[-grosor_panel,-ancho_panel,0],[-grosor_panel,ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[-largo_panel,0,0],[largo_panel,0,0]]
    curva_recorrido = new CurvaBezier(p_control)
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarFilasTapas()
    return geometria
}

function geometriaCuerpoCapsula(){

    p_control = [[-2.2,-1,0],[-2.0,-0.2,0],[-1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,4)

    p_control = [[-1.8,0,0],[0,0,0],[1.8,-1,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,8)

    //suavizo union de curvas promediando las tangentes en el punto de interseccion de la curva:
    var aux_l = disc_curva_forma.tang_list.length

    var mean_normal = vec3.fromValues(
        disc_curva_forma.tang_list[aux_l-3],
        disc_curva_forma.tang_list[aux_l-2],
        disc_curva_forma.tang_list[aux_l-1])
    vec3.add(mean_normal, mean_normal, vec3.fromValues(
        disc_curva_forma2.tang_list[0],
        disc_curva_forma2.tang_list[1],
        disc_curva_forma2.tang_list[2]))
    vec3.scale(mean_normal,mean_normal,0.5)

    disc_curva_forma.tang_list[aux_l-3] = mean_normal[0]
    disc_curva_forma.tang_list[aux_l-2] = mean_normal[1]
    disc_curva_forma.tang_list[aux_l-1] = mean_normal[2]
    disc_curva_forma2.tang_list[0] = mean_normal[0]
    disc_curva_forma2.tang_list[1] = mean_normal[1]
    disc_curva_forma2.tang_list[2] = mean_normal[2]

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)
    


    curva_recorrido = new CurvaCircunferencia(2.5,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)
    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()

    return geometria
}

function geometriaCabezaCapsula(){
    p_control = [[1.8,0,0],[2.4,-0.2,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    
    curva_recorrido = new CurvaCircunferencia(1.3,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()
    return geometria
}

function geometriaPropulsorCapsula(){
    //p_control = [[-2.2,0,0],[-2.2,0.3,0],[-4,0.8,0]]
    //curva_forma = new CurvaBezier(p_control)
    //disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,10)

    p_control = [[-2.2,0.01,0],[-2.2,0.31,0],[-4,0.81,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,10)


    p_control = [[-4,0.81,0],[-4.01,0.8,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)



    p_control = [[-4.01,0.8,0],[-2.21,0.3,0],[-2.21,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,10)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[-2.21,0,0],[-2.2,0.01,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)


    
    curva_recorrido = new CurvaCircunferencia(0.3,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
}

var camera1;
var camera2;
var camera3;

function mainScene(){

    nodo_principal = new Objeto3D()
    
    var puntos_curvatura_modulo_violeta = 6
    
    // nucleo
    nucleo = new Objeto3D()

    modulo_cuerpo = new Objeto3D()
    geometria = geometriaNucleoCuerpo()
    modulo_cuerpo.setGeometria(geometria)
    modulo_cuerpo.setColor(0.83,0.63,0.33)
    modulo_cuerpo.addTraslacion(0,0,0)
    nucleo.agregarHijo(modulo_cuerpo)

    modulo_cuerpo2 = new Objeto3D()
    modulo_cuerpo2.setGeometria(geometria)
    modulo_cuerpo2.setColor(0.83,0.63,0.33)
    modulo_cuerpo2.addTraslacion(0,0,-7)
    nucleo.agregarHijo(modulo_cuerpo2)

    modulo_violeta = new Objeto3D()
    geometria = geometriaNucleoModuloVioleta(puntos_curvatura_modulo_violeta)
    modulo_violeta.setGeometria(geometria)
    modulo_violeta.setColor(0.97,0.08,1.00)
    modulo_violeta.addTraslacion(0,0,3.5)
    nucleo.agregarHijo(modulo_violeta)

    modulo_violeta2 = new Objeto3D()
    modulo_violeta2.setGeometria(geometria)
    modulo_violeta2.setColor(0.97,0.08,1.00)
    modulo_violeta2.addTraslacion(0,0,-3.5)
    nucleo.agregarHijo(modulo_violeta2)
    nucleo.agregarHijo(modulo_violeta2)

    modulo_cabeza = new Objeto3D()
    geometria = geometriaNucleoCabeza(15)
    modulo_cabeza.setGeometria(geometria)
    modulo_cabeza.setTexture(textures.modulo_esferico)
    modulo_cabeza.setColor(0.83,0.63,0.33)
    modulo_cabeza.addTraslacion(0,0,6.3)
    nucleo.agregarHijo(modulo_cabeza)


    //
    // anillo animado
    base_anillo = new Objeto3D()
    geometria = geometriaBaseAnillo()
    base_anillo.setGeometria(geometria)
    base_anillo.addRotacionSegunVariablePorTiempo(Math.PI/5,0,0,1,velocidad_rotacion_anillo)


    //camara 1
    camara_centro = new Objeto3D()
    camara_centro.addTraslacion(5,0,5)
    base_anillo.agregarHijo(camara_centro)
    camera1 = camara_centro;
    //

    base_anillo.setColor(0.58,0.83,0.26)

    color_viga = [0.5,0.5,0.5]
    for (var i = 0; i < cantidad_modulos_anillo; i++){
        var objeto_viga = new Objeto3D()

        var viga_soporte_anillo = new Objeto3D()
        geometria = geometriaVigaSoporteAnillo()
        viga_soporte_anillo.setGeometria(geometria)
        viga_soporte_anillo.setTexture(textures.createSolidTexture(color_viga[0],color_viga[1],color_viga[2],1))

        //viga_soporte_anillo.setColor(0.90,0.70,0.40)
        viga_soporte_anillo.addTraslacion(0,0.8,0)
        viga_soporte_anillo.addRotacion(Math.PI*3/4,1,0,0)
        objeto_viga.agregarHijo(viga_soporte_anillo)

        var viga_soporte_anillo2 = new Objeto3D()
        viga_soporte_anillo2.setGeometria(geometria)
        viga_soporte_anillo2.setTexture(textures.createSolidTexture(color_viga[0],color_viga[1],color_viga[2],1))

        //viga_soporte_anillo2.setColor(0.90,0.70,0.40)
        viga_soporte_anillo2.addTraslacion(0,-0.8,0)
        viga_soporte_anillo2.addRotacion(Math.PI*3/4,1,0,0)
        objeto_viga.agregarHijo(viga_soporte_anillo2)


        //tubos pequeños entre viga
        for (var j = 0; j < 15; j++){
            var tubo_viga = new Objeto3D()
            geometria = geometriaTuboVigaAnillo()
            tubo_viga.setGeometria(geometria)
            //tubo_viga.setColor(0.90,0.70,0.40)
            tubo_viga.setTexture(textures.createSolidTexture(color_viga[0],color_viga[1],color_viga[2],1))
            tubo_viga.addRotacion(Math.PI*((j % 2)),1,0,0)

            tubo_viga.addTraslacion(j*(0.8)+4,0,0)
            objeto_viga.agregarHijo(tubo_viga)
        }

        var agarre_soporte_anillo = new Objeto3D()
        geometria = geometriaAnilloAgarreSoporte(cantidad_modulos_anillo,3)
        agarre_soporte_anillo.setGeometria(geometria)
        agarre_soporte_anillo.setColor(0.75,1.00,0.98)
        agarre_soporte_anillo.addRotacion( (-Math.PI/(2*cantidad_modulos_anillo)),0,0,1)
        objeto_viga.addRotacion((2*i*Math.PI)/(cantidad_modulos_anillo),0,0,1)
        objeto_viga.agregarHijo(agarre_soporte_anillo)

        base_anillo.agregarHijo(objeto_viga)

    }

    var anillo = new Objeto3D()
    geometria = geometriaAnillo()
    anillo.setGeometria(geometria)
    anillo.setColor(1,1,0.8)
    anillo.setTexture(textures.anillo)
    base_anillo.agregarHijo(anillo)
    nucleo.agregarHijo(base_anillo)

    // tubo con paneles
    var tubo_soporte_paneles = new Objeto3D()
    geometria = geometriaTuboSoportePaneles(cantidad_filas_paneles)
    tubo_soporte_paneles.setGeometria(geometria)
    tubo_soporte_paneles.setColor(1.0,0.48,1.00)
    tubo_soporte_paneles.addTraslacion(0,0,-2.0)
    modulo_cuerpo2.agregarHijo(tubo_soporte_paneles)

    var tubo_paneles;

    for (var i = 0; i < cantidad_filas_paneles; i++){

        tubo_paneles = new Objeto3D()
        geometria = geometriaTuboFilaPaneles()
        tubo_paneles.setGeometria(geometria)
        tubo_paneles.setColor(0.83,0.63,0.33)
        tubo_paneles.addTraslacion(0,0,-5.0 -5.0 * i)
        tubo_soporte_paneles.agregarHijo(tubo_paneles)

        var panel = new Objeto3D()
        geometria = geometriaPanel()
        panel.setGeometria(geometria)
        panel.setColor(0.83,0.63,0.33)
        panel.addTraslacion(6.5,0.15, 0.15)
        tubo_paneles.agregarHijo(panel)

        var panel = new Objeto3D()
        geometria = geometriaPanel()
        panel.setGeometria(geometria)
        panel.setColor(0.83,0.63,0.33)
        panel.addTraslacion(-6.5,0.15, 0.15)
        tubo_paneles.agregarHijo(panel)

        //angulo_paneles;
        //velocidad_rotacion_anillo;
        tubo_paneles.addRotacionSegunVariable(Math.PI / 180,1,0,0, angulo_paneles)
    }

    var camara_paneles = new Objeto3D()

    camara_paneles.addTraslacion(3,0.5,0.5)
    camara_paneles.addRotacion(7*Math.PI/4,1,0,0)

    tubo_paneles.agregarHijo(camara_paneles) // agrego camara en el ultimo tubo de paneles

    camera2 = camara_paneles
    nodo_principal.agregarHijo(nucleo)


    // fondo 
    // sol
    var sol = new Objeto3D()
    sol.setIluminacionSimple()
    var sup_sol = new Plano(10)
    geometria = ModuloGeometria.obtenerGeometriaSuperficieParametrizada(sup_sol, 2, 2)
    sol.setGeometria(geometria)
    sol.setTexture(textures.sol)
    sol.setColor(1,1,1)
    sol.addRotacionSegunVariable(Math.PI / 180,1,0,0, angulo_sol)
    sol.addTraslacion(posicion_sol[0],posicion_sol[1],posicion_sol[2])
    // deberia agregar rotacion para que siempre mire hacia la tierra
    sol.addEscalado(2000,0,2000)

    nodo_principal.agregarHijo(sol)

    // planeta tierra
    var planeta = new Objeto3D()
    var sup_planeta = new Esfera(15,Math.PI, Math.PI)
    geometria = ModuloGeometria.obtenerGeometriaSuperficieParametrizada(sup_planeta,80,80)
    planeta.setGeometria(geometria)
    planeta.setColor(0.50,0.50,1)
    planeta.setTexture(textures.tierra)

    //planeta.addRotacion(Math.PI, 0,1,0)

    planeta.addEscalado(2000,2000,2000)
    planeta.addRotacion(Math.PI/2,1,0,0)//.addRotacion(-Math.PI/2,1,0,0)

    planeta.addRotacion(Math.PI*3/2,1,0,0)

    planeta.addTraslacion(0,-16, 0)



    nodo_principal.agregarHijo(planeta)


    // capsula
    var capsula = new Objeto3DControlable()
    capsula.addTraslacion(0,0,10)

    var modelo_capsula = new Objeto3D()
    var cuerpoCapsula = new Objeto3D()
    geometria = geometriaCuerpoCapsula()
    cuerpoCapsula.setGeometria(geometria)
    cuerpoCapsula.setColor(0.83,0.63,0.33)
    modelo_capsula.agregarHijo(cuerpoCapsula)

    var cabezaCapsula = new Objeto3D()
    geometria = geometriaCabezaCapsula()
    cabezaCapsula.setGeometria(geometria)
    cabezaCapsula.setColor(0.83,0.63,0.33)
    modelo_capsula.agregarHijo(cabezaCapsula)

    var propulsorCapsula = new Objeto3D()
    geometria = geometriaPropulsorCapsula()
    propulsorCapsula.setGeometria(geometria)
    propulsorCapsula.setTexture(textures.createSolidTexture(0.30,0.30,0.30,1))
    modelo_capsula.agregarHijo(propulsorCapsula)

    capsula.agregarHijo(modelo_capsula)

    modelo_capsula.addRotacion(Math.PI,0,1,0)

    var camera_capsula = new Objeto3D()
    camera_capsula.addRotacion(-Math.PI,0,1,0)
    camera_capsula.addRotacion(Math.PI/6,1,0,0)
    camera_capsula.addRotacion(Math.PI,0,0,1)

    camera_capsula.addTraslacion(0,0,-13)
    capsula.agregarHijo(camera_capsula)
    nodo_principal.agregarHijo(capsula)

    camera3= camera_capsula;
    
    return nodo_principal;

}