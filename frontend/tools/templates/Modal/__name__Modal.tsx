import {
  Modal,
  notification,
  Typography,
} from 'antd';
import { useBackend } from 'integrations';
import React, { useState } from 'react';
import { Props } from './__name__Modal.type';

const __name__Modal: React.FC<Props> = ({
  visible, onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const backend = useBackend();

  const handleUpdate = async (data: any): Promise<void> => {
    setLoading(true);

    const payload = { ...data };
    /* const [response, error] = await backend...

    if (error || !response || !response.data) {
      notification.error({
        message: 'Error',
      });
      setLoading(false);
      return;
    }

    notification.success({
      message: (
        ''
      ),
    });
    */
    setLoading(false);
    onClose();
  };

  const handleOk = async (): Promise<void> => {
    try {
      const values = {};
      await handleUpdate(values);
    } catch (info) {
      notification.error({
        message: 'Error.',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Confirmar"
      cancelText="Cancelar"
      title={`Titulo`}
      confirmLoading={loading}
    >
      <Typography.Text strong>
        Modal
      </Typography.Text>
    </Modal>
  );
};

export default __name__Modal;
