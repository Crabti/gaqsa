import { RouteProps } from 'react-router-dom';
import HomeView from 'views/Home';
import ProductForm from 'views/ProductForm';

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
  productForm: {
    path: '/product-form',
    view: ProductForm,
  },
};

export default routes;
