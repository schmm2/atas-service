// based on https://github.com/substack/point-in-polygon
// changed to support objects instead of arrays

module.exports = function (gpsObj, dangerzoneObj) {
    var x = gpsObj.lng, y = gpsObj.lat;
    var vs = dangerzoneObj.points;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].lng, yi = vs[i].lat;
        var xj = vs[j].lng, yj = vs[j].lat;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};