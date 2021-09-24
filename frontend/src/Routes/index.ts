import { RouteProps } from 'react-router-dom';
import HomeView from 'views/Home';
import ProductsCreateForm from 'views/Products.CreateForm';
import ProductsListPending from 'views/Products.ListPending';
import ProductsUpdateForm from 'views/Products.UpdateForm';

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
  createProduct: {
    path: '/productos/nuevo',
    view: ProductsCreateForm,
  },
  updateProduct: {
    path: '/productos/:id/modificar',
    view: ProductsUpdateForm,
  },
  listPendingProduct: {
    path: '/productos/pendientes',
    view: ProductsListPending
  }
};

export default routes;
