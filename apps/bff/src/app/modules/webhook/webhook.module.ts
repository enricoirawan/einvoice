import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';

import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.INVOICE_SERVICE)])],
  controllers: [WebhookController],
  providers: [StripeWebhookService],
})
export class WebhookModule {}
