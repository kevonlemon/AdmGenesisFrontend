import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Prestamos = Loadable(lazy(() => import('../../../sections/admnomina/procesos/prestamos/prestamos')));

export const PROCESOS = [
    {
        url: '/prestamos',
        element: <Prestamos />
    }
]