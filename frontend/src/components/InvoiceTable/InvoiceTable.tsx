import React, { useState } from 'react';
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
import { Props } from './InvoiceTable.type';

interface RejectModalProps {
  visible: boolean;
  invoice: Invoice | undefined;
}

const InvoiceTable: React.FC<Props> = (
  { invoices, redirectToOrderDetail, onRefresh },
) => {
  const backend = useBackend();
  const { isAdmin, isInvoiceManager } = useAuth();
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
    },
    {
      title: 'Fecha de Factura',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
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
        <Button target="_blank" type="link" href={invoice.xml_file}>
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
            <Button target="_blank" type="link" href={invoice.invoice_file}>
              Abrir archivo
            </Button>
          </Row>
          { invoice.extra_file ? (
            <Row>
              <Button target="_blank" type="link" href={invoice.extra_file}>
                Abrir archivo
              </Button>
            </Row>
          ) : null}
        </Col>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <InvoiceStatusTag status={status} />,
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: number, data: Invoice) => {
        const canUpdate = data.can_update_status;
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
    if (isAdmin || isInvoiceManager) {
      return columns;
    }
    return columns.filter((col) => col.key !== 'actions');
  };

  return (
    <>
      <Table
        rowKey={(row) => `${row.id}`}
        data={invoices ? invoices.map((invoice) => ({
          id: invoice.id,
          invoice_folio: invoice.invoice_folio,
          delivery_date: moment(invoice.delivery_date).format('YYYY-MM-DD'),
          client: invoice.client,
          invoice_date: moment(
            invoice.invoice_date,
          ).format('YYYY-MM-DD hh:mm'),
          amount: invoice.amount,
          xml_file: invoice.xml_file,
          invoice_file: invoice.invoice_file,
          extra_file: invoice.extra_file,
          order: invoice.order,
          status: invoice.status,
          can_update_status: invoice.can_update_status,
          created_at: moment(
            invoice.created_at,
          ).format('YYYY-MM-DD hh:mm'),
        })) : []}
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
