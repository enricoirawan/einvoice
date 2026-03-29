import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/proccessId.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { CreateUserRequestDto } from '@common/interfaces/gateway/user';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorizer.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCCESS_SERVICE) private readonly userAccessClient: TcpClient) {}

  @Post()
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  @ApiOperation({
    summary: 'Create a new user',
  })
  @Authorization({ secured: false })
  create(@Body() body: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<string, CreateUserTcpRequest>(TCP_REQUEST_MESSAGE.USER.CREATE, { data: body, processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
