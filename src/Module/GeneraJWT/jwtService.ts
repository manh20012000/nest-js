import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async verifyToken(token: string, secret: string): Promise<any> {
    return this.jwtService.verify(token, { secret });
  }

  async refreshTokens(accessToken: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });

    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = await this.generateAccessToken({ userId: payload.userId });
    const newRefreshToken = await this.generateRefreshToken({ userId: payload.userId });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
