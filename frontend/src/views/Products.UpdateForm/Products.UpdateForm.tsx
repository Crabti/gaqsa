import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
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
import RequestPriceUpdateModal from 'components/Modals/RequestPriceUpdateModal';
import useAuth from 'hooks/useAuth';
import { DEFAULT_DISABLED_MESSAGE } from 'constants/strings';

const UpdateForm: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const { isProvider, isAdmin } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [visible, setIsVisible] = useState(false);
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

  const onCloseModal = (): void => {
    setIsVisible(false);
  };

  if (isLoading || !options) {
    return <LoadingIndicator />;
  }

  return (
    <Content>
      <Title
        viewName={verboseName}
        parentName={parentName}
        extra={isProvider && [
          <Button type="primary" onClick={() => setIsVisible(true)}>
            Solicitar cambio de precio
          </Button>,
        ]}
      />
      <ProductForm
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={product as UpdateProductForm}
        options={options}
        disabledFields={isAdmin ? undefined : {
          price: (
            'Da click en el botón de arriba para solicitar cambio de precio.'
          ),
          key: DEFAULT_DISABLED_MESSAGE,
          active_substance: DEFAULT_DISABLED_MESSAGE,
          animal_groups: DEFAULT_DISABLED_MESSAGE,
          category: DEFAULT_DISABLED_MESSAGE,
          ieps: DEFAULT_DISABLED_MESSAGE,
          iva: DEFAULT_DISABLED_MESSAGE,
          laboratory: DEFAULT_DISABLED_MESSAGE,
          more_info: DEFAULT_DISABLED_MESSAGE,
          name: DEFAULT_DISABLED_MESSAGE,
          provider: DEFAULT_DISABLED_MESSAGE,
          reject_reason: DEFAULT_DISABLED_MESSAGE,
          status: DEFAULT_DISABLED_MESSAGE,
          presentation: DEFAULT_DISABLED_MESSAGE,
        }}
        isUpdate
      />
      <RequestPriceUpdateModal
        visible={visible}
        onClose={onCloseModal}
        currentPrice={product ? product.price : 0}
        productId={product ? product.id : 0}
        productName={product ? product.name : ''}
      />
    </Content>
  );
};

export default UpdateForm;
