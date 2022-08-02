import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
// import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import { useSnackbar } from 'notistack';
import { Card, Box, TextField, MenuItem, Grid, Fade, Typography, CardContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import MotivationIllustration from '../../../../assets/illustration_motivation';
import EcommerceNewProducts from '../../../@dashboard/general/e-commerce/EcommerceNewProducts';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import CircularProgreso from '../../../../components/Cargando';

SucursalDashboard.propTypes = {
    disparador: PropTypes.func,
    estadoinicial: PropTypes.object,
}
const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.lighter,
    [theme.breakpoints.up('md')]: {
        height: '100%',
        display: 'flex',
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
}));

function SucursalDashboard(props) {
    const { disparador, estadoinicial } = props;
    const [listarsucursal, setListarSucursal] = React.useState([]);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const [sucursal, setSucursal] = React.useState(1);
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
    React.useEffect(() => {
        async function obtenerSucursales() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/sucursales/listar`, setMostrarProgreso(true));
                setListarSucursal(data);

            } catch (error) {
                mensajeSistema("Problemas de Conexion con el servidor", "error");
            } finally {
                setMostrarProgreso(false)
            }
        }
        // obtenerSucursales();
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
                <Box sx={{ mt: 1, mb: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item md={6} xs={12}>

                            <RootStyle>
                                <CardContent
                                    sx={{
                                        color: 'grey.800',
                                        p: { md: 0 },
                                        pl: { md: 5 }
                                    }}
                                >
                                    <Typography gutterBottom variant="h4">
                                        Gestiona tu personal de manera eficiente con
                                        <br /> GENESIS
                                    </Typography>

                                    <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
                                        La tecnologia al alcance de tus manos
                                    </Typography>

                                    <Box >
                                        <TextField
                                            variant="standard"
                                            select
                                            label="Sucursal"
                                            fullWidth
                                            size="small"
                                            value={sucursal}
                                            onChange={(e) => {
                                                setSucursal(e.target.value)
                                                disparador(e.target.value)
                                            }}
                                        >
                                            {
                                                listarsucursal.map(s => (
                                                    <MenuItem key={s.codigo} value={s.codigo}>{s.nombre}</MenuItem>
                                                ))
                                            }
                                            <MenuItem value={1}>MATRIZ</MenuItem>
                                        </TextField>
                                    </Box>
                                </CardContent>

                                <MotivationIllustration
                                    sx={{
                                        p: 3,
                                        width: 360,
                                        margin: { xs: 'auto', md: 'inherit' }
                                    }}
                                />
                            </RootStyle>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <EcommerceNewProducts />
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        </>
    )
}

export default React.memo(SucursalDashboard);
