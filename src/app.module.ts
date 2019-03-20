import {Module}          from '@nestjs/common';
import {AppController}   from './app.controller';
import {AppService}      from './app.service';
import {TypeOrmModule}   from '@nestjs/typeorm';
import {DBConf}          from './config/typeorm_conf';
import {BackstageModule} from './modules/backstage/backstage.module';
import {FrontendModule}  from './modules/frontend/frontend.module';


@Module({
    imports    : [
        BackstageModule,
        FrontendModule,
        TypeOrmModule.forRoot(DBConf)
    ],
    controllers: [AppController],
    providers  : [AppService],
})
export class AppModule {
    constructor() {

    }
}
