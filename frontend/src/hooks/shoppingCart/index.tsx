import { Offer } from '@types';
import React, { useEffect, useState } from 'react';

interface ProductCart {
  id: number;
  name: string;
  presentation: string;
  category: string;
  key: string;
  active_substance: string;
  laboratory: string;
  price: number;
  iva: number;
  ieps: number;
  provider: string;
  originalPrice?: number;
}

export interface ShoppingCartProductType {
  product: ProductCart;
  offer?: Offer;
  amount: number;
}

export interface ShoppingCartType {
    productsSh: ShoppingCartProductType[];
    subtotal: number;
    subieps: number;
    subiva: number;
    total: number;
    addProducts: (newProduct: ShoppingCartProductType) => void;
    removeProducts: (newProduct: ShoppingCartProductType) => void;
    clear: () => void;
}

export const LOCAL_STORAGE_KEY = 'shoppingCart';

export const ShoppingCartContext = (
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  React.createContext<ShoppingCartType>(undefined!)
);

export const ShoppingCartContextProvider: React.FC = ({ children }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [productsSh, setProductsSh] = useState<ShoppingCartProductType[]>([]);
  const [total, setTotal] = useState<ShoppingCartType['total']>(0);
  const [subtotal, setSubtotal] = useState<ShoppingCartType['subtotal']>(0);
  const [subieps, setSubieps] = useState<ShoppingCartType['subieps']>(0);
  const [subiva, setSubiva] = useState<ShoppingCartType['subiva']>(0);

  const persistProducts = (newProducts: ShoppingCartProductType[]): void => {
    setProductsSh(newProducts);

    let newSubtotal = 0;
    let newIeps = 0;
    let newIVA = 0;
    let newTotal = 0;

    newProducts.forEach((e) => {
      const { price, iva } = e.product;

      newSubtotal += (e.amount * price);

      newIeps += e.amount * ((e.product.ieps / 100) * price);
      newIVA += e.amount * ((iva / 100) * price);
    });
    newTotal = newSubtotal + newIVA + newIeps;
    setSubtotal(newSubtotal);
    setSubieps(newIeps);
    setSubiva(newIVA);

    setTotal(newTotal);

    localStorage.setItem('shoppingCart', JSON.stringify({
      products: newProducts,
      total: newTotal,
      subtotal: newSubtotal,
      subieps: newIeps,
      subiva: newIVA,
    }));
  };

  const addProducts = (newProduct: ShoppingCartProductType): void => {
    if (productsSh.some((e) => e.product.id === newProduct.product.id)) {
      persistProducts(
        productsSh.map((e) => (e.product.id === newProduct.product.id
          ? { ...e, amount: newProduct.amount }
          : e)),
      );
      return;
    }
    persistProducts([...productsSh, newProduct]);
  };

  const removeProducts = (newProduct: ShoppingCartProductType): void => {
    persistProducts(
      productsSh.filter((e) => newProduct.product.id !== e.product.id),
    );
  };

  const retrieveState = (): void => {
    const stored = localStorage.getItem('shoppingCart');
    if (stored) {
      const parsedStored = JSON.parse(stored);
      setProductsSh(parsedStored.products);
      setTotal(parsedStored.total);
      setSubieps(parsedStored.subieps);
      setSubiva(parsedStored.subiva);
      setSubtotal(parsedStored.subtotal);
    } else {
      setProductsSh([]);
    }
    setLoaded(true);
  };

  const clear = (): void => {
    persistProducts([]);
  };

  useEffect(() => {
    if (!loaded) {
      retrieveState();
    }
  }, [loaded]);

  return (
    <ShoppingCartContext.Provider value={{
      // eslint-disable-next-line max-len
      productsSh, total, addProducts, removeProducts, clear, subieps, subiva, subtotal,
    }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

const useShoppingCart = (): ShoppingCartType => React.useContext(
  ShoppingCartContext,
);

export default useShoppingCart;
