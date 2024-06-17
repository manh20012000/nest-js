import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './jwtService';
import { AuthModule } from '../Authen/Auth.modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class AppModule {}