const connection = require("../config/connection.js");

function questionmark(arryLen) {

    const arr = [];

    for (i = 0; i < arryLen; i++) {
      arr.push(`?`);
    }
  
    return arr.toString();    
}

function questionmarks(arryLen) {

    const arr = [];

    for (i = 0; i < arryLen; i++) {
      arr.push(`??`);
    }
  
    return arr.toString();    
}

const dataAccessLayer = {

    select: function(cols, table, callback) {

        const query = `SELECT ${questionmarks(cols.length)} FROM ${questionmarks(table.length)}`;
        const params = [...cols, ...table];

        connection.query(query, params, function(err, res) {
            if (err) throw err;
            callback(res);
            
        });

    },

    create: function(cols, vals, table, callback) {

        const query = `INSERT INTO ${questionmarks(table.length)} (${questionmarks(cols.length)}) VALUES (${questionmark(vals.length)})`;
        const params = [...table, ...cols, ...vals];

            connection.query(query, params, function(err, res) {
                if (err) throw err;
                console.log(`${vals} added to ${table}`);
                callback();
        });

    },

}

module.exports = dataAccessLayer;