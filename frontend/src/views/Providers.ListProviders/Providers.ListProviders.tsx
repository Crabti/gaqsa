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
  Provider,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import {
  ExclamationCircleOutlined, MailOutlined,
} from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';

interface ProviderId {
  pk: number
}

const ListProviders: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [providers, setProviders] = useState<Provider[] | undefined>(undefined);

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

  const onCodeError = () : void => {
    notification.error({
      message: 'Ocurrió un error al enviar los codigos!',
      description: 'Intentalo más tarde',
    });
  };

  const sendCodeOne = async (providerId: number) : Promise<void> => {
    setLoading(true);
    const [, error] = await backend.providers.put('/codes', [
      {
        pk: providerId,
      },
    ]);

    if (error) {
      onCodeError();
    } else {
      notification.success({
        message: '¡Códigos enviado!',
        description: 'Se han enviado los códigos de manera exitosa',
      });
    }
    setLoading(false);
  };

  const sendCodeMassive = async () : Promise<void> => {
    setLoading(true);
    if (providers) {
      const payload : ProviderId[] = providers.map((provider) => ({
        pk: provider.id,
      }));

      const [, error] = await backend.providers.put('/codes', payload);

      if (error) {
        onCodeError();
      } else {
        notification.success({
          message: '¡Código enviado!',
          description: 'Se ha enviado el código de manera exitosa',
        });
      }
    }
    setLoading(false);
  };

  const showConfirmMassive = () : void => {
    confirm({
      title: '¿Está seguro que desea enviar códigos '
      + 'para cambio de precio a todos los proveedores?',
      icon: <ExclamationCircleOutlined />,
      content: 'Se enviará por correo electrónico '
      + ' el código generado a cada proveedor.',
      onOk() {
        sendCodeMassive();
      },
    });
  };

  const showConfirmOne = (providerId: number) : void => {
    confirm({
      title: '¿Está seguro que desea enviar el código para cambio de precio?',
      icon: <ExclamationCircleOutlined />,
      content: 'Se enviará un correo electrónico al '
      + ' proveedor con el código generado.',
      onOk() {
        sendCodeOne(providerId);
      },
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
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (id: number) => (
        <Tooltip title="Enviar Código">
          <Button
            type="primary"
            shape="circle"
            icon={<MailOutlined />}
            onClick={() => showConfirmOne(id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !providers ? <LoadingIndicator /> : (
        <Table
          rowKey={(row) => `${row.id}`}
          data={
            providers.map((provider) => ({
              action: provider.id,
              name: provider.name,
              rfc: provider.rfc,
              address: provider.address,
              email: provider.email,
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
      )}
    </Content>
  );
};

export default ListProviders;
