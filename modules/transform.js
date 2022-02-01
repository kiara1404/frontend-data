
// functie voor het filteren van de data
export function filterData(dataArray, column) {
    return dataArray.map(item => item[column])

};

// returns alle gegevens in kleine letters, dat is netter!
export function allDataToLowerCase(dataArray) {
    return dataArray.map(item => item.toLowerCase())
}

// returns Visa, Mastercard etc. als creditcard
export function cleanCreditcard(dataArray) {
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

export function cleanPin(dataArray) {
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

export function cleanChip(dataArray) {
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

export function cleanCash(dataArray) {
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

export function cleanEverythingElse(dataArray) {
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
export function countedValues(dataArray) {
    let t = dataArray.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    return t
}

// ik wil dat 'naam' en 'aantal' als keys in een object gepusht worden  in de nieuwe array
export function mergeData(dataArray) {
    let p = []
    Object.keys(dataArray).forEach(function (key) {
        // console.log(key, dataArray[key]);
        p.push({ betaalmethode: key, hoeveelheid: dataArray[key] })
        // return p
    });

    return p
}

// --- EINDE CLEANEN DATA ---