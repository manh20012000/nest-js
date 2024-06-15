import { Injectable,BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/Schame/userSchame';
import bcrypt from "bcrypt";
import { SiginUser } from './Auth.dto/Sigin';
import { loginUser } from './Auth.dto/Login';
import { logoutUser } from './Auth.dto/Logout';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>,private jwtService: JwtService
) {}
    async LoginUser(login: loginUser) {
      
    }
  
  async SiginUser(createUser: SiginUser) {
    // const password = await bcrypt.hash(createUser.password, 10)
        const checkUser = await this.authModel.findOne({email: createUser.email }).exec();
        if (checkUser) {
          throw new BadRequestException('Email đã tồn tại');
        } else if(!checkUser) {
          
          const newUser = {
             email:createUser.email ,
             phonenumber: createUser.phonenumber,
             name: createUser.name,
             surname: createUser.surname,
             
             gender: createUser.gender,
             avatar:createUser.avatar,
             nameaccount:createUser.nameaccount,
             password: createUser.password,
          }
          
          const createdAuth = await new this.authModel(newUser);
           console.log(createdAuth,'consoole log creteusth User')
          return createdAuth.save();
          }
             
  }
  
  private _crateToken({ email }) {
    
  }
  
  }
