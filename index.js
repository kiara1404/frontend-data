console.log('are we connected?')
// Alle onderstaande code is gemaakt met behulp van de live coding van Laurens -> 'Live coding API' van 27-10-2020

// Fetching data van DRW
const endpoint = 'https://opendata.rdw.nl/resource/r3rs-ibz5.json'; // link naar de dataset
const selectedColumn = 'paymentmethod';


getData(endpoint)
    .then(data => {
        // er wordt door de dataset geloopt en alle betaalmogelijkheden komen in de console log doordat de filterfunctie wordt aangeroepen
        const paymentMethodArray = filterData(data, selectedColumn);
        const cleanCreditcardData = cleanCreditcard(paymentMethodArray)
        console.log(cleanCreditcardData)
        // hier wordt uiteindelijk de data in de column omgezet naar lowercase
        const toLowerCaseData = allDataToLowerCase(data, selectedColumn)
        console.log(toLowerCaseData)
        // hier wordt de functie die naar unieke waardes zoekt aangeroepen en de unieke waardes komen in de console
        const uniquePaymentValues = uniqueValues(toLowerCaseData)
        console.log(uniquePaymentValues)
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
        }
    })
return uniqueArray
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
        if (item.includes('diners club')) {
            item = 'creditcard';
            cleanedCreditcardArray.push(item);
        }
        // de rest van de gegevens moeten ook in de nieuwe array meegenomen worden.
        else {
            cleanedCreditcardArray.push(item)
        }
    })
return cleanedCreditcardArray
}    




