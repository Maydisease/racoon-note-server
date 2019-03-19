import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {EchoService}                                          from "../common/service/echo.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    public echoService: EchoService;

    constructor() {
        this.echoService = new EchoService();
    }

    catch(exception, host: ArgumentsHost) {
        
        const ctx      = host.switchToHttp();
        const response = ctx.getResponse();
        const request  = ctx.getRequest();
        const status   = exception.getStatus();

        console.log(request.url, status);

        // 捕捉守卫抛出的错误
        if (status === 4000) {
            const errBody = this.echoService.fail(4000, 'Invalid token');
            response.status(200).json(errBody);
        } else {
            response
                .status(status)
                .json({
                    statusCode: status,
                    date      : new Date().toLocaleDateString(),
                    path      : request.url
                });
        }

    }

}