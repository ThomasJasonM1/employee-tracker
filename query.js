const sql = require('mysql');

module.exports = (sqlString, object, cb) => {
    console.log(sqlString);
    const connection = sql.createConnection({
        port: 3306,
        host: "localhost",
        user: "root",
        password: "password",
        database: "my_workforce_db"
    });

    connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
        
    console.log("connected as id " + connection.threadId);
    });

    connection.query(sqlString, object, (err, result) => {
        if (err) return console.log(err);
        connection.end();
        return cb(result);
        // console.log(result);
    })
};