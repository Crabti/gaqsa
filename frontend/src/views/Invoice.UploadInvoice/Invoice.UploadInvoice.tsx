import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Col,
  notification,
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

import OrderStatusTag from 'components/OrderStatusTag';
import { FileOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';
import OrderInvoiceStatusTag from 'components/OrderInvoiceStatusTag';
import TableFilter from 'components/TableFilter';

interface InvoiceModal {
  visible: boolean,
  order: Order | undefined,
}

const UploadInvoice: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const { isProvider } = useAuth();

  const shouldUploadInvoices = isProvider;

  const [invoiceModal, setInvoiceModal] = useState<InvoiceModal>(
    { visible: false, order: undefined },
  );

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

  const onFilterAny = (
    data: Order[], value: string,
  ): Order[] => data.filter((order) => (
    typeof order.user === 'string'
    && order.user.toLowerCase().includes(
      value.toLowerCase(),
    )
  ));

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <TableFilter
        fieldsToFilter={[
          { key: 'user', value: 'Nombre del Cliente' },
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
      <UploadInvoiceModal
        visible={invoiceModal.visible}
        onClose={onCloseModal}
        order={invoiceModal.order}
      />
    </Content>
  );
};

export default UploadInvoice;
