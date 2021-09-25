import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Form,
  notification,
} from 'antd';
import { useHistory, useParams } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Product, UpdateProductForm,
} from '@types';
import ProductForm from 'components/ProductForm';
import routes from 'Routes';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

const UpdateForm: React.FC = () => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
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
  }, [backend.products, id]);

  useEffect(() => {
    fetchProduct();
  }, [history, fetchProduct]);

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const onFinish = async (values: UpdateProductForm) : Promise<void> => {
    setLoading(true);
    // TODO: Get provider id from user
    const [, error] = await backend.products.updateOne(id, {
      ...values,
    });

    if (error) {
      onFinishFailed();
    } else {
      notification.success({
        message: '¡Producto modificado exitosamente!',
      });
      form.resetFields();
      history.replace(routes.listPendingProduct.path);
    }
    setLoading(false);
  };

  if (isLoading) {
    return <LoadingIndicator />;
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
