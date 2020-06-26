const fetch = require("node-fetch");
const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());

app.get('/recoby', async (req, res, next) => {

    const {referer, url} = req.query;

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

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        await res.json(respJson);
        res.end();
    }
    catch (e) {
        res.status(500).json({ error: 'Invalid JSON response from specified URL'}).end();
        return next(e)
    }
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));