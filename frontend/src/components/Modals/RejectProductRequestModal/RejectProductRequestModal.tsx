import {
  Modal,
  notification,
  Input,
  Form,
} from 'antd';
import { useBackend } from 'integrations';
import React, { useState } from 'react';
import { Props } from './RejectProductRequestModal.type';

interface RejectProductsForm {
  reject_reason: string;
}

const RejectProductRequestModal: React.FC<Props> = ({
  visible, selected, onClose,
}) => {
  const [form] = Form.useForm<RejectProductsForm>();
  const [loading, setLoading] = useState(false);
  const backend = useBackend();

  const handleUpdate = async (data: any): Promise<void> => {
    setLoading(true);
    const [response, error] = await backend.products.post('reject',
      {
        ...data,
        products: selected,
      });

    if (error || !response || !response.data) {
      notification.error({
        message: 'Ocurrio un error al rechazar los productos.',
      });
      setLoading(false);
      return;
    }

    notification.success({
      message: (
        'Los productos se han rechazado exitosamente. '
        + 'Los proveedores seran notificados por correo.'
      ),
    });
    setLoading(false);
    onClose(true);
  };

  const handleOk = async (): Promise<void> => {
    const values = await form.validateFields();
    await handleUpdate(values);
  };

  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      onCancel={() => onClose(false)}
      okText="Confirmar"
      cancelText="Cancelar"
      title="Rechazar productos seleccionados"
      confirmLoading={loading}
    >
      <Form
        form={form}
      >
        <Form.Item
          name="reject_reason"
          label="Razón de rechazo"
          required
          rules={[{
            required: true,
          }]}
        >
          <Input.TextArea maxLength={100} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectProductRequestModal;
