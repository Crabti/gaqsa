type Column = {
    title: string;
    dataIndex: string;
    key: string;
}

export default interface Props {
    data: any,
    columns: Column[],
}