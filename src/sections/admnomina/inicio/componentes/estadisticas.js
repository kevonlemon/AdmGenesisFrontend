import * as React from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Card, CardHeader, Box, TextField, MenuItem, Grid, Fade, Typography, Button, Stack, CardContent } from "@mui/material";
import merge from 'lodash/merge';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
import BaseOptionChart from '../../../../components/chart/BaseOptionChart'
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import CircularProgreso from '../../../../components/Cargando';

EstadisticasDashboard.propTypes = {
    sucursal: PropTypes.number,
}

function EstadisticasDashboard(props) {
    // MENSAJE GENERICO
    const { enqueueSnackbar } = useSnackbar();
    const mensajeSistema = (mensaje, variante) => {
        enqueueSnackbar(mensaje,
            {
                variant: variante,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
            }
        )
    }
    const { sucursal } = props;
    const [ventas, setVentas] = React.useState([]);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const [compras, setCompras] = React.useState([]);
    const CHART_DATA = [
        {
            year: 2019,
            data: [
                // { name: 'Ventas', data: ventas },
                // { name: 'Compras', data: compras },
                { name: 'Anticipos', data: [148, 91, 69, 62, 49, 51, 115, 141, 180] },
                { name: 'Prestamos', data: [45, 77, 99, 88, 77, 56, 113, 134, 180] },
            ],

        },
        {
            year: 2020,
            data: [
                { name: 'Ventas', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                { name: 'Compras', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
            ],
        },
    ];
    const [seriesData, setSeriesData] = useState(2019);

    // const handleChangeSeriesData = (event) => {
    //     setSeriesData(Number(event.target.value));
    // };

    const chartOptions = merge(BaseOptionChart(), {
        xaxis: {
            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            // categories: mesventas
        },

    });
    // PETECIONES 
    React.useEffect(() => {
        async function obtenerVentas() {
            try {
                const mventas = []; // lista que almacena el mes y el valor de ese mes
                const { data } = await axios(`${URLAPILOCAL}/dashboard/ventas?sucursal=1`, setMostrarProgreso(true));
                const ventas = data.map(v => ({ ventas: v.ventas, mes: v.mesventas }));
                ventas.forEach(v => {
                    mventas.push([v.mes, v.ventas]);
                })
                const miarray = Array.from({ length: 12 }, () => 0);
                mventas.forEach(s => {
                    miarray[s[0] - 1] = s[1]
                })
                setVentas(miarray);

            } catch (error) {
                mensajeSistema("Problemas de Conexion con el servidor", "error");
            } finally {
                setMostrarProgreso(false)
            }

        }
        async function obtenerCompras() {
            try {
                const mcompras = []; // lista que almacena el mes y el valor de ese mes
                const { data } = await axios(`${URLAPILOCAL}/dashboard/compras?sucursal=1`, setMostrarProgreso(true));
                const compras = data.map(v => ({ compras: v.compras, mes: v.mescompras }));
                compras.forEach(v => {
                    mcompras.push([v.mes, v.compras]);
                })
                const miarray = Array.from({ length: 12 }, () => 0);
                mcompras.forEach(s => {
                    miarray[s[0] - 1] = s[1]
                })
                setCompras(miarray);

            } catch (error) {
                mensajeSistema("Problemas de Conexion con el servidor", "error");
            } finally {
                setMostrarProgreso(false)
            }

        }
        // obtenerVentas();
        // obtenerCompras();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
            <Fade
                in
                style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <Box sx={{ mt: 1, mb: 1 }} >
                    <Card>
                        <CardHeader
                            title="Estadisticas"
                            subheader="(+43%) que el año pasado"
                        // action={
                        //     <TextField
                        //         select
                        //         fullWidth
                        //         value={seriesData}
                        //         SelectProps={{ native: true }}
                        //         onChange={handleChangeSeriesData}
                        //         sx={{
                        //             '& fieldset': { border: '0 !important' },
                        //             '& select': {
                        //                 pl: 1,
                        //                 py: 0.5,
                        //                 pr: '24px !important',
                        //                 typography: 'subtitle2',
                        //             },
                        //             '& .MuiOutlinedInput-root': {
                        //                 borderRadius: 0.75,
                        //                 bgcolor: 'background.neutral',
                        //             },
                        //             '& .MuiNativeSelect-icon': {
                        //                 top: 4,
                        //                 right: 0,
                        //                 width: 20,
                        //                 height: 20,
                        //             },
                        //         }}
                        //     >
                        //         {CHART_DATA.map((option) => (
                        //             <option key={option.year} value={option.year}>
                        //                 {option.year}
                        //             </option>
                        //         ))}
                        //     </TextField>
                        // }
                        />

                        {CHART_DATA.map((item) => (
                            <Box key={item.year} sx={{ mt: 3, mx: 3 }} >
                                {item.year === seriesData && (
                                    <ReactApexChart type="area" series={item.data} options={chartOptions} height={350} />
                                )}
                            </Box>
                        ))}
                    </Card>
                </Box>
            </Fade>
        </>
    );
}

export default React.memo(EstadisticasDashboard);