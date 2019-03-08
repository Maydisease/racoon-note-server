import {CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService}                                                                  from "../modules/frontend/user/user.service";

@Injectable()
export class UserLoginOAuthGuard implements CanActivate {

    public whileList: Array<string>;
    public onWhileList: boolean;
    public userService: UserService;

    constructor(
        @Inject('toolsService') public toolsService
    ) {
        this.onWhileList = true;
        this.userService = new UserService();
        this.whileList   = ['/User', 'logs']
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        let isLoginState = false;
        const headers    = context.switchToHttp().getRequest().headers;

        console.log(555, headers);

        if (this.onWhileList) {

            this.whileList.some((item: string): boolean | void | any => {
                item               = item.toLowerCase();
                const path: string = context.switchToHttp().getRequest().path.toLowerCase();
                if (path.indexOf(item) === 0) {
                    isLoginState = true;
                }
            });
        }

        if (!isLoginState) {
            try {

                const userParams = this.toolsService.decodeUserToken(headers['auth-token']);
                const params     = this.toolsService.filterInvalidParams({
                    username : String(userParams.username),
                    userId   : String(userParams.userId),
                    password : String(userParams.password),
                    inputTime: Number(userParams.inputTime)
                });

                context.switchToHttp().getRequest()['userInfo'] = params;

                isLoginState = await this.userService.verifySignState(params.username, params.userId, params.password, params.inputTime);

            } catch (e) {
                isLoginState = false;
            }
        }

        if (!isLoginState) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error : 'Invalid token',
            }, 4000);
        }

        return isLoginState;
    }
}