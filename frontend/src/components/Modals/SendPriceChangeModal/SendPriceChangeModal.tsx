import {
  Modal,
  Form,
  notification,
  DatePicker,
} from 'antd';
import { useBackend } from 'integrations';
import moment from 'moment';
import React, { useState } from 'react';
import { Props } from './SendPriceChangeModal.type';

interface ProviderId {
    pk: number
  }

interface SendCodeProviderForm {
    providers: ProviderId[],
    token_apply_date: string,
}

const SendPriceChangeModal: React.FC<Props> = ({
  visible, providers, onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<SendCodeProviderForm>();
  const backend = useBackend();

  const handleUpdate = async (data: SendCodeProviderForm): Promise<void> => {
    if (providers) {
      setLoading(true);
      const payload : SendCodeProviderForm = {
        token_apply_date: moment(data.token_apply_date).format('YYYY-MM-DD'),
        providers: providers.map((provider) => ({ pk: provider.id })),
      };

      const [response, error] = await backend.providers.put('/codes', payload);

      if (error || !response || !response.data) {
        notification.error({
          message: 'Error al enviar codigo de cambio de precio.',
        });
        setLoading(false);
        return;
      }

      notification.success({
        message: (
          'Se han enviado los códigos de manera exitosa'
        ),
      });

      setLoading(false);
      onClose();
    }
  };

  const handleOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      await handleUpdate(values);
    } catch (info) {
      notification.error({
        message: 'Error al enviar codigo de cambio de precio.',
      });
    }
  };

  const disabledDate = (
    current : any,
  ) : boolean => current && current < moment().startOf('day');

  return (
    <Modal
      visible={visible}
      onCancel={() => onClose()}
      onOk={handleOk}
      okText="Enviar"
      cancelText="Cancelar"
      title="Enviar códigos para cambios de precios"
      confirmLoading={loading}
    >
      <Form
        form={form}
      >
        <Form.Item
          name="token_apply_date"
          label="Fecha de aplicación"
          rules={[{ required: true }]}
          required
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SendPriceChangeModal;
