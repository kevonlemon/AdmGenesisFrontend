import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Inicio = Loadable(lazy(() => import('../../../sections/admnomina/inicio/inicio')));

const Beneficiosocial = Loadable(lazy(() => import('../../../sections/admnomina/procesos/beneficiosocial/beneficiosocial')));

export const PROCESOS = [
    // {
    //     url: '/dashboard',
    //     element: <Inicio />
    // },
    {
        url: '/beneficiosocial',
        element: <Beneficiosocial />
    }
]