import React from 'react';

type Column = {
    title: string;
    dataIndex: string;
    key: string;
    sorter?: any;
    sortDirections?: any;
    defaultSortOrder?: any;
}

interface TableAction {
    action(): void,
    text: string,
    icon?: React.ReactNode,
}

interface Props {
    data: any,
    columns: Column[],
    expandedRowRender?: any,
    rowKey: string | ((record: any) => string),
    actions?: TableAction[],
}

export default Props;
