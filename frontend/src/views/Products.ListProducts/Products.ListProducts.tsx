import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  notification, Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Product,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import { EditOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import useShoppingCart from 'hooks/shoppingCart';
import {
  SHOW_ADD_OFFER_BTN,
  SHOW_ADD_TO_CART_BTN,
  SHOW_EDIT_PRODUCT,
} from 'constants/featureFlags';
import CreateProductOfferModal from 'components/Modals/CreateProductOfferModal';
import DiscountText from 'components/DiscountText';
import routes from 'Routes';
import { Actions } from './Products.ListProducts.styled';

interface OfferModal {
  visible: boolean,
  product: Product | undefined
}

const ListProducts: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const { isClient, isProvider } = useAuth();
  const [offerModal, setOfferModal] = useState<OfferModal>(
    { visible: false, product: undefined },
  );
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const { addProducts } = useShoppingCart();
  const shouldShowAddToCard = SHOW_ADD_TO_CART_BTN && isClient;
  const shouldShowAddOffer = SHOW_ADD_OFFER_BTN && isProvider;

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.getAll(
      'status=Aceptado',
    );

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setProducts(result.data);
    setLoading(false);
  }, [backend.products]);

  useEffect(() => {
    fetchProducts();
  }, [history, fetchProducts]);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      key: 'presentation',
    },
    {
      title: 'Susbtancia activa',
      dataIndex: 'active_substance',
      key: 'active_substance',
    },
    {
      title: 'Laboratorio',
      dataIndex: 'laboratory',
      key: 'laboratory',
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (_: number, product: Product) => (
        <DiscountText
          originalPrice={product.price}
          discount={product.offer?.discount_percentage}
        />
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (_: number, product: Product) => (
        <Actions>
          {shouldShowAddToCard && (
            <Tooltip title="Añadir al carrito">
              <Button
                shape="circle"
                icon={<PlusOutlined />}
                onClick={() => {
                  notification.success({
                    message: 'Se ha agregado el producto al carrito.',
                    description: 'Puede acceder a detalle de su pedido para'
                    + ' confirmar su pedido',
                    btn: (
                      <Button
                        type="primary"
                        onClick={() => history.push(
                          routes.order.routes.createOrder.path,
                        )}
                      >
                        Ir a detalle
                      </Button>),
                  });
                  addProducts({
                    product: {
                      ...product,
                      price: product.offer
                        ? (
                          product.price - product.price
                        * product.offer.discount_percentage
                        )
                        : product.price,
                    },
                    amount: 1,
                    offer: product.offer,
                  });
                }}
              />
            </Tooltip>
          )}
          {SHOW_EDIT_PRODUCT && (
            <Tooltip title="Editar producto">
              <Button
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => (
                  history.push(`/productos/${product.id}/modificar`)
                )}
              />
            </Tooltip>
          )}
          {shouldShowAddOffer && (
            <Tooltip title="Crear nueva oferta para producto">
              <Button
                shape="circle"
                icon={<TagOutlined />}
                onClick={() => (
                  setOfferModal({
                    visible: true,
                    product,
                  })
                )}
              />
            </Tooltip>
          )}
        </Actions>
      ),
    },
  ];

  const onCloseModal = (): void => {
    setOfferModal({ ...offerModal, visible: false });
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !products ? <LoadingIndicator /> : (
        <>
          <Table
            rowKey={(row) => `${row.id}`}
            data={products.map((product) => ({
              id: product.id,
              name: product.name,
              provider: product.provider,
              presentation: product.presentation,
              active_substance: product.active_substance,
              laboratory: product.laboratory,
              category: product.category,
              price: product.price,
              iva: product.iva,
              ieps: product.ieps,
              offer: product.offer,
            }))}
            columns={columns}
          />
          { offerModal.product
            ? (
              <CreateProductOfferModal
                visible={offerModal.visible}
                onClose={onCloseModal}
                product={offerModal.product}
              />
            ) : null}

        </>
      )}
    </Content>
  );
};

export default ListProducts;
