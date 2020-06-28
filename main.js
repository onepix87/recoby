const fetch = require("node-fetch");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.options('/recoby', cors());

app.get('/recoby', cors(), async (req, res, next) => {

    const {endpoint} = req.query;
    const {referer, url} = JSON.parse(endpoint);

    if(!endpoint) res.status(400).json({ error: 'Request endpoint config object not defined' }).end();
    if(!referer) res.status(400).json({ error: 'Request referer parameter not defined' }).end();
    if(!url) res.status(400).json({ error: 'Request url parameter not defined' }).end();

    const reqInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Referer': referer
        }
    };

    try {
        const innerReq = await fetch(url, reqInit);
        const respJson = await innerReq.json();

        await res.json(respJson);
        res.end();
    }
    catch (e) {
        res.status(500).json({ error: 'Invalid JSON response from specified URL'}).end();
        return next(e)
    }
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));