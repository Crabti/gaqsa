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
  Provider,
} from '@types';
import ProductForm from 'components/ProductForm';
import { PRODUCTS_OPTIONS_ROOT } from 'settings';
import LoadingIndicator from 'components/LoadingIndicator';
import useAuth from 'hooks/useAuth';

const INITIAL_STATE : CreateProductForm = {
  name: '',
  ieps: 0.00,
  more_info: '',
  category: 1,
  animal_groups: [],
  active_substance: '',
};

const CreateForm: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const { isAdmin } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState<ProductOptions | undefined>(undefined);
  const [providers, setProviders] = useState<Provider[] | undefined>(undefined);

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const fetchProviders = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.providers.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar al listado de proveedores!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setLoading(false);
    setProviders(result.data);
  }, [backend.providers]);

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
    if (isAdmin) {
      fetchProviders();
    }
  }, [history, fetchOptions, fetchProviders, isAdmin]);

  const onFinish = async (
    values: CreateProductForm,
  ) : Promise<void> => {
    setLoading(true);
    const [, error] = await backend.products.createOne({
      ...values,
    });
    if (error) {
      onFinishFailed();
    } else {
      if (isAdmin) {
        notification.success({
          message: '¡Producto creado exitosamente!',
        });
      } else {
        notification.success({
          message: '¡Petición de producto creado exitosamente!',
          description: 'Su petición sera validado por un administrador'
          + ' proximamente. Sera notificado ya que esta petición '
          + 'cambie de estado',
        });
      }
      form.resetFields();
      history.replace('/productos');
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
        providers={providers}
        onFinishFailed={onFinishFailed}
        initialState={INITIAL_STATE}
        isAdmin={isAdmin}
      />
    </Content>
  );
};

export default CreateForm;
