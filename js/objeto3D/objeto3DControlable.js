    var MIN_Y=1;

    var DELTA_TRASLACION=0.2;        // velocidad de traslacion 
    var DELTA_ROTACION=0.02;         // velocidad de rotacion
    var FACTOR_INERCIA=0.05;

    class Objeto3DControlable extends Objeto3D {

        constructor(){
            super()
            this.position=vec3.create();
            this.rotation=vec3.create();
            this.rotationMatrix=mat4.create();	

            this.camInitialState={
                xVel:0,
                zVel:0,
                yVel:0,
                xVelTarget:0,
                zVelTarget:0,
                yVelTarget:0,
    
                yRotVelTarget:0,
                yRotVel:0,
                zRotVelTarget:0,
                zRotVel:0,
                xRotVelTarget:0,
                xRotVel:0,
                
                rightAxisMode:"move"
            }
            this.camState=Object.assign({},this.camInitialState);


            var objeto = this;

            document.addEventListener("keydown",function(e){
                //console.log(e.key);
                    
                /*
                    ASDWQE para rotar en 3 ejes en el espacio del objeto
    
                    Flechas + PgUp/PgDw o HJKUOL para trasladar en el espacio del objeto
    
                */
    
                switch ( e.key ) {
    
                    case "ArrowUp":  case "u": // up
                        objeto.camState.zVelTarget=DELTA_TRASLACION; break;
                    case "ArrowDown": case "j": // down
                        objeto.camState.zVelTarget=-DELTA_TRASLACION; break; 
    
                    case "ArrowLeft": case "h": // left
                        objeto.camState.xVelTarget=DELTA_TRASLACION;break;
                    case "ArrowRight": case "k": // right
                        objeto.camState.xVelTarget=-DELTA_TRASLACION; break;   
    
                    case "o": case "PageUp": // PgUp
                        objeto.camState.yVelTarget=DELTA_TRASLACION;break;
                    case "l": case "PageDown":// PgDw
                        objeto.camState.yVelTarget=-DELTA_TRASLACION; break;        
       
    
                    case "s":
                        objeto.camState.xRotVelTarget=DELTA_ROTACION;break;                                 
                    case "w": 
                        objeto.camState.xRotVelTarget=-DELTA_ROTACION;break;
    
    
                    case "a": 
                        objeto.camState.yRotVelTarget=DELTA_ROTACION; break;                
                    case "d": 
                        objeto.camState.yRotVelTarget=-DELTA_ROTACION; break;         
    
                
                    case "q":
                        objeto.camState.zRotVelTarget=DELTA_ROTACION;break;                                 
                    case "e": 
                        objeto.camState.zRotVelTarget=-DELTA_ROTACION;break;            
    
    
                    case "t": 
                        rotation=vec3.create();                    
                        objeto.camState=Object.assign({},camInitialState);
                        break;                    
    
                }               
    
            })
            document.addEventListener("keyup",function(e){
    
                switch ( e.key ) 
                {
                    case "ArrowUp":  case "u": case "ArrowDown": case "j":
                        objeto.camState.zVelTarget=0; break;
                    
                    case "ArrowLeft": case "h": case "ArrowRight": case "k": 
                        objeto.camState.xVelTarget=0; break;  
    
                    case "o": case "l": 
                    case "PageDown": case "PageUp":
                        objeto.camState.yVelTarget=0;break;
        
      
                    case "a": 
                        objeto.camState.yRotVelTarget=0; break;
                    case "d": 
                        objeto.camState.yRotVelTarget=0; break;
                        
                    case "w": 
                        objeto.camState.xRotVelTarget=0;break; 
                    case "s":
                        objeto.camState.xRotVelTarget=0;break;                           
                
                    case "q": 
                        objeto.camState.zRotVelTarget=0;break; 
                    case "e":
                        objeto.camState.zRotVelTarget=0;break;                                
              
                }                 
                
            })
        }
        
        setPosicion(x,y,z){
            this.position = vec3.fromValues(x,y,z);
        }

        _actualizarMatrizPorState=function(m){
            this.camState.xVel+=(this.camState.xVelTarget-this.camState.xVel)*FACTOR_INERCIA;
            this.camState.yVel+=(this.camState.yVelTarget-this.camState.yVel)*FACTOR_INERCIA;
            this.camState.zVel+=(this.camState.zVelTarget-this.camState.zVel)*FACTOR_INERCIA;

            this.camState.xRotVel+=(this.camState.xRotVelTarget-this.camState.xRotVel)*FACTOR_INERCIA;
            this.camState.yRotVel+=(this.camState.yRotVelTarget-this.camState.yRotVel)*FACTOR_INERCIA;
            this.camState.zRotVel+=(this.camState.zRotVelTarget-this.camState.zRotVel)*FACTOR_INERCIA;

            let translation=vec3.fromValues(-this.camState.xVel,this.camState.yVel,-this.camState.zVel);                        
            

            if (Math.abs(this.camState.xRotVel)>0) {		
                // este metodo aplica una rotacion en el eje AXIS en el espacio del objeto o respecto del eje "local", NO el eje de mundo
                mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.camState.xRotVel,vec3.fromValues(1,0,0));                
            }

            if (Math.abs(this.camState.yRotVel)>0) {
                mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.camState.yRotVel,vec3.fromValues(0,1,0));                
            }
            
            if (Math.abs(this.camState.zRotVel)>0) {
                mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.camState.zRotVel,vec3.fromValues(0,0,1));                
            }
            

            vec3.transformMat4(translation,translation,this.rotationMatrix);
            vec3.add(this.position,this.position,translation);

            mat4.translate(m,m,this.position);        
            mat4.multiply(m,m,this.rotationMatrix);
            
        }

        _actualizarMatrizModelado() {
            let m = mat4.create(); // crear una matriz identidad
            for (var i = 0; i < this.transformaciones.length; i++) {
                this.transformaciones[i].transform(m)
            }
            this._actualizarMatrizPorState(m)

            this.matModelado = m;
        } 

    }
