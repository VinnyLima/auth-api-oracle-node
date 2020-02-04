var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../ConfigData/database');
 
function post(req, res, next) {  
    
    oracledb.getConnection(
        config.hrPool,
        function(err, connection){
            if (err) {
                return next(err);
            }
            
            console.log(req.body);
            if(req.body.email){
                connection.execute(
                    'select id as "id", ' +
                    '   email as "email", ' +
                    '   password as "password", ' +
                    '   role as "role" ' +
                    'from jsao_users ' +
                    'where email = :email',
                    {
                        email: req.body.email
                    },
                    {
                        outFormat: oracledb.OBJECT
                    },
                    function(err, results){ 
                        var user;
     
                        if (err) {
                            connection.release(function(err) {
                                if (err)  {
                                    console.error(err.message);
                                }
                            });
     
                            return next(err);
                        }                           
                       
                        user = results.rows[0];
                        
     
                        bcrypt.compare(req.body.password, user.password, function(err, pwMatch) {
                            var payload; 

     
                            if (err) {
                                return next(err);
                            }
     
                            if (!pwMatch) {
                                res.status(401).send({message: 'Invalid email or password.'});
                                return;
                            }
     
                            payload = {
                                sub: user.email,
                                role: user.role
                            };
     
                            res.status(200).json({
                                user: user,
                                token: jwt.sign(payload, config.jwtSecretKey, {expiresIn: 240})
                            });
                        }); 
                        
     
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });
                    });
            }
            else{
                res.status(400).json({
                "Alerta" : "Não veio email junto"
            });
        }


            
        }
    );
}
 
module.exports.post = post;