import { AppstoreOutlined } from '@ant-design/icons';
import { RouteProps } from 'react-router-dom';
import HomeView from 'views/Home';
import ProductsCreateForm from 'views/Products.CreateForm';
import ProductsListPending from 'views/Products.ListPending';
import ProductsListProducts from 'views/Products.ListProducts';
import ProductsUpdateForm from 'views/Products.UpdateForm';
import ListClientOrders from 'views/Orders.ListClientOrders';

export interface RoutesType {
  path: string;
  view: React.VC;
  verboseName: string;
  showInMenu?: boolean;
  props?: Omit<RouteProps, 'path' | 'component'>;
}

export interface Routes {
  [key: string]: RoutesType;
}

export interface RegisteredGroup {
  [key: string]: {
    routes: Routes;
    showInMenu?: boolean;
    icon?: React.FC;
    verboseName?: string;
  }
}

export const productRoutes: Routes = {
  createProduct: {
    path: '/productos/nuevo',
    view: ProductsCreateForm,
    verboseName: 'Alta de Producto',
    showInMenu: true,
  },
  updateProduct: {
    path: '/productos/:id/modificar',
    view: ProductsUpdateForm,
    verboseName: 'Modificar producto',
  },
  listPendingProduct: {
    path: '/productos/pendientes',
    view: ProductsListPending,
    verboseName: 'Productos Por Aprobar',
    showInMenu: true,
  },
  listProducts: {
    path: '/productos/',
    view: ProductsListProducts,
    verboseName: 'Productos Existentes',
    showInMenu: true,
  },
};

const ordersRoutes: Routes = {
  listOrderHistory: {
    path: '/pedidos/historial',
    view: ListClientOrders,
    verboseName: 'Historial de pedidos',
    showInMenu: true,
  },
};

const otherRoutes: Routes = {
  home: {
    path: '/',
    view: HomeView,
    verboseName: 'Inicio',
  },
};

const routes: RegisteredGroup = {
  otherRoutes: {
    routes: otherRoutes,
  },
  product: {
    routes: productRoutes,
    showInMenu: true,
    verboseName: 'Productos',
    icon: AppstoreOutlined,
  },
  order: {
    routes: ordersRoutes,
    showInMenu: true,
    verboseName: 'Pedidos',
    icon: AppstoreOutlined,
  },
};

export default routes;
