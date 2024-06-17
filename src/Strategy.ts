import { HttpException, HttpStatus, Injectable,NestMiddleware} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from "./Module/Authen/AuthService";
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(  private readonly authService: AuthService,
        private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }
    async validate({ email }) {
        const user=await this.authService.validateUser(email)
        if (!user) {
            throw new HttpException('Invalid',HttpStatus.UNAUTHORIZED)
        }
        return user;
    }
}