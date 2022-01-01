const FACTOR_VELOCIDAD = 0.001;

// guardado de datos del mouse
var mouse = {
    isDown: false,
    x:0,
    y:0,
    last_click: {
    x: 0,
    y: 0}
};

class OrbitalCamera {
    values
    constructor(){
        this.values= {
            distancia: 26,
            alfa:0.03,
            beta:0.24,
            alfaprev:0.03,
            betaprev:0.24
        };

        canvas = document.getElementById("my-canvas");  
        self = this;
        $(canvas).mousemove(function(e){ 
            mouse.x = e.clientX || e.pageX; 
            mouse.y = e.clientY || e.pageY 
        });
        
        $(canvas).mousedown(function(event){	
            mouse.isDown = true;
            mouse.last_click.x = mouse.x;
            mouse.last_click.y = mouse.y;

        });

        $(canvas).mouseup(function(event){
            mouse.isDown = false;

            self.values.alfaprev = self.values.alfa;

            self.values.betaprev = self.values.beta;		
        });

        $(canvas).on("wheel",function(event, delta){
        switch (event.originalEvent.wheelDelta >= 0) {
        case true:
            if (self.values.distancia > 1){
                self.values.distancia = self.values.distancia / 1.1;
            }
            break;
        case false:
            if (self.values.distancia < 150){
                self.values.distancia = self.values.distancia * 1.1;
            }
            break;
        }
    });  
    }

    update(){
        if (mouse.isDown){
            var deltaX=0;
            var deltaY=0;
            deltaX = mouse.last_click.x - mouse.x;
            deltaY = mouse.y - mouse.last_click.y;
            
            this.values.beta = this.values.betaprev + deltaX * FACTOR_VELOCIDAD;
            this.values.alfa = this.values.alfaprev + deltaY * FACTOR_VELOCIDAD;
        }
    }
}