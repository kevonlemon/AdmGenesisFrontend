import * as React from 'react';
import { useState } from 'react';
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
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import CircularProgreso from '../../../../components/Cargando';
import { PATH_DASHBOARD, PATH_OPSISTEMA, PATH_PAGE, PATH_AUTH } from '../../../../routes/paths';
import { URLAPIGENERAL, URLAPILOCAL, CORS } from '../../../../config';
import ModalEmpleadosD from './components/modalempleadosd';
import ModalEmpleadosH from './components/modalempleadosh';
import { estilosdetabla, estilosdatagrid, estilosacordeon } from '../../../../utils/csssistema/estilos';
import Page from '../../../../components/Page';
import { formaterarFecha, generarCodigo, obtenerMaquina } from '../../../../utils/sistema/funciones';
import serviciosMantenimientoGenerico from '../../../../servicios/parametros_del_sistema/servicios_genericos';
import RequiredTextField from '../../../../sistema/componentes/formulario/RequiredTextField';
import MensajesGenericos from '../../../../components/sistema/mensajesgenerico';

export default function AprobacionSolicitud() {
  const user = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const navegacion = useNavigate();

  // Hook para mensajes genéricos
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('succes');
  const [openMensaje, setOpenMensaje] = useState(false);
  const [noExisteEmpleadoD, setNoExisteEmpleadoD] = useState(false);
  const [noExisteEmpleadoH, setNoExisteEmpleadoH] = useState(false);
  const [noSesion, setNoSesion] = useState(false);
  const mensajeGenerico = (tipo, msj) => {
    setTexto(msj);
    setTipo(tipo);
    setOpenMensaje(true);
  };

  const cerrarMensaje = () => {
    if (noSesion) {
      setOpenMensaje((p) => !p);
      setNoSesion(false);
      navegacion(`${PATH_AUTH.login}`);
    }
    if (noExisteEmpleadoD) {
      setOpenMensaje((p) => !p);
      setNoExisteEmpleadoD(false);
      setOpenModalD(true);
      setOpenMensaje((p) => !p);
    }
    if (noExisteEmpleadoH) {
      setOpenMensaje((p) => !p);
      setNoExisteEmpleadoH(false);
      setOpenModalH(true);
      setOpenMensaje((p) => !p);
    }
    setOpenMensaje((p) => !p);
  };

  function formatDate(fecha) {
    const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    return formattedDate;
  }

  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, hide: true },
    { field: 'codigo', headerName: 'Codigo', width: 100, hide: true },
    { field: 'numero', headerName: 'Numero', width: 100 },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 120,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '--/--/----';
        }
        const valueFormatted = formaterarFecha(params.value, '-', '/');
        return valueFormatted;
      },
    },
    { field: 'motivo', headerName: 'Motivo', width: 250 },
    { field: 'empleado', headerName: 'Empleado', width: 350 },
    {
      headerAlign: 'center',
      headerName: 'APROBAR',
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 80,
      align: 'center',
      renderHeader: () => <strong>{'Selecc'}</strong>,
    },
  ];

  const [rows, setRows] = React.useState([]);

  const [formulario, setFormulario] = React.useState({
    empleadodesde: 0,
    codigoempleadodesde: '',
    nombreempleadodesde: '',
    empleadohasta: 0,
    codigoempleadohasta: '',
    nombreempleadohasta: '',
    fechadesde: new Date(),
    fechahasta: new Date(),
    motivo: 'todos'
  });
  const [listAprobados, setListAprobados] = React.useState([]);
  const [listamotivos, setListaMotivos] = React.useState([]);
  const [openModalD, setOpenModalD] = React.useState(false);
  const [openModalH, setOpenModalH] = React.useState(false);

  const [empleadoD, setEmpleadoD] = React.useState([]);
  const [empleadoH, setEmpleadoH] = React.useState([]);

  const [tiposBusquedasD, setTiposBusquedaD] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  const toggleShowD = () => setOpenModalD((p) => !p);
  const handleCallbackChildD = (e) => {
    const item = e.row;
    setFormulario({
      ...formulario,
      empleadodesde: item.id,
      codigoempleadodesde: item.codigo,
      nombreempleadodesde: item.nombre,
    });
    toggleShowD();
  };

  const [tiposBusquedasH, setTiposBusquedaH] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  const toggleShowH = () => setOpenModalH((p) => !p);
  const handleCallbackChildH = (e) => {
    const item = e.row;
    setFormulario({
      ...formulario,
      empleadohasta: item.id,
      codigoempleadohasta: item.codigo,
      nombreempleadohasta: item.nombre,
    });
    toggleShowH();
  };

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
      fechahasta: lastDay,
      motivo: 'todos'
    });
    setRows([]);
  };

  const validacion = () => {
    const fechadesde = formatDate(formulario.fechadesde);
    const fechahasta = formatDate(formulario.fechahasta);
    const empleadodesde = formulario.codigoempleadodesde;
    const empleadohasta = formulario.codigoempleadohasta;

    if (fechadesde > fechahasta) {
      mensajeGenerico('error', 'La fecha DESDE no debe ser mayor a la fecha tope');
      return false;
    }
    if (empleadodesde === '' || formulario.nombreempleadodesde === '') {
      mensajeGenerico('error', 'Ingrese un código de empleado DESDE');
      return false;
    }
    if (empleadohasta === '' || formulario.nombreempleadohasta === '') {
      mensajeGenerico('error', 'Ingrese un código de empleado HASTA');
      return false;
    }
    return true;
  };

  const buscarSolicitudes = async () => {
    if (validacion() === false) {
      return 0;
    }
    const fechadesde = formatDate(formulario.fechadesde);
    const fechahasta = formatDate(formulario.fechahasta);
    try { 
      const { data } = await axios.get(
        `${URLAPIGENERAL}/AprobacionSolicitudes/Listar?empleadodesde=${formulario.empleadodesde}&empleadohasta=${formulario.empleadohasta}&fechadesde=${fechadesde}&fechahasta=${fechahasta}&motivo=${formulario.motivo}`
      );
      if (data.length === 0) {
        mensajeGenerico('warning', 'No se encontraron solicitudes para los datos dados');
      } else {
        let codigo = 0;
        data.forEach((f) => {
          codigo += 1;
          f.id = codigo;
        });
        setRows(data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        setNoSesion(true);
        mensajeGenerico('warning', 'Su sesión expiró');
      } else if (error.response.status === 500) {
        navegacion(`${PATH_PAGE.page500}`);
      } else {
        mensajeGenerico('error', 'Problemas al consultar verifique los datos e inténtelo nuevamente');
      }
    } finally {
      setMostrarProgreso(false);
    }
  };

  const Procesar = async () => {
    try {
      const { data } = await axios.post(
        `${URLAPIGENERAL}/AprobacionSolicitudes/Actualizar`,
        listAprobados,
        config,
        setMostrarProgreso(true)
      );
      if (data === 200) {
        mensajeGenerico('succes', 'Solicitudes aprobadas correctamente');
        Nuevo();
      }
    } catch (error) {
      if (error.response.status === 401) {
        setNoSesion(true);
        mensajeGenerico('error', 'Su sesión expiró');
      } else if (error.response.status === 500) {
        navegacion(`${PATH_PAGE.page500}`);
      } else {
        mensajeGenerico('error', 'Problemas al procesar las aprobaciones, inténtelo nuevamente');
      }
    } finally {
      setMostrarProgreso(false);
    }
  };

  React.useEffect(() => {
    async function getDatos() {
      try {
        serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_MOTIVO_SOLICITUD' })
        .then(res => {
          setListaMotivos(res)
        })
        const { data } = await axios(`${URLAPIGENERAL}/empleados/listar`, config, setMostrarProgreso(true));
        const listaempleadodesde = data.map((m) => ({ id: m.codigo, codigo: m.codigo_Empleado, nombre: m.nombres }));
        const listaempleadohasta = data.map((m) => ({ id: m.codigo, codigo: m.codigo_Empleado, nombre: m.nombres }));
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
          nombreempleadohasta: lastItem.nombre
        });
      } catch (error) {
        if (error.response.status === 401) {
          setNoSesion(true);
          mensajeGenerico('warning', 'Su sesión expiró');
        } else if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        } else {
          mensajeGenerico('error', 'Problemas al obtener datos, inténtelo nuevamente');
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    getDatos();
  }, []);

  // -----------------------------------------------------------------------------------------------------
  async function buscarEmpleados(empleado) {
    if (empleado === 'desde') {
      if (formulario.codigoempleadodesde === '') {
        setOpenModalD(true);
      } else {
        try {
          const { data } = await axios(
            `${URLAPILOCAL}/empleados/obtenerxcodigo?codigo=${formulario.codigoempleadodesde === '' ? 'string' : formulario.codigoempleadodesde
            }`,
            config
          );
          if (data.length === 0) {
            setNoExisteEmpleadoD(true);
            mensajeGenerico('warning', 'Código no encontrado');
          } else {
            setFormulario({
              ...formulario,
              empleadodesde: data.codigo,
              codigoempleadodesde: data.codigo_Empleado,
              nombreempleadodesde: data.nombres,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (formulario.codigoempleadohasta === '') {
        setOpenModalH(true);
      } else {
        try {
          const { data } = await axios(
            `${URLAPILOCAL}/empleados/obtenerxcodigo?codigo=${formulario.codigoempleadohasta === '' ? 'string' : formulario.codigoempleadohasta
            }`,
            config
          );
          if (data.length === 0) {
            setNoExisteEmpleadoH(true);
            mensajeGenerico('warning', 'Código no encontrado');
          } else {
            setFormulario({
              ...formulario,
              empleadohasta: data.codigo,
              codigoempleadohasta: data.codigo_Empleado,
              nombreempleadohasta: data.nombres,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  // -----------------------------------------------------------------------------------------------------

  return (
    <>
      <MensajesGenericos openModal={openMensaje} closeModal={cerrarMensaje} texto={texto} tipo={tipo} />
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
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
            <Box>
              <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                  <Box>
                    <HeaderBreadcrumbs
                      heading="Aprobación de Solicitud"
                      links={[
                        { name: 'Inicio', href: PATH_DASHBOARD.root },
                        { name: 'Aprobación de Solicitud' },
                        { name: 'Procesos' },
                      ]}
                      action={
                        <Button
                          fullWidth
                          disabled={listAprobados.length === 0}
                          // variant="text"
                          variant="contained"
                          size="medium"
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
            <Accordion defaultExpanded>
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
                    <Grid item md={8} sm={12} xs={12}>
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
                                      fechadesde: newValue,
                                    });
                                    setRows([]);
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
                                      fechahasta: newValue,
                                    });
                                    setRows([]);
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
                                      codigoempleadodesde: e.target.value,
                                    });
                                    setRows([]);
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const empleado = 'desde';
                                            buscarEmpleados(empleado);
                                          }}
                                        >
                                          <SearchRoundedIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
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
                                    readOnly: true,
                                  }}
                                  sx={{
                                    backgroundColor: '#e5e8eb',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#212B36',
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
                                      codigoempleadohasta: e.target.value,
                                    });
                                    setRows([]);
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const empleado = 'hasta';
                                            buscarEmpleados(empleado);
                                          }}
                                        >
                                          <SearchRoundedIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
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
                                    readOnly: true,
                                  }}
                                  sx={{
                                    backgroundColor: '#e5e8eb',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#212B36',
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={3} sm={6} xs={12}>
                            <TextField
                              select
                              label="Motivo"
                              value={formulario.motivo}
                              onChange={(e) => {
                                setFormulario({
                                  ...formulario,
                                  motivo: e.target.value,
                                });
                                setRows([]);
                              }}
                              fullWidth
                              size="small"
                            >
                              <MenuItem key="todos" value="todos">TODOS</MenuItem>
                              {listamotivos.map((m) => (
                                <MenuItem key={m.codigo} value={m.codigo}>
                                  {' '}
                                  {m.nombre}{' '}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        </Grid>
                      </Box>
                      {/* </Card> */}
                    </Grid>

                    <Grid container item xs={12} spacing={1} justifyContent="flex-start">
                      <Grid item md={1.2} sm={2} xs={6}>
                        <Button
                          fullWidth
                          variant="text"
                          size="small"
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
                          size="small"
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
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={estilosacordeon}
                >
                  <Typography sx={{ fontWeight: 'bold' }}>Solicitudes</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderRadius: '0.5rem' }}>
                  <Box sx={estilosdetabla}>
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
                        getRowId={(rows) => rows.id}
                        checkboxSelection
                        components={{
                          NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        onSelectionModelChange={(newSelectionModel) => {
                          const datos = [];
                          newSelectionModel.forEach((cd) => {
                            rows.forEach((d) => {
                              if (cd === d.id) {
                                const json = {
                                  codigosolicitud: d.codigo,
                                  aprobacion: true,
                                };
                                datos.push(json);
                              }
                            });
                          });
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
  );
}
