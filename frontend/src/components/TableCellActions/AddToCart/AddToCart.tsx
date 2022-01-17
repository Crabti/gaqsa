import React from 'react';
import {
  Col,
  InputNumber,
  Row,
  Tooltip,
} from 'antd';
import { ProductGroup } from '@types';
import useShoppingCart from 'hooks/shoppingCart';

export interface Props {
  product: ProductGroup;
}

const AddToCart: React.FC<Props> = ({ product }) => {
  const {
    addProducts, removeProducts,
  } = useShoppingCart();

  return (
    <Col>
      {product.providers.map((provider, index) => (
        <Row key={provider.id}>
          <Tooltip
            title={
                  `Añadir ${product.name}
                  - ${product.providers[index].provider} al carrito`
                }
          >
            <InputNumber
              min={0}
              step={1}
              onChange={(value) => {
                const rowProvider = product.providers[index];
                if (Number(value) > 0) {
                  addProducts({
                    id: rowProvider.id,
                    quantity: Number(value),
                  });
                } else {
                  removeProducts({
                    id: rowProvider.id,
                    quantity: -1,
                  });
                }
              }}
            />
          </Tooltip>
        </Row>
      ))}
    </Col>
  );
};

export default AddToCart;
