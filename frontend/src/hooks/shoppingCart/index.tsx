import { Product } from '@types';
import React, { useState } from 'react';

export interface ShoppingCartProductType {
  product: Product;
  amount: number;
}

export interface ShoppingCartType {
    products: ShoppingCartProductType[];
    total: number;
    addProducts: (newProduct: ShoppingCartProductType) => void;
}

export const ShoppingCartContext = (
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
    console.log(newProduct);
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

  return (
    <ShoppingCartContext.Provider value={{ products, total, addProducts }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

const useShoppingCart = (): ShoppingCartType => React.useContext(
  ShoppingCartContext,
);

export default useShoppingCart;
