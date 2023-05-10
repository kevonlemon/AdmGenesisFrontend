import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Prestamos = Loadable(lazy(() => import('../../../sections/admnomina/procesos/prestamos/prestamos')));

const Beneficiosocial = Loadable(
  lazy(() => import('../../../sections/admnomina/procesos/beneficiosocial/beneficiosocial'))
);

const SolicitudDocumentos = Loadable(
  lazy(() => import('../../../sections/admnomina/procesos/solicituddocumentos/SolicitudDocumento'))
);

const AprobacionSolicitud = Loadable(
  lazy(() => import('../../../sections/admnomina/procesos/aprobacionsolicitud/AprobacionSolicitudes'))
);

const RegistroRol = Loadable(lazy(() => import('../../../sections/admnomina/procesos/registrorol/registrorol')));

const ContratoEmpleado = Loadable(
  lazy(() => import('../../../sections/admnomina/procesos/contratoempleados/ContratoEmpleado'))
);

const ControlHorarios = Loadable(
  lazy(() => import('../../../sections/admnomina/procesos/controlhorarios/ControlHorarios'))
);

const Biometrico = Loadable(
  lazy(() => import('../../../sections/admnomina/procesos/biometrico/Biometrico'))
);

export const PROCESOS = [
  // {
  //     url: '/dashboard',
  //     element: <Inicio />
  // },
  {
    url: '/beneficiosocial',
    element: <Beneficiosocial />,
  },
  {
    url: '/prestamos',
    element: <Prestamos />,
  },
  {
    url: '/solicituddocumentos',
    element: <SolicitudDocumentos />,
  },
  {
    url: '/aprobacionsolicitud',
    element: <AprobacionSolicitud />,
  },
  {
    url: '/registrorol',
    element: <RegistroRol />,
  },
  {
    url: '/contratoempleado',
    element: <ContratoEmpleado />,
  },
  {
    url: '/controlhorarios',
    element: <ControlHorarios />,
  },
  {
    url: '/biometrico',
    element: <Biometrico />,
  },
];
