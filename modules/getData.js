export async function getDataSet(url) {

    try {
        const data = d3.json(url);
        console.log(data)
        return await data

    } catch (err) {
        console.log(err)

    }

}