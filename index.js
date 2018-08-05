let express = require('express');
let bodyParser = require('body-parser');
let pg = require('pg');
let cons = require('consolidate');
let dust = require('dustjs-helpers');
let path = require('path');

const app = express();
const port = 3000;

app.listen(port,()=>{
    console.log(`App is listening to port :${port}`);
});