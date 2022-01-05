import { Invoice } from '@types';

export interface Props {
    invoices?: Invoice[];
    redirectToOrderDetail?: boolean;
    onRefresh: () => void;
}
