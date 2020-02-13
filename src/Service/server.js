const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');

const port = 3333; 
const app = express();
 
// app.use(morgan('combined')); //logger
// app.use(bodyParser.json());
 
function initialize() {
    return new Promise((resolve, reject) => {
        
        httpServer = http.createServer(app);
        app.use(morgan('combined'));
        app.use(express.json({
            reviver: reviveJson
        }));

        app.use('/api', router);

        httpServer.listen(port)
            .on('listening', () => {
                console.log(`Web server ouvindo em localhost:${port}`);

                resolve();
            })
            .on('error', err => {
                reject(err);
            });
    });
}

 /**
 * Função responsavel pelo fechamento da conexão com banco de dados
 * ou noso pool 
 */

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

module.exports.close = close;

module.exports.initialize = initialize;

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
    // revive ISO 8601 date strings to instances of Date
    if (typeof value === 'string' && iso8601RegExp.test(value)) {
        return new Date(value);
    } else {
        return value;
    }
}

 
// app.listen(port, function() {
//     console.log('Web server listening on localhost:' + port);
// });