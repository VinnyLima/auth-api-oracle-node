const webServer = require('./src/Service/server');
// *** line that requires services/web-server.js is here ***
const dbConfig = require('./src/ConfigData/database');
const defaultThreadPoolSize = 4;
//  *** line that requires services/web-server.js is here ***
const connDatabase = require('./src/Service/database');
// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;


async function startup() {

    try {
         await connDatabase.initialize();
         console.log('Inicializando conexão com banco');
    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
    console.log('Iniciando Aplicação');

    try {
               await webServer.initialize();
               console.log('Inicializando model Webserver');
    } catch (err) {
        console.error(err);

        process.exit(1); // Non-zero failure code
    }
}

startup();

async function shutdown(e) {
    let err = e;

    console.log('Desligando');

    try {
        console.log('Fechando modulo webserver');

        await webServer.close();
    } catch (e) {
        console.log('Ero Encontrado', e);

        err = err || e;
    }

    try {
        console.log('Fechando conexções do banco');

        await database.close();
    } catch (err) {
        console.log('Encountered error', e);

        err = err || e;
    }

    console.log('Saindo do proceso');

    if (err) {
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    }
}

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');

    shutdown();
});

process.on('SIGINT', () => {
    console.log('Received SIGINT');

    shutdown();
});

process.on('uncaughtException', err => {
    console.log('Uncaught exception');
    console.error(err);

    shutdown(err);
});