class TexturesLoader{

    default
    tierra
    sol
    anillo
    constructor(){
        this.default = this._loadTexture('textures/uvgrid.jpg')
        this.tierra = this._loadTexture('textures/tierra.jpg')
        this.sol = this._loadTexture('textures/sol.jpg')
        this.anillo = this._loadTexture('textures/anillo.jpg')

    }

    _loadTexture(src) {
        var texture = gl.createTexture();
        var image = new Image();
        var auxthis = this
        image.onload = function() { auxthis._handleTextureLoaded(image, texture); }
        image.src = src;
        return texture
    }   

    _handleTextureLoaded(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }   
}