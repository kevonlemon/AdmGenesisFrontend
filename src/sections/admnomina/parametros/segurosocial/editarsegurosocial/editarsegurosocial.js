import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Grid, TextField, Box, Card, Fade, Checkbox, FormControlLabel, Button, MenuItem, InputAdornment } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircle';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import { useSnackbar } from 'notistack';
import CircularProgreso from '../../../../../components/Cargando';
// import { MenuMantenimiento } from "../../../../../sistema/componentes/opciones";
import { PATH_DASHBOARD, PATH_OPSISTEMA } from '../../../../../routes/paths';
import { URLAPIGENERAL, CORS } from '../../../../../config';
import Page from '../../../../../components/Page';

export default function newnominasegurosocial() {



    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navegacion = useNavigate();
    // MANEJADOR DE ERRORES
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error1, setError1] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error2, setError2] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error3, setError3] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error4, setError4] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error5, setError5] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { state } = useLocation()



    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { enqueueSnackbar } = useSnackbar();

    const messajeTool = (variant, msg) => {
        enqueueSnackbar(msg, {
            variant, anchorOrigin: { vertical: 'top', horizontal: 'center' },
            autoHideDuration: 5000
        });
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [numerosecuencial, setNumeroSecuencial] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mostrarprogreso, setMostrarProgreso] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dataNuevo, setnuevo] = useState({
        codigo: '',
        nombre: '',
        factor: 0,
        mespago: 0,
        porcentaje: 0, // float
        tipo: '',
        ingegremp: '', // cuenta
        estado: false,
        aplicarol: false,
        segurosocial: false,
        sistema: false,
        aplica: false
    });
    const limpiar = () => {
        setnuevo({
            codigo: dataNuevo.codigo,
            nombre: '',
            factor: 0,
            mespago: 0,
            porcentaje: 0, // float
            tipo: '',
            ingegremp: '',
            estado: false,
            aplicarol: false,
            segurosocial: false,
            sistema: false,
            aplica: false
        });
        setError(false);
        setError1(false);
        setError2(false);
        setError3(false);
        setError4(false);
        setError5(false);

    };

    const SelecTipo = (e) => {
        const cuentaselect = e.target.value;
        setnuevo({ ...dataNuevo, tipo: `${cuentaselect}` });
        setError1(false);
    }

    const cuenta = [
        {
            codigo: 'I',
            nombre: 'INGRESO',
        },
        {
            codigo: 'E',
            nombre: 'EGRESO',
        },
    ];


    const selectCuenta = (e) => {
        const tipocuenta = e.target.value;
        setnuevo({ ...dataNuevo, ingegremp: tipocuenta });
        setError2(false);
    }

    const tipo = [
        {
            codigo: 'BEN',
            nombre: 'BENEFICIO',
        },
        {
            codigo: 'APO',
            nombre: 'APORTACIÓN',
        },
    ];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        async function obtenerContador() {
            // eslint-disable-next-line camelcase
            const { token } = JSON.parse(window.localStorage.getItem('usuario'));
            try {
                const { data } = await axios(`${URLAPIGENERAL}/segurosocial/obtener?codigo=${state.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }, setMostrarProgreso(true));


                setnuevo({

                    codigo: data.codigo,
                    nombre: data.nombre,
                    factor: data.factor,
                    mespago: data.mesPago,
                    porcentaje: data.porcentaje, // float
                    tipo: data.tipo.trim(),
                    ingegremp: data.ingEgrEmp.trim(), // cuenta
                    estado: data.estado,
                    aplicarol: data.aplicaRol,
                    segurosocial: data.seguroSocial,
                    sistema: data.sistema,
                    aplica: data.aplica
                });




            } catch {
                messajeTool("Problemas de conexion con la base de datos", "error");
            } finally {
                setMostrarProgreso(false);
            }
        }
        obtenerContador()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.id])

    const validation = () => {

        // Validar nombre
        const nombre = dataNuevo.nombre.length;

        if (nombre < 3) { messajeTool('error', 'El Nombre debe tener al menos 3 caracteres.'); setError(true); return false; }

        if (nombre === '') { messajeTool('error', 'Debe asignar un nombre al seguro social.'); setError(true); return false; }


        // Validar tipo
        const tipoval = dataNuevo.tipo;
        if (tipoval === '') { messajeTool('error', 'Debe asignar un tipo.'); setError1(true); return false; }

        // Validar tipocuenta
        const ingegrempval = dataNuevo.ingegremp;
        if (ingegrempval === '') { messajeTool('error', 'Debe asignar una cuenta.'); setError2(true); return false; }

        // Validar nombre
        const factorval = dataNuevo.factor;
        if (factorval === '') { messajeTool('error', 'Debe ingresr un valor factor.'); setError3(true); return false; }


        // Validar mes pago
        const mespagoval = dataNuevo.mespago;
        if (mespagoval === '') { messajeTool('error', 'Debe ingresr un valor mes-pago.'); setError4(true); return false; }


        // Validar mes porcentaje
        const porcentajeval = dataNuevo.porcentaje;
        if (porcentajeval === '') { messajeTool('error', 'Debe ingresr un valor porcentaje.'); setError5(true); return false; }


        return true;
    };


    const Grabar = async () => {
        if (validation() === false) {
            return 0;
        }



        setMostrarProgreso(true);
        try {
            const Json = {
                codigo: dataNuevo.codigo,
                Nombre: dataNuevo.nombre,
                Factor: parseInt(dataNuevo.factor, 10),
                MesPago: parseInt(dataNuevo.mespago, 10),
                AplicaRol: dataNuevo.aplicarol,
                SeguroSocial: dataNuevo.segurosocial,
                Estado: dataNuevo.estado,
                Sistema: dataNuevo.sistema,
                Tipo: dataNuevo.tipo.trim(),
                IngEgrEmp: dataNuevo.ingegremp.trim(),
                Porcentaje: parseFloat(dataNuevo.porcentaje),
                Aplica: dataNuevo.aplica
            };

            // eslint-disable-next-line camelcase
            const { token } = JSON.parse(window.localStorage.getItem('usuario'));

            const { data } = await axios.post(`${URLAPIGENERAL}/segurosocial/editar`, Json, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data === 200) {
                navegacion(`/sistema/parametros/segurosocial`);
                messajeTool('success', 'Actualizado con exito!!');
            }

        } catch (error) {
            if (error.response.status === 401) {
                navegacion(`/auth/login`);
                messajeTool('error', 'Su inicio de sesión expiro.');
            }
            if (error.response.status !== 401) {
                messajeTool('error', 'Error al Grabar en el servidor');
            }
        } finally {
            setMostrarProgreso(false);
        }

    };


    const generarCodigo = (letra, num) => {
        const ceros = '0000';

        const nums = num.toString();

        const cero1 = ceros.split('');

        // eslint-disable-next-line no-plusplus
        for (let step = 0; step < nums.length; step++) {
            cero1.pop();
        }

        const cero2 = cero1.join('');
        return `${letra}${cero2}${num}`;
    };

    const Volver = () => {
        navegacion(`/sistema/parametros/segurosocial`);

    }

    const Nuevo = () => {
        navegacion(`/sistema/parametros/nuevosegurosocial`);

    }

    return (
        <>
            <CircularProgreso
                open={mostrarprogreso}
                handleClose1={() => {
                    setMostrarProgreso(false);
                }}
            />
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Page title="Editar Seguro Social">
                    {/* <MenuMantenimiento
                    modo
                    nuevo={() => limpiar()}
                    grabar={() => Grabar()}
                    volver={() =>  volver()}
                /> */}
                    <Box sx={{ ml: 3, mr: 3, p: 0 }}>
                        <Grid container spacing={1} justifyContent="flex-end">
                            <Grid item md={1.2} sm={2} xs={6}>
                                <Button
                                    fullWidth
                                    name=""
                                    variant="text"
                                    size='small'
                                    onClick={Nuevo}
                                    startIcon={<AddCircleRoundedIcon />}
                                >
                                    Nuevo
                                </Button>
                            </Grid>
                            <Grid item md={1.2} sm={2} xs={6}>
                                <Button fullWidth variant="text" size='small' startIcon={<SaveRoundedIcon />} onClick={Grabar}>
                                    Grabar
                                </Button>
                            </Grid>
                            <Grid item md={1.2} sm={2} xs={12}>
                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={Volver}
                                    size='small'
                                    startIcon={<ArrowCircleLeftRoundedIcon />}
                                >
                                    Volver
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
                        <h1>Editar Seguro Social</h1>
                    </Box>
                    <Card sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
                        <Box sx={{ width: '100%', p: 2 }}>
                            <Grid container spacing={2} justifyContent="flex-start" style={{ fontWeight: '400px' }}>
                                <Grid item container spacing={1} md={6}>
                                    <Grid item sm={3} xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            required
                                            name="codigo"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            label="Código"
                                            value={dataNuevo.codigo}
                                            id="outlined-size-small"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid item sm={9} xs={12} md={8}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            required
                                            label="Nombre"
                                            onChange={(e) => {
                                                setnuevo({
                                                    ...dataNuevo,
                                                    nombre: e.target.value.toLocaleUpperCase(),
                                                });
                                                setError(false);
                                            }}
                                            value={dataNuevo.nombre}
                                            id="outlined-size-small"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid item sm={12} xs={12} md={12}>
                                        <Grid container direction="row" spacing={2} alignItems="center">
                                            <Grid item sm={6} xs={6} md={6}>
                                                <TextField
                                                    error={error1}
                                                    fullWidth
                                                    required
                                                    select
                                                    label="Tipo"
                                                    id="outlined-size-small"
                                                    size="small"
                                                    onChange={SelecTipo}
                                                    value={dataNuevo.tipo}
                                                >
                                                    {
                                                        Object.values(tipo).map(
                                                            (val) => (
                                                                <MenuItem key={val.codigo} value={val.codigo}>{val.nombre}</MenuItem>

                                                            )
                                                        )
                                                    }
                                                </TextField>
                                            </Grid>
                                            <Grid item sm={6} xs={6} md={6}>
                                                <TextField
                                                    error={error2}
                                                    fullWidth
                                                    required
                                                    select
                                                    label="Ingreso / Egreso"
                                                    id="outlined-size-small"
                                                    size="small"
                                                    onChange={selectCuenta}
                                                    value={dataNuevo.ingegremp}
                                                >
                                                    {
                                                        Object.values(cuenta).map(
                                                            (val) => (
                                                                <MenuItem key={val.nombre} value={val.codigo}>{val.nombre}</MenuItem>

                                                            )
                                                        )
                                                    }
                                                </TextField>
                                            </Grid>
                                        </Grid>

                                    </Grid>



                                    <Grid item sm={4} xs={12} md={4}>
                                        <TextField
                                            error={error3}
                                            fullWidth
                                            required
                                            type="Number"
                                            label="Factor"
                                            onChange={(e) => {
                                                setnuevo({
                                                    ...dataNuevo,
                                                    factor: e.target.value,
                                                });
                                                setError(false);
                                            }}
                                            value={dataNuevo.factor}
                                            id="outlined-size-small"
                                            size="small"
                                        />
                                    </Grid>

                                    <Grid item sm={4} xs={12} md={4}>
                                        <TextField
                                            error={error4}
                                            fullWidth
                                            type="Number"
                                            required
                                            label="Mes Pago"
                                            onChange={(e) => {
                                                setnuevo({
                                                    ...dataNuevo,
                                                    mespago: e.target.value,
                                                });
                                                setError(false);
                                            }}
                                            value={dataNuevo.mespago}
                                            id="outlined-size-small"
                                            size="small"
                                        />
                                    </Grid>


                                    <Grid item sm={4} xs={12} md={4}>
                                        <TextField
                                            error={error5}
                                            fullWidth
                                            required
                                            type="Number"
                                            label="Porcentaje"
                                            onChange={(e) => {
                                                setnuevo({
                                                    ...dataNuevo,
                                                    porcentaje: e.target.value,
                                                });
                                                setError(false);
                                            }}
                                            InputProps={{
                                                // readOnly: true,
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                            value={dataNuevo.porcentaje}
                                            id="outlined-size-small"
                                            size="small"
                                        />
                                    </Grid>


                                    {/* CHECKSBOX   */}

                                    <Grid item sm={12} xs={12} md={12}>
                                        <Grid container>
                                            <Grid item container direction="row" justifyContent="center" alignItems="center">
                                                <Grid item sm={4} xs={12} md={4}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataNuevo.aplicarol}
                                                                onChange={(e) => {
                                                                    setnuevo({ ...dataNuevo, aplicarol: e.target.checked });
                                                                }}
                                                            />
                                                        }
                                                        label="Aplica Rol"
                                                        name="estado"
                                                    />
                                                </Grid>


                                                <Grid item sm={4} xs={12} md={4}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataNuevo.segurosocial}
                                                                onChange={(e) => {
                                                                    setnuevo({ ...dataNuevo, segurosocial: e.target.checked });
                                                                }}
                                                            />
                                                        }
                                                        label="Seguro social"
                                                        name="estado"
                                                    />
                                                </Grid>

                                                <Grid item sm={4} xs={12} md={4}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataNuevo.estado}
                                                                onChange={(e) => {
                                                                    setnuevo({ ...dataNuevo, estado: e.target.checked });
                                                                }}
                                                            />
                                                        }
                                                        label="Activo"
                                                        name="estado"
                                                    />
                                                </Grid>

                                                <Grid item sm={4} xs={12} md={4}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataNuevo.sistema}
                                                                onChange={(e) => {
                                                                    setnuevo({ ...dataNuevo, sistema: e.target.checked });
                                                                }}
                                                            />
                                                        }
                                                        label="Sistema"
                                                        name="estado"
                                                    />
                                                </Grid>

                                                <Grid item sm={4} xs={12} md={4}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={dataNuevo.aplica}
                                                                onChange={(e) => {
                                                                    setnuevo({ ...dataNuevo, aplica: e.target.checked });
                                                                }}
                                                            />
                                                        }
                                                        label="Aplica"
                                                        name="estado"
                                                    />
                                                </Grid>

                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                </Page>
            </Fade>
        </>
    );
}
