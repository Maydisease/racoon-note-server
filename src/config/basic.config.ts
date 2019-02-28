import * as path from 'path';
import * as fs   from 'fs';

export default {
    PATH: {
        BASIC: path.join(__dirname, '../../')
    },
    KEYS: {
        PRIVATE: fs.readFileSync(path.join(__dirname, '../../keys/note_key')),
        PUBLIC : fs.readFileSync(path.join(__dirname, '../../keys/note_key.pub'))
    },
    ASE: {
      KEY: '9vApxLk5G3PAsJrM',
      IV: 'FnJL7EDzjqWjcaY9'
    },
    DB  : {
        DB_TYPE    : process.env.DB_TYPE,
        DB_HOST    : process.env.DB_HOST,
        DB_PORT    : process.env.DB_PORT,
        DB_DATABASE: process.env.DB_DATABASE,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD
    },
    APP : {
        APP_RUN_HOST: process.env.APP_RUN_HOST,
        APP_RUN_PORT: process.env.APP_RUN_PORT
    }
}