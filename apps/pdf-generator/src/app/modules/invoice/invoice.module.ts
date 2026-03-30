import { Module } from '@nestjs/common';
import { InvoicePdfController } from './controllers/invoce-pdf.controller';
import { InvoicePdfService } from './services/invoice-pdf.service';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [PdfModule],
  controllers: [InvoicePdfController],
  providers: [InvoicePdfService],
  exports: [],
})
export class InvoiceModule {}
