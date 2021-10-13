import { Product } from '@types';
import React, { useEffect, useState } from 'react';

export interface ShoppingCartProductType {
  product: Product;
  amount: number;
}

export interface ShoppingCartType {
    products: ShoppingCartProductType[];
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
  const [products, setProducts] = useState<ShoppingCartProductType[]>([]);
  const [total, setTotal] = useState<ShoppingCartType['total']>(0);
  const [subtotal, setSubtotal] = useState<ShoppingCartType['subtotal']>(0);
  const [subieps, setSubieps] = useState<ShoppingCartType['subieps']>(0);
  const [subiva, setSubiva] = useState<ShoppingCartType['subiva']>(0);

  const persistProducts = (newProducts: ShoppingCartProductType[]): void => {
    setProducts(newProducts);

    let newSubtotal = 0;
    let newIeps = 0;
    let newIVA = 0;
    let newTotal = 0;

    newProducts.forEach((e) => {
      newSubtotal += (e.amount * e.product.price);
      newIeps += e.amount * e.product.ieps * e.product.price;
      newIVA += e.amount * e.product.iva * e.product.price;
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
    if (products.some((e) => e.product.id === newProduct.product.id)) {
      persistProducts(
        products.map((e) => (e.product.id === newProduct.product.id
          ? { ...e, amount: e.amount + newProduct.amount }
          : e)),
      );
      return;
    }
    persistProducts([...products, newProduct]);
  };

  const removeProducts = (newProduct: ShoppingCartProductType): void => {
    persistProducts(
      products.filter((e) => newProduct.product.id !== e.product.id),
    );
  };

  const retrieveState = (): void => {
    const stored = localStorage.getItem('shoppingCart');
    if (stored) {
      const parsedStored = JSON.parse(stored);
      setProducts(parsedStored.products);
      setTotal(parsedStored.total);
      setSubieps(parsedStored.subieps);
      setSubiva(parsedStored.subiva);
      setSubtotal(parsedStored.subtotal);
    }
  };

  const clear = (): void => {
    persistProducts([]);
  };

  useEffect(() => {
    if (products.length === 0) {
      retrieveState();
    }
  }, [products, total]);

  return (
    <ShoppingCartContext.Provider value={{
      // eslint-disable-next-line max-len
      products, total, addProducts, removeProducts, clear, subieps, subiva, subtotal,
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
