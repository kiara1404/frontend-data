(function (d3) {
    'use strict';

    var svg = d3.select('svg');

    +svg.attr('width');
    +svg.attr('height');

    d3.csv('data.csv').then(function (data) {
        console.log(data);
    });

})(d3);
//# sourceMappingURL=bundle.js.map
