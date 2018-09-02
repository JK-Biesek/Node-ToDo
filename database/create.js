let queries = require('./scripts');
const databaseQueries = (req,res) => {
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
module.exports = { databaseQueries };
