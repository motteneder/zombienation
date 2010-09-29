/**
  * map.js
  * Map class and related stuff.
  *
  * (c) 2010 Zombienation Team
  */

var ZMapComponent = new Class({
    // Abstract superclass for ZItem and ZTile.
    // id (string) - Id for CanvasItem
    // x, y (int) - coordinates on the map
    // texture (Image) - graphic representing the idle thing
    // passable (boolean) - whether or not this can be walked over
    // visibility (int) - 0=invisible, 1="fog of war", 2=visible, 3=empty
    // evts (object) - events; see http://forvar.de/js/mcl/docs.CanvasItem.html
    Extends: CanvasItem,
    initialize: function (id, x, y, texture, passable, visibility, evts) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.passable = passable;
        this.visible = visibility;
        this.texture = texture;
        this.parent({id: this.id, interactive: true, events: evts});
    },
    
    draw: function () {
        // Draw according to visible mode.
        switch (this.visible) {
            case 1:
                // Draw foggy.
            case 2:
                CANVAS.ctx.drawImage(this.texture, this.x * 48, this.y * 48);
                break;
            default:
                // Don't draw.
        }
    }
});

var ZItem = new Class({
    // Items on top of the tiles.
    Extends: ZMapComponent,
    initialize: function (x, y, texture, passable, visibility, evts) {
        this.id = 'item' + x + '-' + y;
        this.parent(this.id, x, y, texture, passable, visibility, evts);
    }
});

var ZTile = new Class({
    // A tile on the map aka floor.
    Extends: ZMapComponent,
    initialize: function (x, y, texture, passable, visibility, evts) {
        this.id = 'tile' + x + '-' + y;
        this.parent(this.id, x, y, texture, passable, visibility, evts);
    }
});


// Generates placeholder for empty item slots:
function noItem(x, y) {
    return new ZItem(x, y, e.assets.empty, true, 3, {});
}


var ZMap = new Class({
    // The map, basically a 2d array of tiles (for now).
    initialize: function (width, height) {
        this.width = width;
        this.height = height;
        // Canvas layers.
        this.tileLayer = new Layer({id: 'background'});
        CANVAS.layers.add(this.tileLayer);
        this.itemLayer = new Layer({id: 'items'});
        CANVAS.layers.add(this.itemLayer);
        // Map element data structures.
        this.tiles = new Array(this.width);
        this.items = new Array(this.width);
        // Initialization of map element data structures.
        for (var x = 0; x < this.width; x++) {
            this.tiles[x] = new Array(this.height);
            this.items[x] = new Array(this.height);
            for (var y = 0; y < this.height; y++) {
                // puts sample tile everywhere
                this.tiles[x][y] = new ZTile(x, y, e.assets.tile, true, 2, {});
                // leave items empty.
                this.items[x][y] = noItem(x, y);
                // Add map elements to the respective layers.
                this.tileLayer.add(this.tiles[x][y]);
                this.itemLayer.add(this.items[x][y]);
            }
        }
        // Draw completely after loading map.
        CANVAS.layers.draw();
    },
    
    draw: function () {
        // Draws all layers.
        CANVAS.layers.draw();
    },
    
    setItem: function (item, x, y) {
        // Puts a given ZItem object in the given place, if the place is free.
        if (this.items[x][y].visible == 3) {
            this.items[x][y] = item;
            this.itemLayer.add(this.items[x][y]);
        } else {
            // TODO collision handling, like putting item in next free place.
        }
        CANVAS.layers.draw(); // Redraw item layer.
    },
    
    takeItem: function (x, y) {
        // If an item exists in the given location, it is removed and returned.
        if (this.items[x][y].visible == 3) {
            this.itemLayer.remove(this.items[x][y]);
            var item = this.items[x][y];
            this.items[x][y] = noItem(x, y);
            this.itemLayer.add(this.items[x][y]);
            return item;
            CANVAS.layers.draw(); // Redraw item layer.
        } else {
            return undefined;
        }
    }
});