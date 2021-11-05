import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  notification, Tooltip,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  User,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';
import moment from 'moment';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined, PlusOutlined, StopOutlined,
} from '@ant-design/icons';
import useAuth, { UserGroups } from 'hooks/useAuth';
import confirm from 'antd/lib/modal/confirm';
import { Actions } from './Users.ListUsers.styled';

const ListUsers: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const auth = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[] | undefined>(undefined);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.users.getAll();

    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al cargar la lista de usuarios!',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    setUsers(result.data);
    setLoading(false);
  }, [backend.users]);

  const updateUserActive = async (
    userId: number, activate: boolean,
  ) : Promise<void> => {
    const payload = {
      is_active: activate,
    };
    const [result, error] = await backend.users.put(
      `/${userId}/active`, payload,
    );
    if (error || !result) {
      notification.error({
        message: 'Ocurrió un error al modificar el acceso al usuario!',
        description: 'Intentalo más tarde',
      });
    }
    notification.success({
      message: !activate ? 'El usuario se ha desactiado exitosamente.'
        : 'El usuario se ha activado exitosamente.',
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, [history, fetchUsers]);

  const ACTIVE = 'Activo';
  const INACTIVE = 'No activo';
  const NOT_APPLICABLE = 'N/A';
  const NO_DATA = 'Sin datos';

  const columns = [
    {
      title: 'Razón social',
      dataIndex: 'businessName',
      key: 'businessName',
      sorter: (a: any, b: any) => a.businessName.localeCompare(b.businessName),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Nombre completo',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Rol',
      dataIndex: 'group',
      key: 'group',
      sorter: (a: any, b: any) => a.group.localeCompare(b.group),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: 'Nombre de usuario',
      dataIndex: 'username',
      key: 'username',
      sorter: (a: any, b: any) => a.username.localeCompare(b.username),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Ultimo inicio de sesion',
      dataIndex: 'last_login',
      key: 'last_login',
      sorter: (a: any, b: any) => moment(
        a.last_login,
      ).unix() - moment(b.last_login).unix(),
    },
    {
      title: 'Fecha de registro',
      dataIndex: 'date_joined',
      key: 'date_joined',
      sorter: (a: any, b: any) => moment(
        a.date_joined,
      ).unix() - moment(b.date_joined).unix(),
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
      sorter: (a: any, b: any) => a.active.localeCompare(b.active),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Acciones',
      dataIndex: 'action',
      key: 'action',
      render: (_: number, data: any) => {
        const active = (data.active === ACTIVE);
        const title = active
          ? `Desactivar usuario ${data.username}`
          : `Activar usuario ${data.username}`;

        const content = active
          ? 'Se desabilitara el acceso al usuario y no'
          + ' podra ingresar al sistema nuevamente.'
          : 'Se habilitara el acceso al usuario y'
            + ' podra ingresar nuevamente';

        const isMe = auth.user?.id === data.id;
        const toolTipTitle = active ? 'Desactivar usuario' : 'Activar usuario';
        return (
          <Actions>
            <Tooltip title={
              isMe
                ? 'No está permitido realizar esta acción con su propia cuenta.'
                : toolTipTitle
              }
            >
              <Button
                shape="circle"
                icon={active ? <StopOutlined /> : <CheckCircleOutlined />}
                disabled={auth.user?.id === data.id}
                onClick={() => {
                  confirm({
                    title,
                    icon: <ExclamationCircleOutlined />,
                    content,
                    okText: 'Confirmar',
                    okType: 'danger',
                    cancelText: 'Cancelar',
                    onOk() {
                      return updateUserActive(data.id, !active);
                    },
                  });
                }}
              />
            </Tooltip>
          </Actions>
        );
      },
    },
  ];

  const getBusinessName = (user: User) : string => {
    if (UserGroups.CLIENT === user.groups[0] && user.client) {
      return user.client.name;
    } if (UserGroups.PROVIDER === user.groups[0] && user.provider) {
      return user.provider.name;
    }
    return NOT_APPLICABLE;
  };

  const handleButton = () : void => {
    history.replace('/usuarios/nuevo');
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !users ? <LoadingIndicator /> : (
        <Table
          rowKey={(row) => `${row.id}`}
          data={
            users.map((user) => ({
              id: user.id,
              name: (user.first_name && user.last_name)
                ? `${user.first_name} ${user.last_name}` : NO_DATA,
              email: user.email ? user.email : NO_DATA,
              username: user.username ? user.username : NO_DATA,
              group: user.groups[0] ? user.groups[0] : NO_DATA,
              last_login: user.last_login
                ? moment(user.last_login).format(
                  'YYYY-MM-DD HH:mm',
                ) : NO_DATA,
              active: user.is_active ? ACTIVE : INACTIVE,
              date_joined: moment(user.date_joined).format('YYYY-MM-DD HH:mm'),
              businessName: getBusinessName(user),
            }))
        }
          columns={columns}
          actions={[
            {
              action: handleButton,
              text: 'Nuevo',
              icon: <PlusOutlined />,
            },
          ]}
        />
      )}
    </Content>
  );
};

export default ListUsers;
