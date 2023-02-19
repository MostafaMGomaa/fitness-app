import { Users } from '../models/UsersModel';
import { config } from '../config/config';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_PASSWORD);

export class Email {
  to: string;
  from: string;
  name: string;
  url: string;
  transtport: any;

  constructor(user: Users, url: string) {
    this.to = user.email;
    this.from = 'gomaamostafa26@gmail.com';
    this.name = user.name;
    this.url = url;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: config.development.mailTrapEmail.host,
      port: Number(config.development.mailTrapEmail.port),
      auth: {
        user: config.development.mailTrapEmail.username,
        pass: config.development.mailTrapEmail.password,
      },
    });
  }

  async sendDev(subject: string, text: string): Promise<any> {
    const mailOptions: object = {
      from: 'Mostafa Gomaa',
      to: this.to,
      subject,
      text,
    };

    return await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcomeDev() {
    return await this.sendDev('Welcom', `Weclom ${this.name}`).catch((err) =>
      console.log(err)
    );
  }

  async sendResetPasswordDev(code: string) {
    return await this.sendDev(
      'Your Reset password token',
      `Please make patch request to this endpoint ${this.url} and ur code is ${code}`
    ).catch((err) => console.log(err));
  }

  send(subject: string, text: string) {
    const msg = {
      to: this.to,
      from: 'gomaamostafa26@gmail.com',
      subject,
      text,
    };

    return sgMail.send(msg).catch((err) => {
      console.log(err.response.body);
    });
  }

  sendWelcome() {
    return this.send('Welcome', `Welcome in our app`);
  }

  sendResetPaswordToken(token: string) {
    return this.send(
      'Rest password token',
      `Your reset is ${token}, 
      Your reset password token is only vaild for 10 min`
    );
  }
}
