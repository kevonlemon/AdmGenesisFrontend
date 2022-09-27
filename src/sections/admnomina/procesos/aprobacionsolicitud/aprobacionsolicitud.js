import React from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Grid,
    IconButton,
    Card,
    Fade,
    MenuItem,
    InputAdornment,
    Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import es from 'date-fns/locale/es';
import axios from 'axios';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { DataGrid, esES, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import { CustomNoRowsOverlay } from "../../../../utils/csssistema/iconsdatagrid";
import CircularProgreso from '../../../../components/Cargando';
import { PATH_DASHBOARD, PATH_OPSISTEMA, PATH_PAGE, PATH_AUTH } from '../../../../routes/paths';
import { URLAPIGENERAL, URLAPILOCAL, CORS } from "../../../../config";
import ModalEmpleadosD from './components/modalempleadosd';
import ModalEmpleadosH from './components/modalempleadosh';
import { estilosdetabla, estilosdatagrid, estilosacordeon } from '../../../../utils/csssistema/estilos';
import Page from '../../../../components/Page';
import { formaterarFecha, generarCodigo, obtenerMaquina } from '../../../../utils/sistema/funciones';
import RequiredTextField from '../../../../sistema/componentes/formulario/RequiredTextField';



export default function AprobacionSolicitud() {

    const user = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${user.token}`
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

    function formatDate(fecha) {
        const formattedDate = `${fecha.getDate()}/${(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
        return formattedDate;
    }

    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);

    const columns = [
        { field: 'id', headerName: 'ID', width: 100, hide: true },
        { field: 'codigo', headerName: 'Codigo', width: 100, hide: true },
        { field: 'numero', headerName: 'Numero', width: 100 },
        {
            field: 'fecha', headerName: 'Fecha', width: 120,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        { field: 'motivo', headerName: 'Motivo', width: 250 },
        { field: 'empleado', headerName: 'Empleado', width: 300 },
        {
            headerAlign: 'center',
            headerName: 'APROBAR',
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            width: 80,
            align: 'center',
            renderHeader: () => (
                <strong>
                    {'Selecc'}

                </strong>
            ),
        },
    ]

    const [rows, setRows] = React.useState([]);

    const [formulario, setFormulario] = React.useState({
        empleadodesde: 0,
        codigoempleadodesde: '',
        nombreempleadodesde: '',
        empleadohasta: 0,
        codigoempleadohasta: '',
        nombreempleadohasta: '',
        fechadesde: new Date(),
        fechahasta: new Date()
    });
    const [listAprobados, setListAprobados] = React.useState([]);
    console.log('aprobados', listAprobados);
    const [openModalD, setOpenModalD] = React.useState(false);
    const [openModalH, setOpenModalH] = React.useState(false);

    const [empleadoD, setEmpleadoD] = React.useState([]);
    const [empleadoH, setEmpleadoH] = React.useState([]);

    const [tiposBusquedasD, setTiposBusquedaD] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
    const toggleShowD = () => setOpenModalD(p => !p);
    const handleCallbackChildD = (e) => {
        const item = e.row;
        setFormulario({
            ...formulario,
            empleadodesde: item.id,
            codigoempleadodesde: item.codigo,
            nombreempleadodesde: item.nombre
        });
        toggleShowD();
    }

    const [tiposBusquedasH, setTiposBusquedaH] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
    const toggleShowH = () => setOpenModalH(p => !p);
    const handleCallbackChildH = (e) => {
        const item = e.row;
        setFormulario({
            ...formulario,
            empleadohasta: item.id,
            codigoempleadohasta: item.codigo,
            nombreempleadohasta: item.nombre
        });
        toggleShowH();
    }

    const Nuevo = () => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setFormulario({
            ...formulario,
            empleadodesde: 0,
            codigoempleadodesde: '',
            nombreempleadodesde: '',
            empleadohasta: 0,
            codigoempleadohasta: '',
            nombreempleadohasta: '',
            fechadesde: firstDay,
            fechahasta: lastDay
        })
        setRows([]);
    }

    const buscarSolicitudes = async () => {
        const fechadesde = formatDate(formulario.fechadesde);
        const fechahasta = formatDate(formulario.fechahasta);
        try {
            const { data } = await axios.get(`${URLAPIGENERAL}/AprobacionSolicitudes/Listar?empleadodesde=${formulario.empleadodesde}&empleadohasta=${formulario.empleadohasta}&fechadesde=${fechadesde}&fechahasta=${fechahasta}`);
            if (data.length === 0) {
                mensajeSistema("No se encontraron solicitudes para los datos dados", "error");
                Nuevo();
            } else {
                let codigo = 0;
                data.forEach((f) => {
                    codigo += 1;
                    f.id = codigo
                })
                setRows(data);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesión expiró", "error");
            }
            else if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            } else {
                mensajeSistema("Problemas al consultar verifique los datos e inténtelo nuevamente", "error");
            }
        } finally {
            setMostrarProgreso(false);
        }
    }

    const Procesar = async () => {
        try {
            const { data } = await axios.post(`${URLAPIGENERAL}/AprobacionSolicitudes/Actualizar`, listAprobados, config, setMostrarProgreso(true));
            if (data === 200) {
                mensajeSistema('Solicitudes aprobadas correctamente', 'success');
                Nuevo();
            }
        } catch (error) {
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesión expiró", "error");
            }
            else if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            } else {
                mensajeSistema("Problemas al procesar las aprobaciones, inténtelo nuevamente", "error");
            }
        } finally {
            setMostrarProgreso(false);
        }
    }

    React.useEffect(() => {
        async function getDatos() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/empleados/listar`, config, setMostrarProgreso(true));
                const listaempleadodesde = data.map(m => ({ id: m.codigo, codigo: m.codigo_Empleado, nombre: m.nombres }));
                const listaempleadohasta = data.map(m => ({ id: m.codigo, codigo: m.codigo_Empleado, nombre: m.nombres }));
                setEmpleadoD(listaempleadodesde);
                setEmpleadoH(listaempleadohasta);
                const { [Object.keys(listaempleadohasta).pop()]: lastItem } = listaempleadohasta;
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                setFormulario({
                    ...formulario,
                    fechadesde: firstDay,
                    fechahasta: lastDay,
                    empleadodesde: listaempleadodesde[0].id,
                    codigoempleadodesde: listaempleadodesde[0].codigo,
                    nombreempleadodesde: listaempleadodesde[0].nombre,
                    empleadohasta: lastItem.id,
                    codigoempleadohasta: lastItem.codigo,
                    nombreempleadohasta: lastItem.nombre,
                })
            } catch (error) {
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesión expiró", "error");
                }
                else if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                } else {
                    mensajeSistema("Problemas al obtener datos, inténtelo nuevamente", "error");
                }
            } finally {
                setMostrarProgreso(false)
            }
        }
        getDatos();
    }, [])

    // -----------------------------------------------------------------------------------------------------
    async function buscarEmpleados(empleado) {
        if (empleado === 'desde') {
            if (formulario.codigoempleadodesde === '') {
                setOpenModalD(true);
            } else {
                try {
                    const { data } = await axios(`${URLAPILOCAL}/empleados/obtenerxcodigo?codigo=${formulario.codigoempleadodesde === '' ? 'string' : formulario.codigoempleadodesde}`, config)
                    if (data.length === 0) {
                        mensajeSistema('Código no encontrado', 'warning')
                        setOpenModalD(true);
                    } else {
                        setFormulario({
                            ...formulario,
                            empleadodesde: data.codigo,
                            codigoempleadodesde: data.codigo_Empleado,
                            nombreempleadodesde: data.nombres
                        });
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            
        } else {
            // eslint-disable-next-line no-lonely-if
            if (formulario.codigoempleadohasta === '') {
                setOpenModalH(true);
            } else {
                try {
                    const { data } = await axios(`${URLAPILOCAL}/empleados/obtenerxcodigo?codigo=${formulario.codigoempleadohasta === '' ? 'string' : formulario.codigoempleadohasta}`, config)
                    if (data.length === 0) {
                        mensajeSistema('Código no encontrado', 'warning')
                        setOpenModalH(true);
                    } else {
                        setFormulario({
                            ...formulario,
                            empleadohasta: data.codigo,
                            codigoempleadohasta: data.codigo_Empleado,
                            nombreempleadohasta: data.nombres
                        });
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            
        }
    }
    // -----------------------------------------------------------------------------------------------------

    return (
        <>
            <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
            <ModalEmpleadosD
                nombre="Empleados Desde"
                openModal={openModalD}
                busquedaTipo={tiposBusquedasD}
                toggleShow={toggleShowD}
                rowsData={empleadoD}
                parentCallback={handleCallbackChildD}
            />
            <ModalEmpleadosH
                nombre="Empleados Hasta"
                openModal={openModalH}
                busquedaTipo={tiposBusquedasH}
                toggleShow={toggleShowH}
                rowsData={empleadoH}
                parentCallback={handleCallbackChildH}
            />
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Page title="Aprobación de Solicitud">
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <Box >
                            <Grid container >
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box>
                                        <HeaderBreadcrumbs
                                            heading="Aprobación de Solicitud"
                                            links={[
                                                { name: 'Inicio', href: PATH_DASHBOARD.root },
                                                { name: 'Aprobación de Solicitud' },
                                                { name: 'Procesos' }
                                            ]}
                                            action={
                                                <Button
                                                    fullWidth
                                                    disabled={listAprobados.length === 0}
                                                    // variant="text"
                                                    variant="contained"
                                                    size='medium'
                                                    // disableElevation
                                                    startIcon={<SaveRoundedIcon />}
                                                    onClick={() => Procesar()}
                                                >
                                                    Procesar
                                                </Button>
                                            }
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Accordion
                            defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={estilosacordeon}
                            >
                                <Typography sx={{ fontWeight: 'bold' }}>Busqueda</Typography>
                            </AccordionSummary>
                            <AccordionDetails>


                                {/* Datos paciente */}
                                <Grid container spacing={2}>
                                    <Grid item container spacing={1}>
                                        <Grid item md={8} sm={12} xs={12} >
                                            {/* <Card sx={{ mb: 1, p: 1 }}> */}
                                            <Box sx={{ width: '100%' }}>
                                                <Grid container spacing={1}>
                                                    <Grid item container spacing={1} md={3}>
                                                        <Grid item md={12} sm={6} xs={12}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                                                <MobileDatePicker
                                                                    label="Fecha desde"
                                                                    value={formulario.fechadesde}
                                                                    inputFormat="dd/MM/yyyy"
                                                                    onChange={(newValue) => {
                                                                        setFormulario({
                                                                            ...formulario,
                                                                            fechadesde: newValue
                                                                        });
                                                                    }}
                                                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>
                                                        <Grid item md={12} sm={6} xs={12}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                                                <MobileDatePicker
                                                                    label="Fecha Hasta"
                                                                    value={formulario.fechahasta}
                                                                    inputFormat="dd/MM/yyyy"
                                                                    onChange={(newValue) => {
                                                                        setFormulario({
                                                                            ...formulario,
                                                                            fechahasta: newValue
                                                                        });
                                                                    }}
                                                                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item container spacing={1} md={9}>
                                                        <Grid item container spacing={1} md={12}>
                                                            <Grid item md={5} sm={6} xs={12}>
                                                                <RequiredTextField
                                                                    size="small"
                                                                    fullWidth
                                                                    label="Empleado Desde"
                                                                    value={formulario.codigoempleadodesde}
                                                                    onChange={(e) => {
                                                                        setFormulario({
                                                                            ...formulario,
                                                                            codigoempleadodesde: e.target.value
                                                                        })
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                <IconButton size="small" onClick={() => { 
                                                                                    const empleado = 'desde'
                                                                                    buscarEmpleados(empleado) 
                                                                                }}>
                                                                                    <SearchRoundedIcon />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={7} sm={6} xs={12}>
                                                                <TextField
                                                                    size="small"
                                                                    fullWidth
                                                                    label="Nombre"
                                                                    value={formulario.nombreempleadodesde}
                                                                    InputProps={{
                                                                        readOnly: true
                                                                    }}
                                                                    sx={{
                                                                        backgroundColor: "#e5e8eb",
                                                                        border: "none",
                                                                        borderRadius: '10px',
                                                                        color: "#212B36"
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item container spacing={1} md={12}>
                                                            <Grid item md={5} sm={6} xs={12}>
                                                                <RequiredTextField
                                                                    size="small"
                                                                    fullWidth
                                                                    label="Empleado Hasta"
                                                                    value={formulario.codigoempleadohasta}
                                                                    onChange={(e) => {
                                                                        setFormulario({
                                                                            ...formulario,
                                                                            codigoempleadohasta: e.target.value
                                                                        })
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                <IconButton size="small" onClick={() => { 
                                                                                    const empleado = 'hasta'
                                                                                    buscarEmpleados(empleado) 
                                                                                }}>
                                                                                    <SearchRoundedIcon />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        )
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item md={7} sm={6} xs={12}>
                                                                <TextField
                                                                    size="small"
                                                                    fullWidth
                                                                    label="Nombre"
                                                                    value={formulario.nombreempleadohasta}
                                                                    InputProps={{
                                                                        readOnly: true
                                                                    }}
                                                                    sx={{
                                                                        backgroundColor: "#e5e8eb",
                                                                        border: "none",
                                                                        borderRadius: '10px',
                                                                        color: "#212B36"
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            {/* </Card> */}
                                        </Grid>


                                        <Grid container item xs={12} spacing={1} justifyContent="flex-start"  >
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    variant="text"
                                                    size='small'
                                                    onClick={() => Nuevo()}
                                                    startIcon={<InsertDriveFileRoundedIcon />}
                                                >
                                                    Nuevo
                                                </Button>
                                            </Grid>
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    variant="text"
                                                    size='small'
                                                    onClick={() => buscarSolicitudes()}
                                                    startIcon={<SearchRoundedIcon />}
                                                >
                                                    Buscar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <Accordion
                                defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={estilosacordeon}
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>Solicitudes</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ borderRadius: '0.5rem' }}>
                                    <Box mb={1}>
                                        {/* <Grid container spacing={1} justifyContent="flex-end" >
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    disabled={rows.length <= 0}
                                                    variant="text"
                                                    // eslint-disable-next-line camelcase
                                                    href={`${URLAPIGENERAL}/beneficioempleado/generarexcel?Anio=${anio.anio}&Mes=${getmes.month}&Empleado1=${Datospaciente.id}&Empleado2=${Datospaciente2.id}&Operador=${codigooperador}`}
                                                    // target="_blank"
                                                    startIcon={<ViewComfyRoundedIcon />}
                                                >
                                                    Excel
                                                </Button>
                                            </Grid>
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    disabled={rows.length <= 0}
                                                    variant="text"
                                                    href={`${URLAPIGENERAL}/beneficioempleado/generarpdf?Anio=${anio.anio}&Mes=${getmes.month}&Empleado1=${Datospaciente.id}&Empleado2=${Datospaciente2.id}&Operador=${codigooperador}`}
                                                    target="_blank"
                                                    startIcon={<PictureAsPdfRoundedIcon />}
                                                >
                                                    Pdf
                                                </Button>
                                            </Grid>
                                        </Grid> */}
                                    </Box>
                                    <Box
                                        sx={estilosdetabla}
                                    >
                                        <div
                                            style={{
                                                padding: '1rem',
                                                height: '55vh',
                                                width: '100%',
                                            }}
                                        >
                                            <DataGrid
                                                sx={estilosdatagrid}
                                                density="compact"
                                                rowHeight={28}
                                                columns={columns}
                                                rows={rows}
                                                getRowId={rows => rows.id}
                                                checkboxSelection
                                                components={{
                                                    NoRowsOverlay: CustomNoRowsOverlay,
                                                }}
                                                onSelectionModelChange={newSelectionModel => {
                                                    const datos = []
                                                    newSelectionModel.forEach(cd => {
                                                        rows.forEach(d => {
                                                            if (cd === d.id) {
                                                                const json = {
                                                                    codigosolicitud: d.codigo,
                                                                    aprobacion: true
                                                                };
                                                                datos.push(json);
                                                            }
                                                        })
                                                    })
                                                    setListAprobados(datos);
                                                }}
                                                // hideFooter={rows.length < 3}
                                                // disableColumnMenu={ocultaFooter}
                                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            />
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Box>
                </Page>
            </Fade>
        </>
    )
}
