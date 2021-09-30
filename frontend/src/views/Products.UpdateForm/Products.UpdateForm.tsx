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
  Product, ProductOptions, UpdateProductForm,
} from '@types';
import ProductForm from 'components/ProductForm';
import { productRoutes } from 'Routes';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import { PRODUCTS_OPTIONS_ROOT } from 'settings';

const UpdateForm: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [options, setOptions] = useState<ProductOptions | undefined>(undefined);

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

  const fetchOptions = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.get<ProductOptions>(
      PRODUCTS_OPTIONS_ROOT,
    );

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar las opciones!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    setOptions(result.data);
  }, [backend.products]);

  useEffect(() => {
    fetchProduct();
    fetchOptions();
  }, [history, fetchProduct, fetchOptions]);

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
      history.replace(productRoutes.listPendingProduct.path);
    }
    setLoading(false);
  };

  if (isLoading || !options) {
    return <LoadingIndicator />;
  }

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <ProductForm
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={product as UpdateProductForm}
        options={options}
        isUpdate
      />
    </Content>
  );
};

export default UpdateForm;
