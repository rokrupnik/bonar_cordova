var $ = require("jquery");
var _ = require("lodash");
var L = require("leaflet");
var ol = require("openlayers");

var Libraries = {
    "L": L,
    "$": $,
    "_": _,
    "ol": ol
};
module.exports = Libraries;

// SHIM !!!
//RequestAnimationFrame (IE9, Android 4.1, 4.2, 4.3)
/*! @author Paul Irish */
/*! @source https://gist.github.com/paulirish/1579671 */
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());