import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    PayloadTooLargeException,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log('管道');
        if (metadata.type === 'query') {
            try {
                console.log('try', typeof value);
                return JSON.parse(value);
            } catch (error) {
                console.log('BadRequestException');
                throw new BadRequestException('query params error', 'asd');
            }
        } else {
            throw new PayloadTooLargeException();
        }
    }
}
