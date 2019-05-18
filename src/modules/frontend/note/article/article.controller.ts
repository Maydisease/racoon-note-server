import * as MarkdownIt                           from 'markdown-it';
import {Body, Controller, Inject, Post, Request} from '@nestjs/common';
import {ArticleService}                          from './article.service';
import 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-textile';

const markdownItMermaid = require('markdown-it-mermaid').default;
const markdownItImsize  = require('markdown-it-imsize');

declare var Prism: any;

interface AddArticleDataBody {
    title: string;
    uid: string;
    cid: number;
    markdown_content?: string;
    html_content?: string;
    updateTime?: number;
    inputTime?: number;
}

interface UpdateArticleDataBody {
    id: number;
    title?: string;
    uid?: string;
    markdown_content?: string;
    html_content?: string;
    updateTime: number;
}

interface GetArticleData {
    cid: number;
    uid: string;
    disable: number;
}

interface SetArticleDisableStateBody {
    id: number;
    uid?: string;
    disable: number;
    updateTime?: number;
}

interface SetArticleLockStateBody {
    id: number;
    uid?: string;
    lock: number;
    password?: string;
    updateTime?: number;
}

@Controller('note')
export class ArticleController {

    public markdownIt: MarkdownIt;

    constructor(
        @Inject('toolsService') public toolsService,
        @Inject('echoService') public echoService,
        @Inject('userService') public userService,
        @Inject('errorService') public errorService,
        @Inject('articleService') public articleService: ArticleService,
    ) {
        this.markdownIt = new MarkdownIt({
            highlight: (str: string, lang: string) => {

                let html: string;
                let htmlStr: string;
                let language: string;

                try {
                    language = lang;
                    htmlStr  = Prism.highlight(str, Prism.languages[language], language);
                } catch (e) {
                    language = 'textile';
                    htmlStr  = Prism.highlight(str, Prism.languages[language], language);
                }

                html = `<pre class="language-${language}" language="${language}"><code>${htmlStr}</code></pre>`;

                return html;
            },
        })
            .use(markdownItMermaid)
            .use(markdownItImsize);
    }

    // 获取分类数据
    @Post('getArticleData')
    async getArticleData(@Body() body, @Request() req) {
        const params: GetArticleData = this.toolsService.filterInvalidParams({
            cid    : Number(body.cid),
            uid    : String(req.userInfo.userId),
            disable: 0,
        });

        const response: any = await this.articleService.getArticleData(params.cid, params.uid, params.disable);

        // 判断数据是否正常取出了
        if (!response) {
            return this.echoService.fail(9001);
        }

        response.forEach((item, index: number) => {
            const maxLength             = 50;
            let des                     = item.html_content ? this.toolsService.removeHtmlTag(item.html_content) : '';
            des                         = des.length > maxLength ? des.substring(0, maxLength) + '...' : des;
            response[index].description = des;
        });

        return this.echoService.success(response);
    }

    @Post('addArticleData')
    async addArticleData(@Body() body: AddArticleDataBody, @Request() req): Promise<object> {
        // 格式化数据

        const timestamp: number          = new Date().getTime();
        const params: AddArticleDataBody = this.toolsService.filterInvalidParams({
            title           : String(body.title),
            uid             : String(req.userInfo.userId),
            cid             : Number(body.cid),
            markdown_content: String(body.markdown_content),
            html_content    : String(body.markdown_content ? this.markdownIt.render(body.markdown_content) : ''),
            disable         : 0,
            updateTime      : timestamp,
            inputTime       : timestamp,
        });

        // 判断当前uid是否是有效的用户
        if (!params.uid || !await this.articleService.verifyUserExist(params.uid)) {
            return this.echoService.fail(1001, this.errorService.error.E1001);
        }

        // 判断当前cid是否是有效的分类
        if (!params.cid || !await this.articleService.verifyCategoryExist(params.cid)) {
            return this.echoService.fail(1003, this.errorService.error.E1003);
        }

        const response: any = await this.articleService.addArticleData(params);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.insertId > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }

    @Post('updateArticleData')
    async updateArticleData(@Body() body: UpdateArticleDataBody, @Request() req): Promise<object> {

        const timestamp                     = new Date().getTime();
        const params: UpdateArticleDataBody = this.toolsService.filterInvalidParams({
            id              : Number(body.id),
            title           : String(body.title),
            uid             : String(req.userInfo.userId),
            markdown_content: String(body.markdown_content),
            html_content    : String(body.markdown_content ? this.markdownIt.render(body.markdown_content) : ''),
            updateTime      : timestamp,
        });

        // 判断当前id是否是有效的文章
        if (!params.id || !params.uid || !await this.articleService.verifyArticleExist(params.id, params.uid)) {
            return this.echoService.fail(1003, this.errorService.error.E1003);
        }

        const response: any = await this.articleService.updateArticleData(params.id, params);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.changedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }

    @Post('setArticleDisableState')
    async setArticleDisableState(@Body() body: SetArticleDisableStateBody, @Request() req): Promise<object> {
        const timestamp                          = new Date().getTime();
        const params: SetArticleDisableStateBody = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            disable   : Number(body.disable),
            uid       : String(req.userInfo.userId),
            updateTime: timestamp,
        });

        const response: any = await this.articleService.setArticleDisableState(params.id, params.uid, params.disable, params.updateTime);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.changedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }

    @Post('setArticleLockState')
    async setArticleLockState(@Body() body: SetArticleLockStateBody, @Request() req) {
        const timestamp                       = new Date().getTime();
        const params: SetArticleLockStateBody = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            lock      : Number(body.lock),
            password  : String(body.password),
            uid       : String(req.userInfo.userId),
            updateTime: timestamp,
        });

        let userExistResponse: any;

        if (params.lock === 0) {
            params.password   = this.toolsService.getMD5(params.password);
            userExistResponse = await this.userService.verifyUserValidity(req.userInfo.username, params.password);
            if (!(userExistResponse && userExistResponse.length > 0)) {
                return this.echoService.fail(1004, this.errorService.error.E1004);
            }
        }

        const response = await this.articleService.setArticleLockState(params.id, params.uid, params.lock, params.updateTime);

        return this.echoService.success(response);

    }

    @Post('search')
    async search(@Body() body: any, @Request() req) {
        const params: any = this.toolsService.filterInvalidParams({
            disable: 0,
            lock   : 0,
            keys   : String(body.keys),
            type   : Number(body.type) === 0 ? 'title' : 'html_content',
            uid    : String(req.userInfo.userId),
        });

        const sourceData = await Promise.all([
            this.articleService.getCategoryData(params.uid),
            this.articleService.getSearchData(params.uid, params.keys, params.type, params.disable, params.lock),
        ]);

        const categoryData = sourceData[0];
        const searchData   = sourceData[1];

        const getCrumbs = (cid: number) => {
            const crumbs   = [];
            const findLoop = (cid1: number) => {
                categoryData.filter((item: any) => {
                    if (item.id === cid1) {
                        crumbs.unshift(item.name);
                        findLoop(item.parent);
                    }
                });
            };
            findLoop(cid);
            return crumbs;
        };

        searchData.forEach((item: any, index: number) => {
            const keysLengthMax = 20;
            let htmlContent     = this.toolsService.removeHtmlTag((searchData[index] as any).html_content);
            const startIndex    = htmlContent.indexOf(params.keys);

            if (startIndex > keysLengthMax) {
                htmlContent = htmlContent.substring(startIndex - keysLengthMax, startIndex + params.keys.length + keysLengthMax);
            } else {
                htmlContent = htmlContent.substring(0, startIndex + params.keys.length + keysLengthMax);
            }

            const maxLength                            = 50;
            let des                                    = item.html_content ? this.toolsService.removeHtmlTag(item.html_content) : '';
            des                                        = des.length > maxLength ? des.substring(0, maxLength) + '...' : des;
            (searchData[index] as any).description     = des;
            (searchData[index] as any).crumbs          = getCrumbs(item.cid);
            (searchData[index] as any).keysDescription = htmlContent;
        });

        return this.echoService.success(searchData);

    }

}
