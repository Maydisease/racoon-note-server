import {_User}      from '../../../entities/user.entity';
import {Connection} from 'typeorm';

export class UserModel {

    public tableUser;

    constructor(private readonly connection: Connection) {
        this.tableUser = _User;
    }

    getUserData() {

    }

    // 验证用户是否存在于表中
    verifyUserExist(username: string): Promise<number> {
        return this.connection
                   .getRepository(this.tableUser)
                   .createQueryBuilder()
                   .where("username = :username", {username: username})
                   .getCount();
    }

    // 插入用户数据
    addUserData(params: object): Promise<object> {
        return this.connection
                   .createQueryBuilder()
                   .insert()
                   .into(this.tableUser)
                   .values([params])
                   .printSql()
                   .execute();
    }

    verifyUserValidity(username: string, password: string): Promise<object> {
        return this.connection.getRepository(this.tableUser).find(
            {
                select: ["userId", "username", "options", "inputTime", "updateTime"],
                where : [
                    {username, password}
                ]
            }
        );
    }

    verifySignState(username: string, userId: string, password: string, inputTime: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableUser)
                   .createQueryBuilder()
                   .where("username = :username", {username: username})
                   .andWhere("userId = :userId", {userId: userId})
                   .andWhere("password = :password", {password: password})
                   .andWhere("inputTime = :inputTime", {inputTime: inputTime})
                   .getCount();
    }

    updateLastTime(userId: string, lastTime: number) {
        return this.connection
                   .createQueryBuilder()
                   .update(this.tableUser)
                   .set({lastTime: lastTime})
                   .where("userId = :userId", {userId})
                   .execute();
    }

    updateUserData() {

    }

    removeUserData() {

    }
}