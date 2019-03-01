import * as path   from 'path';
import * as dotenv from 'dotenv';

let testEnvConfPath: string;

switch(process.env.APP_ENV){
    case 'development': 
        testEnvConfPath = path.join(__dirname, '../../env/test.env');
    break;
    case 'production': 
        testEnvConfPath = path.join(__dirname, '../../../env/test.env');
    break;
}

const testEnvConf = dotenv.config({path: testEnvConfPath}).parsed;

console.log(777, testEnvConf);

export default {
    DB : {
        DB_TYPE    : testEnvConf.DB_TYPE,
        DB_HOST    : testEnvConf.DB_HOST,
        DB_PORT    : testEnvConf.DB_PORT,
        DB_DATABASE: testEnvConf.DB_DATABASE,
        DB_USERNAME: testEnvConf.DB_USERNAME,
        DB_PASSWORD: testEnvConf.DB_PASSWORD
    },
    APP: {
        APP_RUN_HOST: testEnvConf.APP_RUN_HOST,
        APP_RUN_PORT: testEnvConf.APP_RUN_PORT
    }
}