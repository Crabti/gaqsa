import React, { useCallback, useEffect, useState } from 'react';
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
import Text from 'antd/lib/typography/Text';

export interface Props {
  product: ProductGroup;
}
interface RequisitionPreview {
  id: number;
  quantity: number;
  total: number;
  subtotal: number;
  iva_total: number;
  ieps_total: number;
  price: number;
  original_price?: number;
  name: string;
  provider: string;
  presentation: string;
  lab: string;
  category: string;
}

interface OrderPreview {
  total: number;
  subtotal: number;
  ieps_total: number;
  iva_total: number;
  products: RequisitionPreview[];
}

const CreateOrder: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [preview, setPreview] = useState<OrderPreview | undefined>(undefined);

  const {
    productsCart, addProducts, removeProducts, clear,
  } = useShoppingCart();

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const fetchPreview = useCallback(async () => {
    setLoading(true);
    const [result, error] = await backend.orders.post<OrderPreview, any>(
      '/preview',
      productsCart,
    );

    if (error || !result) {
      notification.error({
        message: 'Ocurrio un error al cargar el resumen del pedido.',
        description: 'Intentelo mas tarde',
      });
      setLoading(false);
      return;
    }
    setPreview(result.data);
    setLoading(false);
  }, [backend.orders, productsCart]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  const onFinish = async () : Promise<void> => {
    setLoading(true);
    const [, error] = await backend.orders.createOne({
      productsCart,
    });

    if (error) {
      onFinishFailed();
      return;
    }
    clear();
    notification.success({
      message: '¡Petición de orden creado exitosamente!',
      description: 'Su orden de compra ha sido recibida y será procesada'
            + '. El proveedor le informará lo mas pronto posible '
            + 'el estatus de su solicitud.',
    });
    history.replace('/pedidos');

    setLoading(false);
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
      render: (_: number, data: any) => (
        <Text>
          {`$${data.price}`}
        </Text>
      ),
    },
    {
      title: 'IVA',
      dataIndex: 'iva',
      key: 'iva',
    },
    {
      title: 'IEPS',
      dataIndex: 'ieps',
      key: 'ieps',
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (id: number, product: RequisitionPreview) => (
        <InputNumber<number>
          defaultValue={product.quantity}
          min={1}
          step={1}
          onBlur={(event) => (
            product.quantity !== Number(event.target.value)
          ) && addProducts({
            id: product.id,
            quantity: Number(event.target.value),
          })}
        />
      ),
    },
    {
      title: 'SubTotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (id: number, product: RequisitionPreview) => (
        <>
          <Tooltip title="Eliminar del carrito">
            <Button
              shape="circle"
              icon={<MinusOutlined />}
              onClick={() => removeProducts({
                id: product.id,
                quantity: -1,
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
        {isLoading || !productsCart || !preview ? <LoadingIndicator /> : (
          <>
            <Descriptions title="Resumen de Orden">
              <Descriptions.Item label="SubTotal">
                {`$${preview.subtotal.toFixed(2)}`}
              </Descriptions.Item>
              <Descriptions.Item label="IEPS">
                {`$${preview.ieps_total.toFixed(2)}`}
              </Descriptions.Item>
              <Descriptions.Item label="IVA">
                {`$${preview.iva_total.toFixed(2)}`}
              </Descriptions.Item>
              <Descriptions.Item label="Total" span={2}>
                {`$${preview.total.toFixed(2)}`}
              </Descriptions.Item>
            </Descriptions>
            <Table
              data={preview.products.map((product) => ({
                id: product.id,
                name: product.name,
                provider: product.provider,
                presentation: product.presentation,
                laboratory: product.lab,
                category: product.category,
                price: product.price,
                iva: `$${product.iva_total.toFixed(2)}`,
                ieps: `$${product.ieps_total.toFixed(2)}`,
                quantity: product.quantity,
                original_price: `$${product.original_price?.toFixed(2)}`,
                total: `$${product.total.toFixed(2)}`,
                subtotal: `$${product.subtotal}`,
              }))}
              columns={columns}
              rowKey={(row) => `${row.id}`}

            />
            <FormButton
              text="Confirmar"
              disabled={
                !preview
                  || productsCart.length === 0 || preview.products.length === 0
              }
            />
          </>
        )}

      </Form>
    </Content>
  );
};

export default CreateOrder;
