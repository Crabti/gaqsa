import { RouteProps } from 'react-router-dom';
import HomeView from 'views/Home';
import ProductsCreateForm from 'views/Products.CreateForm';
import ProductsListPending from 'views/Products.ListPending';
import ProductsUpdateForm from 'views/Products.UpdateForm';

export interface RoutesType {
  path: string;
  view: RouteProps['component'];
  verboseName: string;
  showInMenu: boolean;
  props?: Omit<RouteProps, 'path' | 'component'>;
}

export interface Routes {
  [key: string]: RoutesType;
}

const routes: Routes = {
  home: {
    path: '/',
    view: HomeView,
    verboseName: 'Inicio',
    showInMenu: true,
  },
  createProduct: {
    path: '/productos/nuevo',
    view: ProductsCreateForm,
    verboseName: 'Registrar Producto',
    showInMenu: true,
  },
  updateProduct: {
    path: '/productos/:id/modificar',
    view: ProductsUpdateForm,
    verboseName: 'Actualizalizar Producto',
    showInMenu: false,
  },
  listPendingProduct: {
    path: '/productos/pendientes',
    view: ProductsListPending,
    verboseName: 'Productos Pendientes',
    showInMenu: true,
  },
};

export default routes;
