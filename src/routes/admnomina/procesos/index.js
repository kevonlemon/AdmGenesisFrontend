import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Prestamos = Loadable(lazy(() => import('../../../sections/admnomina/procesos/prestamos/prestamos')));

const Beneficiosocial = Loadable(lazy(() => import('../../../sections/admnomina/procesos/beneficiosocial/beneficiosocial')));

export const PROCESOS = [
    // {
    //     url: '/dashboard',
    //     element: <Inicio />
    // },
    {


        url: '/beneficiosocial',
        element: <Beneficiosocial />

    },
    {

        url: '/prestamos',
        element: <Prestamos />
    }
]