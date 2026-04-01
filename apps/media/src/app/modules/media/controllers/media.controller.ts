import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { UploadFileTcpReq, UploadFileTcpRes } from '@common/interfaces/tcp/media';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MediaService } from '../services/media.service';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE)
  async uploadFile(@RequestParams() params: UploadFileTcpReq): Promise<Response<UploadFileTcpRes>> {
    const result = await this.mediaService.uploadFile(params);
    return Response.success<UploadFileTcpRes>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.DESTROY_FILE)
  async destroyFile(@RequestParams() publicId: string): Promise<Response<string>> {
    await this.mediaService.destroyFile(publicId);
    return Response.success<string>(HTTP_MESSAGE.DELETED);
  }
}
