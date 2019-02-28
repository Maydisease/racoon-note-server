import {Test}           from '@nestjs/testing';
import {AppModule}      from '../../../app.module';
import {UserController} from './user.controller';
import {UserService}    from './user.service';
import {EchoService}    from '../../../common/service/echo.service';
import {ToolsService}   from "../../../common/service/tools.service";

describe('UserController', () => {

    let userController: UserController;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports    : [AppModule],
            controllers: [UserController],
            providers  : [
                {provide: 'toolsService', useClass: ToolsService},
                {provide: 'userService', useClass: UserService},
                {provide: 'echoService', useClass: EchoService}
            ],
        }).compile();

        userController = module.get(UserController);
    });

    describe('addUserData', () => {

        let username1 = undefined;
        it(`用户名不符合规则 - 字段不存在 username: ${username1}`, async () => {
            const body          = {"password": "a75577918", "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1000);
        });

        let username2 = 1111111;
        it(`用户名不符合规则 - 不是字母开头 username: ${username2}`, async () => {
            const body          = {"username": username2, "password": "a75577918", "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1000);
        });

        let username3 = 'asd4';
        it(`用户名不符合规则 - 太短 username: ${username3}`, async () => {
            const body          = {"username": username3, "password": "a75577918", "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1000);
        });

        let username4 = 't123456789123456789';
        it(`用户名不符合规则 - 太长 username: ${username4}`, async () => {
            const body          = {"username": username4, "password": "a75577918", "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1000);
        });

        let username5 = 'tandongsss?';
        it(`用户名不符合规则 - 意外的字符 username: ${username5}`, async () => {
            const body          = {"username": username5, "password": "a75577918", "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1000);
        });

        let password1 = 'a75577918?';
        it(`密码不符合规则 - 意外的字符 password: ${password1}`, async () => {
            const body          = {"username": 'tandongs', "password": password1, "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1001);
        });

        let password2 = 'a75?';
        it(`密码不符合规则 - 太短 password: ${password2}`, async () => {
            const body          = {"username": 'tandongs', "password": password2, "repassword": password2};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1001);
        });

        let password3 = 'a123123123123123123123123123?';
        it(`密码不符合规则 - 太长 password: ${password3}`, async () => {
            const body          = {"username": 'tandongs', "password": password3, "repassword": password3};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1001);
        });

        let password4   = 'a12312312312?';
        let repassword4 = 'aaaaaasssd?';
        it(`密码不符合规则 - 不一致 password: ${password4} repassword: ${repassword4}`, async () => {
            const body          = {"username": 'tandongs', "password": password4, "repassword": repassword4};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1001);
        });

        let randomUserName = 'tan' + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10);
        let username6      = randomUserName;
        it(`添加用户 - 添加成功 username: ${username6}`, async () => {
            const body          = {"username": username6, "password": "a75577918", "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(2000);
        });

        let username7 = randomUserName;
        it(`添加用户 - 用户存在 username: ${username7}`, async () => {
            const body          = {"username": username7, "password": "a75577918", "repassword": "a75577918"};
            const response: any = await userController.addUserData(body);
            expect(response.messageCode).toEqual(1002);
        });

    });

});