import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button, Col, InputNumber, notification, Row, Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  ProductGroup,
  ProductProvider,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import {
  EditOutlined, PlusOutlined, SearchOutlined, ShoppingCartOutlined, TagOutlined,
} from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import useShoppingCart from 'hooks/shoppingCart';
import {
  SHOW_ADD_OFFER_BTN,
  SHOW_ADD_TO_CART_BTN,
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
  const { user } = useAuth();

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
    addProducts, removeProducts, clear, productsSh,
  } = useShoppingCart();
  const resetFiltered = useCallback(
    () => setFiltered(products || []), [products],
  );
  const shouldShowAddToCard = SHOW_ADD_TO_CART_BTN && isClient;
  const shouldShowAddOffer = SHOW_ADD_OFFER_BTN && isProvider;
  const shouldShowEditProduct = SHOW_EDIT_PRODUCT && isAdmin;
  const shouldShowDetailProduct = isProvider;

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

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar generar la orden de compra!',
      description: 'Intentalo después.',
    });
  };

  const createOrder = async () : Promise<void> => {
    setLoading(true);
    if (user) {
      if (productsSh.length > 0) {
        const [, error] = await backend.orders.createOne({
          productsSh, user: user.id,
        });
        if (error) {
          onFinishFailed();
          history.replace('/productos/');
        } else {
          notification.success({
            message: '¡Petición de orden creado exitosamente!',
            description: 'Su orden de compra ha sido recibida y será procesada.'
            + 'El proveedor le informará lo mas pronto posible '
            + 'el estatus de su solicitud.',
          });
          history.replace('/pedidos/cliente');
        }
      } else {
        notification.error({
          message: '¡Carrito de compras vacío!',
          description: 'Inserte alguna cantidad en algún producto que requiera',
        });
      }
    }
    clear();
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

  const renderQuantity = (
    product: ProductGroup,
  ) : any => (
    <Col>
      {product.providers.map((provider, index) => (
        <Row key={provider.id}>
          <Actions>
            {shouldShowAddToCard && (
              <Tooltip
                title={
                  `Añadir ${product.name}
                  - ${product.providers[index].provider} al carrito`
                }
              >
                <InputNumber
                  min={0}
                  step={1}
                  onChange={(value) => {
                    const rowProvider = product.providers[index];
                    if (Number(value) > 0) {
                      addProducts({
                        product: {
                          id: rowProvider.id,
                          category: (product.category as string),
                          key: product.key,
                          ieps: product.ieps,
                          iva: rowProvider.iva,
                          name: product.name,
                          active_substance: product.active_substance,
                          presentation: product.presentation,
                          laboratory: rowProvider.laboratory.name,
                          provider: (rowProvider.provider as string),
                          originalPrice: rowProvider.price,
                          price: rowProvider.offer
                            ? (
                              rowProvider.price - rowProvider.price
                        * rowProvider.offer.discount_percentage
                            )
                            : rowProvider.price,
                        },
                        amount: Number(value),
                        offer: rowProvider.offer,
                      });
                    } else {
                      removeProducts({
                        product: {
                          id: rowProvider.id,
                          category: (product.category as string),
                          key: product.key,
                          ieps: product.ieps,
                          iva: rowProvider.iva,
                          name: product.name,
                          active_substance: product.active_substance,
                          presentation: product.presentation,
                          laboratory: rowProvider.laboratory.name,
                          provider: (rowProvider.provider as string),
                          originalPrice: rowProvider.price,
                          price: rowProvider.offer
                            ? (
                              rowProvider.price - rowProvider.price
                        * rowProvider.offer.discount_percentage
                            )
                            : rowProvider.price,
                        },
                        offer: rowProvider.offer,
                        amount: -1,
                      });
                    }
                  }}
                />
              </Tooltip>
            )}
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
          </Actions>
        </Row>
      ))}
    </Col>

  );

  const renderActions = (
    product: ProductGroup,
  ) : any => (
    <Row justify="center" align="middle">
      <Col>
        <Actions>
          {shouldShowEditProduct && (
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
          )}
        </Actions>
      </Col>
      <Col>
        {product.providers.map((provider) => (
          <Row key={provider.id}>
            <Actions>
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
            </Actions>
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
      ) => renderQuantity(product),
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
          { !isClient
            ? (
              <>
                <Table
                  rowKey={(row) => `${row.id}`}
                  data={filtered}
                  columns={columns}
                  actions={[
                    {
                      action: handleButton,
                      text: 'Nuevo',
                      icon: <PlusOutlined />,
                    },
                  ]}
                />

              </>
            )
            : (
              <Table
                rowKey={(row) => `${row.id}`}
                data={filtered}
                columns={columns}
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
                    hidden: (isAdmin),
                  },
                  {
                    action: handleButton,
                    text: 'Nuevo',
                    icon: <PlusOutlined />,
                  },
                ]}
              />
            )}
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
