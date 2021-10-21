import { Product } from '@types';

export interface Props {
    visible: boolean;
    onClose: () => void;
    product: Product;
}
