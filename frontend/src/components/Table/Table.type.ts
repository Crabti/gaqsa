import { TablePaginationConfig } from 'antd';

type Column = {
    title: string;
    dataIndex: string;
    key: string;
    sorter?: any;
    sortDirections?: any;
    defaultSortOrder?: any;
}

interface Props {
    data: any,
    columns: Column[],
    expandedRowRender?: any,
    rowKey: string | ((record: any) => string),
    pagination?: false | TablePaginationConfig | undefined,
}

export default Props;
