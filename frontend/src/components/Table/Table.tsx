import React from 'react';
import {
  Button, Col, Layout, Row,
} from 'antd';
import Props from './Table.type';
import { Table } from './Table.styled';

const GenericTable: React.FC<Props> = ({
  data, columns, expandedRowRender, rowKey, actions,
}) => (
  <Layout>
    <Row
      gutter={16}
      justify="end"
      style={{
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
      }}
    >
      {actions?.map((button) => (
        <Col className="gutter-row" span={3}>
          <Button
            onClick={button.action}
            type="primary"
            block
            icon={button.icon}
          >
            {button.text}
          </Button>
        </Col>
      ))}
    </Row>
    <Table
      rowKey={rowKey}
      dataSource={data}
      columns={columns}
      bordered
      size="small"
      expandedRowRender={expandedRowRender}
      pagination={false}
    />
  </Layout>

);

export default GenericTable;
