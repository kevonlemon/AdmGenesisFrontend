import * as React from 'react';
import axios from 'axios';
import { Box, Grid, Fade } from '@mui/material';
import Page from '../../../components/Page';
// import { URLAPIGENERAL, URLAPILOCAL } from '../../../config';
// COMPONENTES
import SucursalDashboard from './componentes/sucursal';
// import ContadoresDashboard from './componentes/contadores';
import EstadisticasDashboard from './componentes/estadisticas';
// import GraficarPastel from './componentes/estadisticaspastel';
import Calendario from './componentes/calendario';

import { AppWidget } from '../../@dashboard/general/app';

// ----------------------------------------------------------------------

export default function Inicio() {
  document.body.style.overflowX = 'hidden';
  // HOOKS
  // SUCURSAL
  const [datos, setDatos] = React.useState({
    surcursal: 1,
    totalclientes: 0,
  });
  return (
    <>
      <Page title="Inicio">
        <Box m={2}>
          <SucursalDashboard disparador={(e) => setDatos({ ...datos, surcursal: e })} />
          <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
            <Grid container spacing={1}>
              <Grid item md={6} sm={6} xs={12}>
                <AppWidget title="Empleados" total={50} icon={'eva:person-fill'} chartData={48} />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <AppWidget
                  title="Prestamos"
                  total={100}
                  icon={'fa-solid:money-check-alt'}
                  color="warning"
                  chartData={70}
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <AppWidget
                  title="Antipicipos"
                  total={10}
                  icon={'fa6-solid:money-bill-transfer'}
                  color="success"
                  chartData={15}
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <AppWidget title="Nuevos Usuarios" total={5} icon={'eva:person-fill'} color="info" chartData={5} />
              </Grid>
            </Grid>
          </Fade>
          <EstadisticasDashboard />
          <Calendario />
          {/* <Fade
                        in
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={1000}
                    >
                        <Box sx={{ mt: 1, mb: 1 }} >
                            <Grid container spacing={1}>


                                <Grid item md={6} sm={12} xs={12}>
                                    <GraficarPastel
                                        titulo="Productos Mas Vendidos"
                                        tipoinformacion="producto"
                                        sucursal={datos.surcursal}
                                    />
                                </Grid>
                                <Grid item md={6} sm={12} xs={12}>
                                    <GraficarPastel
                                        titulo="Pagos Realizados"
                                        tipoinformacion="producto"
                                        sucursal={datos.surcursal}
                                    />
                                </Grid>
                            </Grid>

                        </Box>
                    </Fade> */}
        </Box>
      </Page>
    </>
  );
}
