import { TextField, Grid, Card, FormControlLabel, Checkbox, Fade, InputAdornment, IconButton } from "@mui/material";
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
// import axiosInst from "../../../../../../utils/axiosBirobid";




export default function FormularioContador() {
    document.body.style.overflowX = "hidden";
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${usuario.token}`
        }
    }
    const navegacion = useNavigate();
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
    const [errorcorreo, setErrorcorreo] = React.useState(false);
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
                if (data[0].Representante_legal === '') mensajeSistema("No se encontro ninguna identificacion", "error")
                setFormulario({
                    ...formulario,
                    ruc: data[0].Num_ruc,
                    cedula: data[0].Representante_legal,
                    nombre: data[0].Agente_representante !== '' ? data[0].Agente_representante : data[0].Razon_social,
                    direccion: data[0].Direccion_completa,
                })
            } else {
                mensajeSistema("No se encontro ninguna identificacion", "error")
                limpiarCampos();
            }
        } catch (error) {
            mensajeSistema("No se encontro ninguna identificacion", "error")
        } finally {
            setMostrarProgreso(false)
        }

    };
    // METODO PARA LIMPIAR LOS CAMPOS
    const limpiarCampos = () => {
        setFormulario({
            codigo: 0,
            ruc: "",
            cedula: "",
            nombre: "",
            direccion: "",
            telefono: "",
            correo: "",
            // fecha_Ingreso: new Date(),
            // fecha_Salida: new Date(),
            registro: "",
            estado: true
        })
        setError(false);
        setErrorcorreo(false);
        // setTelefono(false);
        // navegacion(`${PATH_DASHBOARD.nuevocontador}`)
    }

    // GUARDAR INFORMACION
    const Grabar = async () => {
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
                const { data } = await axios.post(`${URLAPIGENERAL}/contadores`, formulario, config, setMostrarProgreso(true));
                if (data === 200) {
                    mensajeSistema("Registros guardado correctamente", "success");
                    navegacion(`/sistema/parametros/contador`);
                    setError(false);
                }

            }
        } catch (error) {
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesion expiro", "error");
            }
            else if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            } else {
                mensajeSistema("Problemas al guardar verifique si se encuentra registrado", "error");
            }
        } finally {
            setMostrarProgreso(false);
        }
    }
    const Volver = () => {
        navegacion(`/sistema/parametros/contador`);
    }
    return (
        <>
            <Page title="Contadores">
                <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
                <MenuMantenimiento
                    modo
                    nuevo={() => limpiarCampos()}
                    grabar={() => Grabar()}
                    volver={() => Volver()}
                />
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
                        <h1>Nuevo de Contador</h1>
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
                                            // error={error}
                                            disabled
                                            fullWidth
                                            size="small"
                                            label="Codigo"
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true
                                            }}
                                            sx={{
                                                backgroundColor: "#e5e8eb",
                                                border: "none",
                                                borderRadius: '10px',
                                                color: "#212B36"
                                            }}
                                        // value="-----"
                                        />
                                    </Grid>
                                    <Grid item md={3} sm={4} xs={12}>
                                        <RequiredTextField
                                            error={error}
                                            fullWidth
                                            type="number"
                                            size="small"
                                            label="Ruc*"
                                            variant="outlined"
                                            // inputProps={{  }}
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
                                                inputMode: 'numeric', pattern: '[0-9]*',
                                                // inputProps: { min: "0", max: "10"}
                                            }}
                                        />

                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={2} sm={3} xs={12}>
                                        <RequiredTextField
                                            error={error}
                                            fullWidth
                                            // inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            InputProps={{
                                                inputMode: 'numeric', pattern: '[0-9]*',
                                            }}
                                            type="number"
                                            size="small"
                                            label="Cedula*"
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
                                        <RequiredTextField
                                            error={error}
                                            fullWidth
                                            size="small"
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
                                        <RequiredTextField
                                            error={error}
                                            fullWidth
                                            size="small"
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
                                        <RequiredTextField
                                            error={error}
                                            fullWidth
                                            size="small"
                                            type="number"
                                            label="Telefono*"
                                            helperText="Solo numero"
                                            variant="outlined"
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    telefono: e.target.value
                                                })
                                            }}
                                            InputProps={{
                                                inputMode: 'numeric', pattern: '[0-9]*',
                                            }}
                                            value={formulario.telefono}
                                        />
                                    </Grid>
                                    <Grid item md={4} sm={5} xs={12}>
                                        <RequiredTextField
                                            error={errorcorreo}
                                            fullWidth
                                            size="small"
                                            type="email"
                                            label="Correo*"
                                            variant="outlined"
                                            helperText={errorcorreo ? "correo invalido: example@example.com" : ''}
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                if (!esCorreo(input)) setErrorcorreo(true);
                                                else setErrorcorreo(false);
                                                setFormulario({
                                                    ...formulario,
                                                    correo: input
                                                })
                                                // setValue(input)
                                            }}
                                            value={formulario.correo}
                                        />
                                        {/* <FormCorreo
                                            correo={formulario.correo}
                                            setcorreo={(e) => {
                                                setFormulario({ ...formulario, correo: e })
                                            }}
                                            nuevo={nuevo}
                                        /> */}
                                    </Grid>
                                </Grid>
                                <Grid container item xs={12} spacing={1}>
                                    <Grid item md={2} sm={5} xs={12}>
                                        <RequiredTextField
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
                                            control={<Checkbox defaultChecked disabled />} label="Activo" />
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