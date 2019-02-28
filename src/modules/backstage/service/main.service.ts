import {Injectable} from '@nestjs/common';
import {Connection} from "typeorm";

@Injectable()
export class MainService {

    constructor(private readonly connection: Connection) {
    }

    getListData() {

    }
}