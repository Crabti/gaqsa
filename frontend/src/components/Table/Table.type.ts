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
}

export default Props;
