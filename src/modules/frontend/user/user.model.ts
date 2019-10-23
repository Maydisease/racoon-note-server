import {_User}         from '../../../entities/user.entity';
import {_NoteCategory} from '../../../entities/note.category.entity';
import {Connection}    from 'typeorm';

export class UserModel {

    public tableUser;
    public tableNoteCategory;

    constructor(private readonly connection: Connection) {
        this.tableUser         = _User;
        this.tableNoteCategory = _NoteCategory;
    }

    getUserData() {
        console.log('');
    }

    // 验证用户是否存在于表中
    verifyUserExist(username: string): Promise<number> {
        return this.connection
                   .getRepository(this.tableUser)
                   .createQueryBuilder()
                   .where('username = :username', {username})
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
                select: ['userId', 'username', 'options', 'inputTime', 'updateTime'],
                where : [
                    {username, password},
                ],
            },
        );
    }

    verifySignState(username: string, userId: string, password: string, inputTime: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableUser)
                   .createQueryBuilder()
                   .where('username = :username', {username})
                   .andWhere('userId = :userId', {userId})
                   .andWhere('password = :password', {password})
                   .andWhere('inputTime = :inputTime', {inputTime})
                   .getCount();
    }

    updateLastTime(userId: string, lastTime: number) {
        const body: any = {lastTime};
        return this.connection
                   .createQueryBuilder()
                   .update(this.tableUser)
                   .set(body)
                   .where('userId = :userId', {userId})
                   .execute();
    }

    updateUserPassword(username: string, password: string, updateTime: number) {

        const setBody: any = {
            password,
            updateTime,
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableUser)
                   .set(setBody)
                   .where('username = :username', {username})
                   .execute();
    }

    userInit(categoryParams) {
        if (categoryParams.uid) {
            return this.connection
                       .createQueryBuilder()
                       .insert()
                       .into(this.tableNoteCategory)
                       .values([categoryParams])
                       .printSql()
                       .execute();
        }
    }
}
