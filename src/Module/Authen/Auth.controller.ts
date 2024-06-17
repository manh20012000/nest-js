import { Controller, Get,Req, Post, Body,Res, HttpException, UseInterceptors, UseGuards,UploadedFile } from '@nestjs/common';
import { AuthService } from './AuthService';
import { Auth } from 'src/Schema/userSchame';
import { loginUser } from './Auth.dto/Login';
import { logoutUser } from './Auth.dto/Logout';
import { SiginUser } from './Auth.dto/Sigin';
import { getUser } from './Auth.dto/getUser';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { multerConfig } from 'src/configeMulter';
import { Request } from 'express';
import { AuthMiddleware } from 'src/Protected/MiddwaveProtected';
@Controller('auth')
    
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('login')
    async loginUser(@Body() loginUser:loginUser,@Res() res: Response) {
        
        return this.authService.LoginUser(loginUser,res);
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

    @Get('Oneuser')
    async getOneUser(@Req() req: Request) {
      const user = (req as any).user; // Lấy user từ req
      console.log(user,'láy thông tin của 1 user '); // Log thông tin user
      return user; // Trả về thông tin user
    }
    
    @Get('getUser')
    async GetUser() {
        return this.authService.getUser()
    }

    @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const oldRefreshToken = req.body.refreshToken;
    if (!oldRefreshToken) {
      throw new HttpException('Refresh token is required',404);
    }
    return this.authService.refreshToken(oldRefreshToken);
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