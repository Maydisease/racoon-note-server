import {Module} from '@nestjs/common';
import {CategoryController} from './category/category.controller'
import {LogsController} from '../logs/logs.controller'
import {APP_GUARD} from '@nestjs/core'
import {UserLoginOAuthGuard} from '../../../guard/userLoginOAuth.guard'
import {EchoService} from '../../../common/service/echo.service'
import {ErrorService} from '../../../common/service/error.service'
import {CategoryService} from './category/category.service'
import {UserService} from '../user/user.service'
import {ToolsService} from '../../../common/service/tools.service'
import {MailService} from '../../../common/service/mail.service'
import {ArticleService} from './article/article.service'
import {AttachedService} from '../attached/attached.service'
import {ShareService} from '../share/share.service'
import {UserController} from '../user/user.controller'
import {ArticleController} from './article/article.controller'
import {AttachedController} from '../attached/attached.controller'
import {ShareController} from '../share/share.controller'

@Module({
	controllers: [
		UserController,
		CategoryController,
		ArticleController,
		AttachedController,
		ShareController,
		LogsController
	],
	providers: [
		{provide: APP_GUARD, useClass: UserLoginOAuthGuard},
		{provide: 'toolsService', useClass: ToolsService},
		{provide: 'echoService', useClass: EchoService},
		{provide: 'errorService', useClass: ErrorService},
		{provide: 'mailService', useClass: MailService},
		{provide: 'categoryService', useClass: CategoryService},
		{provide: 'userService', useClass: UserService},
		{provide: 'articleService', useClass: ArticleService},
		{provide: 'attachedService', useClass: AttachedService},
		{provide: 'shareService', useClass: ShareService},
	]
})

export class NoteModule {

}
