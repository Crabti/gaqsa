import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
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
import { UserGroups } from 'hooks/useAuth';

const ListUsers: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
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

  useEffect(() => {
    fetchUsers();
  }, [history, fetchUsers]);

  const columns = [
    {
      title: 'Razón social',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: 'Nombre completo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Rol',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nombre de usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Ultimo inicio de sesion',
      dataIndex: 'last_login',
      key: 'last_login',
    },
    {
      title: 'Fecha de registro',
      dataIndex: 'date_joined',
      key: 'date_joined',
    },
    {
      title: 'Activo',
      dataIndex: 'active',
      key: 'active',
    },
  ];

  const NO_DATA = 'Sin datos';
  const NOT_APPLICABLE = 'N/A';

  const getBusinessName = (user: User) : string => {
    if (UserGroups.CLIENT === user.groups[0] && user.client) {
      return user.client.name;
    } if (UserGroups.PROVIDER === user.groups[0] && user.provider) {
      return user.provider.name;
    }
    return NOT_APPLICABLE;
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
              active: user.is_active ? 'Activo' : 'No activo',
              date_joined: moment(user.date_joined).format('YYYY-MM-DD HH:mm'),
              businessName: getBusinessName(user),
            }))
        }
          columns={columns}
        />
      )}
    </Content>
  );
};

export default ListUsers;
