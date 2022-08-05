import { TextField, Button, Card, Grid, InputAdornment, Fade, IconButton, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import es from "date-fns/locale/es";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import clsx from 'clsx';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CircularProgreso from '../../../../components/Cargando';
import ModalGenerico from '../../../../components/modalgenerico';
import Page from '../../../../components/Page';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths'
import { URLAPIGENERAL, URLAPILOCAL } from "../../../../config";
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from "../../../../utils/csssistema/estilos";
import { CustomNoRowsOverlay } from "../../../../utils/csssistema/iconsdatagrid";
import { formaterarFecha } from '../../../../utils/sistema/funciones';
import { fCurrency } from '../../../../utils/formatNumber';


export default function Empleado() {
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
    const columns = [
        { field: 'codigo', headerName: 'Codigo', width: 100 },
        { field: 'linea', headerName: 'Linea', width: 80 },
        { field: 'capitalAmortizado', headerName: 'Capital amortizado', width: 150 },
        { field: 'interes', headerName: 'Interes', width: 100, cellClassName: () => clsx('yellowCell') },
        { field: 'interesGracia', headerName: 'Interes gracia', width: 120 },
        { field: 'saldo', headerName: 'Saldo capital', width: 100 },
        {
            field: 'fecing', headerName: 'Fecha dividendo', width: 120, cellClassName: () => clsx('orangeCell'),
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 100,
            renderCell: (param) =>
                param.row.estado === true ? (
                    <Button variant="containded" style={styleActive}>
                        Activo
                    </Button>
                ) : (
                    <Button variant="containded" style={styleInactive}>
                        Inactivo
                    </Button>
                ),
        },
    ];
    // const [, setItems] = React.useState([]);
    const [empleado, setEmpleado] = React.useState([]);
    const [tipoprestamos, setTiposPrestamos] = React.useState([]);
    const [detalleprestamos, setDetallesPrestamos] = React.useState([]);

    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const [formulario, setFormulario] = React.useState({
        codigo: '',
        codigoempleado: '',
        empleado: '',
        nombreempleado: '',
        tipo: 'TP0001',
        monto: 0,
        valorDividendo: 0,
        seguroDesgravamen: 0,
        plazo: 1,
        tasa: 0,
        liquidoRecibir: 0,
        fechaPrimerDividendo: new Date(),
        fechaUltimoDividendo: new Date(),
        fecha_ing: new Date(),
        maquina: '',
        usuario: usuario.codigo
    })

    // eslint-disable-next-line no-unused-vars
    const [tiposBusquedas, setTiposBusqueda] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
    const [openModal, setOpenModal] = React.useState(false);
    const toggleShow = () => setOpenModal(p => !p);
    const handleCallbackChild = (e) => {
        const item = e.row;
        console.log(item)
        setFormulario({
            ...formulario,
            codigo: item.codigo,
            codigoempleado: item.codigo_Empleado,
            nombreempleado: item.nombre
        });
        toggleShow();
    }



    React.useEffect(() => {
        async function getDatos() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/empleados/listar`, config, setMostrarProgreso(true));
                const tipoprestamosget = await axios(`${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=ADM_TIPO_PRESTAMO`, config, setMostrarProgreso(true));

                const listaempleado = data.map(m => ({ codigo: m.codigo, codigo_Empleado: m.codigo_Empleado, nombre: m.nombres }))
                const prestamos = tipoprestamosget.data.map(p => ({ codigo: p.codigo, nombre: p.nombre }))

                setTiposPrestamos(prestamos);
                setEmpleado(listaempleado);


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
                setMostrarProgreso(false)
            }
        }
        getDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
            <ModalGenerico
                nombre="Estado Civil"
                openModal={openModal}
                busquedaTipo={tiposBusquedas}
                toggleShow={toggleShow}
                rowsData={empleado}
                parentCallback={handleCallbackChild}
            />
            <Page title="Prestamos">
                <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <HeaderBreadcrumbs
                            heading="Prestamos"
                            links={[
                                { name: 'Procesos' },
                                { name: 'Prestamos' },
                                { name: 'operacion' },
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => { }}
                                    startIcon={<AddCircleRoundedIcon />}
                                >
                                    Grabar
                                </Button>
                            }
                        />
                    </Box>
                </Fade>
                <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                    <Card sx={{ ml: 3, mr: 3, p: 2 }}>
                        <Box>
                            <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                    <TextField
                                        disabled
                                        size="small"
                                        fullWidth
                                        label="Codigo"
                                        value={formulario.codigo}
                                    />
                                </Grid>
                                <Grid item md={1.8} sm={6} xs={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Empleado"
                                        value={formulario.codigoempleado}
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => { setOpenModal(true) }}>
                                                        <SearchRoundedIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item md={3.2} sm={6} xs={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Nombre"
                                        value={formulario.nombreempleado}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <TextField
                                        select
                                        size="small"
                                        fullWidth
                                        label="Tipo"
                                        value={formulario.tipo}
                                        onChange={
                                            e => {
                                                setFormulario({
                                                    ...formulario,
                                                    tipo: e.target.value
                                                })
                                            }
                                        }
                                    >
                                        {
                                            tipoprestamos.map(t => (
                                                <MenuItem key={t.codigo} value={t.codigo}>{t.nombre}</MenuItem>
                                            ))
                                        }

                                    </TextField>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                    <TextField
                                        type="number"
                                        size="small"
                                        fullWidth
                                        label="Monto"
                                        value={formulario.monto}
                                        onChange={e => {
                                            // eslint-disable-next-line no-restricted-globals
                                            const monto = isNaN(parseFloat(e.target.value)) ?
                                                0 : parseFloat(e.target.value)
                                            const montoplazo = (monto / parseFloat(formulario.plazo))
                                            const portasa = (parseFloat(formulario.tasa) / 100);
                                            const valorDividendo = (montoplazo * portasa) + montoplazo;

                                            setFormulario({
                                                ...formulario,
                                                monto: e.target.value,
                                                // eslint-disable-next-line no-restricted-globals
                                                valorDividendo: isNaN(valorDividendo) ? 0 : valorDividendo.toFixed(2)
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Plazo"
                                        value={formulario.plazo}
                                        onChange={e => {
                                            // eslint-disable-next-line no-restricted-globals
                                            const plazo = isNaN(parseFloat(e.target.value)) ?
                                                1 : parseFloat(e.target.value);
                                            const montoplazo = (parseFloat(formulario.monto) / plazo)
                                            const portasa = (parseFloat(formulario.tasa) / 100);
                                            const valorDividendo = (montoplazo * portasa) + montoplazo;
                                            setFormulario({
                                                ...formulario,
                                                plazo: e.target.value,
                                                // eslint-disable-next-line no-restricted-globals
                                                valorDividendo: isNaN(valorDividendo) ? 0 : valorDividendo.toFixed(2)
                                            })
                                        }}
                                    />
                                </Grid>

                                <Grid item md={1.5} sm={6} xs={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Tasa"
                                        value={formulario.tasa}
                                        onChange={e => {
                                            // eslint-disable-next-line no-restricted-globals
                                            const tasa = isNaN(parseFloat(e.target.value)) ?
                                                0 : parseFloat(e.target.value);
                                            const montoplazo = (parseFloat(formulario.monto) / parseFloat(formulario.plazo))
                                            const portasa = (tasa / 100);
                                            const valorDividendo = (montoplazo * portasa) + montoplazo;
                                            console.log(valorDividendo)
                                            setFormulario({
                                                ...formulario,
                                                tasa: e.target.value,
                                                // eslint-disable-next-line no-restricted-globals
                                                valorDividendo: isNaN(valorDividendo) ? 0 : valorDividendo.toFixed(2)
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                    <TextField
                                        disabled
                                        size="small"
                                        fullWidth
                                        label="Valor dividendo"
                                        value={formulario.valorDividendo}
                                        onChange={e => setFormulario(
                                            {
                                                ...formulario,
                                                valorDividendo: e.target.value
                                            }
                                        )}
                                    />
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Seguro"
                                        value={formulario.seguroDesgravamen}
                                        onChange={e => setFormulario(
                                            {
                                                ...formulario,
                                                seguroDesgravamen: e.target.value
                                            }
                                        )}
                                    />
                                </Grid>

                                <Grid item md={1.5} sm={6} xs={12}>
                                    <TextField
                                        disabled
                                        size="small"
                                        fullWidth
                                        label="Liquidacion"
                                        value={formulario.liquidoRecibir}
                                        onChange={e => setFormulario(
                                            {
                                                ...formulario,
                                                liquidoRecibir: e.target.value
                                            }
                                        )}
                                    />
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                        <MobileDatePicker
                                            disabled
                                            label="Fecha primer dividendo*"
                                            value={formulario.fechaPrimerDividendo}
                                            inputFormat="dd/MM/yyyy"
                                            onChange={(newValue) => {
                                                setFormulario({
                                                    ...formulario,
                                                    fechaPrimerDividendo: newValue
                                                });
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                        <MobileDatePicker
                                            disabled
                                            label="Fecha ultimo dividendo*"
                                            value={formulario.fechaUltimoDividendo}
                                            inputFormat="dd/MM/yyyy"
                                            onChange={(newValue) => {
                                                setFormulario({
                                                    ...formulario,
                                                    fechaUltimoDividendo: newValue
                                                });
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Box>
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
                                    rows={detalleprestamos}
                                    columns={columns}
                                    getRowId={(datosfilas) => datosfilas.codigo}
                                    components={{
                                        NoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                />
                            </div>
                        </Box>
                    </Card>
                </Fade>
            </Page>
        </>
    );
}
