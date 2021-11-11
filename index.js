const endpoint = 'https://dataderden.cbs.nl/ODataApi/OData/50080NED' // api url

async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data;
}
// ik had zelf alleen 'console.log(getData(endpoint) gedaan en kreeg toen <pending> in mijn terminal. Toen heeft Nathan mij geholpen met deze funtie:
console.log(getData(endpoint).then(response => {
    return console.log(response)
}))

console.log(d3)

