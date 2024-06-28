import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
export const MessagingProvider = 'lib:messaging';

export const messagingProvider: Provider = {
  provide: MessagingProvider,
  useFactory: async (configService: ConfigService) => {
    const jsonString = fs.readFileSync(
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
      'utf-8',
    );

    const jsonData = JSON.parse(jsonString);
    await admin.initializeApp({
      credential: admin.credential.cert({
        projectId: jsonData.project_id,
        clientEmail: jsonData.client_email,
        privateKey: jsonData.private_key,
      }),
    });
    return admin.messaging(admin.app());
  },
};
