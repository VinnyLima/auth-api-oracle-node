var oracledb = require('oracledb');
var config = require('../ConfigData/database');
 
function get(req, res, next) {
    oracledb.getConnection(
        config.hrPool,
        function(err, connection){
            if (err) {
                return next(err);
            }
 console.log(req.params);
            connection.execute(
                `select column1 as "Autentication"
                from hr.jsao_public_things 
                 `,
                {
                    
                },//no binds
                {
                    outFormat: oracledb.OBJECT
                },
                function(err, results){
                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });
 
                        return next(err);
                    }
 
                    res.status(200).json(results.rows);
 
                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
        }
    );
}
 
module.exports.get = get;