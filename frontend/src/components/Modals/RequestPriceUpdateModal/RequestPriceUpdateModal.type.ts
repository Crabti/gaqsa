export interface Props {
  visible: boolean;
  onClose: () => void;
  productId: number;
  currentPrice: number;
  productName: string;
}

export interface UpdatePriceFormType {
  price: number;
  token: string;
}
