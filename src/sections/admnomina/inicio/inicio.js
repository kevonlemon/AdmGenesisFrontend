import * as React from 'react';
import axios from 'axios';
import { Box, Grid, Fade } from "@mui/material";
import Page from '../../../components/Page';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../config';
// COMPONENTES
import SucursalDashboard from './componentes/sucursal';
import ContadoresDashboard from './componentes/contadores';
import EstadisticasDashboard from './componentes/estadisticas';
import GraficarPastel from './componentes/estadisticaspastel';


// ----------------------------------------------------------------------



export default function Inicio() {
    document.body.style.overflowX = "hidden";
    // HOOKS
    // SUCURSAL
    const [datos, setDatos] = React.useState({
        surcursal: 1,
        totalclientes: 0
    });
    return (
        <>
            <Page title="Inicio">
                <Box m={2}>
                    <SucursalDashboard disparador={(e) => setDatos({ ...datos, surcursal: e })} />
                    <Fade
                        in
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={1000}
                    >
                        <Grid container spacing={1} direction="column">
                            <Grid item container md={6} sm={12} xs={12} spacing={1}>
                                <ContadoresDashboard sucursal={datos.surcursal} buscar="cliente" etiqueta="Empleados Nuevos" />
                                <ContadoresDashboard sucursal={datos.surcursal} buscar="ventdirecta" etiqueta="Prestamos Nuevos" />
                                <ContadoresDashboard sucursal={datos.surcursal} buscar="ventdirectapos" etiqueta="Anticipos Nuevos" />
                                {/* <ContadoresDashboard sucursal={datos.surcursal} buscar="deuda" etiqueta="Cuentas por Cobrar" /> */}
                            </Grid>
                        </Grid>
                    </Fade>
                    {/* <EstadisticasDashboard />
                    <Fade
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
    )
}