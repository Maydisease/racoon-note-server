import {Module}         from '@nestjs/common';
import {MainController} from './controller/main.controller';
import {MainService}    from './service/main.service';

@Module({
    controllers: [MainController],
    providers: [
        { provide: MainService, useClass: MainService }
    ]
})

export class BackstageModule {
}