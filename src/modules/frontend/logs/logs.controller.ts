import {Body, Controller, Headers, Inject, Post, UseGuards} from '@nestjs/common';

@Controller('logs')
export class LogsController {

    constructor(
        @Inject('echoService') public echoService
    ) {
    }

    // 获取分类数据
    @Post('echo')
    async echoLogs(@Body() body) {
        return this.echoService.success();
    }

}
