import { Module ,NestModule,MiddlewareConsumer,RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth,AuthSchema} from "src/Schema/userSchame";
import { AuthService } from "./AuthService";
import { AuthController } from "./Auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/Strategy";
import { AuthMiddleware } from "src/Protected/MiddwaveProtected";
@Module({
    imports: [MongooseModule.forFeature([{name:'AuthModel', schema: AuthSchema }]), JwtModule.register({
        secret: process.env.JWT_SECRET || 'defaultSecret', // Replace 'defaultSecret' with your actual secret key
        signOptions: { expiresIn: '15m' },
      global: true,
      }), ],
    providers: [AuthService,JwtStrategy],
    controllers: [AuthController],
  })
  export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .forRoutes({path:'auth/Oneuser',method: RequestMethod.GET}); // Đặt các route bạn muốn áp dụng middleware
    }
  }