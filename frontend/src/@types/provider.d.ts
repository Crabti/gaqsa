import { CommonType } from '@types';

interface Provider extends CommonType {
  name: string;
  user: number;
  rfc: string;
  address: string;
  email: string;
}

export default Provider;
