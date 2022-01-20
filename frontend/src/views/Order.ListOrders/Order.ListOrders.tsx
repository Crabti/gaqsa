import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Col,
  notification,
  Popconfirm,
  Row,
  Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Order,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import moment from 'moment';

import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import OrderStatusTag from 'components/OrderStatusTag';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import { OrderStatus } from 'constants/strings';
import TableFilter from 'components/TableFilter';

const ListOrders: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const { isClient, isProvider, isAdmin } = useAuth();

  const shouldShowModifyOrder = isAdmin || isProvider;

  const shouldShowCancelOrder = isClient;

  const [filtered, setFiltered] = useState<Order[]>([]);

  const resetFiltered = useCallback(
    () => setFiltered(orders || []), [orders],
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.orders.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar los pedidos!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setOrders(result.data);
    setLoading(false);
  }, [backend.orders]);

  useEffect(() => {
    fetchOrders();
  }, [history, fetchOrders]);

  const onCancelOrder = async (
    id: number,
  ) : Promise<void> => {
    setLoading(true);
    const cancelled = true;
    const [result, error] = await backend.orders.patch(
      `/orders/${id}/cancelled`,
      {
        cancelled,
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
      message: 'Se ha cancelado la orden exitosamente',
    });
    fetchOrders();
  };

  const renderTotal = (
    order: Order,
  ) : any => (
    <Row>
      {`$${order.total?.toFixed(2)}`}
    </Row>
  );

  const renderDate = (
    order: Order,
  ) : any => (
    <Row>
      {moment(order.created_at).format('YYYY-MM-DD')}
    </Row>
  );

  useEffect(() => {
    resetFiltered();
  }, [orders, resetFiltered]);

  const onFilterAny = (
    data: Order[], value: string,
  ): Order[] => data.filter((order) => (
    (
      typeof order.user === 'string'
      && order.user.toLowerCase().includes(
        value.toLowerCase(),
      )
    )
    || (
      typeof order.provider === 'string'
      && order.provider.toLowerCase().includes(
        value.toLowerCase(),
      )
    )
    || (
      order.status.toLowerCase().includes(
        value.toLocaleLowerCase(),
      )
    )
  ));

  const columns = [
    {
      title: 'Orden',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultSortOrder: 'descend',
      sortDirections: ['ascend', 'descend'],
      sorter: (a: Order, b: Order) => {
        if (moment(a.created_at).isBefore(moment(b.created_at))) {
          return -1;
        }
        return 1;
      },
      render: (
        _: number, order: Order,
      ) => renderDate(order),
    },
    {
      title: 'Cliente',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status,',
      render: (status: string) => <OrderStatusTag status={status} />,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total,',
      render: (
        _: number, order: Order,
      ) => renderTotal(order),
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: number, order: Order) => (
        <Row gutter={10} justify="center">
          <Col>
            <Tooltip title="Ver detalles">
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                onClick={() => {
                  history.push(`/pedidos/${order.id}`);
                }}
              />
            </Tooltip>
          </Col>
          {shouldShowModifyOrder
            ? (
              <Col>
                <Tooltip title={(order.status !== OrderStatus.PENDING)
                  ? 'Este pedido ya fue modificado' : 'Modificar pedido'}
                >
                  <Button
                    shape="circle"
                    disabled={order.status !== OrderStatus.PENDING}
                    icon={<EditOutlined />}
                    onClick={() => {
                      history.push(`/pedidos/${order.id}/modificar`);
                    }}
                  />
                </Tooltip>
              </Col>
            )
            : null}
          {shouldShowCancelOrder && order.status === 'Pendiente'
          && !order.cancelled
            ? (
              <Col>
                <Tooltip title="Cancelar orden">
                  <Popconfirm
                    title="¿Estás seguro de cancelar esta orden?"
                    onConfirm={() => onCancelOrder(
                      order.id,
                    )}
                  >
                    <Button
                      shape="circle"
                      icon={<CloseOutlined />}
                    />
                  </Popconfirm>
                </Tooltip>
              </Col>
            )
            : null}
        </Row>
      ),
    },
  ];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      { (isLoading || !orders) ? <LoadingIndicator />
        : (
          <>
            <TableFilter
              fieldsToFilter={[
                { key: 'user', value: 'Cliente' },
                { key: 'provider', value: 'Proveedor' },
                { key: 'status', value: 'Estado' },
              ]}
              onFilter={setFiltered}
              filterAny={onFilterAny}
              data={orders}
            />
            <Table
              rowKey={(row) => row.id}
              data={filtered}
              columns={columns}
            />
          </>
        )}
    </Content>
  );
};

export default ListOrders;
