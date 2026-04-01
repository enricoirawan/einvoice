import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateInvoiceTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { Invoice } from '@common/schemas/invoice.schema';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { createCheckoutSessionMapping, invoiceRequestMapping } from '../mappers';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { ObjectId } from 'mongodb';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';
import { PaymentService } from '../../payment/services/payment.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';
import { InvoiceSendSagaContext } from '@common/interfaces/saga/saga-step.interface';
import { InvoiceSendSagaSteps } from '../sagas/invoice-send-saga-steps.service';
import { SagaOrchestrationService } from '@common/saga-orchestration/saga-orchestration.service';
import { SAGA_TYPE } from '@common/constants/enum/saga.enum';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
    private readonly paymentService: PaymentService,
    private readonly kafkaClient: KafkaService,
    private readonly sagaSteps: InvoiceSendSagaSteps,
    private readonly sagaOrchestrator: SagaOrchestrationService,
  ) {}

  create(params: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  async sendById(params: SendInvoiceTcpReq, processId: string) {
    const { invoiceId, userId } = params;

    const invoice = await this.invoiceRepository.getById(invoiceId);
    console.log(invoice);

    if (!invoice) {
      throw new BadRequestException(ERROR_CODE.INVOICE_NOT_FOUND);
    }

    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE_SENT);
    }

    const pdfBase64 = await this.generatorInvoicePdf(invoice, processId);

    if (!pdfBase64) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE_SENT);
    }

    const fileUrl = await this.uploadFile({ fileBase64: pdfBase64, fileName: `invoice-${invoiceId}` }, processId);

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
      fileUrl,
    });

    // Execute saga
    const context: InvoiceSendSagaContext = {
      sagaId: '',
      invoiceId,
      userId,
      processId,
    };

    const steps = this.sagaSteps.getSteps(invoice);

    try {
      await this.sagaOrchestrator.execute(SAGA_TYPE.INVOICE_SEND, steps, context);

      this.kafkaClient.emit<InvoiceSentPayload>('invoice-sent', {
        id: invoiceId,
        paymentLink: context.paymentLink || '',
      });
    } catch (error: any) {
      this.logger.error(`Failed to send invoice ${invoiceId}: ${error.message}`);
      throw error;
    }
  }

  generatorInvoicePdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorClient
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, { data, processId })
        .pipe(map((data) => data.data)),
    );
  }

  uploadFile(data: UploadFileTcpReq, processId: string) {
    return firstValueFrom(
      this.mediaClient
        .send<string, UploadFileTcpReq>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, { data, processId })
        .pipe(map((data) => data.data)),
    );
  }

  updateInvoicePaid(invoiceId: string) {
    return this.invoiceRepository.updateById(invoiceId, { status: INVOICE_STATUS.PAID });
  }

  getById(id: string) {
    return this.invoiceRepository.getById(id);
  }
}
