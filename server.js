const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const proxy = httpProxy.createProxyServer({});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy requests to the target URL and return content in an about:blank cloaked URL
app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }
    proxy.web(req, res, { target: url }, (err, req, res) => {
        if (err) {
            return res.status(500).send('Proxy error');
        }
        // Modify the response to use about:blank as the URL
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '0');
        res.setHeader('Referrer-Policy', 'no-referrer');
        res.setHeader('Content-Type', 'text/html');
        res.write(`<html><head><title>Loading...</title></head><body><iframe src="about:blank" style="width:100%;height:100%;border:none;"></iframe><script>document.querySelector('iframe').contentWindow.location.replace('${url}');</script></body></html>`);
        res.end();
    });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
