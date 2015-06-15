var os = require('os');

global.Money = {
    logger: null,
    db: {
        pool: null
    },
    redis: null
};

Money.config = {
    logging: {
        toConsole: false,
        toFile: false
    },

    server: {
        secure: false
    },

    db: {
    },

    io: {
        port: 3000,
        serverOptions: {
        }
    },

    redis: {
        host: 'localhost',
        port: 6379,
        password: null
    }
};

switch (os.hostname()) {
    case 'jura-pc':
        require('./local.js');
        break;
    case 'group.profsoyuz.pro':
        require('./prod.js');
        break;
    default:
        console.log('Unknown hostname "' + os.hostname() + '"');
        process.exit(1);
}
