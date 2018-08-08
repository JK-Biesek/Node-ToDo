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
    if (err) {
        logger.error(`Can not connect !`);
    } else {
        logger.info(`Connected to the Postgres database, command ${res.command} successfull executed ! `);
    }
    pool.end();
});

const client = new Client({
    connectionString: connectionString,
});
client.connect();
/* client.query('SELECT NOW()', (err, res) => {
   console.log(err, res)
   client.end()
 })*/

app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    client.connect(() => {
        client.query('SELECT * FROM public."toDo"', (err, result) => {
            if (err) {
                console.log(err.stack);
                logger.info(`Something went wrong ${err.stack}`);
            } else {
                logger.info(`Command ${result.command} successfull executed ! `);
            }
            res.render('index', { toDo: result.rows });
            client.end();
        });
    });
});

app.post('/addTask', (req, res, err) => {
    if (err) {
        logger.error(`Something went wrong ${err.stack}`);
    }
        const insert = {
            text: 'INSERT INTO  public."toDo" (task, description,directions) VALUES($1, $2, $3)',
            values: [req.body.task, req.body.description, req.body.directions],
          }
        client.query(insert,(error,result)=>{
            if (err) {
                logger.error(`Something went wrong !! ${err.stack}`);
            } else {
                logger.info(`Command ${result.command} successfull executed ! \n added ${req.body.task, req.body.description, req.body.directions} to database`);
            }
        });
        res.redirect('/');
  
});

app.listen(port, () => {
    console.log(`App is listening to port:${port}`);
}).on('listening', () => logger.info(`HTTP server is listening on port ${port}`)); 
