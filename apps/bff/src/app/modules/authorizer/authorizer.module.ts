import { TcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices/module';
import { AuthorizerController } from './controllers/authorizer.controller';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)])],
  controllers: [AuthorizerController],
  providers: [],
  exports: [],
})
export class AuthorizerModule {}
