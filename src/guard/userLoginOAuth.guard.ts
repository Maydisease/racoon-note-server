import {CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService} from '../modules/frontend/user/user.service';

@Injectable()
export class UserLoginOAuthGuard implements CanActivate {

	public whileList: string[];
	public onWhileList: boolean;
	public userService: UserService;

	constructor(
		@Inject('toolsService') public toolsService,
		@Inject('errorService') public errorService
	) {
		this.onWhileList = true;
		this.userService = new UserService();
		this.whileList = ['/user', '/logs', '/mail', '/share'];
	}

	public echoTokenError() {
		throw new HttpException({
			status: HttpStatus.FORBIDDEN,
			error: this.errorService.error.E1015
		}, 1015);
	}

	async canActivate(
		context: ExecutionContext
	): Promise<boolean> {

		let isLoginState = false;
		const headers = context.switchToHttp().getRequest().headers;

		if (this.onWhileList) {

			this.whileList.some((item: string): any => {
				item = item.toLowerCase();
				const path: string = context.switchToHttp().getRequest().path.toLowerCase();

				if (path === '/' || path.indexOf(item) === 0) {
					isLoginState = true;
				}
			});
		}

		if (!isLoginState) {

			// 如果缺少token参数，那么抛出Token无效
			if (!headers['auth-token']) {
				isLoginState = false;
				this.echoTokenError();
			}

			try {

				// 将token解码，获取以下参数.
				const userParams = this.toolsService.decodeUserToken(headers['auth-token']);
				const params = this.toolsService.filterInvalidParams({
					username: String(userParams.username),
					userId: String(userParams.userId),
					password: String(userParams.password),
					inputTime: Number(userParams.inputTime)
				});

				context.switchToHttp().getRequest()['userInfo'] = params;
				isLoginState = await this.userService.verifySignState(params.username, params.userId, params.password, params.inputTime);

			} catch (e) {
				isLoginState = false;
			}

			// 抛出Token无效
			if (!isLoginState) {
				this.echoTokenError();
			}

		}

		return isLoginState;
	}
}
