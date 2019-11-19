import {Injectable} from '@nestjs/common';

enum EMessage {
    'E1000' = 'Data read failed',
    'E1001' = 'User does not exist',
    'E1002' = 'Article does not exist',
    'E1003' = 'Category does not exist',
    'E1004' = 'Username does not exist',
    'E1005' = 'Upload file error',
    'E1006' = 'Attached does not exist',
    'E1007' = 'Remove attached failed',
    'E1008' = 'Category length should be 1-18 characters',
    'E1009' = 'Invalid parent category',
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
    'E1022' = 'Verification code failed to be sent, please resend',
    'E1023' = 'Icon does not exist',
    'E1024' = 'Incorrect sharing code',
    'E1025' = 'Currently this category is super category and cannot be renamed.',
    'E1026' = 'Currently this category is super category and cannot be deleted.',
    'E1027' = 'Currently this category is super category and cannot be created son category.',
    'E1028' = 'This user\'s super tmp category does not exist.',
    'E1029' = 'Article ids parameter does not exist.'
}

@Injectable()
export class ErrorService {

    public error;

    constructor() {
        this.error = EMessage;
    }

}
