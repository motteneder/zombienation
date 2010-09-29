/**
  * engine.js
  * Graphics management, manipulation, and animation.
  *
  * (c) 2010 Zombienation Team
  */

// URLs of preloadable assets:
var preloadable = new Hash({
    // for testing purposes
    test: 'images/test.png',
    tile: 'images/tile.png',
    empty: 'images/empty.png'
});

// Initialize after loading page.
window.addEvent('domready', function () {
    if (browserIsCompatible()) {
        e = new ZEngine('baseCanvas');
        // Preload assets.
        // Future goal: also check local storage for permanently stored,
        // frequently used assets.
        preloadable.each(function (value, key) {
            if (!e.loadAsset(key, value)) {
                alert('failed to load "' + key + '".');
            }
        })
    } else {
        alert('Your browser is not compatible with Zombienation.\
Please consider upgrading to the latest version of a major browser.');
    }
});


var ZEngine = new Class({
    initialize: function (canvas) {
        // Initialize MCL with the base canvas.
        CANVAS.init({canvasElement: canvas, enableMouse: true});
        this.context = CANVAS.ctx;
        // Store all assets centrally.
        this.assets = new Hash();
    },
    
    loadAsset: function(ident, url) {
        // Loads the asset on the specified location and adds it to the assets
        // hash, using the the given identifier as key. If the key is
        // already occupied, the asset won't be loaded and this will return
        // false to indicate failure.
        if (this.assets.has(ident)) {
            return false;
        } else {
            var img = new Image();
            img.src = url;
            this.assets.set(ident, img);
            return true;
        }
    }
});