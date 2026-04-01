import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { UserDestination } from '@common/schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGrpcController } from './controllers/user-grpc.controller';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [MongooseModule.forFeature([UserDestination])],
  controllers: [UserController, UserGrpcController],
  providers: [UserService, UserRepository, TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)],
  exports: [],
})
export class UserModule {}
