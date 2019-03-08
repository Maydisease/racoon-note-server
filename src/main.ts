import {NestFactory}         from '@nestjs/core';
import {AppModule}           from './app.module';
import CONFIG                from './config';
import * as bodyParser       from 'body-parser';
import {HttpExceptionFilter} from './filters/http-exception.filter';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(CONFIG.APP.APP_RUN_PORT);
}

bootstrap();
