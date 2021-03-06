import {Injectable} from '@nestjs/common';

interface successReturn {
    result: number;
    messageCode: number;
    message: string;
    data?: object;
}

interface failReturn {
    result: number;
    messageCode: number;
    message: string;
}

@Injectable()
export class EchoService {

    public success(data: object): successReturn {

        const response: successReturn = {
            result     : 0,
            messageCode: 2000,
            message    : 'success',
        };

        return data ? Object.assign(response, {data}) : response;
    }

    public fail(messageCode: number, message: string): failReturn {
        return {
            result: 1,
            messageCode,
            message,
        };
    }
}
