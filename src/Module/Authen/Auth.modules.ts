import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth,AuthSchema} from "src/Schame/userSchame";
import { AuthService } from "./AuthService";
import { AuthController } from "./Auth.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]), JwtModule.register({
        secret: process.env.JWT_SECRET || 'defaultSecret', // Replace 'defaultSecret' with your actual secret key
        signOptions: { expiresIn: '1h' },
      }), ],
    providers: [AuthService],
    controllers: [AuthController],
  })
  export class AuthModule {}