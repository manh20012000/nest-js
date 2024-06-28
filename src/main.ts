import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    ); /*được sử dụng để kích hoạt CORS (Cross-Origin Resource Sharing) cho ứng dụng.
   CORS là một cơ chế bảo mật cho phép kiểm soát việc truy cập tài nguyên từ một nguồn khác
    với nguồn của trang web mà trình duyệt đang truy cập. Nó giúp ngăn chặn các trang web độc hại truy cập tài nguyên từ trang web của bạn mà không được phé*/
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(8080);
}
bootstrap();
/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const serviceAccount = require(
    configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
  );

  // // Set the config options
  // const adminConfig: ServiceAccount = {
  //   projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
  //   privateKey: configService
  //     .get<string>('FIREBASE_PRIVATE_KEY')
  //     .replace(/\\n/g, '\n'),
  //   clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  // };

  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   // databaseURL: 'https://your-firebase-project-id.firebaseio.com',
  // });
  /*được sử dụng để kích hoạt CORS (Cross-Origin Resource Sharing) cho ứng dụng.
   CORS là một cơ chế bảo mật cho phép kiểm soát việc truy cập tài nguyên từ một nguồn khác
    với nguồn của trang web mà trình duyệt đang truy cập. Nó giúp ngăn chặn các trang web độc hại truy cập tài nguyên từ trang web của bạn mà không được phé*/
//   app.enableCors({
//     origin: '*',
//     credentials: true,
//   });
//   await app.listen(8080);
// }
// bootstrap();
// */
