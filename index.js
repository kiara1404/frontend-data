console.log('are we connected?')
// Alle onderstaande code is gemaakt met behulp van de live coding van Laurens -> 'Live coding API' van 27-10-2020

// Fetching data van RDW
//link naar de datasets
const endpoints = [
    'https://opendata.rdw.nl/resource/r3rs-ibz5.json',
    'https://opendata.rdw.nl/resource/2uc2-nnv3.json',


];
const selectedColumns = ['paymentmethod'];

// --- BEGIN CLEANEN DATA ---

getData(endpoints)
    .then(data => returnToJSON(data))
    .then(data => {
    
        // er wordt door de dataset geloopt en alle betaalmogelijkheden komen in de console log doordat de filterfunctie wordt aangeroepen
        const paymentMethodArray = filterData(data[0], selectedColumns[0]);
        console.log(paymentMethodArray)
        // hier wordt uiteindelijk de data in de column omgezet naar lowercase
        const toLowerCaseData = allDataToLowerCase(paymentMethodArray);
        const cleanCreditcardData = cleanCreditcard(toLowerCaseData);
        // hier wordt de functie die naar unieke waardes zoekt aangeroepen
        const uniquePaymentValues = uniqueValues(paymentMethodArray);
        const cleanPinData = cleanPin(cleanCreditcardData);
        const cleanChipKnipData = cleanChip(cleanPinData);
        const cleanCashData = cleanCash(cleanChipKnipData);
        const cleanRemainingData = cleanEverythingElse(cleanCashData);
        console.log(cleanRemainingData);



    })


//returns de urls met een promise.all, zorgt ervoor dat het wordt uitgevoerd wanneer alle urls zijn opgehaald
// Hulp gekregen van Roeland van Stee en Vincent van Leeuwen
function getData(urls) {
    const datasets = urls.map(url => fetch(url));
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
        else if (item.includes('diners club')) {
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
        else {
            cleanArray.push(item);
        }
    })
    return cleanArray;
}
// --- EINDE CLEANEN DATA ---

// --- BEGIN d3 ---