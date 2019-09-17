import {Injectable} from '@nestjs/common';
import * as crypto  from 'crypto';
import CONFIG       from '../../config';

@Injectable()
export class ToolsService {

    // 过滤无用参数
    public filterInvalidParams(params: any): any {
        for (const key in params) {
            if (params[key] === undefined || params[key] === 'undefined' || params[key] === null || params[key] === '') {
                delete params[key];
            }
        }
        return params;
    }

    // AES 加密
    public aesEncrypt(src) {
        let sign     = '';
        const cipher = crypto.createCipheriv('aes-128-cbc', CONFIG.ASE.KEY, CONFIG.ASE.IV);
        sign += cipher.update(src, 'utf8', 'hex');
        sign += cipher.final('hex');
        return sign;
    }

    // AES 解密
    public aesDecrypt(sign) {
        let src      = '';
        const cipher = crypto.createDecipheriv('aes-128-cbc', CONFIG.ASE.KEY, CONFIG.ASE.IV);
        src += cipher.update(sign, 'hex', 'utf8');
        src += cipher.final('utf8');
        return src;
    }

    // 字符串转MD5
    public getMD5(content: string): string {
        const md5    = crypto.createHash('md5');
        const md5Str = md5.update(content).digest('hex');
        return md5Str.substring(0);
    }

    // 用户OAuthToken加密
    public encodeUserToken(username: string, userId: string, password: string, inputTime: number, lastTime: number): string {
        const sourceStr: string = `${username}&${userId}&${password}&${inputTime}&${lastTime}`;
        return this.aesEncrypt(sourceStr);
    }

    // 用户OAuthToken解密
    public decodeUserToken(token): object | boolean {
        try {
            const [username, userId, password, inputTime, lastTime] = this.aesDecrypt(token).split('&');
            return {username, userId, password, inputTime, lastTime};
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    // removeHtmlTag
    public removeHtmlTag(sourceStr: string): string {

        // 去除HTML tag
        sourceStr = sourceStr.replace(/<\/?[^>]*>/g, '');
        // 去除行尾空白
        sourceStr = sourceStr.replace(/[ | ]*\n/g, '\n');
        // 去除多余空行
        sourceStr = sourceStr.replace(/\n[\s| | ]*\r/g, '\n');
        // 去掉&nbsp;
        sourceStr = sourceStr.replace(/&(nbsp|amp);/ig, '');

        return sourceStr;
    }

    // 生成文章摘要
    public buildArticleDes(html: string, maxLength: number = 50): string {
        let des         = html ? this.removeHtmlTag(html) : '';
        return des.length > maxLength ? des.substring(0, maxLength) + '...' : des;
    }

    public randomGenerator(digit: number, type: 'string' | 'mix' | 'number') {

        let randomCode   = '';
        const letterMaps = [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
        ];

        switch (type) {
            case 'number':
                for (let i = 0; i < digit; i++) {
                    randomCode += Math.ceil(Math.random() * 9) + '';
                }
                break;
            case 'string':
                for (let i = 0; i < digit; i++) {
                    const key = Math.ceil(Math.random() * 25);
                    randomCode += letterMaps[key];
                }
                break;
            case 'mix':
                for (let i = 0; i < digit; i++) {

                    const randomType = Math.floor(Math.random()*2);

                    switch (randomType) {
                        case 0:
                            randomCode += Math.ceil(Math.random() * 9) + '';
                            break;
                        case 1:
                            const key = Math.ceil(Math.random() * 25);
                            randomCode += letterMaps[key];
                            break;
                    }

                }
                break;
        }

        return randomCode;
    }

}
