(function (d3) {
    'use strict';

    // maak SVG aan
    var svg = d3.select('body').append('svg');

    // Geef een width en een height mee aan de SVG
    svg
        .attr('width', 900)
        .attr('height', 600);

    // sla de width en height op in een variabelen
    var width = svg.attr('width');
    var height = svg.attr('height');

    var render = function (data) {
        var xValue = function (d) { return d.population; };
        var yValue = function (d) { return d.country; };

        // geef margins mee zodat de chart mooi gecentreerd is
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
            .enter().append('rect') // maakt de bars aan
            .style('fill', "rgb(102, 102, 255)") // geeft een andere kleur aan de bars
            .attr('y', function (d) { return yScale(yValue(d)); }) // plaatsing in de grafiek (waar op de y-as)
            .attr('width', function (d) { return xScale(xValue(d)); }) // width van één bar
            .attr('height', yScale.bandwidth()); // height van één bar


    };

    d3.csv('data.csv').then(function (data) {
        data.forEach(function (d) {
            d.population = +d.population * 1000; // maakt een nummerieke waarde van population, werd als string ingeladen
        });
        render(data);
    });

})(d3);
//# sourceMappingURL=bundle.js.map
