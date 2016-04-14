var $ = require("jquery");
var _ = require("lodash");
var L = require("leaflet");
var Zlib = require("zlibjs");

var Libraries = {
    "L": L,
    "$": $,
    "_": _,
    "Zlib": Zlib,
};
module.exports = Libraries;

console.log(document);
