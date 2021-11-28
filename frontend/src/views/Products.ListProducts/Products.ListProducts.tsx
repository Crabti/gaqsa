import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button, Col, Popconfirm, notification, Row, Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  ProductGroup,
  ProductProvider,
} from '@types';
import Table from 'components/Table';
import AddToCart from 'components/TableCellActions/AddToCart';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import {
  EditOutlined, PlusOutlined,
  SearchOutlined, StopOutlined, ShoppingCartOutlined, TagOutlined,
} from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import useShoppingCart from 'hooks/shoppingCart';
import {
  SHOW_ADD_OFFER_BTN,
  SHOW_ADD_TO_CART_BTN,
  SHOW_CANCEL_OFFER_BTN,
  SHOW_EDIT_PRODUCT,
} from 'constants/featureFlags';
import CreateProductOfferModal from 'components/Modals/CreateProductOfferModal';
import DiscountText from 'components/DiscountText';
import TableFilter from 'components/TableFilter';
import { Actions } from './Products.ListProducts.styled';

interface OfferModal {
  visible: boolean,
  provider: ProductProvider | undefined,
}

const ListProducts: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();

  const {
    isClient, isProvider, isAdmin,
  } = useAuth();

  const [offerModal, setOfferModal] = useState<OfferModal>(
    { visible: false, provider: undefined },
  );
  const [isLoading, setLoading] = useState(false);
  const [
    products, setProducts,
  ] = useState<ProductGroup[] | undefined>(undefined);
  const [filtered, setFiltered] = useState<ProductGroup[]>([]);
  const {
    productsSh,
  } = useShoppingCart();
  const resetFiltered = useCallback(
    () => setFiltered(products || []), [products],
  );
  const shouldShowAddToCart = SHOW_ADD_TO_CART_BTN && isClient;
  const shouldShowAddOffer = SHOW_ADD_OFFER_BTN && isProvider;
  const shouldShowEditProduct = SHOW_EDIT_PRODUCT && isAdmin;
  const shouldShowDetailProduct = isProvider;
  const shouldShowCancelOffer = SHOW_CANCEL_OFFER_BTN && (
    isProvider || isAdmin
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const [result, error] = await backend.products.getAll<ProductGroup[]>(
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

  const onCancelOffer = async (id: number) : Promise<void> => {
    setLoading(true);
    const [result, error] = await backend.offers.patch(`${id}/cancel`);
    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cancelar la oferta!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    notification.success({
      message: 'Se ha cancelado la oferta exitosamente.',
      description: 'El producto ha regresado a su precio original',
    });
    fetchProducts();
  };

  const createOrder = async () : Promise<void> => {
    setLoading(true);
    if (productsSh.length > 0) {
      history.push('/pedidos');
    }
    setLoading(false);
  };

  const renderLabs = (
    providers: ProductProvider[],
  ) : any => providers.map((provider) => (
    <Row key={provider.id}>
      {provider.laboratory.name}
    </Row>
  ));

  const renderProviders = (
    providers: ProductProvider[],
  ) : any => providers.map((provider) => (
    <Row key={provider.id}>
      {provider.provider}
    </Row>
  ));

  const renderPrices = (
    providers: ProductProvider[],
  ) : any => providers.map((provider) => (
    <Row key={provider.id}>
      <DiscountText
        originalPrice={provider.price}
        discount={provider.offer?.discount_percentage}
      />
    </Row>
  ));

  const renderIVA = (
    providers: ProductProvider[],
  ) : any => providers.map((provider) => (
    <Row key={provider.id}>
      {`${provider.iva} %`}
    </Row>
  ));

  const renderActions = (
    product: ProductGroup,
  ) : any => (
    <Row justify="center" align="middle">
      <Col>
        <Actions>
          {shouldShowEditProduct ? (
            <Tooltip title="Editar producto">
              <Button
                style={{ marginRight: '1em' }}
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => (
                  history.push(`/productos/${product.id}/modificar`)
                )}
              />
            </Tooltip>
          ) : null}
        </Actions>
      </Col>
      <Col>
        {product.providers.map((provider) => (
          <Row key={provider.id}>
            <Col>
              {shouldShowDetailProduct && (
              <Tooltip title="Ver detalles">
                <Button
                  shape="circle"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    history.push(`/productos/${product.id}/detalle`);
                  }}
                />
              </Tooltip>
              )}
            </Col>
            <Col>
              {shouldShowAddOffer && (
              <Tooltip title={
              provider.offer !== null
                ? 'Este producto ya cuenta con una oferta activa. '
                   + 'Debe cancelar la oferta o esperar a que termine '
                   + 'para poder crear una nueva.'
                : 'Crear nueva oferta para producto'
            }
              >
                <Button
                  shape="circle"
                  icon={<TagOutlined />}
                  disabled={provider.offer !== null}
                  onClick={() => (
                    setOfferModal({
                      visible: true,
                      provider,
                    })
                  )}
                />
              </Tooltip>
              )}
            </Col>
            <Col>
              {shouldShowCancelOffer && (
              <Tooltip title={
                provider.offer === null
                  ? 'Este producto no cuenta con una oferta activa.'
                  : 'Cancelar oferta del producto'
              }
              >
                <Popconfirm
                  title={'¿Está seguro que desea cancelar '
                  + 'la oferta de este producto?'}
                  onConfirm={
                    () => provider.offer && onCancelOffer(
                      provider.offer.id,
                    )
                  }
                  disabled={provider.offer === null}
                >
                  <Button
                    shape="circle"
                    icon={<StopOutlined />}
                    disabled={provider.offer === null}
                  />
                </Popconfirm>
              </Tooltip>
              )}
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );

  const columns = [
    {
      title: 'Clave',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',

    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      key: 'presentation',

    },
    {
      title: 'Substancia activa',
      dataIndex: 'active_substance',
      key: 'active_substance',
    },
    {
      title: 'Proveedores',
      dataIndex: 'provider',
      key: 'provider',
      render: (
        _: number, product: ProductGroup,
      ) => renderProviders(
        product.providers,
      ),
    },
    {
      title: 'Laboratorio',
      dataIndex: 'laboratory',
      key: 'laboratory',
      render: (
        _: number, product: ProductGroup,
      ) => renderLabs(product.providers),
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (
        _: number, product: ProductGroup,
      ) => renderPrices(product.providers),
    },
    {
      title: 'IVA',
      dataIndex: 'iva',
      key: 'iva',
      render: (
        _: number, product: ProductGroup,
      ) => renderIVA(product.providers),
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (
        _: number, product: ProductGroup,
      ) => <AddToCart product={product} />,
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (
        _: number, product: ProductGroup,
      ) => renderActions(product),
    },
  ];

  const onCloseModal = (success: boolean): void => {
    if (success) {
      fetchProducts();
    }
    setOfferModal({ ...offerModal, visible: false });
  };

  const onFilterAny = (
    data: ProductGroup[], value: string,
  ): ProductGroup[] => data.filter((product) => (
    product.name.toLowerCase().includes(
      value.toLowerCase(),
    )
    || product.presentation.toLowerCase().includes(
      value.toLowerCase(),
    )
    || product.active_substance.toLowerCase().includes(
      value.toLowerCase(),
    )
    || (
      typeof product.category === 'string'
      && product.category.toLowerCase().includes(
        value.toLowerCase(),
      )
    )
    || (product.providers.find(
      (provider) => provider.laboratory.name.toLowerCase().includes(
        value.toLowerCase(),
      ),
    ))
    || (product.providers.find(
      (provider) => (provider.provider as string).toLowerCase().includes(
        value.toLowerCase(),
      ),
    ))
  ));

  const handleButton = () : void => {
    history.push('/productos/nuevo');
  };

  const changePriceButton = () : void => {
    history.push('/productos/cambio-precio');
  };

  useEffect(() => {
    resetFiltered();
  }, [products, resetFiltered]);

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !products ? <LoadingIndicator /> : (
        <>
          <TableFilter
            useAny
            fieldsToFilter={[
              { key: 'name', value: 'Nombre' },
              { key: 'presentation', value: 'Presentación' },
              { key: 'active_substance', value: 'Substancia activa' },
              { key: 'category', value: 'Categoria' },
            ]}
            onFilter={setFiltered}
            filterAny={onFilterAny}
            data={products}
          />
          <Table
            rowKey={(row) => `${row.id}`}
            data={filtered}
            columns={
              (!shouldShowAddToCart) ? columns.filter(
                (column) => column.key !== 'quantity',
              ) : columns
            }
            actions={[
              {
                action: createOrder,
                text: 'Ordenar',
                icon: <ShoppingCartOutlined />,
                hidden: (isAdmin || isProvider),
              },
              {
                action: changePriceButton,
                text: 'Cambio de precios',
                icon: <PlusOutlined />,
                hidden: (isClient || isAdmin),
              },
              {
                action: handleButton,
                text: 'Nuevo',
                icon: <PlusOutlined />,
                hidden: (isClient),
              },
            ]}
          />

          { offerModal.provider
            ? (
              <CreateProductOfferModal
                visible={offerModal.visible}
                onClose={onCloseModal}
                product={offerModal.provider}
              />
            ) : null}
        </>
      )}
    </Content>
  );
};

export default ListProducts;
