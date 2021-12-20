class TexturesLoader{

    default
    tierra
    sol
    anillo
    modulo_cilindrico
    modulo_esferico
    paneles
    modulo_anillo
    capsula
    luna
    refmap
    constructor(){
        this.default = this._loadTexture('textures/uvgrid.jpg')
        this.tierra = this._loadTexture('textures/tierra.jpg')
        this.sol = this._loadTexture('textures/sol.jpg')
        this.luna = this._loadTexture('textures/luna.jpg')

        this.anillo = this._loadTexture('textures/anillo.jpg')
        this.modulo_cilindrico = this._loadTexture('textures/modulo-cilindrico.jpg')
        this.modulo_esferico = this._loadTexture('textures/modulo-esferico.jpg')
        this.paneles = this._loadTexture('textures/paneles.jpg')
        this.modulo_anillo = this._loadTexture('textures/modulo_anillo.jpg')
        this.capsula = this._loadTexture('textures/shiphull.jpg')

        this.refmap = this._loadTexture('textures/earth_refmap.jpg')

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

    createSolidTexture(r, g, b, a) {
        var data = new Uint8Array([r*255, g*255, b*255, a*255]);
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
}