import { BadgeProps } from 'antd';
import React from 'react';

export type Column = {
  title: string;
  dataIndex: string;
  key: string;
  sorter?: any;
  sortDirections?: any;
  defaultSortOrder?: any;
  render?: any;
}

interface DownloadProps {
  filename?: string;
  disabled?: boolean;
  text?: string;
  ignoreColumnsKeys?: string[];
}

interface TableAction {
  action(): void,

  text: string,
  icon?: React.ReactNode,
  hidden?: boolean;
  disabled?: boolean;
  tooltip?: string;
  disabledTooltip?: string;
  badgeProps?: BadgeProps;
}

interface Props {
  data: any,
  columns: Column[],
  expandedRowRender?: any,
  rowKey: string | ((record: any) => string),
  actions?: TableAction[],
  selection?: any,
  downloadable?: boolean,
  downloadProps?: DownloadProps;
}

export default Props;
