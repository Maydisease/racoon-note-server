import {Module}              from "@nestjs/common";
import {EchoService}         from "../../common/service/echo.service";
import {ToolsService}        from "../../common/service/tools.service";
import {UserService}         from "./user/user.service";
import {UserController}      from "./user/user.controller";
import {CategoryService}     from "./note/category/category.service";
import {CategoryController}  from "./note/category/category.controller";
import {ArticleController}   from "./note/article/article.controller";
import {ArticleService}      from "./note/article/article.service";
import {UserLoginOAuthGuard} from "../../guard/userLoginOAuth.guard";
import {APP_GUARD}           from "@nestjs/core";

@Module({
    controllers: [
        UserController,
        CategoryController,
        ArticleController
    ],
    providers: [
        {provide: APP_GUARD, useClass: UserLoginOAuthGuard},
        {provide: 'toolsService', useClass: ToolsService},
        {provide: 'echoService', useClass: EchoService},
        {provide: 'categoryService', useClass: CategoryService},
        {provide: 'userService', useClass: UserService},
        {provide: 'articleService', useClass: ArticleService},
    ]
})

export class FrontendModule {
}