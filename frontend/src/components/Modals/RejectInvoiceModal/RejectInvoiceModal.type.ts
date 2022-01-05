import { Invoice } from '@types';

export interface Props {
  visible: boolean;
  invoice: Invoice;
  onOk: (invoice: Invoice, values: any) => Promise<boolean>;
  onClose: () => void;
}
