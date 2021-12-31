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

    anillo_nm
    modulo_cilindrico_nm
    modulo_esferico_nm
    paneles_nm
    modulo_anillo_nm
    capsula_nm

    luna
    luna_nm
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

        this.luna_nm = this._loadTexture('textures/luna_nm.png')


        this.anillo_nm = this._loadTexture('textures/anillo_nm.png')
        this.modulo_cilindrico_nm = this._loadTexture('textures/modulo-cilindrico_nm.png')
        this.modulo_esferico_nm = this._loadTexture('textures/modulo-esferico_nm.png')
        this.paneles_nm = this._loadTexture('textures/paneles_nm.png')
        this.modulo_anillo_nm = this._loadTexture('textures/modulo_anillo_nm.png')
        this.capsula_nm = this._loadTexture('textures/shiphull_nm.png')

        this.refmap = this._loadTexture2('textures/earth_refmap.jpg')

    }

    _loadTexture(src) {
        var texture = gl.createTexture();
        var image = new Image();
        var auxthis = this
        image.onload = function() { auxthis._handleTextureLoaded(image, texture); }
        image.src = src;
        return texture
    }

    _loadTexture2(src) {
        var texture = gl.createTexture();
        var image = new Image();
        var auxthis = this
        image.onload = function() { auxthis._handleTextureLoaded2(image, texture); }
        image.src = src;
        return texture
    }   

    _handleTextureLoaded(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST); //minificacion: mas de 1 texel por pixel
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //magnificacion: menos de 1 texel por pixel
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    _handleTextureLoaded2(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST); 
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