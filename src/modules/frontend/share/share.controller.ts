import {Body, Controller, Inject, Post, Render, Get, Request, UseGuards, Query} from '@nestjs/common';
import {ToolsService}                                                           from '../../../common/service/tools.service';
import Conf                                                                     from '../../../config';
import * as moment                                                              from 'moment';

interface ShareCodeParams {
    id: number,
    uid: string,
}

@UseGuards()
@Controller('share')
export class ShareController {

    constructor(
        @Inject('toolsService') public toolsService: ToolsService,
        @Inject('echoService') public echoService,
        @Inject('shareService') public shareService,
        @Inject('errorService') public errorService,
    ) {

    }

    @Post('getShareArticleData')
    async getShareArticleData(@Body() body, @Request() req): Promise<object> {
        const params = this.toolsService.filterInvalidParams({
            code      : String(body.id),
            share_code: String(body.share_code)
        });

        let codeStr: string          = '';
        let codeArr: string[]        = [];
        let codeObj: ShareCodeParams = {
            id : 0,
            uid: ''
        };

        if (params.code) {
            try {
                codeStr = this.toolsService.aesDecrypt(params.code)
            } catch (e) {

            }
        }

        if (codeStr) {
            codeArr = codeStr.split('&');
        }

        if (codeArr.length === 2) {
            codeObj['id']  = Number(codeArr[0]);
            codeObj['uid'] = String(codeArr[1]);
        }

        if (codeObj.id && codeObj.uid) {
            // 判断当前id是否是有效的文章
            // return this.echoService.fail(1003, this.errorService.error.E1003);
        }

        console.log(551, codeObj.id, codeObj.uid, params.share_code);

        const serverBaseAddress = `http://${Conf.APP.APP_RUN_HOST}:${Conf.APP.APP_RUN_PORT}`;
        const response: any     = await this.shareService.getSecretArticleData(codeObj.id, codeObj.uid, params.share_code);

        if (response && response.id) {
            const private_space   = this.toolsService.getMD5(codeObj.uid);
            const newImgFile      = `${serverBaseAddress}/attached_files/${private_space}/img/`;
            response.html_content = response.html_content.replace(/(racoon:\/\/img\/)/g, newImgFile);
            response.date         = moment(new Date(Number(response.updateTime))).format("LLL");
        } else {
            return this.echoService.fail(1024, this.errorService.error.E1024);
        }

        return this.echoService.success(response);

    }

    // 获取分类数据
    @Get('note')
    @Render('index')
    async note(@Query() query): Promise<object> {

        const params = this.toolsService.filterInvalidParams({
            code: query.id,
        });

        let codeStr: string          = '';
        let codeArr: string[]        = [];
        let codeObj: ShareCodeParams = {
            id : 0,
            uid: ''
        };

        if (params.code) {
            try {
                codeStr = this.toolsService.aesDecrypt(params.code)
            } catch (e) {

            }
        }

        if (codeStr) {
            codeArr = codeStr.split('&');
        }

        if (codeArr.length === 2) {
            codeObj['id']  = Number(codeArr[0]);
            codeObj['uid'] = String(codeArr[1]);
        }

        if (codeObj.id && codeObj.uid) {
            // 判断当前id是否是有效的文章
            // return this.echoService.fail(1003, this.errorService.error.E1003);
        }

        const serverBaseAddress = `http://${Conf.APP.APP_RUN_HOST}:${Conf.APP.APP_RUN_PORT}`;
        const response: any     = await this.shareService.getArticleData(codeObj.id, codeObj.uid);

        const CONF = {
            API     : `${serverBaseAddress}/share/getShareArticleData`,
            STATICS : `${serverBaseAddress}/statics`,
            SHARE_ID: params.code
        };

        let onShare: number      = 0;
        let useShareCode: number = 0;

        if (response && response.id) {
            onShare               = 1;
            const private_space   = this.toolsService.getMD5(codeObj.uid);
            const newImgFile      = `${serverBaseAddress}/attached_files/${private_space}/img/`;
            response.html_content = response.html_content.replace(/(racoon:\/\/img\/)/g, newImgFile);
            response.date         = moment(new Date(Number(response.updateTime))).format("LLL");
            useShareCode          = response.use_share_code;
        } else {
            onShare      = 0;
            useShareCode = 0;
        }


        return {CONF, onShare, useShareCode, res: response};
    }

}
