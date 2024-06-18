import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/Schema/userSchame';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,

    @InjectModel('AuthModel') private authModel: Model<Auth>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).json({ message: 'Missing cookies' });
    }
    

    const cookieMap = cookies.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    const accessToken = cookieMap['accessToken'];
    const refreshToken = cookieMap['refreshToken'];

    if (!accessToken) {
      return res.status(401).json({ message: 'Missing access token' });
    }
    
    try {

      const decodedAccessToken = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const email = decodedAccessToken.email;

      const user = await this.authModel.findOne({ email }).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      (req as any).user = user;

      next();
    } catch (accessTokenError) {
     
      try {
    
        const decodedRefreshToken = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        });

        const email = decodedRefreshToken.email;

        const user = await this.authModel.findOne({ email }).select('-password');

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        const newAccessToken = this.jwtService.sign({ email: user.email },{ secret: process.env.JWT_SECRET, expiresIn: '5m' });

        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: false, sameSite: 'lax' });

        (req as any).user = user;

        next();
      } catch (refreshTokenError) {
        console.log('Invalid refresh token error:', refreshTokenError);
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    }
  }
}