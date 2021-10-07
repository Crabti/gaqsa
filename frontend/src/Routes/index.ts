import { AppstoreOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { RouteProps } from 'react-router-dom';
import HomeView from 'views/Home';
import LoginView from 'views/Login';
import OrderCreateOrder from 'views/Order.CreateOrder';
import ProductsCreateForm from 'views/Products.CreateForm';
import ProductsListPending from 'views/Products.ListPending';
import ProductsListProducts from 'views/Products.ListProducts';
import ProductsUpdateForm from 'views/Products.UpdateForm';
import ListClientOrders from 'views/Orders.ListClientOrders';
import ListRequisitions from 'views/Orders.ListRequisitions';
import {
  LIST_CLIENT_ORDERS, LIST_REQUISITIONS,
  SHOW_ORDERS_MENU,
} from 'constants/featureFlags';

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
    verboseName: 'Historial de Pedidos',
    showInMenu: LIST_CLIENT_ORDERS,
  },
  listRequisitions: {
    path: '/pedidos',
    view: ListRequisitions,
    verboseName: 'Pedidos Realizados',
    showInMenu: LIST_REQUISITIONS,
  },
  createOrder: {
    path: '/pedidos/create',
    view: OrderCreateOrder,
    verboseName: 'Realizar pedido',
    showInMenu: true,
  },
};

const otherRoutes: Routes = {
  home: {
    path: '/',
    view: HomeView,
    verboseName: 'Inicio',
  },
  login: {
    path: '/iniciar-sesion',
    view: LoginView,
    verboseName: 'Iniciar Sesión',
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
    showInMenu: SHOW_ORDERS_MENU,
    verboseName: 'Pedidos',
    icon: MedicineBoxOutlined,
  },
};

export default routes;
