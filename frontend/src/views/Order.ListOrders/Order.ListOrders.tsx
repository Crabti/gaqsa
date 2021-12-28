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
import UploadInvoiceModal from 'components/Modals/UploadInvoiceModal';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import moment from 'moment';

import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined';
import OrderStatusTag from 'components/OrderStatusTag';
import { CloseOutlined, EditOutlined, FileOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import { OrderStatus } from 'constants/strings';
import OrderInvoiceStatusTag from 'components/OrderInvoiceStatusTag';

interface InvoiceModal {
  visible: boolean,
  order: Order | undefined,
}

const ListOrders: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const { isClient, isProvider, isAdmin } = useAuth();

  const shouldShowModifyOrder = isAdmin || isProvider;
  const shouldUploadInvoices = isProvider;

  const [invoiceModal, setInvoiceModal] = useState<InvoiceModal>(
    { visible: false, order: undefined },
  );
  const shouldShowCancelOrder = isClient;

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

  const columns = [
    {
      title: 'Numero de Orden',
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
    },
    {
      title: 'Facturación',
      dataIndex: 'invoice_status',
      key: 'invoice_status',
      render: (status: string) => <OrderInvoiceStatusTag status={status} />,
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
          {shouldUploadInvoices
            ? (
              <Col>
                <Tooltip title="Cargar Factura">
                  <Button
                    shape="circle"
                    icon={<FileOutlined />}
                    onClick={() => (
                      setInvoiceModal({
                        visible: true,
                        order,
                      })
                    )}
                  />
                </Tooltip>
              </Col>
            ) : null }
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

  if (isLoading || !orders) {
    return <LoadingIndicator />;
  }

  const onCloseModal = (success: boolean): void => {
    if (success) {
      fetchOrders();
    }
    setInvoiceModal({ ...invoiceModal, visible: false });
  };
  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <Table
        rowKey={(row) => row.id}
        data={
          orders.map((order) => ({
            id: order.id,
            user: order.user,
            created_at: moment(order.created_at).format('YYYY-mm-DD hh:mm'),
            status: order.status,
            provider: order.provider,
            total: `$${order.total?.toFixed(2)}`,
            invoice_status: order.invoice_status,
          }))
      }
        columns={columns}
      />
      <UploadInvoiceModal
        visible={invoiceModal.visible}
        onClose={onCloseModal}
        order={invoiceModal.order}
      />
    </Content>
  );
};

export default ListOrders;
