import { RouteProps } from 'react-router-dom';
import HomeView from 'views/Home';

export interface RoutesType {
  path: string;
  view: RouteProps['component'];
  props?: Omit<RouteProps, 'path' | 'component'>;
}

export interface Routes {
  [key: string]: RoutesType;
}

const routes: Routes = {
  home: {
    path: '/',
    view: HomeView,
  },
};

export default routes;
