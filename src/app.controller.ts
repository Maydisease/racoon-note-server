import {Body, Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    async main() {
        return 200;
    }

}
