// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  inventariokardex: getIcon('ic_inventariokardex'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'APLICACIONES',
    items: [
      {
        title: 'Inicio',
        path: PATH_DASHBOARD.root,
        icon: ICONS.analytics
      },
      // {
      //   title: 'Inventario',
      //   icon: ICONS.inventariokardex,
      //   children: [
      //     { title: 'Productos', path: PATH_DASHBOARD.root },
      //     { title: 'Transf. Productos', path: PATH_DASHBOARD.root },
      //     { title: 'Precios', path: PATH_OPSISTEMA.invetario.ajusteprecio },
      //     { title: 'Categorias', path: PATH_DASHBOARD.kanban },
      //     { title: 'Familias', path: PATH_DASHBOARD.root },
      //     { title: 'Lineas', path: PATH_DASHBOARD.root },
      //     { title: 'Marcas', path: PATH_DASHBOARD.root },
      //     { title: 'Presentacion', path: PATH_DASHBOARD.root },
      //   ],
      // },
      // {
      //   title: 'Reportes',
      //   icon: ICONS.invoice,
      //   children: [
      //     { title: 'Informes de stock', path: PATH_DASHBOARD.root },
      //     { title: 'Saldos de clientes', path: PATH_DASHBOARD.root },
      //     { title: 'Ventas por cajas', path: PATH_DASHBOARD.root },
      //     { title: 'Pag. Realizados por cliente', path: PATH_DASHBOARD.root },
      //   ],
      // },
      // {
      //   title: 'Parametros',
      //   icon: ICONS.kanban,
      //   children: [
      //     { title: 'Permisos', path: PATH_OPSISTEMA.parametros.permisos },
      //     { title: 'Usuarios', path: PATH_DASHBOARD.root },
      //   ],
      // },
      // ...navlist,
      // ...navlistdef

    ],
  },
];
export default navConfig;
