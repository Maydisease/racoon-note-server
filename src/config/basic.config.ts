import * as path from 'path';
import * as fs   from 'fs';

let privateKeyPath: string;
let publicKeyPath: string;
let attachedFilesPath: string;

switch (process.env.APP_ENV) {
    case 'development':
        privateKeyPath    = path.join(__dirname, '../../keys/note_key');
        publicKeyPath     = path.join(__dirname, '../../keys/note_key.pub');
        attachedFilesPath = path.join(__dirname, '../../attached_files');
        break;
    case 'production':
        privateKeyPath    = path.join(__dirname, '../../../keys/note_key');
        publicKeyPath     = path.join(__dirname, '../../../keys/note_key.pub');
        attachedFilesPath = path.join(__dirname, '../../../attached_files');
        break;
}

const privateKey = fs.readFileSync(privateKeyPath);
const publicKey  = fs.readFileSync(publicKeyPath);

export default {
    PATH: {
        BASIC         : path.join(__dirname, '../../'),
        ATTACHED_FILES: attachedFilesPath,
    },
    KEYS: {
        PRIVATE: privateKey,
        PUBLIC : publicKey,
    },
    ASE : {
        KEY: '9vApxLk5G3PAsJrM',
        IV : 'FnJL7EDzjqWjcaY9',
    },
    DB  : {
        DB_TYPE    : process.env.DB_TYPE,
        DB_HOST    : process.env.DB_HOST,
        DB_PORT    : process.env.DB_PORT,
        DB_DATABASE: process.env.DB_DATABASE,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
    },
    APP : {
        APP_RUN_HOST: process.env.APP_RUN_HOST,
        APP_RUN_PORT: process.env.APP_RUN_PORT,
    }
}
