import React from 'react';
import { Table } from 'antd';
import Props from './Table.type';

const GenericTable: React.FC<Props> = ({data, columns}) => {
  return (
    <Table dataSource={data} columns={columns} bordered/>
  );
};

export default GenericTable;
