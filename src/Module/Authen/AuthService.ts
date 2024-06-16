import { Injectable,BadRequestException, Get ,HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/Schame/userSchame';
import * as bcrypt from 'bcrypt';
import { SiginUser } from './Auth.dto/Sigin';
import { loginUser } from './Auth.dto/Login';
import { logoutUser } from './Auth.dto/Logout';
import { JwtService } from '@nestjs/jwt';
import { getUser } from './Auth.dto/getUser'; 
import { Express } from 'express'

@Injectable()
export class AuthService {
  constructor(@InjectModel('AuthModel') private authModel: Model<Auth>,private jwtService: JwtService
  ) { }
  
 async _crateToken(email) {
    const payload = { email:email };
    return {
        access_token: this.jwtService.sign(payload)
    };
  }
  
  async LoginUser(login: loginUser) {
    const user =await this.authModel.findOne({ email: login.email })
    if (user) {
      const token = await this._crateToken(login.email);
      const match = await bcrypt.compare(login.password, user.password);
      if (match) {
        const newUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          birthdate: user.birthdate,
          accessToken: token.access_token,
         }
        return newUser
      }
    }  throw new HttpException('not found user', 404)
   
  }
  
  async SiginUser(createUser: SiginUser,file:String) {
    const password = await bcrypt.hash(createUser.password, 10)

    const checkUser = await this.authModel.findOne({ email: createUser.email });
        if (checkUser) {
          throw new BadRequestException('Email đã tồn tại');
        } else if(!checkUser) {
          try {
             const newUser = {
             email:createUser.email ,
             phonenumber: createUser.phonenumber,
            name: createUser.name,
            birthdate:createUser.birthdate,
             surname: createUser.surname,
             gender: createUser.gender,
             avatar:file,
             nameaccount:createUser.nameaccount,
             password:password,
            }
            console.log(newUser)
          const createdAuth = await new this.authModel(newUser);
          return await createdAuth.save();
          }
          catch (error) {
              console.log(error)
          }

          }
             
  }
  //getUserById
  async getById(id:String) {
    return this.authModel.findById({ _id: id }).select('-password -_id')
}
 
  // getAllUser
  async getUser() {
        return this.authModel.find()
   }
  
  }
