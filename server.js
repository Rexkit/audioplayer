const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'app')));

app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:8080'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/**
 * Utils
 */

const handleFolder = async (folder) => {
    fs.access(folder, (err) => {
        if (err && err.code === 'ENOENT') {
            fs.mkdir(folder, (error) => {
                console.log(error);
            });
        }
    });
}

/**
 * Routes
 */

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/uploads/:user/', async (req, res) => {
    try {
        const username = req.params.user;
        const userFolder = __dirname + '/uploads/' + username;
        let data = [];
        await handleFolder(userFolder);
        fs.readdir(userFolder, (err, files) => {
            if (err != null) console.log(err);
            if (files) {
                files.forEach(file => {
                    data.push(file);
                });
            }
            res.send(data);
        });
    } catch (error) {
        console.log(error);
    }
    
});

/**
 * Server cfg
 */

app.set('port', 3000);
app.listen(app.get('port'), function() {
    console.log('Node App Started');
});