import {
  Injectable,
  BadRequestException,
  Get,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/Schema/userSchame';
import * as bcrypt from 'bcrypt';
import { SiginUser } from './Auth.dto/Sigin';
import { loginUser } from './Auth.dto/Login';
import { JwtService } from '@nestjs/jwt';
import { Express, Response } from 'express';
import { getUser } from './Auth.dto/getUser';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('AuthModel') private authModel: Model<Auth>,
    private jwtService: JwtService,
  ) {}

  async LoginUser(login: loginUser, @Res() res) {
    const user = await this.validateUser(login.email);
    console.log(login);
    if (user) {
      const payload = { email: user.email };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_JWT_SECRET,
        expiresIn: '7d',
      });

      const match = await bcrypt.compare(login.password, user.password);
      if (match) {
        const newUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          birthdate: user.birthdate,
          accessToken: accessToken,
          refreshToken: refreshToken,
          fcmtoken: user.fcmtoken ?? [],
          surname: user.surname,
          phonenumber: user.phonenumber,
        };
        // // Set cookies
        //  res.status(200).json('accessToken', accessToken);
        //  res.status(200).json('refreshToken', refreshToken);
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });

        return res.status(200).json(newUser);
      }
    }
    throw new HttpException('not found user', 404);
  }

  async SiginUser(createUser: SiginUser, file: String) {
    const password = await bcrypt.hash(createUser.password, 10);
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
          phonenumber: createUser.phonenumber,
        };

        const createdAuth = await new this.authModel(newUser);

        return await createdAuth.save();
      } catch (error) {
        console.log(error);
      }
    }
  }

  //getUserById
  async getById(id: String) {
    return this.authModel.findById({ _id: id }).select('-password -_id');
  }

  // getAllUser với lấy những tất cả user mà trừ user có id là khoong lấy ra
  async getUser(id: string) {
    return this.authModel.find({ _id: { $ne: id } }).select('-password');
  }

  //validate tài khoản
  async validateUser(email) {
    const user = await this.authModel.findOne({ email: email });
    if (!user) {
      throw new HttpException('Invalid', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  // refreshtken cơ chế này hoạt động khi mà người dùng vào app đã được luuw tài khoản và
  // hoặc người ta vào 1 cái route khác đăng nhập
  async refreshToken(refreshToken: string, res: Response) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_JWT_SECRET,
      });

      const email = decoded.email;
      const user = await this.validateUser(email);
      if (!user) {
        throw new HttpException('not found user', 404);
      }

      const payload = { email: user.email };
      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      });
      // const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      return res.status(401).json({ message: 'refresh suscess' });
    } catch (error) {
      throw new HttpException('not refresh Token ', 404);
    }
  }

  async updateFCMuser(fcmtokenar: string[], userid: string): Promise<getUser> {
    {
      const updatw: getUser = await this.authModel.findOneAndUpdate(
        { _id: userid },
        { fcmtoken: fcmtokenar },
        { new: true }, // Thêm option new để trả về giá trị đã được cập nhật
      );
      console.log(updatw);
      return updatw;
    }
  }
  // thưc thi với xoa fcm token
  async handelerToken(token: string, refreshToken: string) {
    let newAccessToken = '';
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const email = decoded.email;
      const user = await this.validateUser(email);

      if (!user) {
        throw new HttpException('User not found', 404);
      }
      newAccessToken = token;
      return { userId: user._id, newAccessToken };
    } catch (e) {
      // Kiểm tra nếu lỗi là do token hết hạn
      if (e.name === 'TokenExpiredError') {
        try {
          // Xác thực refresh token
          const decodedRefresh = this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_JWT_SECRET,
          });
          const email = decodedRefresh.email;
          const user = await this.validateUser(email);
          if (!user) {
            throw new HttpException('User not found', 404);
          }

          // Tạo mới access token
          const payload = { email: user.email };
          newAccessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
          });
          return { userid: user.id, newAccessToken };
        } catch (error) {
          throw new HttpException('Invalid refresh token', 401);
        }
      } else {
        throw new HttpException('Invalid token', 401);
      }
    }
  }
}
