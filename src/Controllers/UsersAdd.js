var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../ConfigData/database');
const dbConnClosed = require('../Service/database');

const qryUpdate = `update jsao_users usu  
SET usu.password = :password
where usu.email = :email`

async function update(user) {
    const binds = {};
    if (user) {
        binds.email = user.email;
        binds.password = user.password;

        const result = await dbConnClosed.simpleExecute(qryUpdate, binds);
        return result
    }

}

function post(req, res, next) {
    var user = {
        email: req.body.email
    };
    var unhashedPassword = req.body.password;

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(unhashedPassword, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;

            const rows = update(user);

            // payload = {
            //              sub: user.email,
                         
            //          };
                
            //          res.status(200).json({
            //              user: user,
            //              token: jwt.sign(payload, config.jwtSecretKey, {expiresIn: 360})
            //          });

            if(rows.length > 0){
                res.status(200).json(rows[0]);
            }else{
                res.status(404).end();
            }
        });


    });
}

module.exports.post = post;

// insertUser(user, function(err, user) {
//     var payload;

//     if (err) {
//         return next(err);
//     }

//     payload = {
//         sub: user.email,
//         role: user.role
//     };

//     res.status(200).json({
//         user: user,
//         token: jwt.sign(payload, config.jwtSecretKey, {expiresIn: 360})
//     });
// });



// function insertUser(user, cb) {
//     oracledb.getConnection(
//         config.hrPool,
//         function (err, connection) {
//             if (err) {
//                 return cb(err);
//             }

//             connection.execute(
//                 `update jsao_users usu  
//                 SET usu.password = :password
//                 where usu.email = :email`,
//                 {
//                     email: user.email.toLowerCase(),
//                     password: user.hashedPassword,

//                 },
//                 {
//                     autoCommit: true
//                 },
//                 function (err, results) {
//                     if (err) {
//                         connection.release(function (err) {
//                             if (err) {
//                                 console.error(err.message);
//                             }
//                         });

//                         return cb(err);
//                     }

//                     cb(null, {
//                         id: results.outBinds.id[0],
//                         email: results.outBinds.email[0],

//                     });

//                     connection.release(function (err) {
//                         if (err) {
//                             console.error(err.message);
//                         }
//                     });
//                 });
//         }
//     );
// }