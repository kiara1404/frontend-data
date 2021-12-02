console.log('are we connected?')
// Alle onderstaande code is gemaakt met behulp van de live coding van Laurens -> 'Live coding API' van 27-10-2020

// Fetching data van RDW
//link naar de datasets
const endpoints = [
    'https://opendata.rdw.nl/resource/r3rs-ibz5.json',
    'https://opendata.rdw.nl/resource/2uc2-nnv3.json',


];
let selectedColumn = 'paymentmethod';

// --- BEGIN CLEANEN DATA ---

function x(areacode) {
    getDataSet(endpoints[0])
        .then((data) => {
           if(areacode){ data = data.filter(stad => stad.areamanagerid == areacode)}
            console.log(data)
            data = filterData(data, selectedColumn)
            data = allDataToLowerCase(data)
            data = cleanCreditcard(data)
            data = cleanPin(data)
            data = cleanCash(data)
            data = cleanChip(data)
            data = cleanEverythingElse(data)
            data = countedValues(data)
            data = mergeData(data)
            return data
        })
        .then(data => {
            render(data)
        })
}

x('');




async function getDataSet(url) {

    try {
        const data = d3.json(url);
        console.log(data)
        return await data

    } catch (err) {
        console.log(err)

    }

}

function getData(urls) {
    const datasets = urls.map(url => d3.json(url));
    return Promise.all(datasets);
};


// functie voor het filteren van de data
function filterData(dataArray, column) {
    return dataArray.map(item => item[column])

};

// returns alle gegevens in kleine letters, dat is netter!
function allDataToLowerCase(dataArray) {
    return dataArray.map(item => item.toLowerCase())
}

// returns Visa, Mastercard etc. als creditcard
function cleanCreditcard(dataArray) {
    // lege array
    let cleanedCreditcardArray = [];
    //kijkt welke antwoorden visa bevat en vervangt dedze met creditcard
    dataArray.forEach(item => {
        if (item.includes('visa')) {
            item = 'creditcard';
            cleanedCreditcardArray.push(item);
        }
        //kijkt welke antwoorden mastercard bevat en vervangt deze met creditcard
        else if (item.includes('mastercard')) {
            item = 'creditcard';
            cleanedCreditcardArray.push(item);
        }
        //kijkt welke antwoorden diners club bevat en vervangt deze met creditcard
        else if (item.includes('diners club' && "diner's club")) {
            item = 'creditcard';
            cleanedCreditcardArray.push(item);
        }
        else if (item.includes('amex')) {
            item = 'creditcard';
            cleanedCreditcardArray.push(item);
        }
        // de rest van de gegevens moeten ook in de nieuwe array meegenomen worden.
        else {
            cleanedCreditcardArray.push(item)
        }
    })
    return cleanedCreditcardArray;
}

function cleanPin(dataArray) {
    let cleanPinArray = [];

    dataArray.forEach(item => {
        if (item.includes('vpay')) {
            item = 'pin';
            cleanPinArray.push(item);
        }
        else if (item.includes('maestro')) {
            item = 'pin';
            cleanPinArray.push(item)
        }
        else {
            cleanPinArray.push(item);
        }
    })
    return cleanPinArray;
}

function cleanChip(dataArray) {
    let cleanChipArray = [];

    dataArray.forEach(item => {
        if (item.includes('chip')) {
            item = 'chipknip';
            cleanChipArray.push(item);
        }

        else {
            cleanChipArray.push(item);
        }
    })
    return cleanChipArray;
}

function cleanCash(dataArray) {
    let cleanCashArray = [];

    dataArray.forEach(item => {
        if (item.includes('banknotes')) {
            item = 'cash';
            cleanCashArray.push(item);
        }
        else if (item.includes('coins')) {
            item = 'cash';
            cleanCashArray.push(item);
        }
        else {
            cleanCashArray.push(item);
        }
    })
    return cleanCashArray;
}

function cleanEverythingElse(dataArray) {
    let cleanArray = [];

    dataArray.forEach(item => {
        if (item.includes('dip & go')) {
            item = 'dip-tap&go';
            cleanArray.push(item);
        }
        else if (item.includes('xximio')) {
            item = 'XXImo parkeerpas';
            cleanArray.push(item);
        }
        else if (item.includes('pos')) {
            item = 'betaalautomaat';
            cleanArray.push(item);
        }
        else {
            cleanArray.push(item);
        }
    })
    return cleanArray;
}


//bron: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
//functie om te de frequentie van waardes in een array te checken
function countedValues(dataArray) {
    let t = dataArray.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    return t
}

// ik wil dat 'naam' en 'aantal' als keys in een object gepusht worden  in de nieuwe array
function mergeData(dataArray) {
    let p = []
    Object.keys(dataArray).forEach(function (key) {
        // console.log(key, dataArray[key]);
        p.push({ betaalmethode: key, hoeveelheid: dataArray[key] })
        // return p
    });

    return p
}

function mergeDataTogether(dataArray) {
    // de datasets die we in elkaar gaan voegen
    const payments = dataArray[0]; //
    const areamanagers = dataArray[1];
    // er wordt over de payments dataset geloopt en vergelijkt areamanagerid's met elkaar en wanneer
    //deze overeen komen wordt de areamanager id van areamanagers in de payments dataset 'gezet'
    const result = payments.map(payment => {
        const areamanager = areamanagers.find(areamanager =>
            payment.areamanagerid === areamanager.areamanagerid
        );
        payment.areamanager = areamanager;
        return payment
    })
}

// --- EINDE CLEANEN DATA ---

// --- BEGIN d3 ---

const svg = d3.select('body').append('svg');
const tooltip = d3.select("body").append("div").attr('class', 'toolTip');


// Geef een width en een height mee aan de SVG
svg
    .attr('width', 900)
    .attr('height', 820)

// sla de width en height op in een variabelen
const width = svg.attr('width');
const height = svg.attr('height');

const render = data => {
    const xValue = d => d.hoeveelheid;
    const yValue = d => d.betaalmethode;

    // geef margins mee zodat de chart mooi gecentreerd is
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    //console.log(innerWidth)
    const innerHeight = height - margin.top - margin.bottom;

    // bepaald de grootte van de x-as en de stappen ertussen
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([innerWidth, 0]);

    // console.log(xScale.domain())

    // scaleband bepaald de breedte van de bars
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([innerHeight, 0])
        .padding(0.2);

    // maakt een nieuwe groep aan
    const g = svg.append('g')
        .attr('transform',
            `translate(${margin.left}, ${margin.top})`
        );



    // maakt nog een keer nieuwe groep aan met line en text
    g.append('g').call((d3.axisLeft(xScale)).ticks(20));
    g.append('g').call(d3.axisBottom(yScale))
        .attr('transform', `translate(0,${innerHeight})`);

    g.selectAll('rect').data(data)
        .enter().append('rect') // maakt de bars aan
        .style('fill', "rgb(102, 102, 255)") // geeft een andere kleur aan de bars
        .attr('y', d => xScale(xValue(d)) - 100)
        // plaatsing in de grafiek (waar op de y-as)
        .attr('height', d => innerHeight - xScale(d.hoeveelheid))
        //   .attr('height', d => yScale(yValue(d))) // width van één bar
        .attr('width', yScale.bandwidth()) // height van één bar
        .attr('x', d => { return yScale(d.betaalmethode) })
        .on('mousemove', function (event, d) {
            tooltip
                .style('display', 'inline-block')
                .style('left', event.pageX - 50 + 'px')
                .style('top', event.pageY - 120 + 'px')
                .html('<p> hoeveelheid:' + d.hoeveelheid + '</p>')
        })
        .on('mouseout', function (d) {
            console.log('out')
            tooltip.style('display', 'none')
        })
        .transition() // <---- Here is the transition
        .duration(1000) // 2 seconds
        .attr('y', d => xScale(xValue(d)))
        .delay(function (d, i) {
            return i * - 70
                ;
        })
        .attr('x', d => { return yScale(d.betaalmethode) })
        .ease(d3.easeExpIn)


}


