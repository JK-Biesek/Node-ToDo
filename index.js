let express = require('express');
let bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
let cons = require('consolidate');
let dust = require('dustjs-helpers');
let path = require('path');

const logger = require('./logger/logger');
const app = express();
const port = 3000;

//ADD DB connection
const connectionString = 'postgres://postgres:123@localhost:5432/toDoDb';
const pool = new Pool({
    connectionString: connectionString,
});
pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});

const client = new Client({
    connectionString: connectionString,
})
client.connect();

app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    const query = {
        text: 'SELECT task FROM public."toDo" where id = 1',
        rowMode: 'array',
    };
    client.query(query, (err, res, done) => {
        // let   newarr = res.fields.map((f,i,) =>{ return f.name});
        //console.log(newarr); // ['first_name', 'last_name']
        console.log(res.rows); // ['Brian', 'Carlson']
        done();
        res.render('index', { toDo: res.rows });
    });
    
});

app.listen(port, () => {
    console.log(`App is listening to port:${port}`);
}).on('listening', () => logger.info(`HTTP server is listening on port ${port}`)); 
