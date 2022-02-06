import { InboxOutlined } from '@ant-design/icons';
import { AddresseeTypes } from '@types';
import {
  Button, Form, Input, notification, Select, Upload,
} from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadProps } from 'antd/lib/upload/interface';
import { useBackend } from 'integrations';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ANNOUNCEMENT_ROOT } from 'settings';

const AnnouncementForm: React.FC = () => {
  const history = useHistory();
  const [fileToUpload, setFileToUpload] = useState<RcFile | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const backend = useBackend();

  const uploadProps: UploadProps = {
    name: 'file',
    beforeUpload(file) {
      setFileToUpload(file);
      return false;
    },
    fileList: fileToUpload ? [fileToUpload] : [],
  };

  const handleSubmit = async (
    data: { title: string; content: string; addressee: string; },
  ): Promise<void> => {
    setIsLoading(true);
    if (!fileToUpload) {
      setIsLoading(false);
      notification.error({ message: 'Necesitas seleccionar un archivo' });
      return;
    }
    // We manually create the data to be uploaded
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('addressee', data.addressee);

    const [result, err] = await backend.announcements.post(
      `${backend.rootEndpoint}${ANNOUNCEMENT_ROOT}/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    if (!result || !result.data || err) {
      setIsLoading(false);
      notification.error({ message: 'Error al enviar la circular' });
      return;
    }

    setIsLoading(false);
    history.push('/circulares');
    notification.success({ message: 'Circular enviada exitosamente' });
  };

  return (
    <Form
      name="announcement_form"
      onFinish={handleSubmit}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
    >
      <Form.Item name="title" label="Título">
        <Input
          placeholder="Máximo 140 caractéres"
          maxLength={140}
        />
      </Form.Item>
      <Form.Item name="content" label="Contenido">
        <Input.TextArea placeholder="Escribe aquí..." />
      </Form.Item>
      <Form.Item label="Archivo">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Haz click o arrastra el archivo a subir.
          </p>
          <p className="ant-upload-hint">
            Solo se aceptan archivos PNG, JPG y PDF.
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item name="addressee" label="Enviar a">
        <Select placeholder="Selecciona a quien enviar la circular...">
          {AddresseeTypes.map((el) => (
            <Select.Option key={el.key} value={el.key}>
              {el.value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{
        offset: 6,
        span: 12,
      }}
      >
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Enviar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AnnouncementForm;
