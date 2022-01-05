import { Order, Invoice } from '@types';

export interface Props {
    visible: boolean;
    onClose: (success: boolean, invoice?: Invoice) => void;
    order: Order | undefined;
}
