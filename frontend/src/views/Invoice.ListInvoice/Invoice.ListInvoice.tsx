import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Invoice,
} from '@types';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import InvoiceTable from 'components/InvoiceTable';

const ListInvoice: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [invoices, setInvoice] = useState<Invoice[] | undefined>(undefined);

  const fetchInvoice = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.invoice.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrio un error al cargar las facturas',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setInvoice(result.data);
    setLoading(false);
  }, [backend.invoice]);

  useEffect(() => {
    fetchInvoice();
  }, [history, fetchInvoice]);

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !invoices ? <LoadingIndicator /> : (
        <>
          <InvoiceTable
            invoices={invoices}
            redirectToOrderDetail
            onRefresh={() => fetchInvoice()}
          />
        </>
      )}
    </Content>
  );
};

export default ListInvoice;
