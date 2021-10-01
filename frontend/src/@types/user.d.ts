import { CommonType } from '@types';

interface User extends CommonType {
  firstName: string;
  lastName: string;
  email: string;
  groups: string[];
}

export default User;
