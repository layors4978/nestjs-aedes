import { Injectable } from '@nestjs/common';
import { Client, AuthenticateError } from 'aedes';

@Injectable()
export class AuthService {
  connectAuth(
    client: Client,
    username: string,
    password: Buffer,
    callback: (error: AuthenticateError | null, success: boolean) => void,
  ) {
    // console.log({
    //   id: client.id,
    //   username,
    //   password: password.toString(),
    // });
    const whitelist = ['device:DEMO0001', 'device:DEMO0002'];
    if (!whitelist.includes(client.id)) {
      callback(null, false);
    }
    callback(null, true);
  }
}
