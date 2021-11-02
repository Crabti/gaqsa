import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  notification,
  Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Provider, UserEmail,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import {
  MailOutlined,
} from '@ant-design/icons';
import {
  INVOICES_MAILS_CATEGORY, ORDERS_MAILS_CATEGORY, PRICE_CHANGE_MAILS_CATEGORY,
} from 'constants/strings';
import SendPriceChangeModal from 'components/Modals/SendPriceChangeModal';

interface SendCodeModal {
  visible: boolean,
  providers: Provider[] | undefined,
}

const ListProviders: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[] | undefined>(undefined);
  const [codeModalVisible, setCodeModalVisible] = useState<SendCodeModal>(
    { visible: false, providers: undefined },
  );

  const fetchProviders = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.providers.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar el producto!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setProviders(result.data);
    setLoading(false);
  }, [backend.providers]);

  useEffect(() => {
    fetchProviders();
  }, [history, fetchProviders]);

  const onClose = () : void => {
    setCodeModalVisible({
      visible: false,
      providers: undefined,
    });
  };

  const showConfirmMassive = () : void => {
    setCodeModalVisible({
      visible: true,
      providers,
    });
  };

  const showConfirmOne = (provider: Provider) : void => {
    setCodeModalVisible({
      visible: true,
      providers: [provider],
    });
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'RFC',
      dataIndex: 'rfc',
      key: 'rfc',
    },
    {
      title: 'Correos pedidos',
      dataIndex: 'order_emails',
      key: 'order_emails',
    },
    {
      title: 'Correos facturas',
      dataIndex: 'invoice_emails',
      key: 'invoice_emails',
    },
    {
      title: 'Correos cambio de precios',
      dataIndex: 'price_change_emails',
      key: 'price_change_emails',
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (_: number, provider: Provider) => (
        <Tooltip title="Enviar Código">
          <Button
            type="primary"
            shape="circle"
            icon={<MailOutlined />}
            onClick={() => showConfirmOne(provider)}
          />
        </Tooltip>
      ),
    },
  ];

  const listEmails = (mails: UserEmail[] | undefined) : any => (
    <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
      {mails?.map((mail) => <li key={mail.id}>{mail.email}</li>)}
    </ul>
  );

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !providers ? <LoadingIndicator /> : (
        <>
          <Table
            rowKey={(row) => `${row.id}`}
            data={
            providers.map((provider) => ({
              id: provider.id,
              action: provider.id,
              name: provider.name,
              rfc: provider.rfc,
              address: provider.address,
              order_emails: listEmails(provider.emails?.filter(
                (email) => email.category === ORDERS_MAILS_CATEGORY,
              )),
              invoice_emails: listEmails(provider.emails?.filter(
                (email) => email.category === INVOICES_MAILS_CATEGORY,
              )),
              price_change_emails: listEmails(provider.emails?.filter(
                (email) => email.category === PRICE_CHANGE_MAILS_CATEGORY,
              )),
            }))
        }
            columns={columns}
            actions={[
              {
                action: showConfirmMassive,
                text: 'Código masivo',
                icon: <MailOutlined />,
              },
            ]}
          />
          <SendPriceChangeModal
            providers={codeModalVisible.providers}
            visible={codeModalVisible.visible}
            onClose={onClose}
          />
        </>
      )}
    </Content>
  );
};

export default ListProviders;
