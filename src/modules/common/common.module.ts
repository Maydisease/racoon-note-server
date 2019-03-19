import {Module}         from "@nestjs/common";
import {MailController} from "./mail/mail.controller";

@Module({
    controllers: [
        MailController
    ],
    providers  : []
})

export class CommonModule {

}