import { IsEmail,IsNotEmpty,  } from 'class-validator';
export class loginUser{
        @IsEmail({}, { message: 'Please enter a valid email' })
        readonly email: string;
        @IsNotEmpty({ message: 'Password is required' })
        readonly password: string;
     
}