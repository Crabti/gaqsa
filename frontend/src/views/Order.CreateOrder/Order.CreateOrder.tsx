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
import { ProductProvider } from '@types';
import LoadingIndicator from 'components/LoadingIndicator';
import Table from 'components/Table';
import FormButton from 'components/FormButton';
import useAuth from 'hooks/useAuth';
import DiscountText from 'components/DiscountText';
import Text from 'antd/lib/typography/Text';

const CreateOrder: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const { user } = useAuth();

  const {
    products, addProducts, removeProducts, clear, total, subieps, subiva,
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
        products, user: user.id,
      });

      if (error) {
        onFinishFailed();
      } else {
        clear();
        notification.success({
          message: '¡Petición de orden creado exitosamente!',
          description: 'Su orden de compra ha sido recibida y será procesada. '
            + 'El proveedor le informará lo mas pronto posible '
            + 'el estatus de su solicitud.',
        });
        history.replace('/pedidos/historial');
      }
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
          originalPrice={data.originalPrice}
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
      render: (_: number, provider: ProductProvider) => {
        const { price, iva } = provider;
        return (
          <Text>
            {`$${((iva / 100) * price).toFixed(2)}`}
          </Text>
        );
      },
    },
    {
      title: 'IEPS',
      dataIndex: 'ieps',
      key: 'ieps',
      render: (_: number, data: any) => {
        const { price, ieps } = data;
        return (
          <Text>
            {`$${((ieps / 100) * price).toFixed(2)}`}
          </Text>
        );
      },
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      key: 'amount',
      render: (
        _: number,
        product: any,
      ) => (
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
      render: (id: number, data: any) => (
        <>
          <Tooltip title="Eliminar del carrito">
            <Button
              shape="circle"
              icon={<MinusOutlined />}
              onClick={() => removeProducts({
                product: { ...data },
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
        {isLoading || !products ? <LoadingIndicator /> : (
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
              data={products.map((product) => ({
                id: product.product.id,
                name: product.product.name,
                presentation: product.product.presentation,
                laboratory: product.product.laboratory,
                category: product.product.category,
                price: product.product.price,
                iva: product.product.iva,
                ieps: product.product.ieps,
                amount: product.amount,
                provider: product.product.provider,
                offer: product.offer,
                originalPrice: product.product.originalPrice,
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
