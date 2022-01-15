import { Laboratory, Provider } from '@types';
import {
  Modal,
  notification,
  Form,
  Select,
  InputNumber,
} from 'antd';
import LoadingIndicator from 'components/LoadingIndicator';
import { useBackend } from 'integrations';
import React, { useCallback, useEffect, useState } from 'react';
import { Props } from './AddProviderToProduct.type';

const { Option } = Select;

interface GroupProductForm {
  product: number;
}

const AddProviderToProductModal: React.FC<Props> = ({
  visible, onClose, product,
}) => {
  const [form] = Form.useForm<GroupProductForm>();

  const [loading, setLoading] = useState(false);
  const [
    labs, setLabs,
  ] = useState<Laboratory[] | undefined>(undefined);
  const [
    providers, setProviders,
  ] = useState<Provider[] | undefined>(undefined);
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
  const fetchLabs = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.laboratory.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los laboratorios!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }

    setLabs(result.data);
    setLoading(false);
  }, [backend.laboratory]);

  const fetchProviders = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.providers.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar la lista de proveedores!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }

    setProviders(result.data);
    setLoading(false);
  }, [backend.providers]);

  useEffect(() => {
    if (labs === undefined) {
      fetchLabs();
    }
    if (providers === undefined) {
      fetchProviders();
    }
  }, [fetchLabs, fetchProviders, labs, providers]);

  const handleUpdate = async (data: any): Promise<void> => {
    setLoading(true);

    const [response, error] = await backend.products.post(
      `/${product.id}/providers`, data,
    );

    if (error || !response || !response.data) {
      onFinishFailed(error?.response?.data.code);
      setLoading(false);
      return;
    }

    notification.success({
      message: (
        'Se ha agregado el proveedor exitosamente'
      ),
    });

    setLoading(false);
    onClose(true);
  };

  const handleOk = async (): Promise<void> => {
    const values = await form.validateFields();
    await handleUpdate(values);
  };

  const availableProviders = (): Provider[] => {
    if (!providers || !product) {
      return [];
    }
    // Find providers not associated with product.
    return providers.filter(
      (provider) => !product.providers.some(
        (productsProvider) => productsProvider.provider === provider.name,
      ),
    );
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => onClose(false)}
      onOk={handleOk}
      okText="Confirmar"
      cancelText="Cancelar"
      title={`Agregar proveedor a producto: ${product.name}`}
      confirmLoading={loading}
    >
      { labs && providers
        ? (
          <Form
            form={form}
          >
            <Form.Item
              name="provider"
              rules={[{ required: true }]}
              label="Proveedor"
            >
              <Select
                showSearch
                placeholder="Buscar proveedor"
                filterOption={
                    (input, option: any) => (
                      (option === undefined || option.children === undefined)
                        ? false : option.children
                          .toLowerCase().indexOf(input.toLowerCase()) >= 0)
                    }
              >
                { Object.values(availableProviders().map(
                  (provider) => (
                    <Option value={provider.id} key={provider.id}>
                      {`${provider.name} - ${provider.nav_key}`}
                    </Option>
                  ),
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="laboratory"
              rules={[{ required: true }]}
              label="Laboratorio"
            >
              <Select
                showSearch
                placeholder="Buscar laboratorio"
                filterOption={
                    (input, option: any) => (
                      (option === undefined || option.children === undefined)
                        ? false : option.children
                          .toLowerCase().indexOf(input.toLowerCase()) >= 0)
                    }
              >
                { Object.values(labs.map(
                  (lab) => (
                    <Option value={lab.id} key={lab.id}>
                      {`${lab.name}`}
                    </Option>
                  ),
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label="Precio"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0.01}
                style={{ width: '100%' }}
                formatter={(value) => `$ ${value}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g, ',',
                )}
              />
            </Form.Item>
            <Form.Item
              name="iva"
              label="IVA (%)"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="0.00" key="0.00"> 0.00 %</Option>
                <Option value="16.00" key="16.00"> 16.00 %</Option>
              </Select>
            </Form.Item>
          </Form>
        ) : <LoadingIndicator /> }
    </Modal>
  );
};

export default AddProviderToProductModal;
