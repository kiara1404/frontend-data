import { select, csv, scaleLinear, max, scaleBand, axisLeft, axisBottom, extent } from 'd3';

// maak SVG aan
const svg = select('body').append('svg');

// Geef een width en een height mee aan de SVG
svg
    .attr('width', 900)
    .attr('height', 600)

// sla de width en height op in een variabelen
const width = svg.attr('width');
const height = svg.attr('height');

const render = data => {
    const xValue = d => d.population;
    const yValue = d => d.country;

    // geef margins mee zodat de chart mooi gecentreerd is
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    console.log(innerWidth)
    const innerHeight = height - margin.top - margin.bottom;

// bepaald de grootte van de x-as en de stappen ertussen
    const xScale = scaleLinear()
        .domain([0, max(data, xValue)]) 
        .range([0, innerWidth]);

// scaleband bepaald de breedte van de bars
    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.2);

    // maakt een nieuwe groep aan
    const g = svg.append('g')
        .attr('transform',
            `translate(${margin.left}, ${margin.top})`
        );

    // maakt nog een keer nieuwe groep aan met line en text
    g.append('g').call(axisLeft(yScale));
    g.append('g').call(axisBottom(xScale))
        .attr('transform', `translate(0,${innerHeight})`);

    g.selectAll('rect').data(data)
        .enter().append('rect') // maakt de bars aan
        .style('fill', "rgb(102, 102, 255)") // geeft een andere kleur aan de bars
        .attr('y', d => yScale(yValue(d))) // plaatsing in de grafiek (waar op de y-as)
        .attr('width', d => xScale(xValue(d))) // width van één bar
        .attr('height', yScale.bandwidth()); // height van één bar


};

csv('data.csv').then(data => {
    data.forEach(d => {
        d.population = +d.population * 1000; // maakt een nummerieke waarde van population, werd als string ingeladen
    });
    render(data);
});