console.log('are we connected?')
// Alle onderstaande code is gemaakt met behulp van de live coding van Laurens -> 'Live coding API' van 27-10-2020

// Fetching data van RDW
//link naar de datasets
const endpoints = [
    'https://opendata.rdw.nl/resource/r3rs-ibz5.json',
    'https://opendata.rdw.nl/resource/2uc2-nnv3.json',


];
const selectedColumn = 'paymentmethod';

// --- BEGIN CLEANEN DATA ---
async function getDataSet(url) {
    try {
        const data = d3.json(url);
        console.log(data)
        console.log(typeof data)
        return await data

    } catch (err) {
        console.log(err)

    }

}
getDataSet(endpoints[0])
    //    .then(response => returnToJSON(response))
    .then((data) => {
        data = filterData(data, selectedColumn)
        data = allDataToLowerCase(data)
        data = cleanCreditcard(data)
        data = cleanPin(data)
        data = cleanCash(data)
        data = cleanChip(data)
        data = cleanEverythingElse(data)
        data = countedValues(data)
        data = mergeData(data)
        console.log(data)
        return data
    })
    .then(data => render(data))

// getData(endpoints)
//     .then(response => returnToJSON(response))
//     .then((data) => {
//         data = filterData(data[0], selectedColumn)
//         data = allDataToLowerCase(data)
//         data = cleanCreditcard(data)
//         data = cleanPin(data)
//         data = cleanEverythingElse(data)
//         data = countedValues(data)
//         data = mergeData(data)
//         return data
//     })


// .then(data => filterData(data[0], selectedColumn))
// .then(data => allDataToLowerCase(data))
// .then(data => cleanCreditcard(data))
// .then(data => cleanPin(data))
// .then(data => cleanCash(data))
// .then(data => cleanEverythingElse(data))
// .then(data => console.log(countedValues(data)))



//returns de urls met een promise.all, zorgt ervoor dat het wordt uitgevoerd wanneer alle urls zijn opgehaald
// Hulp gekregen van Roeland van Stee en Vincent van Leeuwen
function getData(url) {
    const datasets = url.map(url => fetch(url));
    return Promise.all(datasets);
};

// Zorgt ervoor dat de dataset een array wordt zodat je kan .map()
function returnToJSON(response) {
    return Promise.all(response.map(response => response.json()))
};


// functie voor het filteren van de data
function filterData(dataArray, column) {
    return dataArray.map(item => item[column])

};

// functie die zoekt naar unieke waardes in een array
function uniqueValues(dataArray) {
    // een lege nieuwe array waarin de unieke waardes gestopt worden
    let uniqueArray = [];
    // 
    dataArray.map(item => {
        if (uniqueArray.indexOf(item) == -1) {
            uniqueArray.push(item);
        };
    })
    return uniqueArray;
}

// returns alle gegevens in kleine letters, dat is netter!
function allDataToLowerCase(dataArray) {
    // console.log('adtlc', dataArray)
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




// --- EINDE CLEANEN DATA ---

// --- BEGIN d3 ---

const svg = d3.select('body').append('svg');


// Geef een width en een height mee aan de SVG
svg
    .attr('width', 900)
    .attr('height', 600)

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
    console.log("d3max", d3.max(data, xValue))
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);
    console.log(xScale.domain())

    // scaleband bepaald de breedte van de bars
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    // maakt een nieuwe groep aan
    const g = svg.append('g')
        .attr('transform',
            `translate(${margin.left}, ${margin.top})`
        );

    // maakt nog een keer nieuwe groep aan met line en text
    g.append('g').call(d3.axisLeft(yScale))
    g.append('g').call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,${innerHeight})`);

    g.selectAll('rect').data(data)
        .enter().append('rect') // maakt de bars aan
        .style('fill', "rgb(102, 102, 255)") // geeft een andere kleur aan de bars
        .attr('y', d => yScale(yValue(d))) // plaatsing in de grafiek (waar op de y-as)
        .attr('width', d => xScale(xValue(d))) // width van één bar
        .attr('height', yScale.bandwidth()); // height van één bar

};



