import { TextField, Grid, Card, FormControlLabel, Checkbox, Fade, InputAdornment, IconButton } from "@mui/material";
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { SearchRounded } from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from 'notistack';
import Page from '../../../../../components/Page'
import { URLAPIGENERAL, URLRUC } from "../../../../../config";
import { esCedula, noEsVacio, esCorreo } from "../../../../../utils/sistema/funciones";
import { MenuMantenimiento } from "../../../../../components/sistema/menumatenimiento";
import CircularProgreso from "../../../../../components/Cargando";
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths'
// import axiosInst from "../../../../../../utils/axiosBirobid";


export default function FormularioContador() {
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${usuario.token}`
        }
    }
    const navegacion = useNavigate()
    const { state } = useLocation()
    const { enqueueSnackbar } = useSnackbar();
    // MENSAJE GENERICO
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
    // MANEJADOR DE ERRORES
    const [error, setError] = React.useState(false);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    // FORMULARIO DE ENVIO
    const [formulario, setFormulario] = React.useState({
        codigo: 0,
        ruc: "",
        cedula: "",
        nombre: "",
        direccion: "",
        telefono: "",
        correo: "",
        registro: "",
        estado: true
    });
    // METODO PARA OBTENER EL RUC
    const consultarRuc = async () => {
        try {
            const { data } = await axios(`${URLRUC}GetRucs?id=${formulario.ruc}`, setMostrarProgreso(true))
            if (data.length > 0) {
                setFormulario({
                    ...formulario,
                    ruc: data[0].Num_ruc,
                    cedula: data[0].Representante_legal,
                    nombre: data[0].Agente_representante,
                    direccion: data[0].Direccion_completa,
                })
            } else {
                mensajeSistema("No se encontro ninguna identificacion", "error")
                // limpiarCampos();
            }
        } catch (error) {
            mensajeSistema("Revisar que la credencial sea la correcta", "error")
            // limpiarCampos();
        } finally {
            setMostrarProgreso(false);
        }

    };
    // GUARDAR INFORMACION
    const Grabar = async () => {
        // console.log(formulario)
        try {
            // VALIDACIONES
            const noesvacio = noEsVacio(formulario);
            const escedula = esCedula(formulario.cedula);
            const esruc = formulario.ruc.trim().length === 13;
            const escorreo = esCorreo(formulario.correo.trim());
            if (!noesvacio) {
                mensajeSistema("Complete los campos requeridos", "error");
                setError(true);
            }
            if (!escedula) {
                mensajeSistema("Verifique su cedula", "error");
                setError(true);
            }
            if (!escorreo) {
                mensajeSistema("Verifique su correo", "error");
                setError(true);
            }
            if (!esruc) {
                mensajeSistema("Verifique su ruc", "error");
                setError(true);
            }
            if (noesvacio && escorreo && escedula && esruc) {
                const { data } = await axios.post(`${URLAPIGENERAL}/contadores/editar`, formulario, config, setMostrarProgreso(true));
                if (data === 200) {
                    mensajeSistema("Registros guardado correctamente", "success");
                    navegacion(`/sistema/parametros/contador`);
                }
                setError(false);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesion expiro", "error");
            }
            else if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            } else{
                mensajeSistema("Problemas al guardar verifique si se encuentra registrado", "error");
            }
        } finally {
            setMostrarProgreso(false);
        }
    }
    const Volver = () => {
        navegacion(`/sistema/parametros/contador`);
    }
    const Nuevo = () => {
        navegacion(`/sistema/parametros/nuevocontador`);
    }

    React.useEffect(() => {
        async function obtenerContador() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/contadores/obtener?codigo=${state.id}`,config, setMostrarProgreso(true));
                setFormulario({
                    codigo: data.codigo,
                    ruc: data.ruc,
                    cedula: data.cedula,
                    nombre: data.nombre,
                    direccion: data.direccion,
                    telefono: data.telefono,
                    correo: data.correo,
                    fecha_Ingreso: new Date(),
                    fecha_Salida: new Date(),
                    registro: data.registro,
                    estado: data.estado
                })
            } catch {
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                else if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                } else{
                    mensajeSistema("Problemas con el servidor", "error");
                }
            } finally {
                setMostrarProgreso(false);
            }
        }
        obtenerContador()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.id])
    return (
        <>
            <Page title="Contadores">
                <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
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
                        <h1>Editar de Contador</h1>
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
                                    <Grid item md={2} sm={3} xs={12}>
                                        <TextField
                                            // error={false}
                                            fullWidth
                                            disabled
                                            size="small"
                                            type="text"
                                            label="Codigo"
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codigo: e.target.value
                                                })
                                            }}
                                            value={formulario.codigo}
                                        />
                                    </Grid>
                                    <Grid item md={3} sm={4} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label="Ruc*"
                                            variant="outlined"
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    ruc: e.target.value
                                                })
                                            }}
                                            value={formulario.ruc}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => consultarRuc()} size="small">
                                                            <SearchRounded />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                inputMode: 'numeric', pattern: '[0-9]*'
                                            }}
                                        />

                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={2} sm={3} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label="Cedula*"
                                            InputProps={{
                                                inputMode: 'numeric', pattern: '[0-9]*',
                                            }}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    cedula: e.target.value
                                                })
                                            }}
                                            value={formulario.cedula}
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
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    nombre: e.target.value.toLocaleUpperCase()
                                                })
                                            }}
                                            value={formulario.nombre}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={6} sm={8} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Direccion*"
                                            variant="outlined"
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    direccion: e.target.value.toLocaleUpperCase()
                                                })
                                            }}
                                            value={formulario.direccion}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={2} sm={3} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label="Telefono*"
                                            InputProps={{
                                                inputMode: 'numeric', pattern: '[0-9]*',
                                            }}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    telefono: e.target.value
                                                })
                                            }}
                                            value={formulario.telefono}
                                        />
                                    </Grid>
                                    <Grid item md={4} sm={5} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Correo*"
                                            variant="outlined"
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    correo: e.target.value
                                                })
                                            }}
                                            value={formulario.correo}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={2} sm={5} xs={12}>
                                        <TextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Registro*"

                                            variant="outlined"
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    registro: e.target.value
                                                })
                                            }}
                                            value={formulario.registro}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={2} xs={12}>
                                        <FormControlLabel
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    estado: e.target.checked
                                                })
                                            }}
                                            value={formulario.estado}
                                            control={<Checkbox checked={formulario.estado} />} label="Activo" />
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