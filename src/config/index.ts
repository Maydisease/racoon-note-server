import developmentConf from './development.config';
import productionConf  from './production.config';
import testConf        from './test.config';
import basicConf       from './basic.config';

let conf: any = {};

switch (process.env.APP_ENV) {
    case 'development':
        conf = Object.assign(basicConf, developmentConf);
        break;
    case 'production':
        conf = Object.assign(basicConf, productionConf);
        break;
    default:
        conf = Object.assign(basicConf, testConf);
        break;
}

export default conf;