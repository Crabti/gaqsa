import { Order } from '@types';

export interface Props {
    visible: boolean;
    onClose: (success: boolean) => void;
    order: Order | undefined;
}
