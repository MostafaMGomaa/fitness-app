import { Users } from '../models/UsersModel';
import { config } from '../config/config';

import nodemailer from 'nodemailer';

export class Email {
  to: string;
  from: string;
  name: string;
  url: string;
  transtport: any;

  constructor(user: Users, url: string) {
    this.to = user.email;
    this.from = '<fitnessApp@info.com>';
    this.name = user.name;
    this.url = url;
  }

  newTransport(): any {
    if (process.env.NODE_ENV === 'producation') {
      // return nodemail transport -> Sendgrid
      // console.log('Prod');
      // console.log(config.production.sendGridEmail);
      this.transtport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: config.production.sendGridEmail.username,
          pass: config.production.sendGridEmail.password,
        },
      });
      return this.transtport;
    }

    return nodemailer.createTransport({
      host: config.development.mailTrapEmail.host,
      port: Number(config.development.mailTrapEmail.port),
      auth: {
        user: config.development.mailTrapEmail.username,
        pass: config.development.mailTrapEmail.password,
      },
    });
  }

  async send(subject: string, text: string): Promise<any> {
    const mailOptions: object = {
      from: 'Mostafa Gomaa',
      to: this.to,
      subject,
      text,
    };

    return await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    return await this.send('Welcom', `Weclom ${this.name}`);
  }

  async sendResetPassword(code: string) {
    return await this.send(
      'Your Reset password token',
      `Please make patch request to this endpoint ${this.url} and ur code is ${code}`
    );
  }
}
