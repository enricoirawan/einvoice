import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), InvoiceModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
