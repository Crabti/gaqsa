/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
  InputNumber,
  Select,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Laboratory,
  Product, ProductGroup,
} from '@types';
import Table from 'components/Table';
import moment from 'moment';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import TableFilter from 'components/TableFilter';
import RejectProductRequestModal
  from 'components/Modals/RejectProductRequestModal';
import GroupProductModal from 'components/Modals/GroupProductModal';

const { Option } = Select;

interface GroupProductModal {
  visible: boolean;
  products?: Product[] | undefined,
}

const ListPending: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState<
  Product[] | undefined
  >(undefined);

  const [labs, setLabs] = useState<
  Laboratory[] | undefined
  >(undefined);

  const [filtered, setFiltered] = useState<Product[]>([]);
  const resetFiltered = useCallback(
    () => setFiltered(products || []), [products],
  );
  const [
    selected,
    setSelected,
  ] = useState([]);

  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  const [groupModal, setGroupModal] = useState<GroupProductModal>(
    { visible: false, products: undefined },
  );

  const onSelectChange = (rows : any) : void => {
    setSelected(rows);
  };

  const rowSelection = {
    selected,
    onChange: onSelectChange,
  };

  const fetchLabs = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.laboratory.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los laboratorios!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setLabs(result.data);
    setLoading(false);
  }, [backend.laboratory]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.products.getAll<ProductGroup[]>(
      'status=Pendiente',
    );

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    const converted : Product[] = result.data.map((product) => ({
      ...product,
      provider: {
        ...product.providers[0],
      },
    }));
    setProducts(converted);
    setLoading(false);
  }, [backend.products]);

  const filterSelectedProducts = () : Product[] | undefined => {
    if (!products) { return undefined; }
    return products.filter(
      (product) => rowSelection.selected.find(
        (selection) => selection === product.id,
      ),
    );
  };

  const onCreateSelected = async () : Promise<void> => {
    const selectedProducts = filterSelectedProducts();
    if (!selectedProducts) {
      return;
    }
    setLoading(true);

    const payload = selectedProducts.map((product) => ({
      id: product.id,
      price: product.provider.price,
      iva: product.provider.iva,
      laboratory: product.provider.laboratory.id,
    }));

    const [, error] = await backend.products.post(
      'accept', payload,
    );

    if (error) {
      notification.error({
        message: 'Ocurrió un error al registrar los productos!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }

    notification.success({
      message: '¡Producto(s) aceptado(s) exitosamente!',
    });
    setLoading(false);
    history.push('/productos');
  };

  const onRejectSelected = (value: boolean) : void => {
    setRejectModalVisible(value);
  };

  const onProductsGroup = (visible: boolean) : void => {
    const selectedProducts = filterSelectedProducts();
    setGroupModal({
      visible,
      products: selectedProducts,
    });
  };

  useEffect(() => {
    if (products === undefined) {
      fetchProducts();
    }

    if (labs === undefined) {
      fetchLabs();
    }
    resetFiltered();
  }, [history, fetchProducts, resetFiltered]);

  const onUpdatePrice = (
    key: number, value: number,
  ) : any => {
    const updatedProducts = products;
    if (updatedProducts) {
      updatedProducts[key].provider.price = value;
      setProducts(updatedProducts);
    }
  };

  const onUpdateIva = (
    key: number, value: number,
  ) : any => {
    const updatedProducts = products;
    if (updatedProducts) {
      updatedProducts[key].provider.iva = value;
      setProducts(updatedProducts);
    }
  };

  const onUpdateLab = (
    key: number, value: number,
  ) : any => {
    const updatedProducts = products;
    if (updatedProducts) {
      updatedProducts[key].provider.laboratory.id = value;
      setProducts(updatedProducts);
    }
  };

  const columns = [
    {
      title: 'Fecha de registro',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend'],
      sorter: (a: Product, b: Product) => {
        if (moment(a.created_at).isBefore(moment(b.created_at))) {
          return -1;
        }
        return 1;
      },
    },
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
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      key: 'presentation',
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Laboratorio',
      dataIndex: 'laboratory',
      key: 'laboratory',
      render: (_: string, data: any, index: number) => (
        <Select
          showSearch
          defaultValue={data.laboratory.id}
          placeholder="Buscar laboratorio"
          optionFilterProp="children"
          style={{ width: '100%' }}
          onChange={
            (value) => onUpdateLab(
              index, value,
            )
          }
          filterOption={(input, option) => (option === undefined
            ? false : option.children
              .toLowerCase().indexOf(input.toLowerCase()) >= 0)}
        >
          {labs ? Object.values(labs).map(
            (lab: Laboratory) => (
              <Option value={lab.id} key={lab.id}>
                {lab.name}
              </Option>
            ),
          ) : null}
        </Select>
      ),
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (_: string, data: any, index: number) => (
        <InputNumber
          defaultValue={data.price}
          onChange={
            (value) => onUpdatePrice(
              index, value,
            )
          }
          formatter={(value) => `$ ${value}`.replace(
            /\B(?=(\d{3})+(?!\d))/g, ',',
          )}
        />
      ),
    },
    {
      title: 'IVA',
      dataIndex: 'iva',
      key: 'iva',
      render: (_: string, data: any, index: number) => (
        <InputNumber
          defaultValue={data.iva}
          onChange={
            (value) => onUpdateIva(
              index, value,
            )
          }
          formatter={(value) => `${value}%`}
        />
      ),
    },
  ];

  const onFilterAny = (
    data: Product[], value: string,
  ): Product[] => data.filter((product) => (
    product.name.toLowerCase().includes(
      value.toLowerCase(),
    )
  ));

  const onRejectModalClose = (success: boolean) : void => {
    if (success) {
      fetchProducts();
    }
    setRejectModalVisible(false);
  };

  const onGroupModalClose = (success: boolean) : void => {
    if (success) {
      fetchProducts();
    }
    setGroupModal({
      ...groupModal,
      visible: false,
    });
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !products || !labs ? <LoadingIndicator /> : (
        <>
          <TableFilter
            useAny
            fieldsToFilter={[
              { key: 'name', value: 'Nombre' },
            ]}
            onFilter={setFiltered}
            filterAny={onFilterAny}
            data={products}
          />
          <Table
            rowKey={(row) => row.id}
            data={filtered.map((product) => ({
              id: product.id,
              key: product.key,
              name: product.name,
              category: product.category,
              provider: product.provider.provider,
              presentation: product.presentation,
              iva: product.provider.iva,
              price: product.provider.price,
              laboratory: product.provider.laboratory,
              created_at: moment(
                new Date(product.created_at),
              ).format('DD/MM/YYYY HH:mm'),
              action: product.id,
            }))}
            columns={columns}
            selection={rowSelection}
            actions={[
              {
                action: onCreateSelected,
                text: 'Aceptar',
                disabled: rowSelection.selected.length === 0,
                disabledTooltip: 'Debe seleccionar por lo menos un producto.',
              },
              {
                action: () => onRejectSelected(true),
                text: 'Rechazar',
                disabled: rowSelection.selected.length === 0,
                disabledTooltip: 'Debe seleccionar por lo menos un producto.',
              },
              {
                action: () => onProductsGroup(true),
                text: 'Agrupar',
                disabled: rowSelection.selected.length === 0,
                disabledTooltip: 'Debe seleccionar por lo menos un producto.',
              },
            ]}
          />
          <RejectProductRequestModal
            visible={rejectModalVisible}
            selected={rowSelection.selected}
            onClose={onRejectModalClose}
          />
          <GroupProductModal
            visible={groupModal.visible}
            products={groupModal.products}
            onClose={onGroupModalClose}
          />
        </>
      )}
    </Content>
  );
};

export default ListPending;
