import { ProductProvider } from '@types';

export interface Props {
    visible: boolean;
    onClose: (success: boolean) => void;
    product: ProductProvider;
}
