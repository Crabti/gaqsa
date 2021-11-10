import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
  Form,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  ChangePriceForm,
  Product,
  ProductGroup,
} from '@types';
import PriceChangeForm from 'components/PriceChangeForm';

const PriceChange: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();

  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[] | undefined>(undefined);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.getAll<ProductGroup[]>(
      'status=Aceptado',
    );
    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    const parsed = result.data.map((product) => ({
      ...product,
      provider: {
        ...product.providers[0],
        laboratory: product.providers[0].laboratory.name,
      },
    }));
    setProducts(parsed);
    setLoading(false);
  }, [backend.products]);

  useEffect(() => {
    fetchProducts();
  }, [history, fetchProducts]);

  const onFinishFailed = (code: string) : void => {
    switch (code) {
      case 'INVALID_TOKEN':
        notification.error({
          message: 'Token inválido.',
          description: 'Verifique que el código fue escrito '
          + 'correctamente o que aún es válido.',
        });
        form.setFields([{
          name: ['token'],
          errors: ['El token ingresado es inválido.'],
        }]);
        form.scrollToField(['token']);
        break;
      default:
        notification.error({
          message: '¡Ocurrió un error al intentar guardar!',
          description: 'Inténtalo más tarde.',
        });
        break;
    }
  };

  const onFinish = async (values: ChangePriceForm) : Promise<void> => {
    setLoading(true);
    const payload : ChangePriceForm = {
      ...values,
      products: values.products?.filter((product) => product !== undefined),
    };
    const [, error] = await backend.products.post('price_change', {
      ...payload,
    });

    if (error) {
      onFinishFailed(error.response?.data.code);
    } else {
      notification.success({
        message: 'Cambio de precio aplicado exitosamente',
        description: 'Los precios de sus productos se han '
        + 'actualizado con los datos ingresados.',
      });
      history.replace('/productos');
    }
    setLoading(false);
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <PriceChangeForm
        form={form}
        products={products}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        isLoading={isLoading}
      />
    </Content>
  );
};

export default PriceChange;
