import {NestFactory}         from '@nestjs/core';
import {AppModule}           from './app.module';
import CONFIG                from './config';
import {HttpExceptionFilter} from './filters/http-exception.filter';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(CONFIG.APP.APP_RUN_PORT);
}

bootstrap();
