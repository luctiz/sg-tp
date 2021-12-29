
class UVMapping {
    constructor(){};
    mapBarrido(forma_discretizada, recorrido_discretizado){};
}

class UVMappingSimple extends UVMapping {
    start_u
    start_v
    len_u
    len_v
    u_repeat
    v_repeat
    constructor(start_u = 0, start_v = 0, len_u = 1, len_v = 1, u_repeat = 1, v_repeat = 1){
        super()
        this.start_u = start_u
        this.start_v = start_v
        this.len_u = len_u
        this.len_v = len_v
        this.u_repeat = u_repeat
        this.v_repeat = v_repeat
    }

    mapBarrido(forma_discretizada, recorrido_discretizado) {
        let recorrido_length = recorrido_discretizado.position_list.length
        let forma_length = forma_discretizada.position_list.length
        let uvs = []
        for (var j = 0; j<recorrido_length; j+=3){

            for (var i = 0; i<(forma_length); i+=3){

        
            uvs.push((this.start_u + (i/((forma_length-1)/this.u_repeat))*this.len_u) )
            uvs.push((this.start_v + (j/((recorrido_length-1)/this.v_repeat))*this.len_u) )
            }

        }
        return uvs;
    }
}


class UVMappingDistanciaRecorrida extends UVMapping {
    start_u
    start_v
    len_u
    len_v
    acum_dist

    constructor(start_u = 0, start_v = 0, len_u = 1, len_v = 1){
        super()
        this.start_u = start_u
        this.start_v = start_v
        this.len_u = len_u
        this.len_v = len_v
    }

    mapBarrido(forma_discretizada, recorrido_discretizado) {
        let recorrido_length = recorrido_discretizado.position_list.length
        let forma_length = forma_discretizada.position_list.length
        let uvs = []
        let total_dist = 0
        let distances = []
        distances.push(0)

        for (var j = 0; j < (forma_length - 3); j+=3){
            let a = vec3.fromValues(forma_discretizada.position_list[j],forma_discretizada.position_list[j+1],forma_discretizada.position_list[j+2]);
            let b = vec3.fromValues(forma_discretizada.position_list[j+3],forma_discretizada.position_list[j+4],forma_discretizada.position_list[j+5]);

            let dist = vec3.dist(a,b)
            distances.push(dist)
            total_dist+=dist
        }


        for (var j = 0; j<recorrido_length; j+=3){
            let acum_forma_recorrida = 0;

            for (var i = 0; i<(forma_length); i+=3){
                acum_forma_recorrida += distances[i/3]

                uvs.push((this.start_u + (acum_forma_recorrida/total_dist)*this.len_u) )
                uvs.push((this.start_v + (j/((recorrido_length-1)))*this.len_v) )
            }
        }
        //console.log(uvs)

        return uvs;
    }
}