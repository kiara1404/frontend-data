
// maak SVG aan
const svg = d3.select('body').append('svg');
console.log('hallo')

// Geef een width en een height mee aan de SVG
svg
    .attr('width', 900)
    .attr('height', 600)

// sla de width en height op in een variabelen
const width = svg.attr('width');
const height = svg.attr('height');

const render = data => {
    const xValue = d => d.quantity;
    const yValue = d => d.paymentmethod;

    // geef margins mee zodat de chart mooi gecentreerd is
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    console.log(innerWidth)
    const innerHeight = height - margin.top - margin.bottom;

    // bepaald de grootte van de x-as en de stappen ertussen
    const xScale = d3.scaleLinear()
        .domain([0, 300])
        .range([0, innerWidth]);
    console.log(xScale.domain())

    // scaleband bepaald de breedte van de bars
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.2);

    // maakt een nieuwe groep aan
    const g = svg.append('g')
        .attr('transform',
            `translate(${margin.left}, ${margin.top})`
        );

    // maakt nog een keer nieuwe groep aan met line en text
    g.append('g').call(d3.axisLeft(yScale));
    g.append('g').call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,${innerHeight})`);

    g.selectAll('rect').data(data)
        .enter().append('rect') // maakt de bars aan
        .style('fill', "rgb(102, 102, 255)") // geeft een andere kleur aan de bars
        .attr('y', d => yScale(yValue(d))) // plaatsing in de grafiek (waar op de y-as)
        .attr('width', d => xScale(xValue(d))) // width van één bar
        .attr('height', yScale.bandwidth()); // height van één bar


};

d3.csv('data.csv').then(data => {

    render(data);
});