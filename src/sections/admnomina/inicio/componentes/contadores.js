import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Grid } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { AppWidgetSummary } from '../../../@dashboard/general/app';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import CircularProgreso from '../../../../components/Cargando';

ContadoresDashboard.propTypes = {
    etiqueta: PropTypes.string,
    buscar: PropTypes.string,
    sucursal: PropTypes.number,
}

function ContadoresDashboard(props) {
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
    const { etiqueta, sucursal, buscar } = props;
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const [contador, setContador] = React.useState(0);
    const theme = useTheme();

    React.useEffect(() => {
        async function obtenerContador() {
            try {
                const { data } = await axios(`${URLAPILOCAL}/dashboard/obtener?sucursal=${sucursal}`);
                let contador = 0
                if (`${buscar}`.toLocaleLowerCase() === 'cliente') contador = data.total_clienteshoy;
                if (`${buscar}`.toLocaleLowerCase() === 'ventdirecta') contador = data.total_venta_directa;
                if (`${buscar}`.toLocaleLowerCase() === 'ventdirectapos') contador = data.total_venta_directapos;
                if (`${buscar}`.toLocaleLowerCase() === 'deuda') contador = data.total_deudores;

                setContador(contador);
            } catch{
                mensajeSistema("Problemas de Conexion con el servidor", "error");
            } finally {
                setMostrarProgreso(false)
            }

        }
        // obtenerContador();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buscar,sucursal])
    return (
        <>
            <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
            <Grid item md={6} xs={12}>
                <AppWidgetSummary
                    title={etiqueta}
                    percent={15}
                    total={contador}
                    chartColor={theme.palette.primary.main}
                    chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]} />
            </Grid>
        </>

    );
}

export default React.memo(ContadoresDashboard);