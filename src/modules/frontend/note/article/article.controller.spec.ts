import {Test}              from '@nestjs/testing';
import {AppModule}         from '../../../../app.module';
import {ArticleController} from './article.controller';
import {ArticleService}    from './article.service';
import {EchoService}       from '../../../../common/service/echo.service';
import {ToolsService}      from '../../../../common/service/tools.service';

describe('ArticleController', () => {

    let articleController: ArticleController;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports    : [AppModule],
            controllers: [ArticleController],
            providers  : [
                {provide: 'toolsService', useClass: ToolsService},
                {provide: 'articleService', useClass: ArticleService},
                {provide: 'echoService', useClass: EchoService}
            ],
        }).compile();

        articleController = module.get(ArticleController);
    });

    describe('getArticleData', () => {

    });


    const uid = 'xde44sss';
    describe('addArticleData', () => {
        it(`添加文章 - 用户无效`, async () => {

            const params = {
                title           : '关于张三同志得任职通知',
                uid             : uid,
                cid             : 5,
                disable         : 0,
                markdown_content: 'markdown_content',
                html_content    : 'html_content'
            };

            const response: any = await articleController.addArticleData(params, {});
            expect(response.messageCode).toBe(1200)
        });

        const cid = 50000;
        it(`添加文章 - 分类无效`, async () => {

            const params = {
                title           : '关于张三同志得任职通知',
                uid             : 'a3958865b8de1',
                cid             : cid,
                markdown_content: 'markdown_content',
                html_content    : 'html_content'
            };

            const response: any = await articleController.addArticleData(params, {});
            expect(response.messageCode).toBe(1201)
        });

        const cid1 = 5;
        it(`添加文章 - 添加成功`, async () => {

            const params = {
                title           : '关于张三同志得任职通知',
                uid             : 'a3958865b8de1',
                cid             : cid1,
                markdown_content: 'markdown_content',
                html_content    : 'html_content'
            };

            const response: any = await articleController.addArticleData(params, {});
            expect(response.messageCode).toBe(2000)
        });

    });

    describe('updateArticleData', () => {

    });

});