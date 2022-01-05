import { Invoice, UploadInvoiceForm } from '@types';
import {
  Modal,
  Form,
  Typography,
  DatePicker,
  Upload,
  Button,
  Row,
  notification,
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { RcFile } from 'antd/es/upload';
import { UploadProps } from 'antd/lib/upload/interface';
import { useBackend } from 'integrations';
import moment from 'moment';
import { Props } from './UploadInvoiceModal.type';

const UploadInvoiceModal: React.FC<Props> = ({
  visible, onClose, order,
}) => {
  const maxInvoiceFiles = 2;
  const backend = useBackend();
  const [form] = Form.useForm<UploadInvoiceForm>();
  const { Dragger } = Upload;
  const [xmlFile, setXmlFile] = useState<RcFile | undefined>(
    undefined,
  );
  const [invoiceFiles, setInvoiceFiles] = useState<RcFile[]>(
    [],
  );

  const [isLoading, setLoading] = useState<boolean>(false);

  const xmlFileProps: UploadProps = {
    name: 'xml',
    onRemove: () => {
      setXmlFile(undefined);
    },
    beforeUpload(file) {
      setXmlFile(file);
      return false;
    },
    fileList: xmlFile ? [xmlFile] : [],
    accept: '.xml',
  };

  const invoiceFileProps: UploadProps = {
    name: 'invoice',
    multiple: true,
    maxCount: 2,
    onRemove: (file:any) => {
      if (!invoiceFiles) {
        return;
      }
      const index = invoiceFiles.indexOf(file);
      const newFileList = invoiceFiles.slice();
      newFileList.splice(index, 1);
      setInvoiceFiles(newFileList);
    },
    beforeUpload(file, fileList) {
      setInvoiceFiles([...invoiceFiles, ...fileList].slice(0, maxInvoiceFiles));
      return false;
    },
    fileList: invoiceFiles || [],
    accept: '.png, .jpg, .pdf',
  };

  const onSubmit = async (data: any): Promise<void> => {
    setLoading(true);
    if (!xmlFile) {
      setLoading(false);
      notification.warning(
        { message: 'Necesitas seleccionar un archivo .xml' },
      );
      return;
    }

    const formData = new FormData();
    formData.append('xml_file', xmlFile);
    if (invoiceFiles.length === 0) {
      setLoading(false);
      notification.warning(
        {
          message: 'Necesitas seleccionar por lo menos un archivo',
        },
      );
      return;
    }
    formData.append('invoice_file', invoiceFiles[0]);
    if (invoiceFiles.length > 1) {
      formData.append('extra_file', invoiceFiles[1]);
    }

    formData.append(
      'delivery_date',
      moment(data.delivery_date).format('YYYY-MM-DD'),
    );
    formData.append('order', `${order?.id}`);

    const [response, error] = await backend.invoice.post(
      '/create',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    if (error || !response || !response.data) {
      notification.error({
        message: '¡Ocurrio un error al guardar la factura!',
        description: 'Verifique si su archivo XML es valido',
      });
      setLoading(false);
      return;
    }

    notification.success({
      message: (
        'Se ha guardado la factura exitosamente'
      ),
    });
    const invoice : Invoice = response.data as Invoice;
    setLoading(false);
    onClose(true, invoice);
  };

  const validateForm = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (info) {
      notification.error({
        message: 'Error al guardar factura.',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => onClose(false)}
      okText="Guardar"
      onOk={validateForm}
      okButtonProps={{ disabled: invoiceFiles.length === 0 }}
      title={`Facturación Pedido No. ${order?.id}`}
      confirmLoading={isLoading}
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
            <Upload {...xmlFileProps}>
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
            { `Subir archivo PDF y extras (Max. ${maxInvoiceFiles}) 
            (Restante ${maxInvoiceFiles - invoiceFiles.length})`}
          </Typography>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Dragger {...invoiceFileProps}>
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
