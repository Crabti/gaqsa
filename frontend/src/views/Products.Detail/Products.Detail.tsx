import { Product } from '@types';
import { Descriptions, Layout } from 'antd';
import Title from 'components/Title';
import React from 'react';

interface Props {
  product: Product;
}

const ProductDetail: React.FC<Props> = ({ product }) => (
  <Layout.Content>
    <Title viewName={product.name} parentName="Productos" />
    <Descriptions bordered>
      <Descriptions.Item label="Presentación">
        {product.presentation}
      </Descriptions.Item>
      <Descriptions.Item label="Información">
        {product.more_info}
      </Descriptions.Item>
      <Descriptions.Item label="IEPS">
        {product.ieps || 0.0}
      </Descriptions.Item>
      <Descriptions.Item label="Especie">
        {product.animal_groups}
      </Descriptions.Item>
      <Descriptions.Item label="Substancia Activa">
        {product.active_substance}
      </Descriptions.Item>
      <Descriptions.Item label="Clave">
        {product.key}
      </Descriptions.Item>
    </Descriptions>
  </Layout.Content>
);

export default ProductDetail;
