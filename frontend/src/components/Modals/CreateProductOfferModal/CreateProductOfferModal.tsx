import { CreateOfferForm } from '@types';
import {
  Modal,
  Form,
  notification,
  Typography,
  InputNumber,
  DatePicker,
  Row,
} from 'antd';
import { useBackend } from 'integrations';
import moment from 'moment';
import React, { useState } from 'react';
import { Props } from './CreateProductOfferModal.type';

const CreateProductOfferModal: React.FC<Props> = ({
  visible, onClose, product,
}) => {
  const INITIAL_DISCOUNT = 50;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<CreateOfferForm>();
  const [discount, setDiscount] = useState(INITIAL_DISCOUNT);

  const [newPrice, setNewPrice] = useState(product.price);
  const backend = useBackend();

  const handleUpdate = async (data: CreateOfferForm): Promise<void> => {
    setLoading(true);

    const payload : CreateOfferForm = {
      ...data,
      ending_at: moment(data.ending_at).format('YYYY-MM-DD'),
      product_provider: product.id,
      discount_percentage: +(data.discount_percentage / 100).toFixed(15),
    };

    const [response, error] = await backend.offers.createOne(
      payload,
    );

    if (error || !response || !response.data) {
      notification.error({
        message: 'Error al crear oferta de producto.',
      });
      setLoading(false);
      return;
    }

    notification.success({
      message: (
        '¡Creación de nueva oferta creado exitosamente!'
      ),
    });

    setLoading(false);
    onClose(true);
  };

  const handleOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      await handleUpdate(values);
    } catch (info) {
      notification.error({
        message: 'Error al crear oferta de producto.',
      });
    }
  };

  const handleDiscountUpdate = (value: number): void => {
    setDiscount(value);
    const price = +(
      product.price - product.price * (value / 100)
    ).toFixed(2);
    setNewPrice(price);
    form.setFieldsValue({
      newPrice: price,
    });
  };

  const handleNewPriceUpdate = (value: number): void => {
    const newDiscount = +((1 - value / product.price) * 100);
    setDiscount(newDiscount);
    setNewPrice(value);
    form.setFieldsValue({
      discount_percentage: newDiscount,
    });
  };

  const disabledDate = (
    current : any,
  ) : boolean => current && current < moment().endOf('day');

  return (
    <Modal
      visible={visible}
      onCancel={() => onClose(false)}
      onOk={handleOk}
      okText="Crear"
      cancelText="Cancelar"
      title="Crear una nueva oferta para el producto."
      confirmLoading={loading}
    >
      <Row>

        <Typography.Text strong>
          Precio actual: $
          {' '}
          {product.price}
          {' '}
        </Typography.Text>
      </Row>
      <Row style={{ marginTop: '1.75rem' }}>
        <Typography.Text strong>
          Precio con descuento: $
          {' '}
          {
            (
              product.price - product.price * (discount / 100)
            ).toFixed(2)
          }
        </Typography.Text>
      </Row>
      <Form
        form={form}
        initialValues={{
          product: product.id,
          discount_percentage: INITIAL_DISCOUNT,
          newPrice: newPrice * 0.5,
        }}
      >
        <Form.Item
          style={{ marginTop: '1.75rem' }}
          name="discount_percentage"
          label="Porcentaje de descuento"
          required
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0.01}
            max={99.99}
            formatter={(value) => `${value}%`}
            onChange={handleDiscountUpdate}
          />
        </Form.Item>
        <Form.Item
          style={{ marginTop: '1.75rem' }}
          name="newPrice"
          label="Nuevo precio"
          required
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0.01}
            max={product.price - 0.01}
            onChange={handleNewPriceUpdate}
            formatter={
              (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            precision={2}
          />
        </Form.Item>
        <Form.Item name="ending_at" label="Fecha limite" required>
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductOfferModal;
