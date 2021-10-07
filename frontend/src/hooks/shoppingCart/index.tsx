import { Product } from '@types';
import React, { useEffect, useState } from 'react';

export interface ShoppingCartProductType {
  product: Product;
  amount: number;
}

export interface ShoppingCartType {
    products: ShoppingCartProductType[];
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

  const persistProducts = (newProducts: ShoppingCartProductType[]): void => {
    setProducts(newProducts);

    let newTotal = 0;

    newProducts.forEach((e) => {
      newTotal += e.amount * e.product.price;
    });

    setTotal(newTotal);

    localStorage.setItem('shoppingCart', JSON.stringify({
      products: newProducts,
      total: newTotal,
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
    const productExist = products.find(
      (e) => newProduct.product.id === e.product.id,
    );

    if (productExist?.amount === 1) {
      persistProducts(
        products.filter((e) => newProduct.product.id !== e.product.id),
      );
    } else {
      persistProducts(
        products.map((e) => (e.product.id === newProduct.product.id
          ? { ...e, amount: e.amount + newProduct.amount }
          : e)),
      );
    }
  };

  const retrieveState = (): void => {
    const stored = localStorage.getItem('shoppingCart');
    if (stored) {
      const parsedStored = JSON.parse(stored);
      setProducts(parsedStored.products);
      setTotal(parsedStored.total);
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
      products, total, addProducts, removeProducts, clear,
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
