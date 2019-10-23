import {Body, Controller, Headers, Inject, Post, UseGuards} from '@nestjs/common';
import {storeService}                                       from '../../../common/service/store.service';

interface AddUserDataBody {
    username: string;
    password: string;
    options: object | '';
    updateTime: number;
    inputTime: number;
    userId?: string;
}

interface VerifySignStateBody {
    token: string;
}

interface SignInBody {
    username: string;
    password: string;
    lastTime: number;
}

@UseGuards()
@Controller('user')
export class UserController {

    public forgetPasswordCodeTimer: boolean;

    constructor(
        @Inject('toolsService') public toolsService,
        @Inject('userService') public userService,
        @Inject('echoService') public echoService,
        @Inject('mailService') public mailService,
        @Inject('errorService') public errorService,
    ) {
        this.forgetPasswordCodeTimer = false;
    }

    // 获取分类数据
    @Post('getUserData')
    async getUserData(@Body() body) {
        console.log('null');
    }

    // 异步验证状态
    @Post('asyncVerifyUser')
    async asyncVerifyUser(@Body() body): Promise<object> {

        const params = {
            username: String(body.username || ''),
        };

        // 用户存在
        if (await this.userService.verifyUserExist(params.username)) {
            return this.echoService.success({state: 1});
        } else {
            return this.echoService.success({state: 2});
        }

    }

    @Post('verifyUserExist')
    async verifyUserExist(@Body() body): Promise<object> {

        const params = {
            username: String(body.username || ''),
        };

        // 用户名已被占用
        if (await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1006, this.errorService.error.E1006);
        }

        return this.echoService.success();
    }

    // 插入用户数据
    @Post('addUserData')
    async addUserData(@Body() body): Promise<object> {

        // 格式化数据
        const timestamp               = new Date().getTime();
        const params: AddUserDataBody = this.toolsService.filterInvalidParams({
            username  : String(body.username),
            password  : String(body.password),
            options   : '',
            updateTime: timestamp,
            inputTime : timestamp,
        });

        // 账号不符合邮箱规则
        if (!(params.username && new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/).test(params.username))) {
            return this.echoService.fail(1007, this.errorService.error.E1007);
        }

        // 密码不一致 or 不符合规则
        if (!(params.password === body.repassword && new RegExp(/^[0-9a-zA-Z]{6,16}$/).test(params.password))) {
            return this.echoService.fail(1018, this.errorService.error.E1018);
        }

        // 用户名已被占用
        if (await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1016, this.errorService.error.E1016);
        }

        params.password    = this.toolsService.getMD5(params.password);
        params.userId      = this.userService.buildUserId(params.username, timestamp);
        const response     = await this.userService.addUserData(params);

        // 写入数据失败
        if (!(response && response.raw.insertId > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        const initResponse = await this.userService.userInit(params.userId, params.inputTime);

        if (!(initResponse && initResponse.raw.insertId > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);
    }

    @Post('signIn')
    async signIn(@Body() body) {

        // 格式化数据
        const timestamp          = new Date().getTime();
        const params: SignInBody = this.toolsService.filterInvalidParams({
            username: String(body.username),
            password: String(body.password),
            lastTime: timestamp,
        });

        // 用户名不存在
        if (!params.username || !await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1004, this.errorService.error.E1004);
        }

        // 密码不符合规则
        if (!params.password || !(new RegExp(/^[0-9a-zA-Z]{6,16}$/).test(params.password))) {
            return this.echoService.fail(1009, this.errorService.error.E1009);
        }

        params.password = this.toolsService.getMD5(params.password);
        const response  = await this.userService.verifyUserValidity(params.username, params.password);

        // 用户存在
        if (typeof response === 'object' && response.length > 0) {
            const getUserToken = this.toolsService.encodeUserToken(response[0].username, response[0].userId, params.password, response[0].inputTime);
            await this.userService.updateLastTime(response[0].userId, params.lastTime);
            const responseBody = Object.assign({
                token        : getUserToken,
                private_space: this.toolsService.getMD5(response[0].userId),
            }, response[0]);

            return this.echoService.success(responseBody);
        } else {
            return this.echoService.fail(1020, this.errorService.error.E1020);
        }

    }

    @Post('verifySignState')
    public async verifySignState(@Headers() headers): Promise<object> {

        const authToken: string = String(headers['auth-token']);

        // 用户名不存在
        if (!authToken) {
            return this.echoService.fail(1015, this.errorService.error.E1015);
        }

        const userParams = this.toolsService.decodeUserToken(authToken);

        if (!userParams) {
            return this.echoService.fail(1015, this.errorService.error.E1015);
        }

        const params = this.toolsService.filterInvalidParams({
            username : String(userParams.username),
            userId   : String(userParams.userId),
            password : String(userParams.password),
            inputTime: Number(userParams.inputTime),
        });

        const response = await this.userService.verifySignState(params.username, params.userId, params.password, params.inputTime);

        if (!response) {
            return this.echoService.fail(1015, this.errorService.error.E1015);
        }

        return this.echoService.success();

    }

    @Post('changeUserPassword')
    public async verifyForgetPasswordMailCode(@Body() body) {
        const timestamp = new Date().getTime();
        const params    = this.toolsService.filterInvalidParams({
            username  : String(body.username),
            verifycode: String(body.verifycode),
            password  : String(body.password),
            updateTime: timestamp
        });

        if (!(
            storeService.storeList['forgetPasswordCode'] &&
            storeService.storeList['forgetPasswordCode'][params.verifycode] &&
            storeService.storeList['forgetPasswordCode'][params.verifycode].expireDate > timestamp &&
            storeService.storeList['forgetPasswordCode'][params.verifycode].username === params.username
        )) {
            storeService.remove('forgetPasswordCode', params.verifycode);
            return this.echoService.fail(1021, this.errorService.error.E1021);
        }

        storeService.remove('forgetPasswordCode', params.verifycode);

        // 用户名不存在
        if (!params.username || !await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1004, this.errorService.error.E1004);
        }

        // 密码不符合规则
        if (!params.password || !(new RegExp(/^[0-9a-zA-Z]{6,16}$/).test(params.password))) {
            return this.echoService.fail(1019, this.errorService.error.E1019);
        }

        params.password = this.toolsService.getMD5(params.password);
        const response  = await this.userService.updateUserPassword(params.username, params.password, params.updateTime);

        if (response && response.raw && response.raw.changedRows > 0) {
            return this.echoService.success();
        } else {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

    }

    // 更新数据
    @Post('sendForgetPasswordVerifyMail')
    public async sendForgetPasswordVerifyMail(@Body() body) {

        const timestamp = new Date().getTime();
        const params    = this.toolsService.filterInvalidParams({
            username: String(body.username),
        });

        // if (this.forgetPasswordCodeTimer) {
        //     return this.echoService.fail(1203, 'verification code is being sent');
        // } else {
        //     this.forgetPasswordCodeTimer = true;
        // }

        // 账号不符合邮箱规则
        if (!(params.username && new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/).test(params.username))) {
            return this.echoService.fail(1017, this.errorService.error.E1017);
        }

        // 用户名不存在
        if (!params.username || !await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1004, this.errorService.error.E1004);
        }

        const randomCode = this.toolsService.randomGenerator(6);

        const mailOptions = {
            to     : params.username,
            subject: `racoon note 找回登录密码 ✔ 验证码：${randomCode}`,
            text   : `您使用了 racoon note 提供的找回登录密码服务，验证码是：${randomCode} 请勿泄露给其他人`,
            html   : `<b>您使用了 racoon note 提供的找回登录密码服务，验证码是：<em style='color: red'>${randomCode}</em> 请勿泄露给其他人</b>`,
        };

        const sendMailResponse       = await this.mailService.send(mailOptions);
        this.forgetPasswordCodeTimer = true;

        if (sendMailResponse.messageId) {
            const forgetPasswordCodeBody = {
                username  : params.username,
                expireDate: timestamp + 30000,
            };
            storeService.put('forgetPasswordCode', randomCode, forgetPasswordCodeBody);
            return this.echoService.success();
        } else {
            return this.echoService.fail(1022, this.errorService.error.E1022);
        }

    }

    // 删除数据
    @Post('removeUserData')
    removeUserData() {
        return 'removeUserData';
    }

}
