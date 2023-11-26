require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
app.get('/:name', async (req, res) => {
    try {
        let rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.params.name}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())

        let maxDate = rover.photo_manifest.max_date;

        let roverDetail = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/photos?earth_date=${maxDate}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ roverDetail })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))