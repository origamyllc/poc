'use strict';

var PrettyStream = require('bunyan-prettystream');

var prettyStdOut = new PrettyStream();

prettyStdOut.pipe(process.stdout);

module.exports = prettyStdOut;
