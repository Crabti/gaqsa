import { AuthType } from 'hooks/useAuth';

interface Props {
    hasAccess?(auth: AuthType): boolean;
}

export default Props;
