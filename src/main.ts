import {NestFactory}         from '@nestjs/core';
import {AppModule}           from './app.module';
import CONFIG                from './config';
import * as bodyParser       from 'body-parser';
import {join}                from 'path';
import {HttpExceptionFilter} from './filters/http-exception.filter';
import * as sassMiddleware   from 'node-sass-middleware';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    app.enableCors();
    app.useStaticAssets(CONFIG.PATH.ATTACHED_FILES, {
        prefix: '/attached_files/',
    });
    app.useStaticAssets(CONFIG.PATH.STATICS, {
        prefix: '/statics/',
    });

    app.setBaseViewsDir(join(CONFIG.PATH.PROJECT_SRC, 'views'));
    app.setViewEngine('hbs');

    app.use(
        sassMiddleware({
            src        : join(CONFIG.PATH.PROJECT_SRC, 'scss'),
            dest       : CONFIG.PATH.STATICS,
            debug      : true,
            outputStyle: 'compressed',
            prefix     : '/statics'
        }),
    );

    await app.listen(CONFIG.APP.APP_RUN_PORT);
}

bootstrap();
