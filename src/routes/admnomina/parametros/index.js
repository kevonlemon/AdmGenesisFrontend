import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Inicio = Loadable(lazy(() => import('../../../sections/admnomina/inicio/inicio')));

// ***************** DESARROLLADOR => Javier Caicedo *********************
// ========================== PARAMETROS ===================================

const Segurosocial = Loadable(lazy(() => import('../../../sections/admnomina/parametros/segurosocial/segurosocial')));
const Nuevosegurosocial = Loadable(lazy(() => import('../../../sections/admnomina/parametros/segurosocial/nuevosegurosicual/nuevosegurosocial')));
const Editarsegurosocial = Loadable(lazy(() => import('../../../sections/admnomina/parametros/segurosocial/editarsegurosocial/editarsegurosocial')));

export const PARAMETROS = [
    {
        url: '/dashboard',
        element: <Inicio />
    },
    {
        url: '/segurosocial',
        element: <Segurosocial />
    },
    {
        url: '/nuevosegurosocial',
        element: <Nuevosegurosocial />
    },
    {
        url: '/editarsegurosocial',
        element: <Editarsegurosocial />
    }
]