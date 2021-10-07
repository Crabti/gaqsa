import {
  AppstoreOutlined, MedicineBoxOutlined, TeamOutlined,
} from '@ant-design/icons';
import { RouteProps } from 'react-router-dom';
import HomeView from 'views/Home';
import LoginView from 'views/Login';
import ProductsCreateForm from 'views/Products.CreateForm';
import ProductsListPending from 'views/Products.ListPending';
import ProductsListProducts from 'views/Products.ListProducts';
import ProductsUpdateForm from 'views/Products.UpdateForm';
import ListClientOrders from 'views/Orders.ListClientOrders';
import ListRequisitions from 'views/Orders.ListRequisitions';
import ListProviders from 'views/Providers.ListProviders';

import {
  LIST_CLIENT_ORDERS, LIST_PROVIDERS, LIST_REQUISITIONS,
  SHOW_ORDERS_MENU,
} from 'constants/featureFlags';
import { AuthType } from 'hooks/useAuth';

export interface RoutesType {
  path: string;
  view: React.VC;
  verboseName: string;
  showInMenu?: boolean;
  isPublic?: boolean;
  hasAccess?(auth: AuthType): boolean;
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
    hasAccess: ((auth) => auth.isAdmin || auth.isProvider),
  },
  updateProduct: {
    path: '/productos/:id/modificar',
    view: ProductsUpdateForm,
    verboseName: 'Modificar producto',
    hasAccess: ((auth) => auth.isAdmin),
  },
  listPendingProduct: {
    path: '/productos/pendientes',
    view: ProductsListPending,
    verboseName: 'Productos Por Aprobar',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listProducts: {
    path: '/productos/',
    view: ProductsListProducts,
    verboseName: 'Productos Existentes',
    showInMenu: true,
    hasAccess: ((auth) => auth.isClient || auth.isAdmin),
  },
};

const ordersRoutes: Routes = {
  listOrderHistory: {
    path: '/pedidos/historial',
    view: ListClientOrders,
    verboseName: 'Historial de Pedidos',
    showInMenu: LIST_CLIENT_ORDERS,
    hasAccess: ((auth) => auth.isClient),
  },
  listRequisitions: {
    path: '/pedidos',
    view: ListRequisitions,
    verboseName: 'Pedidos Realizados',
    showInMenu: LIST_REQUISITIONS,
    hasAccess: ((auth) => auth.isAdmin || auth.isProvider),
  },
};

export const providerRoutes: Routes = {
  listProviders: {
    path: '/proveedores',
    view: ListProviders,
    verboseName: 'Lista de proveedores',
    showInMenu: LIST_PROVIDERS,
    hasAccess: ((auth) => auth.isAdmin),
  },
};

export const otherRoutes: Routes = {
  home: {
    path: '/',
    view: HomeView,
    verboseName: 'Inicio',
  },
  login: {
    path: '/iniciar-sesion',
    view: LoginView,
    verboseName: 'Iniciar Sesión',
    isPublic: true,
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
  provider: {
    routes: providerRoutes,
    showInMenu: true,
    verboseName: 'Proveedores',
    icon: TeamOutlined,
  },
};

export default routes;
