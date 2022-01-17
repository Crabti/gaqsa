import React, { useEffect, useState } from 'react';

export interface ShoppingCartProductType {
  id: number;
  quantity: number;
}

export interface ShoppingCartType {
    productsCart: ShoppingCartProductType[];
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
  const [productsCart, setProductsCart] = useState<ShoppingCartProductType[]>(
    [],
  );

  const persistProducts = (newProducts: ShoppingCartProductType[]): void => {
    setProductsCart(newProducts);

    localStorage.setItem('shoppingCart', JSON.stringify({
      productsCart: newProducts,
    }));
  };

  const addProducts = (newProduct: ShoppingCartProductType): void => {
    if (productsCart.some((e) => e.id === newProduct.id)) {
      persistProducts(
        productsCart.map((e) => (e.id === newProduct.id
          ? { ...e, quantity: newProduct.quantity }
          : e)),
      );
      return;
    }
    persistProducts([...productsCart, newProduct]);
  };

  const removeProducts = (newProduct: ShoppingCartProductType): void => {
    persistProducts(
      productsCart.filter((e) => newProduct.id !== e.id),
    );
  };

  const retrieveState = (): void => {
    const stored = localStorage.getItem('shoppingCart');
    if (stored) {
      const parsedStored = JSON.parse(stored);
      setProductsCart(parsedStored.productsCart);
    } else {
      setProductsCart([]);
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
      productsCart, addProducts, removeProducts, clear,
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
