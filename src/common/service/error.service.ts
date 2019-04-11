import {Injectable} from '@nestjs/common';

enum EMessage {
    'E1000'  = 'Data read failed',
    'E1001'  = 'User does not exist',
    'E1002'  = 'Category does not exist',
    'E1003'  = 'Article does not exist',
    'E1004'  = 'Username does not exist',
    'E1005'  = 'Upload file error',
    'E1006'  = 'Attached does not exist',
    'E1007'  = 'Remove attached failed',
    'E1008'  = 'Category length should be 1-18 characters',
    'E1009'  = 'Invalid parent category',
    'E1010' = 'Category already exists',
    'E1011' = 'Category does not exist',
    'E1012' = 'Category id is an unsupported type',
    'E1013' = 'Current category has subcategories',
    'E1014' = 'Current category has articles',
    'E1015' = 'Invalid token',
    'E1016' = 'Username already exists',
    'E1017' = 'Please enter your vaild email',
    'E1018' = 'Password twice inconsistencies',
    'E1019' = 'Password does not match the rule',
    'E1020' = 'Username and password do not match',
    'E1021' = 'The verification code does not match the account number.',
    'E1022' = 'Verification code failed to be sent, please resend'
}


// return this.echoService.fail(0 9001, "Data read failed");
// return this.echoService.fail(1 1200, "user does not exist");
// return this.echoService.fail(2 1201, "category does not exist");
// return this.echoService.fail(3 1201, "article does not exist");
// return this.echoService.fail(4 1003, "username does not exist");
// return this.echoService.fail(5 1099, `upload ${body.name} file error`);
// return this.echoService.fail(6 1120, "attached does not exist");
// return this.echoService.fail(7 1121, "remove attached failed");
// return this.echoService.fail(8 1100, "Category length should be 1-18 characters");
// return this.echoService.fail(9 1102, "Invalid parent category");
// return this.echoService.fail(10 1103, "Category already exists");
// return this.echoService.fail(11 1104, "Category does not exist");
// return this.echoService.fail(12 1105, "Category id is an unsupported type");
// return this.echoService.fail(13 1106, "Current category has subcategories");
// return this.echoService.fail(14 1107, "Current category has articles");
// const errBody = this.echoService.fail(15 4000, 'Invalid token');
// return this.echoService.fail(16 1002, "Username already exists");
// return this.echoService.fail(17 1000, "please enter your vaild email");
// return this.echoService.fail(18 1001, "Password twice inconsistencies");
// return this.echoService.fail(19 1001, "Password does not match the rule");
// return this.echoService.fail(20 1004, "Username and password do not match");
// return this.echoService.fail(21 4000, "Invalid token");
// return this.echoService.fail(22 1202, "The verification code does not match the account number.");
// return this.echoService.fail(23 1001, "Password does not match the rule");
// return this.echoService.fail(24 1204, "verification code failed to be sent, please resend");

@Injectable()
export class ErrorService {

    public error;

    constructor() {
        this.error = EMessage;
    }

}