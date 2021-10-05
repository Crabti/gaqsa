import React from 'react';
import { Table } from 'antd';
import Props from './Table.type';

const GenericTable: React.FC<Props> = (
  {
    data, columns, expandedRowRender, pagination,
  },
) => (
  <Table
    dataSource={data}
    columns={columns}
    bordered
    expandedRowRender={expandedRowRender}
    pagination={pagination}
  />
);

export default GenericTable;
