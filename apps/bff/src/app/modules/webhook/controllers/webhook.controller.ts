import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StripeWebhookService } from '../services/stripe-webhook.service';
import { ProcessId } from '@common/decorators/proccessId.decorator';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Stripe Webhook' })
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @ProcessId() processId: string,
  ) {
    console.log('masuk controller');
    console.log(req.rawBody);
    if (req.rawBody) {
      await this.stripeWebhookService.processWebhook({ rawBody: req.rawBody, signature }, processId);
      return Response.success<string>(HTTP_MESSAGE.OK);
    }
  }
}
