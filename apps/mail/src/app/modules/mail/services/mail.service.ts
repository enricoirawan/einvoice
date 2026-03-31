import { SendMailOptions } from '@common/interfaces/common/email.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    const host = this.config.get('MAIL_CONFIG.HOST');
    const port = this.config.get('MAIL_CONFIG.PORT');
    const user = this.config.get('MAIL_CONFIG.USER');
    const pass = this.config.get('MAIL_CONFIG.PASS');
    this.transporter = nodemailer.createTransport({
      host,
      port: parseInt(port ?? '', 10),
      secure: false,
      requireTLS: true,
      auth: {
        user,
        pass,
      },
    });

    // Verify connection on startup
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('❌ Mail transporter verification failed:', error);
      } else {
        this.logger.log('✅ Mail transporter is ready');
      }
    });
  }

  async sendMail({ to, subject, html, text, senderName, senderEmail, attachments }: SendMailOptions) {
    const defaultName = this.config.get('MAIL_CONFIG.SENDER_NAME');
    const defaultEmail = this.config.get('MAIL_CONFIG.SENDER_EMAIL');

    const mailOptions = {
      from: `"${senderName ?? defaultName}" <${senderEmail ?? defaultEmail}>`,
      to,
      subject,
      html,
      text: text ?? html?.replace(/<[^>]+>/g, ''),
      attachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`📧 Mail sent to ${to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send mail to ${to}:`, error);
      throw error;
    }
  }
}
