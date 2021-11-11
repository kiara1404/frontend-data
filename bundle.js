(function () {
    'use strict';

    var svg = d3.select('body').append('svg');

    svg.attr('width', 900)
        .attr('height', 600);
    // const svg = d3.select('svg');

    var width = svg.attr('width');
    console.log(width);
    var height = svg.attr('height');

    var render = function (data) {
        var xValue = function (d) { return d.population; };
        var yValue = function (d) { return d.country; };
        var margin = { top: 20, right: 20, bottom: 20, left: 100 };
        var innerWidth = width - margin.left - margin.right;
        console.log(innerWidth);
        var innerHeight = height - margin.top - margin.bottom;


        var xScale = d3.scaleLinear()
            .domain([0, d3.max(data, xValue)])
            .range([0, innerWidth]);

        var yScale = d3.scaleBand()
            .domain(data.map(yValue))
            .range([0, innerHeight])
            .padding(0.2);

        var g = svg.append('g')
            .attr('transform',
                ("translate(" + (margin.left) + ", " + (margin.top) + ")")
            );

        g.append('g').call(d3.axisLeft(yScale));
        g.append('g').call(d3.axisBottom(xScale))
            .attr('transform', ("translate(0," + innerHeight + ")"));

        g.selectAll('rect').data(data)
            .enter().append('rect')
            .style('fill', "rgb(102, 102, 255)")
            .attr('y', function (d) { return yScale(yValue(d)); })
            .attr('width', function (d) { return xScale(xValue(d)); })
            .attr('height', yScale.bandwidth());


    };

    d3.csv('data.csv').then(function (data) {
        data.forEach(function (d) {
            d.population = +d.population * 1000;
        });
        render(data);
    });

})();
//# sourceMappingURL=bundle.js.map
