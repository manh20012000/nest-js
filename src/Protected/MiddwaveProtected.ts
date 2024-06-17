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
      const decoded = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
      const email = decoded.email;
      const user = await this.authModel.findOne({ email }).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      (req as any).user = user; // Gán thông tin người dùng vào req

      next();
    } catch (err) {
      console.log('Invalid token error:', err); // Log lỗi để kiểm tra
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}
