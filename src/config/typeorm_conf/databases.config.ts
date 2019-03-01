import CONFIG from '../index';

interface ConfInterface {
    type: any,
    host: string,
    port: string,
    username: string,
    password: string,
    database: string,

    [entities: string]: any,

    synchronize: boolean
}

const dbConf: ConfInterface = {
    type       : CONFIG.DB.DB_TYPE,
    host       : CONFIG.DB.DB_HOST,
    port       : CONFIG.DB.DB_PORT,
    username   : CONFIG.DB.DB_USERNAME,
    password   : CONFIG.DB.DB_PASSWORD,
    database   : CONFIG.DB.DB_DATABASE,
    entities   : [CONFIG.PATH.BASIC + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    charset: 'utf8mb4',
    logging    : true
};

export default dbConf;