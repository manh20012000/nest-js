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
    // const cookies = req.headers.cookie;
    const accessToken = req.headers['authorization'];
    const refreshToken = req.headers['refresh-token'] as string;
  
    if (!accessToken) {
      return res.status(401).json({ message: 'Missing cookies' });
    }
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
      console.log('nhảy vào đây thực thi');
      try {
        const decodedRefreshToken = this.jwtService.verify(refreshToken, {
          secret: process.env.REFRESH_JWT_SECRET,
        });

        const email = decodedRefreshToken.email;

        const user = await this.authModel
          .findOne({ email })
          .select('-password');

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        const newAccessToken = this.jwtService.sign(
          { email: user.email },
          { secret: process.env.JWT_SECRET, expiresIn: '1d' },
        );

        res.status(200).json({
          message: 'New vui lòng login lại  ',
          accessToken: newAccessToken,
        });

        next();
      } catch (err) {
        console.log('Invalid refresh token error:', err);
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    }
  }
}
