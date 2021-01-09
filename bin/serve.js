/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const morgan = require('morgan');

const server = express();
server.use(morgan('common'));
se