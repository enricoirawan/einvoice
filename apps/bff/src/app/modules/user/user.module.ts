import { Module } from '@nestjs/common';

import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { UserController } from './controllers/user.controller';
import { ClientsModule } from '@nestjs/microservices/module';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.USER_ACCCESS_SERVICE)])],
  controllers: [UserController],
  providers: [],
  exports: [],
})
export class UserModule {}
