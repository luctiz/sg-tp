function obtenerDiscretizacionCurvaParametrizada(curva, cantidad_puntos_a_discretizar){
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

class GeometriaCurva{
    constructor(pos,normal,index){
        this.pos=pos;
        this.normal=normal;
        this.index=index;
    }

    bind(){
        var webgl_position_buffer = gl.createBuffer();
        webgl_position_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pos), gl.STATIC_DRAW);

        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        var indexBuffer = gl.createBuffer();
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = this.index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index), gl.STATIC_DRAW); 

        var vertexBuffer = {webgl_position_buffer,webgl_normal_buffer}//,webgl_uvs_buffer}

        return {
            vertexBuffer,
            indexBuffer,
        }
    }

}

class Geometria{ //geometria superficie
    constructor(pos,normal,uv,index, cant_columnas){
        this.pos=pos;
        this.normal=normal;
        this.uv=uv;
        this.index=index;
        this.cant_columnas=cant_columnas


        // calculo centro de masa (para luego verificar que las normales queden apuntando afuera)
        this.centro = [0,0,0];
        var i;
        for (i = 0; i<(this.pos.length); i+=3){
            this.centro[0]+=this.pos[i]
            this.centro[1]+=this.pos[i+1]
            this.centro[2]+=this.pos[i+2]
        }
        this.centro[0]/=(this.pos.length / 3)
        this.centro[1]/=(this.pos.length / 3)
        this.centro[2]/=(this.pos.length / 3)

        this._verificarNormales();
    }

    agregarColumnasTapas(suavizar = false){
        var rows = (this.pos.length/3)/this.cant_columnas;
        var cols = this.cant_columnas


        //quedarme con las 2 columnas, primera y ultima
        var new_col1 = []
        var new_col2 = []
        for (var i=0; i<rows; i++){
            new_col1.push(...[this.pos[i*cols*3], this.pos[i*cols*3 +1], this.pos[i*cols*3 + 2]])
            new_col2.push(...[this.pos[((i*cols)+cols-1)*3], this.pos[((i*cols)+cols-1)*3 +1], this.pos[((i*cols)+cols-1)*3 + 2]])
        }

        ////// obtener normal tapas
        // asumo que la superficie tiene al menos 3 puntos por fila, de lo contrario crear una pared como fila no tendria sentido.
        var v0 =vec3.create()
        var v1 = vec3.create()
        var nm1 = vec3.create()
        var nm2 = vec3.create()

        var p0 = vec3.fromValues(new_col1[0],new_col1[0+1],new_col1[0+2])
        var p1 = vec3.fromValues(new_col1[0+3],new_col1[0+4],new_col1[0+5])

        var p2 = vec3.fromValues(new_col1[0+6],new_col1[0+7],new_col1[0+8]) 
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_col1[3+6],new_col1[3+7],new_col1[3+8])
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm1,v0,v1)
        vec3.normalize(nm1,nm1)

        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm1, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm1,nm1,-1)
        }
        
        /// normal segunda tapa:
        var p0 = vec3.fromValues(new_col2[0],new_col2[0+1],new_col2[0+2])
        var p1 = vec3.fromValues(new_col2[0+3],new_col2[0+4],new_col2[0+5])
        var p2 = vec3.fromValues(new_col2[3+6],new_col2[3+7],new_col2[3+8])
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_col2[3+6],new_col2[3+7],new_col2[3+8])
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm2,v0,v1)
        vec3.normalize(nm2,nm2)

        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm2, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm2,nm2,-1)
        }
        /////////
        for (var i=0;i<rows; i+=1) {
            this.pos.splice(i*(cols+1)*3,0,...[new_col1[(3*i)],new_col1[(3*i)+1],new_col1[(3*i)+2]])
            this.normal.splice(i*(cols+1)*3,0,...[nm1[0],nm1[1],nm1[2]])
        }
        //  

        cols+=1

        for (var i=0;i<rows; i+=1) {
            this.pos.splice( (i*(cols+1) + cols) *3 , 0, ...[new_col2[(3*i)],new_col2[(3*i)+1],new_col2[(3*i)+2]])
            this.normal.splice( (i*(cols+1) + cols) *3 , 0, ...[nm2[0],nm2[1],nm2[2]])
        }

        //actualizo index
        cols+=1;
        var index=[];
        
        for (var j=2; j<rows-1;j++){
            index.push(0);
            index.push((cols)*(j-1));
            index.push((cols)*j);
        }

        for (var i=0;i<rows-1;i++){
            index.push(i*cols);
            for (var j=1;j<cols-2;j++){ //salteo primer y ultima columna ya que van a ser tapas.
                index.push(i*cols+j);
                index.push((i+1)*cols+j);
                index.push(i*cols+j+1);
                index.push((i+1)*cols+j+1);
            }
            index.push((i+1)*cols+cols-1);
        }

        for (var j=2; j<rows-1;j++){
            index.push(cols-1+0);
            index.push(cols-1+(cols)*(j-1));
            index.push(cols-1+(cols)*j);
        }
        this.index=index;
    }

    agregarFilasTapas(suavizar = false){ //creo que el parametro suavizar no es necesario en este caso?
        var rows = (this.pos.length/3)/this.cant_columnas;
        var cols = this.cant_columnas
        
        var new_row1= this.pos.slice(0,cols*3)
        var new_row2 = this.pos.slice(cols*3*(rows-1))

        ////// obtener normal tapas
        // asumo que la superficie tiene al menos 3 puntos por fila, de lo contrario crear una pared como fila no tendria sentido.
        var v0 =vec3.create()
        var v1 = vec3.create()
        var nm1 = vec3.create()
        var nm2 = vec3.create()

        var p0 = vec3.fromValues(new_row1[0],new_row1[0+1],new_row1[0+2])
        var p1 = vec3.fromValues(new_row1[0+3],new_row1[0+4],new_row1[0+5])

        var p2 = vec3.fromValues(new_row1[0+6],new_row1[0+7],new_row1[0+8]) 
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_row1[3+6],new_row1[3+7],new_row1[3+8]) // para el de los paneles, ya que uno curvas y en la union los puntos se repiten
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm1,v0,v1)
        vec3.normalize(nm1,nm1)

        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm1, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm1,nm1,-1)
        }
        
        /// normal segunda tapa:
        var p0 = vec3.fromValues(new_row2[0],new_row2[0+1],new_row2[0+2])
        var p1 = vec3.fromValues(new_row2[0+3],new_row2[0+4],new_row2[0+5])
        var p2 = vec3.fromValues(new_row2[3+6],new_row2[3+7],new_row2[3+8])
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_row2[3+6],new_row2[3+7],new_row2[3+8])
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm2,v0,v1)
        vec3.normalize(nm2,nm2)

        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm2, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm2,nm2,-1)
        }
        /////////
        this.pos.unshift(...new_row1)
        this.pos.push(...new_row2)

        for (var i= 0; i<cols; i++){
            this.normal.unshift(...[nm1[0],nm1[1],nm1[2]])
            this.normal.push(...[nm2[0],nm2[1],nm2[2]])
        }

        //actualizo index
        for (var j=0; j<this.index.length;j++){
            this.index[j]+=cols;
        }

        for (var j=0; j<cols-2;j++){
            this.index.unshift(0);
            this.index.unshift(j+1);
            this.index.unshift(j+2);
        }

        for (var j=0; j<cols-2;j++){
            this.index.push(((rows+1)*(cols)));
            this.index.push(((rows+1)*(cols)) +j+1);
            this.index.push(((rows+1)*(cols))+j+2);
        } 
    }

    obtenerGeometriaNormales(){
        // codigo solamente por si se quiere dibujar normales
        var normallines_pos = []
        var normallines_normal = []
        for (var i = 3; i<=(this.pos.length); i+=3){
            normallines_pos.push(this.pos.at(i-3))
            normallines_pos.push(this.pos.at(i-2))
            normallines_pos.push(this.pos.at(i-1))
            normallines_pos.push(this.pos.at(i-3) + this.normal.at(i-3))
            normallines_pos.push(this.pos.at(i-2) + this.normal.at(i-2))
            normallines_pos.push(this.pos.at(i-1) + this.normal.at(i-1))

            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
        }

        var index=[]
        var cant_puntos = (this.pos.length)

        for (var i = 0; i < (cant_puntos); i+=2){
            index.push(i)
            index.push(i+1)
        }
        
        return new GeometriaCurva(normallines_pos,normallines_normal, index)
    }


    // funcion para corregir normales si quedan apuntando hacia adentro
    _verificarNormales(){
        //veo si la normal del primer punto apunta hacia el centro. Si apunta para el lado contrario entonces invierto todas las normales
        var aux_normal = vec3.fromValues(this.normal[0],this.normal[1],this.normal[2])
        vec3.normalize(aux_normal,aux_normal)

        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-this.pos[0],
            this.centro[1]-this.pos[1],
            this.centro[2]-this.pos[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        // Producto escalar para ver si tienen misma direccion
        var x = vec3.dot(aux_normal, aux_vecdir_to_center)
        if (x > 0) {
            for (var i = 0; i<this.pos.length; i+=1){
                this.normal[i] = -this.normal[i]
            }
        }
        //
    } 

    bind(){
        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pos), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.pos.length / 3;

        /*var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.uv.length / 2;*/

        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.normal.length / 3;

        var indexBuffer = gl.createBuffer();
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = this.index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index), gl.STATIC_DRAW);  

        var vertexBuffer = {webgl_position_buffer,webgl_normal_buffer}//,webgl_uvs_buffer}
        return {vertexBuffer, indexBuffer}
    }
}

class ModuloGeometria {
    static obtenerGeometriaSuperficieParametrizada(superficie, filas, columnas){
        var vertex = this._getVertexBufferSuperficieParametrizada(superficie,filas,columnas);
        var index = this._getIndexBuffer(filas,columnas)
        return new Geometria(vertex.pos,vertex.normal,null,index,columnas)
    }

    static obtenerGeometriaSuperficieBarrido(forma_discretizada, recorrido_discretizado, tapas=-1){
        var vertex = this._getVertexBufferSuperficieBarrido(forma_discretizada,recorrido_discretizado)
        var columnas = forma_discretizada.position_list.length / 3
        var filas = recorrido_discretizado.position_list.length / 3
        var index = this._getIndexBuffer(filas, columnas)

        return new Geometria(vertex.pos,vertex.normal,null,index, columnas)
    }

    static _getVertexBufferSuperficieParametrizada(superficie, rows,cols)
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
            return {pos,uv,normal}
        }
    static _getIndexBuffer(rows,cols){
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
            return index;
    }

    static _getVertexBufferSuperficieBarrido(forma_discretizada,recorrido_discretizado){

        var pos = []
        var normal = []

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

                pos.push(new_forma_pos[0])
                pos.push(new_forma_pos[1])
                pos.push(new_forma_pos[2])


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
                normal.push(sup_normal[0])
                normal.push(sup_normal[1])
                normal.push(sup_normal[2])
            }
        }

        return {
            pos,
            normal,
        }
    }

    
    static _getIndexBufferTangentesCurvaDiscretizada(position_buffer_length){
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



    static obtenerGeometriaCurvaParametrizada(curva, cant_puntos){
        var vertexBuffer = this._getVertexBufferCurva(curva,cant_puntos);
        var indexBuffer = this._getIndexBufferCurva(cant_puntos)
        return {vertexBuffer, indexBuffer}
    }


    static obtenerGeometriaTangentesCurvaDiscretizada(curva_discretizada){
        var vertexBuffer = this._getVertexBufferTangentesCurvaDiscretizada(curva_discretizada);
        var indexBuffer = this._getIndexBufferTangentesCurvaDiscretizada(curva_discretizada.position_list.length * 2 / 3)
        return {vertexBuffer, indexBuffer}
    }


    static _getVertexBufferTangentesCurvaDiscretizada(curva_discretizada)
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

    static _getVertexBufferCurvaParametrizada(curva, cant_puntos)
    {
        var discretizacion = obtenerDiscretizacionCurvaParametrizada(curva,cant_puntos)

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
}