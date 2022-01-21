/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useRef } from 'react';
import {
  Badge,
  Button, Col, Row, Tooltip,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { CSVLink } from 'react-csv';
import { DownloadOutlined } from '@ant-design/icons';
import Props from './Table.type';
import { Table } from './Table.styled';

const GenericTable: React.FC<Props> = ({
  data,
  columns,
  expandedRowRender,
  rowKey, actions, selection, downloadProps, downloadable,
}) => {
  const filteredColumns = (downloadProps && downloadProps.ignoreColumnsKeys)
    ? columns.filter(
      (col) => !downloadProps.ignoreColumnsKeys?.includes(col.key),
    )
    : columns;

  const headers = filteredColumns.map((col) => ({
    label: col.title,
    key: col.key,
  }));

  const csvLink = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
    >(
      null,
    );

  return (
    <>
      <Row
        gutter={16}
        justify="end"
        style={{
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10,
        }}
      >
        {
        downloadable
        && (
        <Col className="gutter-row" span={3} key={uuidv4()}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            block
            disabled={downloadProps && downloadProps.disabled}
            onClick={() => csvLink.current?.link.click()}
          >
            { (downloadProps && downloadProps.text) || 'Descargar' }
          </Button>
        </Col>
        )
      }
        {actions?.map((button) => (
          button.hidden ? null : (
            <Col className="gutter-row" span={3} key={uuidv4()}>
              <Tooltip title={(
                button.disabled && button.disabledTooltip
              ) ? button.disabledTooltip
                : button.tooltip ? button.tooltip : null}
              >
                {button.badgeProps ? (
                  <Badge {...button.badgeProps}>
                    <Button
                      onClick={button.action}
                      type="primary"
                      block
                      disabled={button.disabled}
                      icon={button.icon}
                    >
                      {button.text}
                    </Button>
                  </Badge>
                ) : (
                  <Button
                    onClick={button.action}
                    type="primary"
                    block
                    disabled={button.disabled}
                    icon={button.icon}
                  >
                    {button.text}
                  </Button>
                )}
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
      { downloadable
        && (
        <CSVLink
          data={data}
          target="_blank"
          headers={headers}
          filename={
            (downloadProps && downloadProps.filename) || `GAQSA-${uuidv4()}.csv`
          }
          ref={csvLink}
          hidden
        />
        )}
    </>

  );
};

export default GenericTable;
