const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
const app = express();

app.disable("etag");
app.disable("x-powered-by");
//app.use(helmet());
app.use(helmet.hidePoweredBy());
// // app.use(express.json());
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/build')));

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const httpsPort = "443";
const allowedOrigins = [
    'https://dashboard.nimc.gov.ng:443',
    'https://vsc.ibib.io:7080',
    'https://v1.ibib.io:7070'

];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    })
);

/* https certs */
const keyPath = "/etc/plumes/nimc.gov.ng.key";
const certPath = "/etc/plumes/nimc.gov.ng.crt";
const caPath = "/etc/plumes/entrust_CA.crt";

/* https certs */
// const keyPath =  '/keystore/vsc.ibib.io.key';
// const certPath = '/keystore/vsc.combined.crt';
// const caPath = '/keystore/vsc.combined.crt';

const key = fs.readFileSync(keyPath, "utf8");
const cert = fs.readFileSync(certPath, "utf8");
const ca = fs.readFileSync(caPath, "utf8");
/* end */

const options = {
    key: key,
     cert: cert,
     ca: ca,
 };

https.createServer(options, app).listen(httpsPort, function () {
    console.log(`The API has started on http://127.0.0.1:${httpsPort}/`);
});