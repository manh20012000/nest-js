import { IsEmail,IsNotEmpty,  } from 'class-validator';
export class loginUser{
        // @IsEmail({ message: 'Please Enter a Valid Email' })
        readonly  email: string;
        readonly password: string;
     
}