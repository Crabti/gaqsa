import {
  Modal,
  Input,
  Form,
  notification,
} from 'antd';
import React, { useState } from 'react';
import { Props } from './RejectInvoiceModal.type';

interface RejectInvoiceForm {
  reject_reason: string;
}

const RejectInvoiceModal: React.FC<Props> = ({
  visible, invoice, onOk, onClose,
}) => {
  const [form] = Form.useForm<RejectInvoiceForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOk = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      const success = await onOk(invoice, values);
      setIsLoading(false);
      if (success) {
        onClose();
      }
    } catch (error) {
      notification.warning({
        message: 'Se requiere llenar todos los campos solicitados',
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Rechazar"
      okType="danger"
      cancelText="Cancelar"
      title={`Rechazar factura con folio ${invoice.invoice_folio}`}
      confirmLoading={isLoading}
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
          <Input.TextArea maxLength={500} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectInvoiceModal;
