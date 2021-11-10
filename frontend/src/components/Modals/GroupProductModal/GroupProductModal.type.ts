import { Product } from '@types';

export interface Props {
  visible: boolean;
  onClose: (success: boolean) => void;
  products?: Product[],
}
