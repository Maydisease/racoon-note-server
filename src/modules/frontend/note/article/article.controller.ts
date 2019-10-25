import * as MarkdownIt                           from 'markdown-it';
import {Body, Controller, Inject, Post, Request} from '@nestjs/common';
import {ArticleService}                          from './article.service';
import * as moment                               from 'moment';
import {ToolsService}                            from '../../../../common/service/tools.service';
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
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-yaml';

const markdownItMermaid = require('markdown-it-mermaid').default;
const markdownItImsize  = require('markdown-it-imsize');

declare var Prism: any;

interface RemoveTrashArticle {
    id: number;
    uid: string;
}

interface AddArticleDataBody {
    title: string;
    uid: string;
    cid: number;
    markdown_content?: string;
    html_content?: string;
    description?: string;
    share_code?: string;
    on_share?: number;
    use_share_code?: number;
    updateTime?: number;
    inputTime?: number;
}

interface UpdateArticleDataBody {
    id: number;
    title?: string;
    uid?: string;
    markdown_content?: string;
    html_content?: string;
    description?: string;
    share_code?: string;
    on_share?: number;
    use_share_code?: number;
    updateTime: number;
}

interface UpdateArticleShareConfBody {
    id: number;
    uid?: string;
    on_share?: number;
    use_share_code?: number;
}

interface UpdateArticleShareCodeBody {
    id: number;
    uid?: string;
    share_code: string;
    updateTime: number;
}

interface GetArticleList {
    cid: number;
    uid: string;
    disable: number;
}

interface GetArticleData {
    id: number;
    uid: string;
}

interface GetTrashArticleData {
    disable: number;
    uid: string;
}

interface GetTrashArticleDetail {
    id: number;
    uid: string;
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

interface ResetTrashArticleToTmpCategory {
    id: number;
    uid: string;
    updateTime?: number;
}

interface ResetTrashArticleBody {
    id: number;
    disable: number;
    cid?: number;
    uid?: string;
    updateTime?: number;
}

@Controller('note')
export class ArticleController {

    public markdownIt: MarkdownIt;

    constructor(
        @Inject('toolsService') public toolsService: ToolsService,
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

    // 获取文章列表
    @Post('getArticleList')
    async getArticleList(@Body() body, @Request() req) {
        const params: GetArticleList = this.toolsService.filterInvalidParams({
            cid    : Number(body.cid),
            uid    : String(req.userInfo.userId),
            disable: 0,
        });

        let response: any = await this.articleService.getArticleList(params.cid, params.uid, params.disable);

        // 判断数据是否正常取出了
        if (!response) {
            return this.echoService.fail(9001);
        }

        console.log(params.uid);

        if (response.length > 0) {
            response.forEach((item: any, index: number) => {
                const id           = this.toolsService.aesEncrypt(`${item.id}&${params.uid}`);
                item.share_address = `/share/note?id=${id}`;
            });
        }

        return this.echoService.success(response);
    }

    // 获取文章详情
    @Post('getArticleData')
    async getArticleData(@Body() body, @Request() req) {
        const params: GetArticleData = this.toolsService.filterInvalidParams({
            id : Number(body.id),
            uid: String(req.userInfo.userId)
        });

        const response: any = await this.articleService.getArticleData(params.id, params.uid);

        // 判断数据是否正常取出了
        if (!response) {
            return this.echoService.fail(9001);
        }

        return this.echoService.success(response);
    }

    // 添加文章数据
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
            on_share        : 0,
            use_share_code  : 0,
            share_code      : String(this.toolsService.randomGenerator(6, 'mix')),
            disable         : 0,
            updateTime      : timestamp,
            inputTime       : timestamp
        });

        // 判断当前uid是否是有效的用户
        if (!params.uid || !await this.articleService.verifyUserExist(params.uid)) {
            return this.echoService.fail(1001, this.errorService.error.E1001);
        }

        // 判断当前cid是否是有效的分类
        if (!params.cid || !await this.articleService.verifyCategoryExist(params.cid)) {
            return this.echoService.fail(1003, this.errorService.error.E1003);
        }

        if (params.html_content) {
            params.description = this.toolsService.buildArticleDes(params.html_content);
        }

        const response: any = await this.articleService.addArticleData(params);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.insertId > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }

    // 更新文章分享上的随机ShareCode
    @Post('updateArticleShareCode')
    async updateArticleShareCode(@Body() body: UpdateArticleShareCodeBody, @Request() req): Promise<object> {
        const timestamp                          = new Date().getTime();
        const shareCode                          = String(this.toolsService.randomGenerator(6, 'mix'));
        const params: UpdateArticleShareCodeBody = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            uid       : String(req.userInfo.userId),
            share_code: shareCode,
            updateTime: timestamp
        });

        // 判断当前id是否是有效的文章
        if (!params.id || !params.uid || !await this.articleService.verifyArticleExist(params.id, params.uid)) {
            return this.echoService.fail(1002, this.errorService.error.E1002);
        }

        const response: any = await this.articleService.updateArticleShareCode(params.id, params);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.changedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        response.shareCode = shareCode;

        return this.echoService.success(response);

    }

    // 更新文章分享面板配置参数
    @Post('updateArticleShareConf')
    async updateArticleShareConf(@Body() body: UpdateArticleShareConfBody, @Request() req): Promise<object> {
        const timestamp                          = new Date().getTime();
        const params: UpdateArticleShareConfBody = this.toolsService.filterInvalidParams({
            id            : Number(body.id),
            uid           : String(req.userInfo.userId),
            on_share      : Number(body.on_share),
            use_share_code: Number(body.use_share_code),
            updateTime    : timestamp,
        });

        // 判断当前id是否是有效的文章
        if (!params.id || !params.uid || !await this.articleService.verifyArticleExist(params.id, params.uid)) {
            return this.echoService.fail(1002, this.errorService.error.E1002);
        }

        const response: any = await this.articleService.updateArticleShareConf(params.id, params);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.changedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        console.log(params);

        return this.echoService.success(response);

    }

    // 更新文章数据
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
            return this.echoService.fail(1002, this.errorService.error.E1002);
        }

        if (params.html_content) {
            params.description = this.toolsService.buildArticleDes(params.html_content);
        }

        const response: any = await this.articleService.updateArticleData(params.id, params);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.changedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }

    // 设置文章禁用状态(垃圾箱)
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

    // 设置文章锁定状态(分享)
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

    // 搜索文章
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

    // 获取垃圾箱中的数据列表
    @Post('getTrashArticleData')
    async getTrashArticleData(@Body() body: GetTrashArticleData, @Request() req): Promise<object> {
        const params: GetTrashArticleData = this.toolsService.filterInvalidParams({
            disable: 1,
            uid    : String(req.userInfo.userId),
        });

        const response: any = await this.articleService.getTrashArticleData(params.uid, params.disable);

        if (!response) {
            return this.echoService.fail(9001);
        }

        return this.echoService.success(response);

    }

    // 获取垃圾箱中选中文章的详情参数
    @Post('getTrashArticleDetail')
    async getTrashArticleDetail(@Body() body: GetTrashArticleDetail, @Request() req): Promise<object> {
        const params: GetTrashArticleDetail = this.toolsService.filterInvalidParams({
            id : Number(body.id),
            uid: String(req.userInfo.userId),
        });

        const sourceData = await Promise.all([
            this.articleService.getCategoryData(params.uid),
            this.articleService.getTrashArticleDetail(params.id, params.uid),
        ]);

        const categoryData       = sourceData[0];
        const trashArticleDetail = sourceData[1];

        if (!trashArticleDetail || !categoryData) {
            return this.echoService.fail(9001);
        }

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

        (trashArticleDetail as any).crumbs = getCrumbs((trashArticleDetail as any).cid);
        (trashArticleDetail as any).date   = moment(new Date(Number((trashArticleDetail as any).updateTime))).format("LLL");


        return this.echoService.success(trashArticleDetail);

    }

    // 彻底删除垃圾箱中的文章
    @Post('removeTrashArticle')
    async removeTrashArticle(@Body() body: RemoveTrashArticle, @Request() req): Promise<object> {
        const params: RemoveTrashArticle = this.toolsService.filterInvalidParams({
            id : Number(body.id),
            uid: String(req.userInfo.userId),
        });

        // 判断当前id是否是有效的文章
        if (!params.id || !params.uid || !await this.articleService.verifyArticleExist(params.id, params.uid)) {
            return this.echoService.fail(1002, this.errorService.error.E1002);
        }

        const response: any = await this.articleService.removeTrashArticle(params.id, params.uid);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.affectedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }

    // 恢复垃圾箱中找不到分类的文章到tmp分类下
    @Post('resetTrashArticleToTmpCategory')
    async resetTrashArticleToTmpCategory(@Body() body: ResetTrashArticleToTmpCategory, @Request() req): Promise<object> {
        const timestamp                              = new Date().getTime();
        const params: ResetTrashArticleToTmpCategory = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            uid       : String(req.userInfo.userId),
            updateTime: timestamp
        });

        const getTmpCategoryIdResponse: any = await this.articleService.getTmpCategoryId(params.uid);

        // 判断该用户是否有创建超级分类tmp
        if (!getTmpCategoryIdResponse.id) {
            return this.echoService.fail(1028, this.errorService.error.E1028);
        }

        const response: any = await this.articleService.resetTrashArticleToTmpCategory(params.id, params.uid, getTmpCategoryIdResponse.id, params.updateTime);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.changedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }


    // 恢复垃圾箱中的文章
    @Post('resetTrashArticle')
    async resetTrashArticle(@Body() body: ResetTrashArticleBody, @Request() req): Promise<object> {
        const timestamp                     = new Date().getTime();
        const params: ResetTrashArticleBody = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            disable   : 0,
            cid       : Number(body.cid),
            uid       : String(req.userInfo.userId),
            updateTime: timestamp,
        });

        // 判断当前需要恢复的文章的分类是否存在
        if (!params.cid || !await this.articleService.verifyCategoryExist(params.cid)) {
            return this.echoService.fail(1003, this.errorService.error.E1003);
        }

        const response: any = await this.articleService.setArticleDisableState(params.id, params.uid, params.disable, params.updateTime);

        // 判断数据是否正常插入到了article表
        if (!(response && response.raw.changedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);

    }

}
