import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import { 
  Button,
  Form,
  notification
} from 'antd';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Product, UpdateProductForm,
} from '@types';
import ProductForm from 'components/ProductForm';
import { useHistory, useParams } from 'react-router';


const UpdateForm: React.FC = () => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false)
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const fetchProduct = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.getOne(id);

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }

    setProduct(result.data);
    setLoading(false);
  }, [backend.products]);

    useEffect(() => {
        fetchProduct();
    }, [history, fetchProduct]);

  const onFinish = async (values: UpdateProductForm) => {
    setLoading(true);
    console.log(values);
    //TODO: Get provider id from user
    const [result, error] = await backend.products.updateOne(id, {
      ...values
    });
    
    if (error) {
      onFinishFailed();
    } else {
      console.log(result);
      notification.success({
        message: '¡Producto modificado exitosamente!',
        btn: (
          <Button
            type="primary"
            //TODO: Redirect to another page
            onClick={() => history.push('/')}
          >
            Ir a home
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
      <Title text="Modificar producto" />
      <ProductForm
        form={form}
        onFinish={onFinish} 
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={product as UpdateProductForm}
        isUpdate
      />
    </Content>
  );
};

export default UpdateForm;
