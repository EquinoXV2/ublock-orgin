const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const proxy = httpProxy.createProxyServer({});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }
    proxy.web(req, res, { target: url });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
