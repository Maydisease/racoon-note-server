import {Body, Controller, Headers, Inject, Post, UseGuards} from '@nestjs/common';

interface addUserDataBody {
    username: string,
    password: string,
    options: object | '',
    updateTime: number,
    inputTime: number,
    userId?: string
}

interface verifySignStateBody {
    token: string
}

interface signInBody {
    username: string,
    password: string,
    lastTime: number
}

@UseGuards()
@Controller('user')
export class UserController {

    constructor(
        @Inject('toolsService') public toolsService,
        @Inject('userService') public userService,
        @Inject('echoService') public echoService
    ) {
    }

    // 获取分类数据
    @Post('getUserData')
    async getUserData(@Body() body) {

    }

    // 异步验证状态
    @Post('asyncVerifyUser')
    async asyncVerifyUser(@Body() body): Promise<object> {

        const params = {
            username: String(body.username || '')
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
            username: String(body.username || '')
        };

        // 用户名已被占用
        if (await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1002, "Username already exists");
        }

        return this.echoService.success();
    }

    // 插入用户数据
    @Post('addUserData')
    async addUserData(@Body() body): Promise<object> {

        // 格式化数据
        const timestamp               = new Date().getTime();
        const params: addUserDataBody = this.toolsService.filterInvalidParams({
            username  : String(body.username),
            password  : String(body.password),
            options   : '',
            updateTime: timestamp,
            inputTime : timestamp
        });

        // 账号不符合规则
        if (!(params.username && new RegExp(/^[a-zA-Z][0-9a-zA-Z]{5,11}$/).test(params.username))) {
            return this.echoService.fail(1000, "Username should be 6-12 digits long, with underscore letters and numbers");
        }

        // 密码不一致 or 不符合规则
        if (!(params.password === body.repassword && new RegExp(/^[0-9a-zA-Z]{6,16}$/).test(params.password))) {
            return this.echoService.fail(1001, "Password twice inconsistencies");
        }

        // 用户名已被占用
        if (await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1002, "Username already exists");
        }

        params.password = this.toolsService.getMD5(params.password);
        params.userId   = this.userService.buildUserId(params.username, timestamp);
        const response  = await this.userService.addUserData(params);

        // 写入数据失败
        if (!(response && response.raw.insertId > 0)) {
            return this.echoService.fail(9001, "Data write failed");
        }

        return this.echoService.success(response);
    }

    @Post('signIn')
    async signIn(@Body() body) {

        // 格式化数据
        const timestamp          = new Date().getTime();
        const params: signInBody = this.toolsService.filterInvalidParams({
            username: String(body.username),
            password: String(body.password),
            lastTime: timestamp
        });

        // 用户名不存在
        if (!params.username || !await this.userService.verifyUserExist(params.username)) {
            return this.echoService.fail(1003, "username does not exist");
        }

        // 密码不符合规则
        if (!params.password || !(new RegExp(/^[0-9a-zA-Z]{6,16}$/).test(params.password))) {
            return this.echoService.fail(1001, "Password does not match the rule");
        }

        params.password = this.toolsService.getMD5(params.password);
        const response  = await this.userService.verifyUserValidity(params.username, params.password);

        // 用户存在
        if (typeof response === 'object' && response.length > 0) {
            const getUserToken = this.toolsService.encodeUserToken(response[0].username, response[0].userId, params.password, response[0].inputTime);
            await this.userService.updateLastTime(response[0].userId, params.lastTime);
            const responseBody = Object.assign({
                token        : getUserToken,
                private_space: this.toolsService.getMD5(response[0].userId)
            }, response[0]);

            console.log(responseBody);

            return this.echoService.success(responseBody);
        } else {
            return this.echoService.fail(1004, "Username and password do not match");
        }

    }

    @Post('verifySignState')
    public async verifySignState(@Headers() headers): Promise<object> {

        const authToken: string = String(headers['auth-token']);

        // 用户名不存在
        if (!authToken) {
            return this.echoService.fail(4000, "Invalid token");
        }

        const userParams = this.toolsService.decodeUserToken(authToken);

        if (!userParams) {
            return this.echoService.fail(4000, "Invalid token");
        }

        const params = this.toolsService.filterInvalidParams({
            username : String(userParams.username),
            userId   : String(userParams.userId),
            password : String(userParams.password),
            inputTime: Number(userParams.inputTime)
        });

        const response = await this.userService.verifySignState(params.username, params.userId, params.password, params.inputTime);

        if (!response) {
            return this.echoService.fail(4000, "Invalid token");
        }

        return this.echoService.success();

    }

    // 更新数据
    @Post('updateUserData')
    updateUserData() {
        return 'updateUserData'
    }

    // 删除数据
    @Post('removeUserData')
    removeUserData() {
        return 'removeUserData'
    }

}
