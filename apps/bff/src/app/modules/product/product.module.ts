import { Module } from '@nestjs/common';

import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { ProductController } from './controllers/product.controller';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.PRODUCT_SERVICE)])],
  controllers: [ProductController],
  providers: [],
  exports: [],
})
export class ProductModule {}
