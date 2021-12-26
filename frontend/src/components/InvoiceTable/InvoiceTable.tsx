import React from 'react';
import {
  Button, Col, Row,
} from 'antd';
import { Invoice } from '@types';
import moment from 'moment';
import Table from 'components/Table';
import { Props } from './InvoiceTable.type';

const InvoiceTable: React.FC<Props> = ({ invoices, redirectToOrderDetail }) => {
  const columns = [
    {
      title: 'Folio',
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
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => moment(
        a.created_at,
      ).unix() - moment(b.created_at).unix(),
    },
    {
      title: 'Fecha de factura',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
    },
    {
      title: 'Fecha de entrega',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
    },
    {
      title: 'RFC Cliente',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Archivos XML',
      dataIndex: 'xml_file',
      key: 'xml_file',
      render: (_: number, invoice: Invoice) => (
        <Button target="_blank" type="link" href={invoice.xml_file}>
          Abrir archivo
        </Button>
      ),
    },
    {
      title: 'Archivos adicionales',
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
  ];

  return (
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
        xml_file: invoice.xml_file,
        invoice_file: invoice.invoice_file,
        extra_file: invoice.extra_file,
        order: invoice.order,
        created_at: moment(
          invoice.created_at,
        ).format('YYYY-MM-DD hh:mm'),
      })) : []}
      columns={columns}
    />
  );
};
export default InvoiceTable;
