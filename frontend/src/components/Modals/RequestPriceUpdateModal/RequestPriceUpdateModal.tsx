import {
  Modal,
  Form,
  notification,
  Typography,
  Input,
  InputNumber,
} from 'antd';
import { useBackend } from 'integrations';
import React, { useState } from 'react';
import { Props, UpdatePriceFormType } from './RequestPriceUpdateModal.type';

const RequestPriceUpdateModal: React.FC<Props> = ({
  visible, onClose, productName, productId, currentPrice,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<UpdatePriceFormType>();
  const backend = useBackend();

  const handleUpdate = async (data: UpdatePriceFormType): Promise<void> => {
    setLoading(true);

    const payload = { ...data, price: parseFloat(`${data.price}`) };
    const [response, error] = await backend.products.patch(
      `/price_change/${productId}`, payload,
    );

    if (error || !response || !response.data) {
      notification.error({
        message: 'Error al solicitar cambio de precio. Revise su código.',
      });
      setLoading(false);
      return;
    }

    notification.success({
      message: (
        '¡Solicitud de cambio de precio enviada exitosamente!'
        + 'Le notificaremos cuando la pretición sea revisada.'
      ),
    });

    setLoading(false);
    onClose();
  };

  const handleOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      await handleUpdate(values);
    } catch (info) {
      notification.error({
        message: 'Error al solicitar cambio de precio. Revise su código.',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Solicitar cambio"
      cancelText="Cancelar"
      title={`Actualizar precio de ${productName}`}
      confirmLoading={loading}
    >
      <Typography.Text strong>
        Precio actual: $
        {' '}
        {currentPrice}
        {' '}
      </Typography.Text>
      <Form form={form} initialValues={{ price: currentPrice, token: '' }}>
        <Form.Item
          style={{ marginTop: '1.75rem' }}
          name="price"
          label="Nuevo Precio"
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(
              /\B(?=(\d{3})+(?!\d))/g, ',',
            )}
          />
        </Form.Item>
        <Form.Item name="token" label="Codigo para solicitar cambio">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestPriceUpdateModal;
