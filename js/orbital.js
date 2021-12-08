// orbital

// manejo de mouse y teclado
var previousClientX = 0;
var previousClientY = 0;
var radio = 5;
var alfa = 0;
var beta = Math.PI/2;
var factorVelocidad = 0.01;

var isMouseDown = false;
var actualEvent;

var mouse = {x: 0, y: 0};

class FirstPersonCamera {
    constructor(){}

    obtenerViewMatrix(o_camara, updateAngle){   
        if (updateAngle == true){
            var deltaX=0;
            var deltaY=0;
            if (previousClientX) deltaX = previousClientX - mouse.x;
            if (previousClientY) deltaY = mouse.y - previousClientY;

            previousClientX = mouse.x;
            previousClientY = mouse.y;

            alfa = alfa + deltaX * factorVelocidad;
            beta = beta + deltaY * factorVelocidad;

            if (beta<=0) beta=0.001;
            if (beta>=Math.PI) beta=Math.PI*0.999;
        }

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
        /*vec3.add(vec3upvector,vec3upvector,vec_position)

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
        //*/
        return result
    }
} 