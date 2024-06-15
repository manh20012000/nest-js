import { Controller, Get, Post, Body, } from '@nestjs/common';
import { AuthService } from './AuthService';
import { Auth } from 'src/Schame/userSchame';
import { loginUser } from './Auth.dto/Login';
import { logoutUser } from './Auth.dto/Logout';
import { SiginUser } from './Auth.dto/Sigin';

@Controller('auth')
    
export class AuthController {
    constructor(private readonly authService: AuthService) { }
        
    @Post('/sigin')
    async siginUser(@Body() siginUser: SiginUser): Promise<SiginUser> {
         console.log(siginUser,'giá tri dược log ra khi mà mình dăng ký với user')
        const user = await this.authService.SiginUser(siginUser);
        // const objUserSusscess=await{ message: 'Sigin successful', user };
        return await this.authService.SiginUser(user)
    }
}






/*export class AuthController {
    constructor(private readonly authService: AuthService) { }
        
    @Post('/sigin')
    async siginUser(@Body() siginUser: SiginUser): {
        const user = await this.authService.SiginUser(siginUser);
        // const objUserSusscess=await{ message: 'Sigin successful', user };
        return objUserSusscess;
    }
}*/