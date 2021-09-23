import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import { 
  Button,
  Form,
  notification
} from 'antd';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  CreateProductForm,
} from '@types';
import ProductForm from 'components/ProductForm';
import { useHistory } from 'react-router';


const INITIAL_STATE : CreateProductForm = {
  name: '',
  price: 0.00,
  key: '',
  dose: '',
  iva: 0.16,
  ieps: 0.00,
  more_info: '',
  is_generic: 'Si',
}

const CreateForm: React.FC = () => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const onFinish = async (values: CreateProductForm) => {
    setLoading(true);
    console.log(values);
    //TODO: Get provider id from user
    const [result, error] = await backend.products.createOne({
      ...values, provider : 1
    });
    
    if (error) {
      onFinishFailed();
    } else {
      console.log(result);
      notification.success({
        message: '¡Petición de producto creado exitosamente!',
        description: 'Su petición sera validado por un administrador proximamente. \
          Sera notificado ya que esta petición cambie de estado',
        btn: (
          <Button
            type="primary"
            //TODO: Redirect to another page
            onClick={() => history.push('/')}
          >
            Ir al home
          </Button>
        ),
      });
      form.resetFields();
    }
    setLoading(false);
  }

  const onFinishFailed = () => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  }

  return (
    <Content>
      <Title text="Crear petición de nuevo producto" />
      <ProductForm
        form={form}
        onFinish={onFinish} 
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={INITIAL_STATE}
      />
    </Content>
  );
};

export default CreateForm;
