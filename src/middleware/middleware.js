// middleware.js
const express = require('express');

const imgMiddleware = express.static(__dirname + '..' + '/imgs', {
    setHeaders: (res, path) => {
        if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        } else if (path.endsWith('.gif')) {
            res.setHeader('Content-Type', 'image/gif');
        } else if (path.endsWith('.bmp')) {
            res.setHeader('Content-Type', 'image/bmp');
        }
    }
});

const tempMiddleware = express.static(__dirname + '..' + '/imgs/temp', {
    setHeaders: (res, path) => {
        if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        } else if (path.endsWith('.gif')) {
            res.setHeader('Content-Type', 'image/gif');
        } else if (path.endsWith('.bmp')) {
            res.setHeader('Content-Type', 'image/bmp');
        }
    }
});

module.exports = {
    imgMiddleware,
    tempMiddleware
    // ... Add other middleware functions as needed ...
  };
  