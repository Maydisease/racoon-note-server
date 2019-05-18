import * as nodemailer             from 'nodemailer';
import {Injectable}                from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';

interface MailOptions {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    html?: string;
}

interface TransporterOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

@Injectable()
export class MailService {

    public secret: string;
    public connection: Connection;
    public mailOptions: MailOptions;
    public transporter: nodemailer;
    public transporterOptions: TransporterOptions;

    constructor() {
        this.connection = getConnection();
        this.secret     = 'note';

        this.mailOptions = {
            from: `racoon <racoon_note@163.com>`,
        };

        this.transporterOptions = {
            host  : 'smtp.163.com',
            port  : 587,
            secure: true, // true for 465, false for other ports
            auth  : {
                user: 'racoon_note@163.com', // generated ethereal user
                pass: 'Tan75577918', // generated ethereal password
            },
        };

        this.transporter = nodemailer.createTransport(this.transporterOptions);

    }

    public async send(mailOptions: MailOptions) {
        const info = await this.transporter.sendMail({...this.mailOptions, ...mailOptions});
        return info;
    }
}
