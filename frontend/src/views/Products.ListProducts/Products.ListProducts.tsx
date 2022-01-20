import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button, Popconfirm, notification, Row, Tooltip, Dropdown, Menu,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  ProductGroup,
  ProductProvider,
  Provider,
} from '@types';
import Table from 'components/Table';
import AddToCart from 'components/TableCellActions/AddToCart';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import {
  EditOutlined, PlusOutlined,
  StopOutlined,
  ShoppingCartOutlined, TagOutlined, UserAddOutlined, MinusCircleOutlined,
  DownOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import useShoppingCart from 'hooks/shoppingCart';
import {
  SHOW_ADD_OFFER_BTN,
  SHOW_ADD_PROVIDER_TO_PRODUCT,
  SHOW_ADD_TO_CART_BTN,
  SHOW_CANCEL_OFFER_BTN,
  SHOW_EDIT_PRODUCT,
  SHOW_REMOVE_PROVIDER_FROM_PRODUCT,
} from 'constants/featureFlags';
import CreateProductOfferModal from 'components/Modals/CreateProductOfferModal';
import DiscountText from 'components/DiscountText';
import TableFilter from 'components/TableFilter';
import AddProviderToProductModal
  from 'components/Modals/AddProviderToProductModal';
import { Actions } from './Products.ListProducts.styled';

interface OfferModal {
  visible: boolean,
  provider: ProductProvider | undefined,
}

interface AddProviderModal {
  visible: boolean,
  product: ProductGroup | undefined,
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

  const [addProviderModal, setAddProviderModal] = useState<AddProviderModal>(
    { visible: false, product: undefined },
  );

  const [isLoading, setLoading] = useState(false);
  const [
    products, setProducts,
  ] = useState<ProductGroup[] | undefined>(undefined);
  const [filtered, setFiltered] = useState<ProductGroup[]>([]);
  const {
    productsCart,
  } = useShoppingCart();
  const resetFiltered = useCallback(
    () => setFiltered(products || []), [products],
  );
  const shouldShowAddToCart = SHOW_ADD_TO_CART_BTN && isClient;
  const shouldShowAddOffer = SHOW_ADD_OFFER_BTN && isProvider;
  const shouldShowEditProduct = SHOW_EDIT_PRODUCT && isAdmin;
  const shouldShowCancelOffer = SHOW_CANCEL_OFFER_BTN && (
    isProvider || isAdmin
  );
  const shouldShowAddProvider = SHOW_ADD_PROVIDER_TO_PRODUCT && isAdmin;
  const shouldShowRemoveProvider = SHOW_REMOVE_PROVIDER_FROM_PRODUCT && isAdmin;
  const shouldShowToggleProductProviderActive = isAdmin || isProvider;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const [result, error] = await backend.products.getAll<ProductGroup[]>(
      isProvider ? '' : 'status=Aceptado',
    );
    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los productos!',
        description: 'Inténtalo más tarde',
      });
      setLoading(false);
      return;
    }
    const providerFiltered = isClient
      ? result.data.map((product) => ({
        ...product,
        providers: product.providers.filter((provider) => provider.active),
      }))
      : result.data;
    setProducts(providerFiltered);
    setLoading(false);
  }, [backend.products, isClient, isProvider]);

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

  const onToggleProductProviderActive = async (
    id: number, active: boolean,
  ) : Promise<void> => {
    setLoading(true);
    const [result, error] = await backend.products.patch(
      `/productproviders/${id}/active`,
      {
        active,
      },
    );
    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cambiar el estado del producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    notification.success({
      message: 'Se ha cambiado el estado del producto exitosamente.',
    });
    fetchProducts();
  };

  const onRemoveProvider = async (
    pk: number,
  ) : Promise<void> => {
    setLoading(true);
    const [result, error] = await backend.products.delete(
      `/productproviders/${pk}`,
    );
    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al desagrupar al proveedor!',
        description: 'Inténtalo más tarde',
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    notification.success({
      message: 'Se ha desagrupado al proveedor del producto exitosamente.',
    });
    fetchProducts();
  };

  const createOrder = () : void => {
    history.push('/pedidos/resumen');
  };

  const renderLabs = (
    providers: ProductProvider[],
  ) : any => {
    if (providers.length === 0) {
      return 'No disponible';
    }
    return providers.map((provider) => (
      <Row key={provider.id}>
        {provider.laboratory.name}
      </Row>
    ));
  };

  const renderProviders = (
    providers: ProductProvider[],
  ) : any => {
    if (providers.length === 0) {
      return 'No disponible';
    }

    return providers.map((provider) => (
      <Row key={provider.id}>
        {(provider.provider as Provider).name}
      </Row>
    ));
  };

  const renderPrices = (
    providers: ProductProvider[],
  ) : any => {
    if (providers.length === 0) {
      return 'No disponible';
    }
    return providers.map((provider) => (
      <Row key={provider.id}>
        <DiscountText
          originalPrice={provider.price}
          discount={provider.offer?.discount_percentage}
        />
      </Row>
    ));
  };

  const renderIVA = (
    providers: ProductProvider[],
  ) : any => {
    if (providers.length === 0) {
      return 'No disponible';
    }

    return (providers.map((provider) => (
      <Row key={provider.id}>
        {`${provider.iva} %`}
      </Row>
    )));
  };

  const renderProductProviderActive = (
    providers: ProductProvider[],
  ) : any => providers.map((provider) => (
    <Row key={provider.id}>
      {provider.active ? 'Activo' : 'No activo'}
    </Row>
  ));

  const renderActionsMenu = (
    product: ProductGroup, provider: ProductProvider,
  ) : any => (
    <Menu key={`${provider.id}-${product.id}-menu`}>
      {shouldShowAddOffer && product.status === 'Aceptado' && (
        <Tooltip title={
            provider.offer !== null
              ? 'Este producto ya cuenta con una oferta activa. '
                  + 'Debe cancelar la oferta o esperar a que termine '
                  + 'para poder crear una nueva.'
              : 'Crear nueva oferta para producto'
          }
        >
          <Menu.Item
            key={`${provider.id}-offer`}
            icon={<TagOutlined />}
            disabled={provider.offer !== null}
            onClick={() => (
              setOfferModal({
                visible: true,
                provider,
              })
            )}
          >
            Crear nueva oferta para producto
          </Menu.Item>
        </Tooltip>
      )}
      {shouldShowCancelOffer && product.status === 'Aceptado' && (
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
            <Menu.Item
              icon={<StopOutlined />}
              disabled={provider.offer === null}
            >
              Cancelar oferta de producto
            </Menu.Item>
          </Popconfirm>
        </Tooltip>
      )}
      {shouldShowRemoveProvider && (
        <Popconfirm
          title={'¿Está seguro que desea desagrupar al proveedor '
                + `${provider.provider} del producto: ${product.name}?`}
          onConfirm={
                  () => onRemoveProvider(
                    provider.id,
                  )
                }
        >
          <Menu.Item
            icon={<MinusCircleOutlined />}
          >
            Desagrupar producto de proveedor
          </Menu.Item>
        </Popconfirm>
      )}
      {shouldShowToggleProductProviderActive && (
      <Popconfirm
        title={
          provider.active
            ? `¿Está seguro que desea desactivar al producto: ${product.name}?`
            : `¿Está seguro que desea activar al producto: ${product.name}?`
        }
        onConfirm={() => onToggleProductProviderActive(
          provider.id, !provider.active,
        )}
      >
        <Menu.Item
          icon={provider.active ? <CheckCircleOutlined /> : <StopOutlined />}
        >
          {provider.active ? 'Desactivar producto' : 'Activar producto'}
        </Menu.Item>
      </Popconfirm>
      )}
    </Menu>
  );

  const renderActions = (product: ProductGroup) : any => (
    product.providers.map((provider) => (
      <Row>
        <Dropdown overlay={renderActionsMenu(product, provider)}>
          <Button>
            Más
            <DownOutlined />
          </Button>
        </Dropdown>
      </Row>
    ))
  );

  const renderProductActions = (
    product: ProductGroup,
  ) : any => (
    <Actions>
      {shouldShowEditProduct ? (
        <Tooltip title="Editar producto">
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => (
              history.push(`/productos/${product.id}/modificar`)
            )}
          />
        </Tooltip>
      ) : null}
      {shouldShowAddProvider ? (
        <Tooltip title="Agregar proveedor">
          <Button
            shape="circle"
            icon={<UserAddOutlined />}
            onClick={() => (
              setAddProviderModal({
                visible: true,
                product,
              }))}
          />
        </Tooltip>
      ) : null}
    </Actions>
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
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Substancia',
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
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
      render: (
        _: number, product: ProductGroup,
      ) => renderProductProviderActive(product.providers),
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (
        _: number, product: ProductGroup,
      ) => renderProductActions(product),
    },
    {
      title: '',
      key: 'moreActions',
      render: (_: number, product: ProductGroup) => renderActions(product),
    },
  ];

  const onCloseModal = (success: boolean): void => {
    if (success) {
      fetchProducts();
    }
    setOfferModal({ ...offerModal, visible: false });
    setAddProviderModal({ ...addProviderModal, visible: false });
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
      (provider) => (provider.provider as Provider).name.toLowerCase().includes(
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

  const filterColumns = () : any => {
    const cartFiltered = !shouldShowAddToCart ? columns.filter(
      (column) => column.key !== 'quantity',
    ) : columns;

    const statusFiltered = !isProvider ? cartFiltered.filter(
      (column) => column.key !== 'status',
    ) : cartFiltered;

    const actionsFiltered = isClient ? statusFiltered.filter(
      (column) => column.key !== 'actions'
      && column.key !== 'moreActions'
      && column.key !== 'active',
    ) : statusFiltered;

    return actionsFiltered;
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
            columns={filterColumns()}
            actions={[
              {
                action: createOrder,
                text: 'Ordenar',
                icon: <ShoppingCartOutlined />,
                disabled: productsCart.length === 0,
                hidden: (isAdmin || isProvider),
                badgeProps: {
                  count: productsCart.length,
                  showZero: true,
                  color: 'green',
                },
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
          { shouldShowAddProvider
           && addProviderModal.product
            ? (
              <AddProviderToProductModal
                visible={addProviderModal.visible}
                onClose={onCloseModal}
                product={addProviderModal.product}
              />
            ) : null}
        </>
      )}
    </Content>
  );
};

export default ListProducts;
