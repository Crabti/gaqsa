import { Maybe, Product } from '@types';
import { message, Spin } from 'antd';
import { useBackend } from 'integrations';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from './Products.Detail';

const ProductDetailCompound: React.FC = () => {
  const [product, setProduct] = useState<Maybe<Product>>(undefined);
  const [loading, setLoading] = useState(false);
  const backend = useBackend();
  const { id: productId } = useParams<{ id: string; }>();

  useEffect(() => {
    const fetchProduct = async (): Promise<void> => {
      const [result, error] = await backend.products.getOne(productId);

      if (error || !result || !result.data) {
        message.error('Error al cargar el producto.');
        return;
      }

      setProduct(result.data);
    };

    setLoading(true);
    fetchProduct();
    setLoading(false);
  }, [backend.products, productId]);

  if (!product) return <></>;

  if (loading) return <Spin />;

  return (
    <ProductDetail product={product} />
  );
};

export default ProductDetailCompound;
