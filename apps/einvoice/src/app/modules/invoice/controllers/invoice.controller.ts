import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { TcpServerTracingInterceptor } from '@common/interceptors/tracing-server.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../services/invoice.service';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ProcessId } from '@common/decorators/proccessId.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpServerTracingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  async create(@RequestParams() params: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
    const result = await this.invoiceService.create(params);
    return Response.success<InvoiceTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.SEND)
  async sendById(
    @RequestParams() params: SendInvoiceTcpReq,
    @ProcessId() processId: string,
  ): Promise<Response<string>> {
    await this.invoiceService.sendById(params, processId);
    return Response.success<string>(HTTP_MESSAGE.OK);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.UPDATE_INVOICE_PAID)
  async updateInvoicePaid(@RequestParams() invoiceId: string): Promise<Response<string>> {
    await this.invoiceService.updateInvoicePaid(invoiceId);
    return Response.success<string>(HTTP_MESSAGE.UPDATED);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.GET_BY_ID)
  async getInvoiceById(@RequestParams() invoiceId: string) {
    const invoice = await this.invoiceService.getById(invoiceId);
    if (invoice) return Response.success<InvoiceTcpResponse>(invoice);
  }
}
