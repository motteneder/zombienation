/**
  * utils.js
  * Commonly used functions, or stuff you can't really put somewhere else.
  *
  * (c) 2010 Zombienation Team
  */

function browserIsCompatible() {
    // Required browser features (expand as required):
    return (Modernizr.canvas &&
            Modernizr.canvastext);
}