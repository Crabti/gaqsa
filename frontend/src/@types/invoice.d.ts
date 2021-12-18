import { CommonType } from '@types';

export interface Invoice extends CommonType {
    invoice_folio: string;
    invoice_date: string;
    amount: number;
    client: string;
    order: number;
}

export interface UploadInvoiceForm {
    delivery_date: string;
    xml_file: Blob;
    invoice_file: Blob;
    extra_file: Blob;
}
