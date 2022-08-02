import { TextField, Button, Card, Grid, InputAdornment, Fade } from "@mui/material";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, esES } from "@mui/x-data-grid";
// import axios from "axios";
import clsx from 'clsx';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import { useSnackbar } from 'notistack';
// PLANTILLA
import axios from "axios";
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CircularProgreso from '../../../../components/Cargando';
// import CircularProgreso from "../../../../../sistema/componentes/circuloprogreso";
import Page from '../../../../components/Page';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { URLAPIGENERAL, URLAPILOCAL } from "../../../../config";
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from "../../../../utils/csssistema/estilos";
import { CustomNoRowsOverlay } from "../../../../utils/csssistema/iconsdatagrid";
import { formaterarFecha } from "../../../../utils/sistema/funciones";

export default function AdmContador() {
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${usuario.token}`
        }
    }
    // NAVEGACION
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
    // CABECERA DE LA TABLA
    const cabezera = [
        { field: 'codigo', headerName: 'Codigo', width: 100 },
        { field: 'ruc', headerName: 'Ruc', width: 130, cellClassName: () => clsx('blueCell') },
        { field: 'cedula', headerName: 'Cedula', width: 120, cellClassName: () => clsx('orangeCell') },
        { field: 'nombre', headerName: 'Nombre', width: 200, cellClassName: () => clsx('yellowCell') },
        { field: 'direccion', headerName: 'Direccion', width: 250 },
        { field: 'telefono', headerName: 'Telefono', width: 120 },
        { field: 'correo', headerName: 'Correo', width: 200 },
        {
            field: 'fecha_Ingreso', headerName: 'Fecha ingreso', width: 130, valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        {
            field: 'fecha_Salida', headerName: 'Fecha Salida', width: 130, valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        { field: 'registro', headerName: 'Registro', width: 120 },
        {
            field: 'estado', headerName: 'Estado', width: 100, renderCell: (param) => (
                param.row.estado === true ? <Button variant="containded" style={styleActive}>Activo</Button> : <Button variant="containded" style={styleInactive}>Inactivo</Button>
            ),
        },

    ];
    // FILAS INICIALES DE LA TABLA
    const [datosfilas, setDatosFilas] = React.useState([]);
    // METODO EMPLEADO PARA BUSCAR
    const [buscar, setBuscar] = React.useState("");
    // COPIA FILAS INICIALES DE LA TABLA
    const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    // METODO BUSCAR
    const Buscar = (e) => {
        // console.log(e.target.value);
        setBuscar(e.target.value);
        const texto = String(e.target.value).toLocaleUpperCase();
        const resultado = resultadobusqueda.filter(b => String(b.nombre).toLocaleUpperCase().includes((texto)));
        setDatosFilas(resultado);
    }
    // ENVIA A EDITAR 
    const Editar = (e) => {
        // console.log(e);
        navegacion(`/sistema/parametros/editarcontador`, { state: { id: e.id } })
    }
    // RENDERIZADO DE LOS DATOS DE LA API
    React.useEffect(() => {
        async function cargarDatos() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/contadores/listar`,config, setMostrarProgreso(true));
                setDatosFilas(data);
                setResultadoBusqueda(data);
            } catch (error) {
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                else if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                } else{
                    mensajeSistema("Problemas con la base de datos", "error");
                }
            } finally {
                setMostrarProgreso(false);
            }
        };
        cargarDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <Page title="Contadores">
                <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}  >
                        <HeaderBreadcrumbs
                            heading="Contadores"
                            links={[
                                { name: 'Parametros' },
                                { name: 'Contadores' },
                                { name: 'Lista' },
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component={RouterLink}
                                    to="/sistema/parametros/nuevocontador"
                                    startIcon={<AddCircleRoundedIcon />}
                                >
                                    Nuevo
                                </Button>
                            }
                        />
                    </Box>
                </Fade>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Card sx={{ ml: 3, mr: 3, p: 1, mt: 1 }}>
                        <Box sx={{ ml: 2, mt: 2 }}>
                            <Grid container spacing={1} direction="row" justifyContent="space-between">
                                <Grid item md={3} sm={6} xs={12}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        label="Buscar"
                                        value={buscar}
                                        onChange={Buscar}
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchRoundedIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item container spacing={1} md={9} sm={6} xs={12} justifyContent="flex-end">
                                    <Grid item md={1.5} sm={3} xs={6}>
                                        <Button
                                            fullWidth
                                            variant="text"
                                            href={`${URLAPILOCAL}/contadores/generarexcel`}
                                            target="_blank"
                                            startIcon={<ViewComfyRoundedIcon />}
                                        >
                                            Excel
                                        </Button>
                                    </Grid>
                                    <Grid item md={1.5} sm={3} xs={6}>
                                        <Button
                                            fullWidth
                                            variant="text"
                                            href={`${URLAPILOCAL}/contadores/generarpdf`}
                                            target="_blank"
                                            startIcon={<PictureAsPdfRoundedIcon />}
                                        >
                                            Pdf
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Box>
                        <Box sx={estilosdetabla}>
                            <div
                                style={{
                                    padding: '1rem',
                                    height: '55vh',
                                    width: '100%'
                                }}
                            >
                                <DataGrid
                                    density="compact"
                                    rowHeight={28}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    onRowDoubleClick={e => Editar(e)}
                                    sx={estilosdatagrid}
                                    components={{
                                        NoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                    rows={datosfilas}
                                    columns={cabezera}
                                    getRowId={rows => rows.codigo}
                                />
                            </div>
                        </Box>
                    </Card>
                </Fade>
            </Page>
        </>
    );
}