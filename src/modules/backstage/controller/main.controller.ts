import {Controller, Get, Inject, UseGuards} from '@nestjs/common';
import {TestGuard}                          from '../test.guard';

@Controller('api/admin')
export class MainController {

    constructor(@Inject('MainService') public mainService) {
    }

    @Get()
    async getHello() {
        return {hello: 'hello'}
    }
}
