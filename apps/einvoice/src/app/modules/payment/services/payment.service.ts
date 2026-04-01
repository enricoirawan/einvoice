import { CreateCheckoutSessionRequest } from '@common/interfaces/common';
import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeService: StripeService) {}

  createCheckoutSession(params: CreateCheckoutSessionRequest) {
    return this.stripeService.createCheckoutSession(params);
  }

  expireCheckoutSession(sessionId: string) {
    return this.stripeService.expireCheckoutSession(sessionId);
  }
}
