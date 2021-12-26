import { CommonType } from '@types';

export interface Invoice extends CommonType {
    invoice_folio: string;
    invoice_date: string;
    delivery_date: string;
    amount: number;
    client: string;
    order: number;
    xml_file: string;
    invoice_file: string;
    extra_file?: string;
}

export interface UploadInvoiceForm {
    delivery_date: string;
    xml_file: Blob;
    invoice_file: Blob;
    extra_file: Blob;
}
