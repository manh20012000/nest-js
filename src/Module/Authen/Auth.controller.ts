import { Controller, Get,Req, Post, Body,Param, HttpException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './AuthService';
import { Auth } from 'src/Schame/userSchame';
import { loginUser } from './Auth.dto/Login';
import { logoutUser } from './Auth.dto/Logout';
import { SiginUser } from './Auth.dto/Sigin';
import { getUser } from './Auth.dto/getUser';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { multerConfig } from 'src/configeMulter';
import { Request } from 'express';
@Controller('auth')
    
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('login')
    async loginUser(@Body() loginUser:loginUser) {
        
        return this.authService.LoginUser(loginUser);
    }
    

    @Post('/sigin')
    @UseInterceptors(FileInterceptor('file',multerConfig))
        
    async siginUser(@Body() siginUser: SiginUser,@UploadedFile() file: Express.Multer.File, @Req() req: Request ) {//@Body(): Decorator này cho phép NestJS tự động lấy dữ liệu từ phần thân của yêu cầu HTTP và chuyển nó thành một đối tượng dựa trên DTO SiginUser
        console.log(file)
        const protocol = req.protocol;
        const host = req.get('host');
        console.log(`Protocol: ${protocol}, Host: ${host}`);
        const fileavatar:String=`${protocol}://${host}/image/` + file.filename;
        const user = await this.authService.SiginUser(siginUser,fileavatar);
        const objUserSusscess=await{ message: 'Sigin successful', user };
        return user
    }


    @Get('/:id')
    async getUseById(@Param('id') id: string) {
        console.log(id)
        const findUser = await this.authService.getById(id);
        if (!findUser)  throw new HttpException('not found user', 404)
          throw new HttpException(findUser, 404)

    }
    

    @Get('getUser')
    async GetUser() {
        return this.authService.getUser()
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