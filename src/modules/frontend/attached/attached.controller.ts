import {Body, Controller, Inject, Post, Request, UseGuards} from '@nestjs/common';
import conf                                                 from '../../../config';
import * as path                                            from 'path';
import * as fs                                              from 'fs';
import {dirExists, getFilePathStat}                         from '../../../utils';
import {AttachedService}                                    from './attached.service';

@UseGuards()
@Controller('attached')
export class AttachedController {

    public imageType: string[];

    constructor(
        @Inject('toolsService') public toolsService,
        @Inject('userService') public userService,
        @Inject('echoService') public echoService,
        @Inject('attachedService') public attachedService: AttachedService
    ) {
        this.imageType = ['.jpg', '.jpeg', '.png', '.gif'];
    }

    // 获取分类数据
    @Post('upload')
    async upload(@Body() body, @Request() req) {

        const timestamp: number     = new Date().getTime();
        const private_space         = this.toolsService.getMD5(req.userInfo.userId);
        let attachedPath            = path.join(conf.PATH.ATTACHED_FILES, private_space);
        let fileSaveDirPath: string = '';
        let fileSavePath: string    = '';
        const randomFileName        = `${timestamp}${body.type}`;
        if (this.imageType.indexOf(body.type) >= 0) {
            fileSaveDirPath = path.join(attachedPath, 'img');
            fileSavePath    = path.join(attachedPath, `img/${randomFileName}`);
        }
        const buffer: Buffer = new Buffer(body.buffer.data);
        if (!await getFilePathStat(fileSaveDirPath)) {
            await dirExists(fileSaveDirPath);
        }

        const err: any = fs.writeFileSync(fileSavePath, new Buffer(buffer));

        if (!err) {

            const params = this.toolsService.filterInvalidParams({
                uid       : req.userInfo.userId,
                name      : String(body.name),
                path      : randomFileName,
                type      : String(body.type),
                size      : Number(body.size),
                updateTime: timestamp,
                inputTime : timestamp
            });

            const response: any = await this.attachedService.addAttached(params);

            if (response.raw.insertId > 0) {
                return this.echoService.success();
            }

        } else {
            return this.echoService.fail(1099, `upload ${body.name} file error`);
        }
    }

    @Post('getAttachedData')
    async getAttachedData(@Body() body, @Request() req) {

        const params = this.toolsService.filterInvalidParams({
            uid: req.userInfo.userId
        });

        const response = await this.attachedService.getAttached(params.uid);

        // 判断数据是否正常取出了
        if (!response) {
            return this.echoService.fail(9001, "Data read failed");
        }

        return this.echoService.success(response);
    }

    @Post('removeAttached')
    async removeAttached(@Body() body, @Request() req) {

        const private_space = this.toolsService.getMD5(req.userInfo.userId);
        let attachedPath    = path.join(conf.PATH.ATTACHED_FILES, private_space);

        const params = this.toolsService.filterInvalidParams({
            ids: body.ids,
            uid: req.userInfo.userId,
        });

        const getOneAttached: any = await this.attachedService.getAttachedType(params.ids);
        const response: any       = await this.attachedService.removeAttached(params.ids, params.uid);

        if (response.raw.affectedRows > 0) {

            let attachedType = '';

            if (this.imageType.indexOf(getOneAttached.type) >= 0) {
                attachedType = 'img';
            }

            const readyRemoveAttachedPath = path.resolve(attachedPath, attachedType, getOneAttached.path);
            const attachedExists          = fs.existsSync(readyRemoveAttachedPath);
            if (!attachedExists) {
                return this.echoService.fail(1120, "attached does not exist");
            }
            const removeErr: any = fs.unlinkSync(readyRemoveAttachedPath);
            if (!removeErr) {
                return this.echoService.success(response);
            } else {
                return this.echoService.fail(1121, "remove attached failed");
            }

        } else {
            return this.echoService.fail(9002, "Data remove failed");
        }

    }

}
