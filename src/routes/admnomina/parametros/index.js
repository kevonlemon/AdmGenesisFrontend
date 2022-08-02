import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';

const Contador = Loadable(lazy(() => import('../../../sections/admnomina/parametros/contador/contador')));
const NuevoContador = Loadable(lazy(() => import('../../../sections/admnomina/parametros/contador/nuevocontador/nuevocontador')));
const EditarContador = Loadable(lazy(() => import('../../../sections/admnomina/parametros/contador/editarcontador/editarcontador')));

const Representante = Loadable(lazy(() => import('../../../sections/admnomina/parametros/representante/representante')));
const NuevoRepresentante = Loadable(lazy(() => import('../../../sections/admnomina/parametros/representante/nuevorepresentante/nuevorepresentante')));
const EditarRepresentante = Loadable(lazy(() => import('../../../sections/admnomina/parametros/representante/editarrepresentante/editarrepresentante')));

const Sucursal = Loadable(lazy(() => import('../../../sections/admnomina/parametros/sucursal/sucursal')));
const NuevoSucursal = Loadable(lazy(() => import('../../../sections/admnomina/parametros/sucursal/nuevosucursal/nuevosucursal')));
const EditarSucursal = Loadable(lazy(() => import('../../../sections/admnomina/parametros/sucursal/editarsucursal/editarsucursal')));

const Empresa = Loadable(lazy(() => import('../../../sections/admnomina/parametros/empresa/empresa')));

const MantenimientoGenerico = Loadable(lazy(() => import('../../../sections/admnomina/parametros/mantenimientogenerico/mantenimientogenerico')));
const NuevoMantenimientoGenerico = Loadable(lazy(() => import('../../../sections/admnomina/parametros/mantenimientogenerico/nuevomantenimiento/nuevomantenimiento')));
const EditarMantenimientoGenerico = Loadable(lazy(() => import('../../../sections/admnomina/parametros/mantenimientogenerico/editarmantenimiento/editarmantenimiento')));

const Banco = Loadable(lazy(() => import('../../../sections/admnomina/parametros/bancocia/bancocia')));
const NuevoBanco = Loadable(lazy(() => import('../../../sections/admnomina/parametros/bancocia/nuevobancocia/nuevobancocia')));
const EditarBanco = Loadable(lazy(() => import('../../../sections/admnomina/parametros/bancocia/editarbancocia/editarbancocia')));

const Persona = Loadable(lazy(() => import('../../../sections/admnomina/parametros/persona/persona')));
const NuevoPersona = Loadable(lazy(() => import('../../../sections/admnomina/parametros/persona/nuevoregistropersona/nuevoregistropersona')));
const EditarPersona = Loadable(lazy(() => import('../../../sections/admnomina/parametros/persona/editarregistropersona/editarregistropersona')));

const Empleado = Loadable(lazy(() => import('../../../sections/admnomina/parametros/empleado/empleado')));
const FormularioEmpleado = Loadable(lazy(() => import('../../../sections/admnomina/parametros/empleado/formulario/formularioempleado')));
// const EditarEmpleado = Loadable(lazy(() => import('../../../sections/admnomina/parametros/persona/editarregistropersona/editarregistropersona')));




export const PARAMETROS = [
    {
        url: '/contador',
        element: <Contador />
    },
    {
        url: '/nuevocontador',
        element: <NuevoContador />
    },
    {
        url: '/editarcontador',
        element: <EditarContador />
    },

    {
        url: '/representante',
        element: <Representante />
    },
    {
        url: '/nuevorepresentante',
        element: <NuevoRepresentante />
    },
    {
        url: '/editarrepresentante',
        element: <EditarRepresentante />
    },

    {
        url: '/sucursal',
        element: <Sucursal />
    },
    {
        url: '/nuevosucursal',
        element: <NuevoSucursal />
    },
    {
        url: '/editarsucursal',
        element: <EditarSucursal />
    },

    {
        url: '/empresa',
        element: <Empresa />
    },

    {
        url: '/generico',
        element: <MantenimientoGenerico />
    },
    {
        url: '/nuevogenerico',
        element: <NuevoMantenimientoGenerico />
    },
    {
        url: '/editargenerico',
        element: <EditarMantenimientoGenerico />
    },

    {
        url: '/bancocia',
        element: <Banco />
    },
    {
        url: '/nuevobancocia',
        element: <NuevoBanco />
    },
    {
        url: '/editarbancocia',
        element: <EditarBanco />
    },

    {
        url: '/persona',
        element: <Persona />
    },
    {
        url: '/nuevopersona',
        element: <NuevoPersona />
    },
    {
        url: '/editarpersona',
        element: <EditarPersona />
    },
    {
        url: '/empleado',
        element: <Empleado />
    },
    {
        url: '/formularioempleado',
        element: <FormularioEmpleado />
    },
    // {
    //     url: '/editarempleado',
    //     element: <EditarEmpleado />
    // },
]