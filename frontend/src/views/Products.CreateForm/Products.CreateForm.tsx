import React, { useCallback, useEffect, useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Form,
  notification,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  ProductOptions,
  CreateProductForm,
} from '@types';
import ProductForm from 'components/ProductForm';
import { PRODUCTS_OPTIONS_ROOT } from 'settings';
import LoadingIndicator from 'components/LoadingIndicator';

const INITIAL_STATE : CreateProductForm = {
  name: '',
  price: 0.01,
  iva: 0.16,
  ieps: 0.00,
  more_info: '',
  category: 1,
  laboratory: 1,
  animal_groups: [],
  active_substance: '',
};

const CreateForm: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState<ProductOptions | undefined>(undefined);

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

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
    fetchOptions();
  }, [history, fetchOptions]);

  const onFinish = async (values: CreateProductForm) : Promise<void> => {
    setLoading(true);
    // TODO: Get provider id from user. Hard coded to provider 1 right now
    const [, error] = await backend.products.createOne({
      ...values, provider: 2,
    });

    if (error) {
      onFinishFailed();
    } else {
      notification.success({
        message: '¡Petición de producto creado exitosamente!',
        description: 'Su petición sera validado por un administrador proxima'
          + 'proximamente. Sera notificado ya que esta petición '
          + 'cambie de estado',
      });
      form.resetFields();
      history.replace('/');
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
        options={options}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={INITIAL_STATE}
      />
    </Content>
  );
};

export default CreateForm;
