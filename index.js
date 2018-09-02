let express = require('express');
let bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
let cons = require('consolidate');
let dust = require('dustjs-helpers');
let path = require('path');
let createTableQ = require('./database/create');
let queries = require('./database/scripts');

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
            //client.end();
        });
    });
});

app.post('/addTask', (req, res) => {

    const insert = {
        text: 'INSERT INTO  public."toDo" (task, description,directions) VALUES($1, $2, $3)',
        values: [req.body.task, req.body.description, req.body.directions],
    }
    client.query(insert, (err, result) => {
        if (err) {
            logger.error(`Something went wrong !! ${err.stack}`);
        } else {
            logger.info(`Command ${result.command} successfull executed ! Task ${req.body.task} added to database`);
        }
        //client.end();
    });
    res.redirect('/');

});

app.post('/delete', (req, res) => {
    let deleteTask = {
        text: 'DELETE FROM public."toDo" WHERE id = $1',
        values: [req.body.id],
    }
    client.query(deleteTask,(err,result)=>{
        if(err){
            logger.error(`Something went wrong during deletion of object ${req.body.id}-->${err.stack}`);
        } else{
            logger.info(`Command ${result.command} successfull executed ! Task ${req.body.id} Deleted from the database`);
        }
       // client.end();
    });
    res.redirect('/');
});

app.post('/deleteAll', function(req, res){
    let msg = 'All task successfully deleted';
	if(req.body.message != "") {
        let deleteAll_Query = {
            text: 'DELETE FROM public."toDo"'
        }
        client.query(deleteAll_Query,(err)=>{
            if(err){
                logger.error(`Something went wrong during deletion of all objects --> ${err.stack}`);
            } else{
                logger.info(`${req.body.title} successfull executed !`);
            }
        });
    }
    res.send(msg);
    res.redirect('/');
});

app.post('/editTask',(req,res)=>{
    let msgError;
    if(req.body.id != undefined ){  
        let queryEdit = { text: 'UPDATE public."toDo" SET task =$1, description = $2 ,directions = $3 WHERE id = $4',
        values: [req.body.task, req.body.description, req.body.directions,req.body.id]};

        client.query(queryEdit,(err,result)=>{
            if (err) {
                logger.error(`Something went wrong !! ${err.stack}`);
            } else {
                logger.info(`Command ${result.command} successfull executed ! Task ${req.body.id} Editted`);
            }
            //client.end();
        });
    } else {
        msgError = '/views/error.html';
        return  res.sendFile(path.join(__dirname + msgError));
    }
  
    res.redirect('/');
});

const databaseQueries = (req,res) => {
    
}
app.get('/createTable',(req,res)=>{
    client.query(queries.createDatabase, (err, result) => {
        if (err) {
            logger.error(`Something went wrong !! ${err.stack}`);
        } else {
            logger.info(`Command ${result.command} Database successfull executed !`);
            client.query(queries.CreateTable, (err, result) => {
                if (err) {
                    logger.error(`Something went wrong !! ${err.stack}`);
                } else {
                    logger.info(`Command ${result.command} Table successfull executed !`);
                    client.query(queries.ownerQery, (err, result) => {
                        if (err) {
                            logger.error(`Something went wrong !! ${err.stack}`);
                        } else {
                            logger.info(`Command ${result.command} Owner successfull executed !`);
                            client.query(queries.columnId, (err, result) => {
                                if (err) {
                                    logger.error(`Something went wrong !! ${err.stack}`);
                                } else {
                                    logger.info(`Command ${result.command} Primary Key successfull executed !`);
                                    client.query(queries.columnTask, (err, result) => {
                                        if (err) {
                                            logger.error(`Something went wrong !! ${err.stack}`);
                                        } else {
                                            logger.info(`Command ${result.command} Task Added successfull executed !`);
                                            client.query(queries.columnDesc, (err, result) => {
                                                if (err) {
                                                    logger.error(`Something went wrong !! ${err.stack}`);
                                                } else {
                                                    logger.info(`Command ${result.command} Description Added successfull executed !`);
                                                    client.query(queries.columnDir, (err, result) => {
                                                        if (err) {
                                                            logger.error(`Something went wrong !! ${err.stack}`);
                                                        } else {
                                                            logger.info(`Command ${result.command} Direction Added successfull executed !`);
                                                            //need to add Info page then redirect 
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`App is listening to port:${port}`);
}).on('listening', () => logger.info(`HTTP server is listening on port ${port}`)); 
