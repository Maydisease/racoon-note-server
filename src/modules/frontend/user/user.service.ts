import {Injectable}                from '@nestjs/common';
import {UserModel}                 from './user.model';
import {Connection, getConnection} from 'typeorm';
import * as crypto                 from 'crypto';

interface CategoryBody {
    name: string;
    uid: string;
    parent: number;
    count: number;
    iconText: string;
    iconColor: string;
    updateTime: number;
    inputTime: number;
    fn_code: string;
    is_super: number;
}

@Injectable()
export class UserService {

    public secret: string;
    public connection: Connection;

    constructor() {
        this.connection = getConnection();
        this.secret     = 'note';
    }

    // 生成用户唯一ID
    public buildUserId(username: string, timestamp: string): string {
        const value             = username + timestamp;
        const usernameSha256str = crypto.createHmac('sha256', this.secret).update(value).digest('hex');
        return usernameSha256str.substring(0, 13);
    }

    // 验证用户是否存在
    public async verifyUserExist(username: string): Promise<boolean> {
        return await new UserModel(this.connection).verifyUserExist(username) >= 1;
    }

    public getUserData() {
        return new UserModel(this.connection).getUserData();
    }

    // 插入用户数据
    public async addUserData(params: object): Promise<object> {
        return await new UserModel(this.connection).addUserData(params);
    }

    // 验证库中是否存在该用户
    public async verifyUserIdentity(username: string, password: string): Promise<object> {
        return await new UserModel(this.connection).verifyUserIdentity(username, password);
    }

    // 验证用户登录状态
    public async verifySignState(username: string, userId: string, password: string, inputTime: number): Promise<boolean> {
        return await new UserModel(this.connection).verifySignState(username, userId, password, inputTime) > 0;
    }

    // 更新用户最后一次登录的时间
    public async updateLastTime(userId: string, lastTime: number): Promise<object> {
        return await new UserModel(this.connection).updateLastTime(userId, lastTime);
    }

    // 更新用户密码
    public async updateUserPassword(username: string, password: string, updateTime: number) {
        return await new UserModel(this.connection).updateUserPassword(username, password, updateTime);
    }

    public async userInit(uid: string, inputTime: number) {

        const categoryParams: CategoryBody = {
            name      : 'tmp',
            uid       : uid,
            count     : 0,
            parent    : 0,
            iconText  : 'poetry',
            iconColor : 'default',
            inputTime : inputTime,
            updateTime: inputTime,
            fn_code   : 'tmp',
            is_super  : 1
        };

        return await new UserModel(this.connection).userInit(categoryParams);
    }
}
