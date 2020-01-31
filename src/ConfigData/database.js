module.exports = {
    hrPool: {
        user: 'system',
        password: 'oracle',
        connectString: 'localhost:49161/xe',
        poolMin: 20,
        poolMax: 20,
        poolIncrement: 0
    },
    jwtSecretKey: "jmvhDdDBMvqb=M@6h&QVA7x"
};

/*

module.exports = {
    hrPool: {
        user: process.env.HR_USER || 'sankhya',
        password: process.env.HR_PASSWORDv|| 'civittsnk',
        connectString: process.env.HR_CONNECTIONSTRING || '192.168.1.246:1521/orcl',
        poolMin: 20,
        poolMax: 20,
        poolIncrement: 0
    }
};
*/