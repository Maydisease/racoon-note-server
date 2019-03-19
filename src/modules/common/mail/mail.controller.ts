import {Body, Controller, Get} from '@nestjs/common';
import {UserService}           from './mail.service';

@Controller('mail')
export class MailController {

    constructor() {

    }

    // 获取分类数据
    @Get('send')
    async send(@Body() body) {

        const mailOptions = {
            to     : `medivh@jollycorp.com`, // list of receivers
            subject: `找回登录密码 ✔`, // Subject line
            text   : `您开启了找回密码服务，验证码是：952981?`, // plain text body
            html   : `<b>您开启了找回密码服务，验证码是：952981?</b>` // html body
        };

        await new UserService().send(mailOptions);

        return 1;
    }

}
