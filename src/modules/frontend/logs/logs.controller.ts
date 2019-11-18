import {Body, Controller, Headers, Inject, Get, Query, Param, UseGuards, UsePipes} from '@nestjs/common';
import {ValidationPipe}                                                            from "./validation.pipe";


@Controller('logs')
export class LogsController {

    constructor() {
    }

    // 获取分类数据
    @UsePipes(new ValidationPipe())
    @Get('echo')
    async echoLogs(@Query() query) {
        return {}
    }

}
