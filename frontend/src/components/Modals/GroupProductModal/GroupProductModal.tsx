/* eslint-disable react-hooks/exhaustive-deps */

import { Product } from '@types';
import {
  Modal,
  notification,
  Form,
  Select,
  Typography,
  Row,
} from 'antd';
import LoadingIndicator from 'components/LoadingIndicator';
import { useBackend } from 'integrations';
import React, { useCallback, useEffect, useState } from 'react';
import { Props } from './GroupProductModal.type';

const { Option } = Select;

interface GroupProductForm {
  product: number;
}

const GroupProductModal: React.FC<Props> = ({
  visible, onClose, products,
}) => {
  const [form] = Form.useForm<GroupProductForm>();

  const [loading, setLoading] = useState(false);
  const [
    existingProducts, setProducts,
  ] = useState<Product[] | undefined>(undefined);
  const backend = useBackend();

  const onFinishFailed = (code: string) : void => {
    switch (code) {
      default:
        notification.error({
          message: '¡Ocurrió un error al intentar guardar!',
          description: 'Intentalo después.',
        });
        break;
    }
  };
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.getAll(
      'status=Aceptado',
    );

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }

    setProducts(result.data);
    setLoading(false);
  }, [backend.products]);

  useEffect(() => {
    if (products === undefined) {
      fetchProducts();
    }
  }, [fetchProducts, products]);

  const handleUpdate = async (data: any): Promise<void> => {
    setLoading(true);
    const providers = products?.map(
      (product) => ({
        ...product.provider,
        laboratory: product.provider.laboratory.id,
      }),
    );

    const payload = { ...data, providers };
    const [response, error] = await backend.products.post('group', payload);

    if (error || !response || !response.data) {
      onFinishFailed(error?.response?.data.code);
      setLoading(false);
      return;
    }

    notification.success({
      message: (
        'Se han agrupado los productos exitosamente.'
      ),
    });

    setLoading(false);
    onClose(true);
  };
  const handleOk = async (): Promise<void> => {
    const values = await form.validateFields();
    await handleUpdate(values);
  };

  const replaceFieldsHint : string[] = [
    'Clave',
    'Nombre',
    'Categoria',
    'Presentación',
    'IEPS',
  ];

  const productLabel = (product: Product) : string => `${product.key}
    - ${product.category}
     - ${product.name}
     - ${product.presentation}`;

  return (
    <Modal
      visible={visible}
      onCancel={() => onClose(false)}
      onOk={handleOk}
      okText="Confirmar"
      cancelText="Cancelar"
      title="Agrupar productos"
      confirmLoading={loading}
    >
      { existingProducts
        ? (
          <>
            <Form
              form={form}
            >

              <Form.Item
                name="product"
                rules={[{ required: true }]}
                label="Producto existente"
              >
                <Select
                  showSearch
                  placeholder="Buscar producto existente"
                  filterOption={
            (input, option: any) => ((option === undefined || option.children)
              ? false : option.children
                .toLowerCase().indexOf(input.toLowerCase()) >= 0)
          }
                >
                  { Object.values(existingProducts).map(
                    (product) => (
                      <Option value={product.id} key={product.id}>
                        {productLabel(product)}
                      </Option>
                    ),
                  )}
                </Select>
              </Form.Item>

            </Form>
            <Row style={{ marginTop: '1em' }}>
              <Typography.Text type="secondary">
                ¿Esta seguro que desea realizar esta accion?
                Los siguientes productos seran asociados
                con el producto existente seleccionado:
              </Typography.Text>
            </Row>
            {products?.map((product) => (
              <Row
                justify="center"
                style={{ marginTop: '1em' }}
                key={product.id}
              >
                {productLabel(product)}
              </Row>
            ))}
            <Row style={{ marginTop: '1.5em' }}>
              <Typography.Text type="secondary">
                Los siguientes campos de los productos
                seran remplazados por el producto existente seleccionado:
              </Typography.Text>
            </Row>
            {replaceFieldsHint?.map((field) => (
              <Row key={field} justify="center" style={{ marginTop: '0.1em' }}>
                {field}
              </Row>
            ))}
          </>
        ) : <LoadingIndicator /> }
    </Modal>
  );
};

export default GroupProductModal;
