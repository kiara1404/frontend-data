console.log('are we connected?')
// Alle onderstaande code is gemaakt met behulp van de live coding van Laurens -> 'Live coding API' van 27-10-2020

// Fetching data van DRW
const endpoint = 'https://opendata.rdw.nl/resource/r3rs-ibz5.json'; // link naar de dataset
const selectedColumn = 'paymentmethod';


getData(endpoint)
    .then(data => {
        // er wordt door de dataset geloopt en alle betaalmogelijkheden komen in de console log doordat de filterfunctie wordt aangeroepen
        const paymentMethodArray = filterData(data, selectedColumn);
        const cleanCreditcardData = cleanCreditcard(paymentMethodArray);
        console.log(cleanCreditcardData);
        // hier wordt uiteindelijk de data in de column omgezet naar lowercase
        const toLowerCaseData = allDataToLowerCase(data, selectedColumn);
        // hier wordt de functie die naar unieke waardes zoekt aangeroepen en de unieke waardes komen in de console
        const uniquePaymentValues = uniqueValues(toLowerCaseData);
        const cleanPinData = cleanPin(toLowerCaseData);
        const cleanChipKnipData = cleanChip(toLowerCaseData);
        console.log(cleanChipKnipData);
        const cleanCashData = cleanCash(toLowerCaseData);
        console.log(cleanCashData);
        const cleanRemainingData = cleanEverythingElse(toLowerCaseData);
        console.log(cleanRemainingData);
 
    })

async function getData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
// functie voor het filteren van de data
function filterData(dataArray, column) {
    return dataArray.map(item => item[column])
};

// functie die zoekt naar unieke waardes in een array
function uniqueValues(dataArray){
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
function allDataToLowerCase(dataArray, column) {
    return dataArray.map(item => item[column].toLowerCase())
}

// returns Visa, Mastercard etc. als creditcard
function cleanCreditcard(dataArray){
    // lege array
    let cleanedCreditcardArray = [];
    //kijkt welke antwoorden visa bevat en vervangt dedze met creditcard
    dataArray.forEach(item => {
        if (item.includes('visa')) {
            item = 'creditcard';
            cleanedCreditcardArray.push(item);
        }
        //kijkt welke antwoorden mastercard bevat en vervangt dedze met creditcard
        else if (item.includes('mastercard')) {
            item = 'creditcard';
            cleanedCreditcardArray.push(item);
        }
        //kijkt welke antwoorden diners club bevat en vervangt dedze met creditcard
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