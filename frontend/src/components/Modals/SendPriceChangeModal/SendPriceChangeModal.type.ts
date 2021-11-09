import { Provider } from '@types';

export interface Props {
    visible: boolean;
    onClose: () => void;
    providers?: Provider[];
}
