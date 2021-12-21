import { UploadInvoiceForm } from '@types';
import {
  Modal,
  Form,
  Typography,
  DatePicker,
  Upload,
  Button,
  message,
  Row,
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { UploadProps } from 'antd/lib/upload/interface';
import { Props } from './UploadInvoiceModal.type';

const UploadInvoiceModal: React.FC<Props> = ({
  visible, onClose, order,
}) => {
  const [form] = Form.useForm<UploadInvoiceForm>();
  const { Dragger } = Upload;
  const [fileToUpload, setFileToUpload] = useState<RcFile | undefined>(
    undefined,
  );

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload(file) {
      setFileToUpload(file);
      return false;
    },
    fileList: fileToUpload ? [fileToUpload] : [],
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => onClose(false)}
      okText="Guardar"
      title={`Facturación Pedido No. ${order?.id}`}
    >
      <Form
        form={form}
      >
        <Form.Item>
          <Typography>
            Subir archivo XML de Factura
          </Typography>
          <Row justify="center">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Cargar XML</Button>
            </Upload>
          </Row>
        </Form.Item>
        <Form.Item
          name="delivery_date"
          label="Fecha Entrega Producto"
          required
        >
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Typography>
            Subir archivo PDF y extras
          </Typography>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Dragger>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Haz click o arrastra el archivo a subir
            </p>
            <p className="ant-upload-hint">
              Sólo se aceptan archivos PNG, JPG y PDF.
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadInvoiceModal;
