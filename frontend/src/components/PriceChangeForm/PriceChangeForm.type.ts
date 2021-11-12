import { Product } from '@types';
import { FormInstance } from 'antd';

interface Props {
    form: FormInstance<any>;
    onFinish: (values: any) => void;
    onFinishFailed: (values: any) => void;
    products?: Product[];
    isLoading: boolean;
}

export default Props;
