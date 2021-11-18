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
                    product: {
                      id: rowProvider.id,
                      category: (product.category as string),
                      key: product.key,
                      ieps: product.ieps,
                      iva: rowProvider.iva,
                      name: product.name,
                      active_substance: product.active_substance,
                      presentation: product.presentation,
                      laboratory: rowProvider.laboratory.name,
                      provider: (rowProvider.provider as string),
                      originalPrice: rowProvider.price,
                      price: rowProvider.offer
                        ? (
                          rowProvider.price - rowProvider.price
                        * rowProvider.offer.discount_percentage
                        )
                        : rowProvider.price,
                    },
                    amount: Number(value),
                    offer: rowProvider.offer,
                  });
                } else {
                  removeProducts({
                    product: {
                      id: rowProvider.id,
                      category: (product.category as string),
                      key: product.key,
                      ieps: product.ieps,
                      iva: rowProvider.iva,
                      name: product.name,
                      active_substance: product.active_substance,
                      presentation: product.presentation,
                      laboratory: rowProvider.laboratory.name,
                      provider: (rowProvider.provider as string),
                      originalPrice: rowProvider.price,
                      price: rowProvider.offer
                        ? (
                          rowProvider.price - rowProvider.price
                        * rowProvider.offer.discount_percentage
                        )
                        : rowProvider.price,
                    },
                    offer: rowProvider.offer,
                    amount: -1,
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
