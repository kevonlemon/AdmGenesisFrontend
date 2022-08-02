import { TextField, Grid, Card, FormControlLabel, MenuItem, Checkbox, Fade } from "@mui/material";
import * as React from 'react';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useSnackbar } from "notistack";
// import SearchRounded from "@mui/icons-material/SearchRounded";
import Page from '../../../../../components/Page';
import { URLAPIGENERAL } from "../../../../../config";
import { MenuMantenimiento } from "../../../../../components/sistema/menumatenimiento";
import CircularProgreso from '../../../../../components/Cargando';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths'

export default function Formulario() {
    document.body.style.overflowX = 'hidden';
    const navegacion = useNavigate();
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${usuario.token}`
        }
    }
    const { state } = useLocation();
    const datosobtenidos = state.datos;
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
    const [error, setError] = React.useState(false);
    const [mantenimientogenericobase, setMantenimientoGenericoBase] = React.useState([])
    // const [listarcuentascontables, setListarCuentasContables] = React.useState([]);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const [formulario, setFormulario] = React.useState({
        codigo: '',
        tabla: '',
        nombre: '',
        estado: true,
        aplCuentaContable: false,
        cuenta: '',
        nombre_cuenta: ''
    });

    // GUARDAR INFORMACION
    const Grabar = async () => {
        // console.log(formulario)
        try {
            if (formulario.nombre.trim().length > 0 && formulario.codigo.trim().length) {
                console.log(formulario)
                const { data } = await axios.post(`${URLAPIGENERAL}/mantenimientogenerico/editar`, formulario, config, setMostrarProgreso(true));
                if (data === 200) {
                    mensajeSistema("Registros guardado correctamente", "success");
                    navegacion(`/sistema/parametros/generico`);
                }
            } else {
                mensajeSistema("Complete los campos requeridos", "error");
                setError(true);
            }

        } catch (error) {
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesion expiro", "error");
            }
            else if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            } else {
                mensajeSistema("Error al guardar el registro. Verifique si ya existe", "error")
            }
        } finally {
            setMostrarProgreso(false);
        }
    }
    const Volver = () => {
        navegacion(`/sistema/parametros/generico`);
    }
    const Nuevo = () => {
        navegacion(`/sistema/parametros/nuevogenerico`);
    }
    React.useEffect(() => {
        async function obtenerManteminetosGenericoBase() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/mantenimientogenericobase/listar`, config, setMostrarProgreso(true));
                setMantenimientoGenericoBase(data);
            } catch (error) {
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                else if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                } else {
                    mensajeSistema("Problemas con el servidor", "error")
                }
            } finally {
                setMostrarProgreso(false)
            }

        }
        async function obtenerManteminetosGenerico() {
            try {
                // console.log(datosobtenidos)
                const { data } = await axios(`${URLAPIGENERAL}/mantenimientogenerico/obtener?codigo=${datosobtenidos.codigo}&tabla=${datosobtenidos.tabla}`, config, setMostrarProgreso(true))
                // console.log(data);
                setFormulario(data);
            } catch (error) {
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                else if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                } else {
                    mensajeSistema("Problemas con el servidor", "error")
                }
            } finally {
                setMostrarProgreso(false)
            }

        }

        obtenerManteminetosGenericoBase();
        obtenerManteminetosGenerico();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datosobtenidos.codigo, datosobtenidos.tabla])
    return (
        <>
            <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
            {/* MODAL DE PROVINCIA */}

            <Page title="Genericos">

                <MenuMantenimiento
                    modo={false}
                    nuevo={() => Nuevo()}
                    grabar={() => Grabar()}
                    volver={() => Volver()}
                />
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
                        <h1>Editar Mantenimiento Generico</h1>
                    </Box>
                </Fade>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }} >
                        <Box sx={{ width: '100%', p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            select
                                            label="Opcion"
                                            fullWidth
                                            size="small"
                                            disabled
                                            value={formulario.tabla}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    tabla: e.target.value
                                                })
                                            }}
                                        >
                                            {
                                                mantenimientogenericobase.map((m) =>
                                                    <MenuItem key={m.tabla} value={m.tabla.trim()}>{m.descripcion}</MenuItem>
                                                )
                                            }
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={2} sm={3} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Codigo*"
                                            variant="outlined"
                                            value={formulario.codigo}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codigo: String(e.target.value).toLocaleUpperCase()
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={4} sm={5} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Nombre*"
                                            variant="outlined"
                                            value={formulario.nombre}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    nombre: String(e.target.value).toLocaleUpperCase()
                                                })
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                {/* <Grid container item xs={12} spacing={1}>
                                    <Grid item md={2} sm={3} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Cuenta"
                                            variant="outlined"
                                            value={formulario.cuenta}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    cuenta: String(e.target.value).toLocaleUpperCase()
                                                })
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setOpenModalCuenta(true)} size="small" disabled={!aplcontable}>
                                                            <SearchRounded />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                readOnly: true
                                                // inputMode: 'numeric', pattern: '[0-9]*',
                                                // startAdornment: <InputAdornment position="start">{caja.cjid} -</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={4} sm={5} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Nombre"
                                            variant="outlined"
                                            value={formulario.nombre_cuenta}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    nombre_cuenta: String(e.target.value).toLocaleUpperCase()
                                                })
                                            }}
                                            InputProps={{
                                                readOnly: true
                                            }}
                                        />
                                    </Grid>
                                </Grid> */}
                                <Grid container item md={6} xs={12} spacing={1}>
                                    {/* <Grid item md={5} sm={6} xs={6}>
                                        <FormControlLabel
                                            value={formulario.aplCuentaContable}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    aplCuentaContable: e.target.checked,
                                                })
                                                // console.log(e.target.checked)
                                                // setAplContable(e.target.checked)
                                            }}
                                            control={<Checkbox />}
                                            label="Aplica Cta Contable" />
                                    </Grid> */}
                                    <Grid item md={4} sm={4} xs={6}>
                                        <FormControlLabel
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    estado: e.target.checked
                                                })
                                            }}
                                            value={formulario.estado}
                                            control={<Checkbox checked={formulario.estado} />} label="Estado" />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                </Fade>
            </Page>
        </>
    );
}