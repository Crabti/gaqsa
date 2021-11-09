/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React from 'react';
import {
  Button, Col, Layout, Row, Tooltip,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import Props from './Table.type';
import { Table } from './Table.styled';

const GenericTable: React.FC<Props> = ({
  data, columns, expandedRowRender, rowKey, actions, selection,
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
        button.hidden ? null : (
          <Col className="gutter-row" span={3} key={uuidv4()}>
            <Tooltip title={
              (
                button.disabled && button.disabledTooltip
              ) ? button.disabledTooltip : button.tooltip ? button.tooltip : null
            }
            >
              <Button
                onClick={button.action}
                type="primary"
                block
                disabled={button.disabled}
                icon={button.icon}
              >
                {button.text}
              </Button>
            </Tooltip>
          </Col>
        )
      ))}
    </Row>
    <Table
      rowKey={(rowKey === undefined || rowKey === null) ? uuidv4() : rowKey}
      dataSource={data}
      columns={columns}
      bordered
      size="small"
      expandedRowRender={expandedRowRender}
      pagination={false}
      defaultExpandAllRows
      rowSelection={selection}
    />
  </Layout>

);

export default GenericTable;
