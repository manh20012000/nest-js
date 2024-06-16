import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth,AuthSchema} from "src/Schame/userSchame";
import { AuthService } from "./AuthService";
import { AuthController } from "./Auth.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [MongooseModule.forFeature([{name:'AuthModel', schema: AuthSchema }]), JwtModule.register({
        secret: process.env.JWT_SECRET || 'defaultSecret', // Replace 'defaultSecret' with your actual secret key
      signOptions: { expiresIn: '15m' },
      global: true,
      }), ],
    providers: [AuthService],
    controllers: [AuthController],
  })
  export class AuthModule {}