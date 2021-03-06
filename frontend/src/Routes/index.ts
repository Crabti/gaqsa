import {
  AppstoreOutlined, FileOutlined, MedicineBoxOutlined,
  TeamOutlined, UserOutlined,
} from '@ant-design/icons';
import { RouteProps } from 'react-router-dom';
import AnnouncementsCreate from 'views/Announcements.Create';
import AnnouncementsDetailCompound from 'views/Announcements.Detail';
import AnnouncementsListCompound from 'views/Announcements.List';
import HomeView from 'views/Home';
import LoginView from 'views/Login';
import ProductsCreateForm from 'views/Products.CreateForm';
import ProductsListPending from 'views/Products.ListPending';
import ProductsListProducts from 'views/Products.ListProducts';
import ProductsUpdateForm from 'views/Products.UpdateForm';
import LaboratoryCreateForm from 'views/Laboratory.CreateForm';
import CreateUser from 'views/Users.CreateForm/Users.CreateForm';
import ListUsers from 'views/Users.ListUsers/Users.ListUsers';
import ListLaboratory from 'views/Laboratory.ListLaboratory';
import ListCategory from 'views/Category.ListCategory';
import CategoryCreateForm from 'views/Category.CreateForm';
import ProductsDetail from 'views/Products.Detail';
import ListOrders from 'views/Order.ListOrders/Order.ListOrders';
import PriceChange from 'views/Products.PriceChange';
import OrderUpdate from 'views/Orders.Update';
import OrderDetail from 'views/Order.OrderDetail/Order.OrderDetail';
import ListProviders from 'views/Providers.ListProviders';
import ListAuditLog from 'views/AuditLog.ListAuditLog';
import ListInvoice from 'views/Invoice.ListInvoice';
import UploadInvoice from 'views/Invoice.UploadInvoice/Invoice.UploadInvoice';
import OrderCreateOrder from 'views/Order.CreateOrder';
import UpdateUserCompound from 'views/Users.UpdateUser';

import {
  LIST_PROVIDERS, SHOW_CREATE_ANNOUNCEMENT,
  SHOW_CREATE_USER, SHOW_LIST_ANNOUNCEMENT,
  SHOW_ORDERS_MENU,
  SHOW_USERS_LIST,
  SHOW_AUDIT_LOG, SHOW_DETAIL_ANNOUNCEMENT,
} from 'constants/featureFlags';
import { AuthType } from 'hooks/useAuth';

export interface RoutesType {
  path: string;
  view: React.VC;
  verboseName: string;
  showInMenu?: boolean;
  isPublic?: boolean;
  props?: Omit<RouteProps, 'path' | 'component'>;

  hasAccess?(auth: AuthType): boolean;
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
  };
}

export const productRoutes: Routes = {
  createProduct: {
    path: '/productos/nuevo',
    view: ProductsCreateForm,
    verboseName: 'Alta de producto',
    hasAccess: ((auth) => auth.isProvider || auth.isAdmin),
  },
  updateProduct: {
    path: '/productos/:id(\\d+)/modificar',
    view: ProductsUpdateForm,
    verboseName: 'Modificar producto',
    hasAccess: ((auth) => auth.isAdmin || auth.isProvider),
  },
  listPendingProduct: {
    path: '/productos/pendientes',
    view: ProductsListPending,
    verboseName: 'Productos por aprobar',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listProducts: {
    path: '/productos/',
    view: ProductsListProducts,
    verboseName: 'Lista de productos',
    showInMenu: true,
    hasAccess: ((auth) => auth.isClient || auth.isAdmin || auth.isProvider),
  },
  detailProduct: {
    path: '/productos/:id(\\d+)/detalle',
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
  orderDetail: {
    path: '/pedidos/:id(\\d+)',
    view: OrderDetail,
    verboseName: 'Detalle de pedido',
    showInMenu: false,
    hasAccess: (
      (auth) => auth.isClient || auth.isAdmin
        || auth.isProvider || auth.isInvoiceManager
    ),
  },
  listOrder: {
    path: '/pedidos',
    view: ListOrders,
    verboseName: 'Historial de pedidos',
    showInMenu: true,
    hasAccess: (
      (auth) => auth.isClient || auth.isAdmin
        || auth.isProvider || auth.isInvoiceManager),
  },
  updateOrder: {
    path: '/pedidos/:id(\\d+)/modificar',
    view: OrderUpdate,
    verboseName: 'Modificar pedido',
    hasAccess: (auth) => auth.isProvider || auth.isAdmin,
  },
  createOrder: {
    path: '/pedidos/resumen',
    view: OrderCreateOrder,
    verboseName: 'Resumen de orden',
    showInMenu: true,
    hasAccess: ((auth) => auth.isClient),
  },
};

const invoiceRoutes: Routes = {
  listInvoice: {
    path: '/facturas',
    verboseName: 'Historial de facturas',
    view: ListInvoice,
    showInMenu: true,
    hasAccess: (
      () => true
    ),
  },
  uploadInvoice: {
    path: '/facturaci??n',
    verboseName: 'Cargar Facturas',
    view: UploadInvoice,
    showInMenu: true,
    hasAccess: ((auth) => auth.isProvider),
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
    verboseName: 'Iniciar Sesi??n',
    isPublic: true,
  },
};

export const catalogsRoutes: Routes = {
  createCategory: {
    path: '/categorias/nuevo',
    view: CategoryCreateForm,
    verboseName: 'Registrar categor??a',
    showInMenu: false,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listCategory: {
    path: '/categorias',
    view: ListCategory,
    verboseName: 'Lista de categor??as',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
  createLaboratory: {
    path: '/laboratorios/nuevo',
    view: LaboratoryCreateForm,
    verboseName: 'Registrar laboratorio',
    showInMenu: false,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listLaboratory: {
    path: '/laboratorios',
    view: ListLaboratory,
    verboseName: 'Lista de laboratorios',
    showInMenu: true,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listAnnouncements: {
    path: '/circulares',
    view: AnnouncementsListCompound,
    verboseName: 'Lista de circulares',
    showInMenu: SHOW_LIST_ANNOUNCEMENT,
    hasAccess: (
      (auth) => auth.isAdmin || auth.isProvider || auth.isClient
    ),
  },
  createAnnouncement: {
    path: '/circulares/nueva',
    view: AnnouncementsCreate,
    verboseName: 'Nueva circular',
    showInMenu: SHOW_CREATE_ANNOUNCEMENT,
    hasAccess: ((auth) => auth.isAdmin),
  },
  detailAnnouncements: {
    path: '/circulares/:id(\\d+)',
    view: AnnouncementsDetailCompound,
    verboseName: 'Detalle de circulare',
    showInMenu: SHOW_DETAIL_ANNOUNCEMENT,
    hasAccess: (
      (auth) => auth.isAdmin || auth.isProvider || auth.isClient
    ),
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
    verboseName: 'Lista de usuarios',
    showInMenu: SHOW_USERS_LIST,
    hasAccess: ((auth) => auth.isAdmin),
  },
  listAuditLog: {
    path: '/bitacora',
    view: ListAuditLog,
    verboseName: 'Bit??cora de acciones',
    showInMenu: SHOW_AUDIT_LOG,
    hasAccess: ((auth) => auth.isAdmin),
  },
  editUser: {
    path: '/usuarios/:id(\\d+)/modificar',
    view: UpdateUserCompound,
    verboseName: 'Modificar usuario',
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
    verboseName: 'Cat??logos',
  },
  user: {
    routes: usersRoutes,
    showInMenu: true,
    verboseName: 'Usuarios',
    icon: UserOutlined,
  },
  invoice: {
    routes: invoiceRoutes,
    showInMenu: true,
    verboseName: 'Facturas',
    icon: FileOutlined,
  },
};

export default routes;
