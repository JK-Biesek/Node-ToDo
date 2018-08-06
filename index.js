let express = require('express');
let bodyParser = require('body-parser');
let pg = require('pg');
let cons = require('consolidate');
let dust = require('dustjs-helpers');
let path = require('path');

const logger = require('./logger/logger');
const app = express();
const port = 3000;

//ADD DB connection
const connect = "postgres://postgres:123@localhost/toDoDB";

app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views',__dirname + '/views');

app.use(express.static(path.join(__dirname,'public')));

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/',(req,res)=>{
    res.render('index');
});

app.listen(port, () => {
    console.log(`App is listening to port:${port}` );
}).on('listening',() => logger.info(`HTTP server is listening on port ${port}`)); 
