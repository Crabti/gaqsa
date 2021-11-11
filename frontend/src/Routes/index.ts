import {
  AppstoreOutlined, MedicineBoxOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';
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
import ListProviders from 'views/Providers.ListProviders';
import LaboratoryCreateForm from 'views/Laboratory.CreateForm';
import CreateUser from 'views/Users.CreateForm/Users.CreateForm';
import ListUsers from 'views/Users.ListUsers/Users.ListUsers';
import ListLaboratory from 'views/Laboratory.ListLaboratory';
import ListCategory from 'views/Category.ListCategory';
import CategoryCreateForm from 'views/Category.CreateForm';
import ProductsDetail from 'views/Products.Detail';
import PriceChange from 'views/Products.PriceChange';
import OrderUpdate from 'views/Orders.Update';

import {
  LIST_CLIENT_ORDERS, LIST_PROVIDERS, LIST_REQUISITIONS,
  SHOW_CREATE_USER,
  SHOW_ORDERS_MENU,
  SHOW_USERS_LIST,
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
    hasAccess: ((auth) => auth.isProvider || auth.isAdmin),
  },
  updateProduct: {
    path: '/productos/:id/modificar',
    view: ProductsUpdateForm,
    verboseName: 'Modificar producto',
    hasAccess: ((auth) => auth.isAdmin || auth.isProvider),
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
    verboseName: 'Lista de Productos',
    showInMenu: true,
    hasAccess: ((auth) => auth.isClient || auth.isAdmin || auth.isProvider),
  },
  detailProduct: {
    path: '/productos/:id/detalle',
    view: ProductsDetail,
    verboseName: 'Modificar producto',
    showInMenu: false,
    hasAccess: (auth) => auth.isAdmin || auth.isProvider,
  },
  changePrice: {
    path: '/productos/cambio-precio',
    view: PriceChange,
    verboseName: 'Cambio de precios',
    hasAccess: (auth) => auth.isProvider,
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
  createOrder: {
    path: '/pedidos/create',
    view: OrderCreateOrder,
    verboseName: 'Realizar pedido',
    showInMenu: true,
    hasAccess: ((auth) => auth.isClient),
  },
  updateOrder: {
    path: '/pedidos/:id/modificar',
    view: OrderUpdate,
    verboseName: 'Modificar pedido',
    hasAccess: (auth) => auth.isProvider,
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

const catalogsRoutes: Routes = {
  createCategory: {
    path: '/categorias/nuevo',
    view: CategoryCreateForm,
    verboseName: 'Registrar Categoría',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listCategory: {
    path: '/categorias',
    view: ListCategory,
    verboseName: 'Lista de categorías',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
  createLaboratory: {
    path: '/laboratorios/nuevo',
    view: LaboratoryCreateForm,
    verboseName: 'Registrar Laboratorio',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listLaboratory: {
    path: '/laboratorios',
    view: ListLaboratory,
    verboseName: 'Lista de laboratorios',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
};

export const usersRoutes: Routes = {
  createUser: {
    path: '/usuarios/nuevo',
    view: CreateUser,
    verboseName: 'Crear nuevo usuario',
    showInMenu: SHOW_CREATE_USER,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listUsers: {
    path: '/usuarios',
    view: ListUsers,
    verboseName: 'Lista de Usuarios',
    showInMenu: SHOW_USERS_LIST,
    hasAccess: ((auth) => auth.isAdmin),
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
  catalogs: {
    routes: catalogsRoutes,
    showInMenu: true,
    verboseName: 'Catalogos',
  },
  user: {
    routes: usersRoutes,
    showInMenu: true,
    verboseName: 'Usuarios',
    icon: UserOutlined,
  },
};

export default routes;
