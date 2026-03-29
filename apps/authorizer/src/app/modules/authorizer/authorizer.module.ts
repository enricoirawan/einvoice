import { Module } from '@nestjs/common';
import { AuthorizerController } from './controllers/authorizer.controller';
import { AuthorizerService } from './services/authorizer.service';
import { KeycloackModule } from '../keycloak/keycloak.module';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';

@Module({
  imports: [KeycloackModule, ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.USER_ACCCESS_SERVICE)])],
  controllers: [AuthorizerController],
  providers: [AuthorizerService],
})
export class AuthorizerModule {}
