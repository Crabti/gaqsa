/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Descriptions,
  Form,
  InputNumber,
  notification,
  Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  MinusOutlined,
} from '@ant-design/icons';
import useShoppingCart from 'hooks/shoppingCart';
import { ProductGroup } from '@types';
import LoadingIndicator from 'components/LoadingIndicator';
import Table from 'components/Table';
import FormButton from 'components/FormButton';
import useAuth from 'hooks/useAuth';
import DiscountText from 'components/DiscountText';
import Text from 'antd/lib/typography/Text';

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

export interface Props {
  product: ProductGroup;
}

const CreateOrder: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const { user } = useAuth();

  const {
    productsSh, addProducts, removeProducts, clear, total, subieps, subiva,
    subtotal,
  } = useShoppingCart();

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const onFinish = async () : Promise<void> => {
    setLoading(true);
    if (user) {
      const [, error] = await backend.orders.createOne({
        productsSh,
      });

      if (error) {
        onFinishFailed();
        return;
      }
      clear();
      notification.success({
        message: '¡Petición de orden creado exitosamente!',
        description: 'Su orden de compra ha sido recibida y será procesada'
            + 'El proveedor le informará lo mas pronto posible '
            + 'el estatus de su solicitud.',
      });
      history.replace('/pedidos/cliente');

      setLoading(false);
    }
  };
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      key: 'presentation',
    },
    {
      title: 'Laboratorio',
      dataIndex: 'laboratory',
      key: 'laboratory',
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (_: number, data: any) => (data.offer ? (
        <DiscountText
          originalPrice={(data.price
            + data.price * data.offer.discount_percentage).toFixed(2)}
          discount={data.offer.discount_percentage}
        />
      ) : (
        <Text>
          {`$${data.price}`}
        </Text>
      )),
    },
    {
      title: 'IVA',
      dataIndex: 'iva',
      key: 'iva',
      render: (_: number, product: ProductCart) => {
        const { price } = product;
        return (
          <Text>
            {`$${((product.iva / 100) * price).toFixed(2)}`}
          </Text>
        );
      },
    },
    {
      title: 'IEPS',
      dataIndex: 'ieps',
      key: 'ieps',
      render: (_: number, product: ProductCart) => {
        const { price } = product;
        return (
          <Text>
            {`$${((product.ieps / 100) * price).toFixed(2)}`}
          </Text>
        );
      },
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      key: 'amount',
      render: (id: number, product: ProductCart & {amount: string}) => (
        <InputNumber<string>
          defaultValue={product.amount}
          min="1"
          step="1"
          onChange={(event) => addProducts({
            product: { ...product },
            amount: (Number(event) - Number(product.amount)),
          })}
        />
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (id: number, product: ProductCart) => (
        <>
          <Tooltip title="Eliminar del carrito">
            <Button
              shape="circle"
              icon={<MinusOutlined />}
              onClick={() => removeProducts({
                product: { ...product },
                amount: -1,
              })}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <Form
        name="productForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {isLoading || !productsSh ? <LoadingIndicator /> : (
          <>
            <Descriptions title="Resumen de Orden">
              <Descriptions.Item label="SubTotal">
                {`$${subtotal.toFixed(2)}`}
              </Descriptions.Item>
              <Descriptions.Item label="IEPS">
                {`$${subieps.toFixed(2)}`}
              </Descriptions.Item>
              <Descriptions.Item label="IVA">
                {`$${subiva.toFixed(2)}`}
              </Descriptions.Item>
              <Descriptions.Item label="Total" span={2}>
                {`$${total.toFixed(2)}`}
              </Descriptions.Item>
            </Descriptions>
            <Table
              data={productsSh.map((product) => ({
                id: product.product.id,
                name: product.product.name,
                provider: product.product.provider,
                presentation: product.product.presentation,
                laboratory: product.product.laboratory,
                category: product.product.category,
                price: product.product.price,
                iva: product.product.iva,
                ieps: product.product.ieps,
                amount: product.amount,
                offer: product.offer,
              }))}
              columns={columns}
              rowKey={(row) => `${row.id}`}
            />
          </>
        )}
        <FormButton
          loading={isLoading}
          text="Confirmar"
        />
      </Form>
    </Content>
  );
};

export default CreateOrder;
