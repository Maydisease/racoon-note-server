import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';

import {EchoService} from '../../../common/service/echo.service'
import {ErrorService} from '../../../common/service/error.service'
import {ToolsService} from '../../../common/service/tools.service'
import {LogsController} from '../logs/logs.controller'
import {UserLoginOAuthGuard} from '../../../guard/userLoginOAuth.guard'

import {UserService} from '../user/user.service'
import {CategoryController} from './category/category.controller'
import {CategoryService} from './category/category.service'
import {LinkController} from './link/link.controller'
import {LinkService} from './link/link.service'
import {TagService} from './tag/tag.service'

@Module({
	controllers: [
		CategoryController,
		LogsController,
		LinkController
	],
	providers: [
		{provide: APP_GUARD, useClass: UserLoginOAuthGuard},
		{provide: 'toolsService', useClass: ToolsService},
		{provide: 'echoService', useClass: EchoService},
		{provide: 'errorService', useClass: ErrorService},
		{provide: 'categoryService', useClass: CategoryService},
		{provide: 'userService', useClass: UserService},
		{provide: 'linkService', useClass: LinkService},
		{provide: 'tagService', useClass: TagService},
	]
})

export class LinksModule {

}
