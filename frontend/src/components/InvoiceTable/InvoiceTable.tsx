import React, { useState, useEffect, useCallback } from 'react';
import {
  Button, Col, notification, Row, Tooltip,
} from 'antd';
import { Invoice } from '@types';
import moment from 'moment';
import Table, { Column } from 'components/Table';
import { InvoiceStatus } from 'constants/strings';
import {
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useBackend } from 'integrations';
import confirm from 'antd/lib/modal/confirm';
import useAuth from 'hooks/useAuth';
import RejectInvoiceModal from 'components/Modals/RejectInvoiceModal';
import InvoiceStatusTag from 'components/InvoiceStatusTag';
import TableFilter from 'components/TableFilter';
import { Props } from './InvoiceTable.type';

interface RejectModalProps {
  visible: boolean;
  invoice: Invoice | undefined;
}

const InvoiceTable: React.FC<Props> = (
  { invoices, redirectToOrderDetail, onRefresh },
) => {
  const backend = useBackend();
  const { isAdmin, isInvoiceManager, isClient } = useAuth();
  const [rejectModal, setRejectModal] = useState<RejectModalProps>({
    visible: false,
    invoice: undefined,
  });

  const onUpdate = async (
    invoice: number, accepted: boolean, reject_reason?: string,
  ) : Promise<boolean> => {
    const payload = {
      status: accepted ? InvoiceStatus.ACCEPTED : InvoiceStatus.REJECTED,
      reject_reason,
    };
    const [result, error] = await backend.invoice.patch(
      `/${invoice}/status`, payload,
    );
    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al modificar el estado de la factura.',
        description: 'Intentalo más tarde',
      });
      return false;
    }
    notification.success({
      message: accepted
        ? 'La factura ha cambiado a estado "Aceptado" exitosamente.'
        : 'La factura ha cambiado a estado "Rechazado" exitosamente.',
    });
    onRefresh();
    return true;
  };

  const onReject = async (invoice: Invoice, values: any) : Promise<boolean> => {
    const success = await onUpdate(invoice.id, false, values.reject_reason);
    return success;
  };

  const onModalClose = () : void => {
    setRejectModal({
      visible: false,
      invoice: undefined,
    });
  };

  const [filtered, setFiltered] = useState<Invoice[]>([]);

  const resetFiltered = useCallback(
    () => setFiltered(invoices || []), [invoices],
  );

  const onFilterAny = (
    data: Invoice[], value: string,
  ): Invoice[] => data.filter((invoice) => (
    (
      invoice.client.toLowerCase().includes(
        value.toLocaleLowerCase(),
      )
    )
    || (
      invoice.status.toLowerCase().includes(
        value.toLocaleLowerCase(),
      )
    )
  ));

  const renderTotal = (
    invoice: Invoice,
  ) : any => (
    <Row>
      {`$${invoice.amount?.toFixed(2)}`}
    </Row>
  );

  const renderInvoiceDate = (
    invoice: Invoice,
  ) : any => (
    <Row>
      {moment(invoice.invoice_date).format('YYYY-MM-DD')}
    </Row>
  );

  const renderCreatedDate = (
    invoice: Invoice,
  ) : any => (
    <Row>
      {moment(invoice.created_at).format('YYYY-MM-DD')}
    </Row>
  );

  useEffect(() => {
    resetFiltered();
  }, [invoices, resetFiltered]);

  const columns = [
    {
      title: 'Folio de Factura',
      dataIndex: 'invoice_folio',
      key: 'invoice_folio',
    },
    {
      title: 'Pedido',
      dataIndex: 'order',
      key: 'order',
      render: (_: number, invoice: Invoice) => (redirectToOrderDetail ? (
        <Button
          target="_blank"
          type="link"
          size="small"
          href={`/pedidos/${invoice.order}`}
        >
          {`Pedido ${invoice.order}`}
        </Button>
      ) : `Pedido ${invoice.order}`),
    },
    {
      title: 'Fecha de Captura',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => moment(
        a.created_at,
      ).unix() - moment(b.created_at).unix(),
      render: (
        _: number, invoice: Invoice,
      ) => renderCreatedDate(invoice),
    },
    {
      title: 'Fecha de Factura',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      render: (
        _: number, invoice: Invoice,
      ) => renderInvoiceDate(invoice),
    },
    {
      title: 'Fecha de Entrega',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (
        _: number, invoice: Invoice,
      ) => renderTotal(invoice),
    },
    {
      title: 'RFC Cliente',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Archivo XML',
      dataIndex: 'xml_file',
      key: 'xml_file',
      render: (_: number, invoice: Invoice) => (
        <Button
          target="_blank"
          type="link"
          size="small"
          href={invoice.xml_file}
        >
          Abrir archivo
        </Button>
      ),
    },
    {
      title: 'Archivos Adicionales',
      dataIndex: 'extra_files',
      key: 'extra_files',
      render: (_: number, invoice: Invoice) => (
        <Col>
          <Row>
            <Button
              target="_blank"
              type="link"
              size="small"
              href={invoice.invoice_file}
            >
              Abrir archivo
            </Button>
          </Row>
          { invoice.extra_file ? (
            <Row>
              <Button
                target="_blank"
                type="link"
                size="small"
                href={invoice.extra_file}
              >
                Abrir archivo
              </Button>
            </Row>
          ) : null}
        </Col>
      ),
    },
    {
      title: 'Vigencia',
      dataIndex: 'is_client_responsible',
      key: 'is_client_responsible',
      render: (valid: boolean) => (valid ? '' : 'Excedió tiempo'),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <InvoiceStatusTag status={status} />,
    },
    {
      title: 'Razon de rechazo',
      dataIndex: 'reject_reason',
      key: 'reject_reason',
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: number, data: Invoice) => {
        const canUpdate = data.can_update_status_today;
        const isPending = data.status === InvoiceStatus.PENDING;
        const acceptModalTitle = `
        Aceptar factura con folio ${data.invoice_folio}`;
        const acceptModalContent = 'Se cambiara el estado de '
        + ' la factura a "Aceptado"';
        let acceptTooltip;
        if (!canUpdate) {
          acceptTooltip = 'Esta acción no se puede realizar el día de hoy.';
        } else if (isPending) {
          acceptTooltip = `Aceptar factura folio ${data.invoice_folio}.`;
        } else {
          acceptTooltip = 'Esta factura ya ha sido sido aceptada o rechazada.';
        }
        let rejectTooltip;
        if (!canUpdate) {
          rejectTooltip = 'Esta accion no se puede realizar el dia de hoy.';
        } else if (isPending) {
          rejectTooltip = `Rechazar factura folio ${data.invoice_folio}.`;
        } else {
          rejectTooltip = acceptTooltip;
        }
        return (
          <Row>
            <Tooltip title={acceptTooltip}>
              <Button
                shape="circle"
                icon={<CheckCircleOutlined />}
                disabled={!canUpdate || !isPending}
                onClick={() => {
                  confirm({
                    title: acceptModalTitle,
                    icon: <ExclamationCircleOutlined />,
                    content: acceptModalContent,
                    okText: 'Aceptar',
                    cancelText: 'Cancelar',
                    onOk() {
                      return onUpdate(data.id, true);
                    },
                  });
                }}
              />
            </Tooltip>
            <Tooltip title={rejectTooltip}>
              <Button
                shape="circle"
                icon={<CloseCircleOutlined />}
                disabled={!canUpdate || !isPending}
                onClick={() => {
                  setRejectModal({
                    visible: true,
                    invoice: data,
                  });
                }}
              />
            </Tooltip>
          </Row>

        );
      },
    },
  ];

  const getColumns = () : Column[] => {
    if (isAdmin || isInvoiceManager || isClient) {
      return columns;
    }
    return columns.filter((col) => col.key !== 'actions');
  };

  return (
    <>
      <TableFilter
        fieldsToFilter={[
          { key: 'client', value: 'RFC del Cliente' },
          { key: 'status', value: 'Estado' },
        ]}
        onFilter={setFiltered}
        filterAny={onFilterAny}
        // eslint-disable-next-line
        data={invoices!}
      />
      <Table
        rowKey={(row) => `${row.id}`}
        data={invoices ? filtered : []}
        downloadable
        downloadProps={{
          filename: 'Saldos.csv',
          ignoreColumnsKeys: [
            'actions',
          ],
        }}
        columns={
        getColumns()
      }
      />
      { rejectModal.invoice ? (
        <RejectInvoiceModal
          onOk={onReject}
          invoice={rejectModal.invoice}
          visible={rejectModal.visible}
          onClose={onModalClose}
        />
      ) : null }
    </>
  );
};
export default InvoiceTable;
