import { TextField, Button, Card, Grid, InputAdornment, Fade } from "@mui/material";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, esES } from "@mui/x-data-grid";
// import { Grow } from "@mui/material";
// import { palette } from '@mui/system';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import axios from "axios";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CircularProgreso from '../../../../components/Cargando';
import Page from '../../../../components/Page';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths'
import { URLAPIGENERAL} from "../../../../config";
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from "../../../../utils/csssistema/estilos";
import { CustomNoRowsOverlay } from "../../../../utils/csssistema/iconsdatagrid";


export default function AdmMantimientoGenerico() {
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${usuario.token}`
        }
    }
    const navegacion = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const cabecera = [
        { field: 'codigo', headerName: 'Codigo', width: 100, cellClassName: () => clsx('blueCell') },
        { field: 'descripcion', headerName: 'Descripcion', width: 300, cellClassName: () => clsx('orangeCell') },
        { field: 'nombre', headerName: 'Nombre', width: 300 },
        {
            field: 'estado', headerName: 'Estado', width: 100, renderCell: (param) => (
                param.row.estado === true ? <Button variant="containded" style={styleActive}>Activo</Button> : <Button variant="containded" style={styleInactive}>Inactivo</Button>
            ),
        },
        // {
        //     field: 'aplCuentaContable', headerName: 'Aplica Cuenta Contable', width: 180, renderCell: (param) => (
        //         param.row.aplCuentaContable === true ? <Button variant="containded" style={styleActive}>Si</Button> : <Button variant="containded" style={styleInactive}>No</Button>
        //     ),
        // },
        // { field: 'cuenta', headerName: 'Cuenta', width: 100 },

    ];
    const [datosfilas, setDatosFilas] = React.useState([]);
    const [buscar, setBuscar] = React.useState("");
    const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
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
    const Buscar = (e) => {
        // console.log(e.target.value);
        setBuscar(e.target.value);
        const texto = String(e.target.value).toLocaleUpperCase();
        const resultado = resultadobusqueda.filter(b => b.descripcion.includes(texto) || b.nombre.includes(texto));
        setDatosFilas(resultado);
    }
    const Editar = (e) => {
        const datos = { codigo: e.row.codigo, tabla: e.row.tabla };
        navegacion(`/sistema/parametros/editargenerico`, { state: { datos } });
    }

    React.useEffect(() => {
        async function getDatos() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/mantenimientogenerico/listar`,config, setMostrarProgreso(true));
                let id = 1
                data.forEach(d => {
                    d.id = id
                    id += 1
                });
                setDatosFilas(data);
                setResultadoBusqueda(data)
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

        getDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <Page title="Genericos">
                <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}  >
                        <HeaderBreadcrumbs
                            heading="Mantenimiento Generico"
                            links={[
                                { name: 'Parametros' },
                                { name: 'Mantenimiento generico' },
                                { name: 'Lista' },
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component={RouterLink}
                                    to="/sistema/parametros/nuevogenerico"
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
                                            href={`${URLAPIGENERAL}/mantenimientogenerico/generarexcel`}
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
                                            href={`${URLAPIGENERAL}/mantenimientogenerico/generarpdf`}
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
                                    components={{
                                        NoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                    sx={estilosdatagrid}
                                    rows={datosfilas}
                                    columns={cabecera}
                                    getRowId={rows => rows.id}
                                // getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                                />
                            </div>
                        </Box>
                    </Card>
                </Fade>
            </Page>
        </>
    );
}