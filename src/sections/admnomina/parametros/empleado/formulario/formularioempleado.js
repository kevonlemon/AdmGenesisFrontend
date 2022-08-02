import { TextField, Grid, Card, MenuItem, FormControlLabel, Button, Checkbox, Fade, InputAdornment, IconButton, Typography, Box } from "@mui/material";
import * as React from 'react';
import { DataGrid, esES } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import es from "date-fns/locale/es";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SearchRounded } from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from 'notistack';
import Page from '../../../../../components/Page'
import { URLAPIGENERAL, URLRUC, URLAPILOCAL } from "../../../../../config";
import { esCedula, noEsVacio, esCorreo, formaterarFecha, generarCodigo, obtenerMaquina } from "../../../../../utils/sistema/funciones";
import { MenuMantenimiento } from "../../../../../components/sistema/menumatenimiento";
import CircularProgreso from "../../../../../components/Cargando";
import CajaGenerica from "../../../../../components/cajagenerica";
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths'
import { fCurrency } from '../../../../../utils/formatNumber';
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from "../../../../../utils/csssistema/estilos";
import { CustomNoRowsOverlay } from "../../../../../utils/csssistema/iconsdatagrid";

const meses = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Dicembre' }
]


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography variant="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function FormularioEmpleado() {
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
    // CERTIFICADOS COLUMNA
    const columns = [
        {
            field: 'button', headerName: 'Eliminar', width: 90,
            renderCell: (param) => (
                <Button
                    fullWidth
                    variant="text"
                    onClick={() => { eliminarCertficado(param) }}
                    startIcon={<CancelRoundedIcon />}
                />
            ),
        },
        { field: 'empleado', headerName: 'Empleado', width: 120 },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'empresaEmisora', headerName: 'Empresa', width: 100 },
        {
            field: 'caduca', headerName: 'Caduca', width: 100,
            renderCell: (param) =>
                param.row.caduca === true ? (
                    <Button variant="containded" style={styleActive}>
                        SI
                    </Button>
                ) : (
                    <Button variant="containded" style={styleInactive}>
                        NO
                    </Button>
                ),
        },
        {
            field: 'mesExpedicion', headerName: 'Mes', width: 100,
            valueFormatter: (params) => {
                const mes = meses.filter(f => f.id === params.value);
                return mes[0].nombre;
            },
        },
        { field: 'anioExpedicion', headerName: 'Año', width: 100 },
        {
            field: 'fechaCaducidad', headerName: 'Fecha', width: 100,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },

        { field: 'idCredencial', headerName: 'Credencial', width: 100 },
        { field: 'tipo', headerName: 'Tipo', width: 100 },
        { field: 'urlArchivo', headerName: 'Archivo', width: 100 },
    ];
    // COLUMNS
    const columns1 = [
        { field: 'empleado', headerName: 'Empleado', width: 120 },
        { field: 'parentezco', headerName: 'Parentezco', width: 120 },
        { field: 'nombres', headerName: 'Nombre', width: 300 },
        { field: 'cedula', headerName: 'Cedula', width: 100 },
        { field: 'direccion', headerName: 'Direccion', width: 300 },
        {
            field: 'button', headerName: 'Eliminar', width: 90,
            renderCell: (param) => (
                <Button
                    fullWidth
                    variant="text"
                    onClick={() => { eliminarCarga(param) }}
                    startIcon={<CancelRoundedIcon />}
                />
            ),
        },
    ];
    // TABS
    const [tabs, setTabs] = React.useState(0);

    const handleChangeTabs = (event, newValue) => {
        setTabs(newValue);
    };
    // MANEJADOR DE ERRORES
    const [tipodoc, setTipoDoc] = React.useState('05');
    const [listatipodoc, setListaTipoDoc] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [errorcertificado, setErrorCertificado] = React.useState(false);
    const [errorcarga, setErrorCarga] = React.useState(false);
    const [errorcorreo, setErrorcorreo] = React.useState(false);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const [tablacertificado, setTablaCertificado] = React.useState([]);
    const [tablacarga, setTablaCarga] = React.useState([]);
    
    // FORMULARIO DE ENVIO

    // FORMULARIOS DE ENVIO DE DATOS
    const [formularioempleado, setFormularioEmpleado] = React.useState({
        codigo_Empleado: '',
        nombres: '',
        direccion: '',
        telefonos: '',
        fecing: new Date(),
        cedula: '',
        correo: '',
        fechaNac: new Date(),
        cargo: '',
        nombrecargo: '',
        departamento: '',
        nombredepartamento: '',
        nivelEstudio: '',
        nombrenivelEstudio: '',
        sexo: 'M',
        sueldoBase: 0,
        afiliadoSeguro: true,
        beneficioSocial: true,
        fondoReserva: true,
        pagoMensualDecimoTercero: true,
        pagoMensualDecimoCuarto: true,
        observacion: '',
        estado: true,
        fecha_ing: new Date(),
        maquina: '',
        usuario: 1
    });
    const [formulariocertificado, setFormularioCertificado] = React.useState({
        empleado: 1,
        nombre: '',
        empresaEmisora: '',
        caduca: true,
        mesExpedicion: new Date().getMonth(),
        anioExpedicion: new Date().getFullYear(),
        fechaCaducidad: new Date(),
        idCredencial: '',
        tipo: 'PRE',
        urlArchivo: ''
    });
    const [formulariocarga, setFormularioCarga] = React.useState({
        empleado: 1,
        parentezco: '',
        nombres: '',
        cedula: '',
        direccion: ''
    });
    // METODO PARA OBTENER EL RUC

    // METODO PARA LIMPIAR LOS CAMPOS
    const limpiarCampos = () => {
        setFormularioEmpleado({
            ...formularioempleado,
            nombres: '',
            direccion: '',
            telefonos: '',
            fecing: new Date(),
            cedula: '',
            correo: '',
            fechaNac: new Date(),
            cargo: '',
            nombrecargo: '',
            departamento: '',
            nombredepartamento: '',
            nivelEstudio: '',
            nombrenivelEstudio: '',
            sexo: 'M',
            sueldoBase: 0,
            afiliadoSeguro: true,
            beneficioSocial: true,
            fondoReserva: true,
            pagoMensualDecimoTercero: true,
            pagoMensualDecimoCuarto: true,
            observacion: '',
            estado: true,
            fecha_ing: new Date(),
            maquina: '',
            usuario: 1
        })
        setFormularioCertificado({
            empleado: 1,
            nombre: '',
            empresaEmisora: '',
            caduca: true,
            mesExpedicion: new Date().getMonth(),
            anioExpedicion: new Date().getFullYear(),
            fechaCaducidad: new Date(),
            idCredencial: '',
            tipo: 'PRE',
            urlArchivo: ''
        })
        setFormularioCarga({
            empleado: 1,
            parentezco: '',
            nombres: '',
            cedula: '',
            direccion: ''
        })
        setTablaCarga([])
        setTablaCertificado([])
        setError(false);
        setErrorcorreo(false);
        setErrorCarga(false);
        setErrorCertificado(false);
        // setTelefono(false);
        // navegacion(`${PATH_DASHBOARD.nuevocontador}`)
    }

    // GUARDAR INFORMACION

    const Volver = () => {
        navegacion(`/sistema/parametros/empleado`);
    }
    const consultarIdentificacion = async (identificacion, opcion) => {
        try {
            if (opcion === 'empleado') {
                if (tipodoc === '05') {
                    const { data } = await axios(`${URLRUC}GetCedulas?id=${identificacion}`);
                    const fechaNac = new Date(formaterarFecha(data[0].FechaNacimiento, '/', '-'))
                    setFormularioEmpleado({
                        ...formularioempleado,
                        nombres: data[0].Nombre,
                        direccion: data[0].Direccion,
                        fechaNac
                    })
                } else {
                    mensajeSistema('Solo busca con cedula', 'error');
                }
            }
            if (opcion === 'carga') {

                const { data } = await axios(`${URLRUC}GetCedulas?id=${identificacion}`);
                setFormularioCarga({
                    ...formulariocarga,
                    nombres: data[0].Nombre,
                    direccion: data[0].Direccion
                })

            }

        } catch (error) {
            mensajeSistema('Error al buscar indentificacion', 'error');
        }
    }

    const agregarCertificado = () => {
        // validaciones
        if (formulariocertificado.nombre.trim().length === 0) {
            mensajeSistema('Ingrese un nombre', 'error');
            setErrorCertificado(true)
            return
        }
        if (formulariocertificado.empresaEmisora.trim().length === 0) {
            mensajeSistema('Ingrese una empresa emisora', 'error')
            setErrorCertificado(true)
            return
        }
        if (`${formulariocertificado.anioExpedicion}`.trim().length === 0) {
            mensajeSistema('Ingrese un año', 'error')
            setErrorCertificado(true)
            return
        }
        if (formulariocertificado.idCredencial.trim().length === 0) {
            mensajeSistema('Ingrese credencial', 'error')
            setErrorCertificado(true)
            return
        }
        // if (formulariocertificado.urlArchivo.trim().length === 0) {
        //     mensajeSistema('Ingrese un nombre', 'error')
        //     return
        // }
        const existe = tablacertificado.filter(f => 
            f.idCredencial === formulariocertificado.idCredencial &&
            f.empresaEmisora === formulariocertificado.empresaEmisora &&
            f.urlArchivo === formulariocertificado.urlArchivo
        )
        if(existe.length > 0){
            mensajeSistema('No puede agregar el mismo certificado', 'error');
            return
        }

        setErrorCertificado(false)
        const codigo = tablacertificado.length === 0
            ? 1 : tablacertificado.length + 1
        const add = {
            codigo,
            empleado: formularioempleado.codigo_Empleado,
            nombre: formulariocertificado.nombre,
            empresaEmisora: formulariocertificado.empresaEmisora,
            caduca: formulariocertificado.caduca,
            mesExpedicion: formulariocertificado.mesExpedicion,
            anioExpedicion: formulariocertificado.anioExpedicion,
            idCredencial: formulariocertificado.idCredencial,
            fechaCaducidad: formulariocertificado.fechaCaducidad.toISOString(),
            tipo: formulariocertificado.tipo,
            urlArchivo: formulariocertificado.urlArchivo
        }
        setTablaCertificado([...tablacertificado, add]);
    }
    const agregarCarga = () => {
        if (formulariocarga.parentezco.trim().length === 0) {
            mensajeSistema('Ingrese un parentezco', 'error')
            setErrorCarga(true)
            return
        }
        if (formulariocarga.nombres.trim().length === 0) {
            mensajeSistema('Ingrese un nombre', 'error')
            setErrorCarga(true)
            return
        }
        if (formulariocarga.cedula.trim().length === 0) {
            mensajeSistema('Ingrese cedula', 'error')
            setErrorCarga(true)
            return
        }
        if (!esCedula(`${formulariocarga.cedula}`)) {
            mensajeSistema('Ingrese una cedula valida', 'error')
            setErrorCarga(true)
            return
        }
        const existe = tablacarga.filter(f => f.cedula === formulariocarga.cedula.trim());
        if(existe.length > 0){
            mensajeSistema('No puede agregar una persona con el mismo numero de cedula', 'error');
            return
        }

        setErrorCarga(false);
        const codigo = tablacarga.length === 0
            ? 1 : tablacarga.length + 1
        const add = {
            codigo,
            empleado: formularioempleado.codigo_Empleado,
            parentezco: formulariocarga.parentezco,
            nombres: formulariocarga.nombres,
            direccion: formulariocarga.direccion,
            cedula: formulariocarga.cedula
        }
        setTablaCarga([...tablacarga, add]);
    }
    const eliminarCertficado = (e) => {
        const nuevalista = tablacertificado.filter(l => l.codigo !== e.row.codigo)
        setTablaCertificado(nuevalista);
    }
    const eliminarCarga = (e) => {
        const nuevalista = tablacarga.filter(l => l.codigo !== e.row.codigo)
        setTablaCarga(nuevalista);
    }

    const validacionEmpleado = () => {
        if (formularioempleado.nombres.trim().length === 0) {
            mensajeSistema('Ingrese un nombre', 'error');
            setError(true);
            return false;
        }
        if (!esCorreo(formularioempleado.correo)) {
            mensajeSistema('Correo Invalido');
            setError(true);
            return false;
        }
        if (formularioempleado.direccion.trim().length === 0) {
            mensajeSistema('Ingrese un direccion', 'error');
            setError(true);
            return false;
        }
        if (`${formularioempleado.cedula}`.trim().length === 0) {
            mensajeSistema('Ingrese cedula', 'error');
            setError(true);
            return false;
        }
        if (!esCedula(`${formularioempleado.cedula}`)) {
            mensajeSistema('Ingrese una cedula valida', 'error');
            setError(true);
            return false;
        }
        if (`${formularioempleado.telefonos}`.trim().length === 0) {
            mensajeSistema('Ingrese telefono', 'error');
            return false;
        }
        if (formularioempleado.departamento.trim().length === 0) {
            mensajeSistema('Seleccion un departamento', 'error');
            setError(true);
            return false;
        }
        if (formularioempleado.cargo.trim().length === 0) {
            mensajeSistema('Seleccion un cargo', 'error');
            setError(true);
            return false;
        }
        if (formularioempleado.nivelEstudio.trim().length === 0) {
            mensajeSistema('Seleccion un nivel de estudio', 'error');
            setError(true);
            return false;
        }
        return true;
    }
    const Grabar = async () => {
        try {
            if (!validacionEmpleado()) {
                return
            }
            tablacertificado.forEach(t => {
                t.empleado = 0
            })
            tablacarga.forEach(t => {
                t.empleado = 0 
            })
            setError(false);
            const maquina = await obtenerMaquina();
            const enviarjson = {
                codigo: 0,
                codigo_Empleado: formularioempleado.codigo_Empleado,
                nombres: formularioempleado.nombres,
                direccion: formularioempleado.direccion,
                telefonos: formularioempleado.telefonos,
                fecing: formularioempleado.fecing,
                cedula: formularioempleado.cedula,
                correo: formularioempleado.correo,
                fechaNac: formularioempleado.fechaNac,
                cargo: formularioempleado.cargo,
                departamento: formularioempleado.departamento,
                nivelEstudio: formularioempleado.nivelEstudio,
                sexo: formularioempleado.sexo,
                sueldoBase: parseFloat(formularioempleado.sueldoBase),
                afiliadoSeguro: formularioempleado.afiliadoSeguro,
                beneficioSocial: formularioempleado.beneficioSocial,
                fondoReserva: formularioempleado.fondoReserva,
                pagoMensualDecimoTercero: formularioempleado.pagoMensualDecimoTercero,
                pagoMensualDecimoCuarto: formularioempleado.pagoMensualDecimoCuarto,
                observacion: formularioempleado.observacion,
                estado: formularioempleado.estado,
                fecha_ing: new Date(),
                maquina,
                usuario: usuario.codigo,
                carga: [
                    ...tablacarga
                ],
                certificado: [
                    ...tablacertificado
                ]
            }
            console.log(enviarjson);
            const { data } = await axios.post(`${URLAPILOCAL}/empleados`,enviarjson,config);
            if (data === 200) {
                mensajeSistema('Registro guardado correctamente', 'success');
                limpiarCampos();
                setTabs(0)
                const inicial = await axios(`${URLAPIGENERAL}/iniciales/buscar?opcion=ADM`, config);
                const codigogenerado = generarCodigo('EM', inicial.data[0].numero, '0000')
                setFormularioEmpleado({
                    ...formularioempleado,
                    codigo_Empleado: codigogenerado
                });
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
        }
    }
    React.useEffect(() => {
        async function obtenerDatos() {
            try {
                const tipodoc = await axios(`${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=CXC_TIPODOC`, config)
                const inicial = await axios(`${URLAPIGENERAL}/iniciales/buscar?opcion=ADM`, config);
                const codigogenerado = generarCodigo('EM', inicial.data[0].numero, '0000')

                setListaTipoDoc(tipodoc.data);
                setFormularioEmpleado({
                    ...formularioempleado,
                    codigo_Empleado: codigogenerado
                })

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
                /**/
            }
        }
        obtenerDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <Page title="Empleados">
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
                        <h1>Formulario de Empleado</h1>
                    </Box>
                </Fade>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 2 }} >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabs} onChange={handleChangeTabs} aria-label="basic tabs example">
                                    <Tab label="Datos Empleado" {...a11yProps(0)} />
                                    <Tab label="Certificados" {...a11yProps(1)} />
                                    <Tab label="Cargas" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={tabs} index={0}>
                                <Grid container spacing={1}>
                                    <Grid container item md={6} xs={12} spacing={1}>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <TextField
                                                disabled
                                                fullWidth
                                                size="small"
                                                label="Codigo"
                                                variant="outlined"
                                                value={formularioempleado.codigo_Empleado}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        codigo_Empleado: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={8} sm={6} xs={12}>
                                            <TextField
                                                error={error}
                                                fullWidth
                                                size="small"
                                                label="Nombres*"
                                                variant="outlined"
                                                value={formularioempleado.nombres}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        nombres: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <TextField
                                                error={error}
                                                fullWidth
                                                size="small"
                                                label="Direccion*"
                                                variant="outlined"
                                                value={formularioempleado.direccion}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        nombres: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <TextField
                                                select
                                                label="Tipo"
                                                value={tipodoc}
                                                onChange={(e) => {
                                                    setTipoDoc(
                                                        e.target.value
                                                    )
                                                }}
                                                fullWidth
                                                size="small"
                                            >
                                                {
                                                    listatipodoc.map(t =>
                                                        <MenuItem key={t.codigo} value={t.codigo}> {t.nombre}</MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <TextField
                                                error={error}
                                                fullWidth
                                                type="number"
                                                size="small"
                                                label="Identificacion*"
                                                variant="outlined"
                                                value={formularioempleado.cedula}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        cedula: e.target.value
                                                    })
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => consultarIdentificacion(formularioempleado.cedula, 'empleado')} size="small">
                                                                <SearchRounded />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    inputMode: 'numeric', pattern: '[0-9]*'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <TextField
                                                error={error}
                                                fullWidth
                                                type="number"
                                                size="small"
                                                label="Telefono*"
                                                variant="outlined"
                                                value={formularioempleado.telefonos}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        telefonos: e.target.value
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <TextField
                                                select
                                                label="Sexo"
                                                value={formularioempleado.sexo}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        sexo: e.target.value
                                                    })
                                                }}
                                                fullWidth
                                                size="small"
                                            >
                                                <MenuItem value="M"> MASCULINO</MenuItem>
                                                <MenuItem value="F"> FEMENINO </MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item md={8} sm={8} xs={12}>
                                            <TextField
                                                error={error}
                                                fullWidth
                                                type="email"
                                                size="small"
                                                label="Correo*"
                                                variant="outlined"
                                                value={formularioempleado.correo}
                                                onChange={e => {
                                                    const input = e.target.value;
                                                    if (!esCorreo(input)) setErrorcorreo(true);
                                                    else setErrorcorreo(false);
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        correo: input
                                                    })
                                                }}
                                                helperText={errorcorreo ? "correo invalido: example@example.com" : ''}

                                            />
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                                <MobileDatePicker
                                                    label="Fecha Nacimiento*"
                                                    value={formularioempleado.fechaNac}
                                                    inputFormat="dd/MM/yyyy"
                                                    onChange={(newValue) => {
                                                        setFormularioEmpleado({
                                                            ...formularioempleado,
                                                            fechaNac: newValue
                                                        });
                                                    }}
                                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                                <MobileDatePicker
                                                    label="Fecha Ingreso*"
                                                    value={formularioempleado.fecing}
                                                    inputFormat="dd/MM/yyyy"
                                                    onChange={(newValue) => {
                                                        setFormularioEmpleado({
                                                            ...formularioempleado,
                                                            fecing: newValue
                                                        });
                                                    }}
                                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <TextField
                                                error={error}
                                                fullWidth
                                                type="number"
                                                size="small"
                                                label="Sueldo Base*"
                                                variant="outlined"
                                                value={formularioempleado.sueldoBase}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        sueldoBase: e.target.value
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <CajaGenerica
                                            nombremodal="Departamento"
                                            url={`${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=ADM_DEPARTAMENTO`}
                                            disparador={(e) => {
                                                setFormularioEmpleado({
                                                    ...formularioempleado,
                                                    departamento: e.codigo,
                                                    nombredepartamento: e.nombre
                                                })
                                            }}
                                            estadoinicial={{ codigo: formularioempleado.departamento, nombre: formularioempleado.nombredepartamento }}
                                        />
                                        <CajaGenerica
                                            nombremodal="Cargo"
                                            url={`${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=ADM_CARGO`}
                                            disparador={(e) => {
                                                setFormularioEmpleado({
                                                    ...formularioempleado,
                                                    cargo: e.codigo,
                                                    nombrecargo: e.nombre
                                                })
                                            }}
                                            estadoinicial={{ codigo: formularioempleado.cargo, nombre: formularioempleado.nombrecargo }}
                                        />
                                        <CajaGenerica
                                            nombremodal="Estudio"
                                            url={`${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=ADM_NIVEL_ESTUDIO`}
                                            disparador={(e) => {
                                                setFormularioEmpleado({
                                                    ...formularioempleado,
                                                    nivelEstudio: e.codigo,
                                                    nombrenivelEstudio: e.nombre
                                                })
                                            }}
                                            estadoinicial={{ codigo: formularioempleado.nivelEstudio, nombre: formularioempleado.nombrenivelEstudio }}
                                        />
                                        <Grid item md={12} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                // error={error}
                                                size="small"
                                                label="Plantel*"
                                                variant="outlined"
                                                disabled
                                            // value={formularioempleado.}
                                            // onChange={e => {
                                            //     setFormularioEmpleado({
                                            //         ...formularioempleado,
                                            //         sexo: e.target.value
                                            //     })
                                            // }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container item md={6} xs={12} spacing={1}>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Observacion"
                                                variant="outlined"
                                                value={formularioempleado.observacion}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        observacion: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControlLabel
                                                value={formularioempleado.afiliadoSeguro}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        afiliadoSeguro: e.target.checked
                                                    })
                                                }}
                                                control={<Checkbox defaultChecked />} label="Afiliado Seguro" />
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControlLabel
                                                value={formularioempleado.beneficioSocial}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        beneficioSocial: e.target.checked
                                                    })
                                                }}
                                                control={<Checkbox defaultChecked />} label="Beneficio Social" />
                                        </Grid>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <FormControlLabel
                                                value={formularioempleado.fondoReserva}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        fondoReserva: e.target.checked
                                                    })
                                                }}
                                                control={<Checkbox defaultChecked />} label="Fondo de Reserva" />
                                        </Grid>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControlLabel
                                                value={formularioempleado.pagoMensualDecimoTercero}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        pagoMensualDecimoTercero: e.target.checked
                                                    })
                                                }}
                                                control={<Checkbox defaultChecked />} label="Pago Mensual Decimo Tercero" />
                                        </Grid>
                                        <Grid item md={6} sm={6} xs={12}>
                                            <FormControlLabel
                                                value={formularioempleado.pagoMensualDecimoCuarto}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        pagoMensualDecimoCuarto: e.target.checked
                                                    })
                                                }}
                                                control={<Checkbox defaultChecked />} label="Pago Mensual Decimo Cuarto" />
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <FormControlLabel
                                                disabled
                                                value={formularioempleado.estado}
                                                onChange={e => {
                                                    setFormularioEmpleado({
                                                        ...formularioempleado,
                                                        estado: e.target.checked
                                                    })
                                                }}
                                                control={<Checkbox defaultChecked disabled />} label="Activo" />
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12}>
                                            {/*  */}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={tabs} index={1}>
                                <Grid container spacing={1}>
                                    <Grid item container md={12} sm={12} xs={12} spacing={1}>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                error={errorcertificado}
                                                size="small"
                                                label="Nombre*"
                                                variant="outlined"
                                                value={formulariocertificado.nombre}
                                                onChange={e => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        nombre: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                error={errorcertificado}
                                                size="small"
                                                label="Empresa Emisora*"
                                                variant="outlined"
                                                value={formulariocertificado.empresaEmisora}
                                                onChange={e => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        empresaEmisora: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} sm={12} xs={12}>
                                            <TextField
                                                select
                                                label="Tipo"
                                                value={formulariocertificado.tipo}
                                                onChange={e => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        tipo: e.target.value
                                                    })
                                                }}
                                                fullWidth
                                                size="small"
                                            >
                                                <MenuItem value="PRE"> PRESENCIAL </MenuItem>
                                                <MenuItem value="LIN"> LINEA </MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item md={2} sm={4} xs={12}>
                                            <TextField
                                                select
                                                label="Mes"
                                                value={formulariocertificado.mesExpedicion}
                                                onChange={e => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        mesExpedicion: e.target.value
                                                    })
                                                }}
                                                fullWidth
                                                size="small"
                                            >
                                                {meses.map(m => (
                                                    <MenuItem key={m.id} value={m.id}> {m.nombre} </MenuItem>
                                                ))

                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item md={2} sm={4} xs={12}>
                                            <TextField
                                                error={errorcertificado}
                                                label="Año*"
                                                value={formulariocertificado.anioExpedicion}
                                                onChange={e => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        anioExpedicion: e.target.value
                                                    })
                                                }}
                                                fullWidth
                                                size="small"
                                            />

                                        </Grid>
                                        <Grid item md={2} sm={4} xs={12}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                                <MobileDatePicker
                                                    label="Fecha Caducidad*"
                                                    value={formulariocertificado.fechaCaducidad}
                                                    inputFormat="dd/MM/yyyy"
                                                    onChange={(newValue) => {
                                                        setFormularioCertificado({
                                                            ...formulariocertificado,
                                                            fechaCaducidad: newValue
                                                        });
                                                    }}
                                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item md={2} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                error={errorcertificado}
                                                size="small"
                                                label="Codigo Credencial*"
                                                variant="outlined"
                                                value={formulariocertificado.idCredencial}
                                                onChange={e => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        idCredencial: e.target.value
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Archivo*"
                                                variant="outlined"
                                                value={formulariocertificado.urlArchivo}
                                                onChange={e => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        urlArchivo: e.target.value
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={1.2} sm={6} xs={12}>
                                            <FormControlLabel
                                                onChange={(e) => {
                                                    setFormularioCertificado({
                                                        ...formulariocertificado,
                                                        caduca: e.target.checked
                                                    })
                                                }}
                                                value={formulariocertificado.caduca}
                                                control={<Checkbox defaultChecked />} label="Caduca" />
                                        </Grid>
                                        <Grid item md={2} sm={6} xs={12}>
                                            <Button
                                                fullWidth
                                                variant="text"
                                                onClick={() => { agregarCertificado() }}
                                                startIcon={<AddCircleRoundedIcon />}
                                            >
                                                Agregar
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>
                                <Box
                                    sx={estilosdetabla}
                                >
                                    <div
                                        style={{
                                            padding: '0.5rem',
                                            height: '55vh',
                                            width: '100%',
                                        }}
                                    >
                                        <DataGrid
                                            density="compact"
                                            rowHeight={28}
                                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            // onRowDoubleClick={(e) => Editar(e)}
                                            sx={estilosdatagrid}
                                            rows={tablacertificado}
                                            columns={columns}
                                            getRowId={rows => rows.codigo}
                                            components={{
                                                NoRowsOverlay: CustomNoRowsOverlay,
                                            }}
                                        />
                                    </div>
                                </Box>
                            </TabPanel>
                            <TabPanel value={tabs} index={2}>
                                <Grid container spacing={1}>
                                    <Grid item container md={12} sm={12} xs={12} spacing={1}>
                                        <Grid item md={2} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                error={errorcarga}
                                                size="small"
                                                label="Parentezco*"
                                                variant="outlined"
                                                value={formulariocarga.parentezco}
                                                onChange={e => {
                                                    setFormularioCarga({
                                                        ...formulariocarga,
                                                        parentezco: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                error={errorcarga}
                                                size="small"
                                                label="Nombre*"
                                                variant="outlined"
                                                value={formulariocarga.nombres}
                                                onChange={e => {
                                                    setFormularioCarga({
                                                        ...formulariocarga,
                                                        nombres: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={2} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                error={errorcarga}
                                                type="number"
                                                size="small"
                                                label="Cedula*"
                                                variant="outlined"
                                                value={formulariocarga.cedula}
                                                onChange={e => {
                                                    setFormularioCarga({
                                                        ...formulariocarga,
                                                        cedula: e.target.value
                                                    })
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => { consultarIdentificacion(formulariocarga.cedula, 'carga') }} size="small">
                                                                <SearchRounded />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    inputMode: 'numeric', pattern: '[0-9]*',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Direccion"
                                                variant="outlined"
                                                value={formulariocarga.direccion}
                                                onChange={e => {
                                                    setFormularioCarga({
                                                        ...formulariocarga,
                                                        direccion: e.target.value.toUpperCase()
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={1.2} sm={6} xs={12}>
                                            <Button
                                                fullWidth
                                                variant="text"
                                                onClick={() => { agregarCarga() }}
                                                startIcon={<AddCircleRoundedIcon />}
                                            >
                                                Agregar
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>
                                <Box
                                    sx={estilosdetabla}
                                >
                                    <div
                                        style={{
                                            padding: '0.5rem',
                                            height: '55vh',
                                            width: '100%',
                                        }}
                                    >
                                        <DataGrid
                                            density="compact"
                                            rowHeight={28}
                                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            // onRowDoubleClick={(e) => Editar(e)}
                                            sx={estilosdatagrid}
                                            rows={tablacarga}
                                            columns={columns1}
                                            getRowId={(datosfilas) => datosfilas.codigo}
                                            components={{
                                                NoRowsOverlay: CustomNoRowsOverlay,
                                            }}
                                        />
                                    </div>
                                </Box>
                            </TabPanel>
                        </Box>
                    </Card>
                </Fade>
            </Page>
        </>
    );
}