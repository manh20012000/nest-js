import { Injectable,BadRequestException, Get ,HttpException, HttpStatus,Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/Schema/userSchame';
import * as bcrypt from 'bcrypt';
import { SiginUser } from './Auth.dto/Sigin';
import { loginUser } from './Auth.dto/Login';
import { logoutUser } from './Auth.dto/Logout';
import { JwtService } from '@nestjs/jwt';
import { getUser } from './Auth.dto/getUser'; 
import e, { Express,Response} from 'express'

@Injectable()
export class AuthService {
  constructor(@InjectModel('AuthModel') private authModel: Model<Auth>,private jwtService: JwtService
  ) { }

  
  async LoginUser(login: loginUser ,@Res() res) {
    const user =await this.validateUser(login.email)
    if (user) {
      const payload = { email: user.email };
      const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '5m' });
      const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '7d' });
      const match = await bcrypt.compare(login.password, user.password);
      if (match) {

        const newUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          birthdate: user.birthdate,
          accessToken: accessToken,
          refreshToken:refreshToken,
         }
              // // Set cookies
              res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'lax' });
             res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'lax' });
              
              return res.status(200).json(newUser);
      }
    }  throw new HttpException('not found user', 404)
  }
  async SiginUser(createUser: SiginUser,file:String) {
    const password = await bcrypt.hash(createUser.password, 10)
    const checkUser = await this.authModel.findOne({ email: createUser.email });
        if (checkUser) {
          throw new BadRequestException('Email đã tồn tại');
        } else if (!checkUser) {
          
          try {
            const newUser = {
              avatar: file,
              password: password,
              name: createUser.name,
              email: createUser.email,
              gender: createUser.gender,
              surname: createUser.surname,
              birthdate: createUser.birthdate,
              nameaccount: createUser.nameaccount,
              phonenumber:   createUser.phonenumber,
            }
           
          const createdAuth = await new this.authModel(newUser);
          return await createdAuth.save();
          }
          catch (error) {
              console.log(error)
          }
     }
     
  }

  //getUserById
  async getById(id: String) {
    
    return this.authModel.findById({ _id: id }).select('-password -_id')
}
 
  // getAllUser
  async getUser() {
        return this.authModel.find()
  }
  
//validate tài khoản 
  async validateUser(email) {
     const user=await this.authModel.findOne({email:email})
    if (!user) {
        throw new HttpException('Invalid',HttpStatus.UNAUTHORIZED)
    }
    return user;
  }
  
  // refreshtken 
  async refreshToken(refreshToken: string, res: Response,) {
    
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const email = decoded.email;
      const user = await this.validateUser(email);
      if (!user) {
        throw new HttpException('not found user', 404)
      }
     
      const payload = { email: user.email };
      const newAccessToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '5m' });
      // const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
     
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false, sameSite: 'lax' });
      return  res.status(401).json({ message: 'refresh suscess' });
  
    } catch (error) {
      throw new HttpException('not refresh Token ', 404)
    }
  }

  async handelerToken(token:string) {
    try {
      console.log(token,'token khi được verifte')
      const email = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      })
      const user = await this.validateUser(email);
      if (!user) {
        throw new HttpException('not found user', 404)
      }
      return user._id;

     } catch (e) {
       throw new HttpException('HttpException ',404)
     }
  }

}
  
