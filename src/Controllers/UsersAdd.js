var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../ConfigData/database');
const dbConnClosed = require('../Service/database');

const qryUpdate = `update jsao_users usu  
SET usu.password = :password
where usu.email = :email`;

function post(req, res, next) {

    oracledb.getConnection(
        config.hrPool,
        function (err, connection) {
            if (err) {
                return next(err);
            }

            var user = {
                email: req.body.email
            };

            var password = req.body.password;

            if (user.email) {

                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        return next(err);
                    }

                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            return next(err);
                        }

                        user.password = hash;
                        console.log(user.password);

                        connection.execute(
                            qryUpdate,
                            {
                                email: user.email.toLowerCase(),
                                password: user.password                                
                            },
                            {
                                
                                autoCommit: true
                            },
                            function (err, results) {
                                
                                console.log(results);

                                if (err) {
                                    connection.release(function (err) {
                                        if (err) {
                                            console.error(err.message);
                                        }
                                    });

                                    return next(err);
                                }


                                connection.release(function (err) {
                                    if (err) {
                                        console.error(err.message);
                                    }
                                });
                            });

                        var payload;

                        if (err) {
                            return next(err);
                        }

                        payload = {
                            sub: user.email,
                            role: user.role
                        };

                        res.status(200).json({
                            user: user,
                            token: jwt.sign(payload, config.jwtSecretKey, { expiresIn: 360 })
                        });

                    });
                });

            }
            else {
                res.status(400).json({
                    "Alerta": "Não veio email junto"
                });
            }



        }
    );
}

module.exports.post = post;
