import * as fs   from 'fs';
import * as path from 'path';

/**
 * 读取路径信息
 * @param {string} path 路径
 */
const getFilePathStat = (path: string): Promise<boolean | object> => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                resolve(false);
            } else {
                resolve(stats);
            }
        })
    })
};

/**
 * 创建路径
 * @param {string} dir 路径
 */
const mkdir = (dir: string): Promise<boolean | object> => {
    return new Promise((resolve: (value: boolean) => void, reject: (value: boolean) => void) => {
        fs.mkdir(dir, err => err ? resolve(false) : resolve(true));
    })
};

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
const dirExists = async (dir: string) => {
    let isExists: boolean | object | object = await getFilePathStat(dir);
    //如果该路径且不是文件，返回true
    if (isExists && (isExists as any).isDirectory()) {
        return true;
    } else if (isExists) {     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if (status) {
        mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
};

export {dirExists, getFilePathStat};