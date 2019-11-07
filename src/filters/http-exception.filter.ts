import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {EchoService}                                          from '../common/service/echo.service';
import {ErrorService}                                         from '../common/service/error.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    public echoService: EchoService;
    public errorService: ErrorService;

    constructor() {
        this.echoService  = new EchoService();
        this.errorService = new ErrorService();
    }

    catch(exception, host: ArgumentsHost) {

        const ctx      = host.switchToHttp();
        const response = ctx.getResponse();
        const request  = ctx.getRequest();
        const status   = exception.getStatus();

        // 捕捉守卫抛出的错误
        if (status === 1015) {
            const errBody = this.echoService.fail(1015, this.errorService.error.E1015);
            response.status(200).json(errBody);
        } else {
            response
                .status(status)
                .json({...exception.message, path: request.url});
        }

    }

}
