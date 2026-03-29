import { Controller, HttpStatus } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UserById } from '@common/interfaces/grpc/user-access';
import { User } from '@common/schemas/user.schema';
import { Response } from '@common/interfaces/grpc/common/response.interface';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getByUserId')
  async getByUserId(payload: UserById): Promise<Response<User>> {
    const result = await this.userService.getUserByUserId(payload.userId);

    if (!result) {
      return Response.error<User>('User not found', HttpStatus.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);
    }

    return Response.success<User>(result);
  }
}
