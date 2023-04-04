import { TextField, Button, Card, Grid, InputAdornment, Fade } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import clsx from 'clsx';
import axios from 'axios';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CircularProgreso from '../../../../components/Cargando';
import Page from '../../../../components/Page';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from '../../../../utils/csssistema/estilos';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import { formaterarFecha } from '../../../../utils/sistema/funciones';
import { fCurrency } from '../../../../utils/formatNumber';
import MensajesGenericos from '../../../../components/sistema/mensajesgenerico';

export default function Empleado() {
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${usuario.token}`,
    },
  };
  const navegacion = useNavigate();
  const [openModal2, setopenModal2] = React.useState(false);
  const [mantenimmiento, setMantenimmiento] = React.useState(false);
  const [codigomod, setCodigomod] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [modoMantenimiento, setModoMantenimiento] = React.useState('');
  const [texto, setTexto] = React.useState('');
  const [tipo, setTipo] = React.useState('succes');

  // MENSAJE GENERICO
  const messajeTool = (variant, msg) => {
    const unTrue = true;
    setCodigomod('');
    setNombre('');
    setModoMantenimiento('grabar');
    setTexto(msg);
    setTipo(variant);
    setMantenimmiento(false);
    setopenModal2(unTrue);
  };

  const columns = [
    { field: 'codigo_Empleado', headerName: 'Codigo', width: 85 },
    { field: 'nombres', headerName: 'Nombre', width: 350 },
    { field: 'cedula', headerName: 'Cedula', width: 100 },
    { field: 'direccion', headerName: 'Direccion', width: 200, cellClassName: () => clsx('yellowCell') },
    { field: 'correo', headerName: 'Correo', width: 350 },
    { field: 'telefonos', headerName: 'Telefono', width: 100 },
    {
      field: 'fecing',
      headerName: 'Fecha ingreso',
      width: 100,
      cellClassName: () => clsx('orangeCell'),
      valueFormatter: (params) => {
        if (params.value == null) {
          return '--/--/----';
        }
        const valueFormatted = formaterarFecha(params.value, '-', '/');
        return valueFormatted;
      },
    },
    {
      field: 'fechaNac',
      headerName: 'Fecha Nacimiento',
      width: 150,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '--/--/----';
        }
        const valueFormatted = formaterarFecha(params.value, '-', '/');
        return valueFormatted;
      },
    },
    // { field: 'cargo', headerName: 'Carga', width: 250 },
    // { field: 'departamento', headerName: 'Departamento', width: 250 },
    // { field: 'nivelestudio', headerName: 'Nivel Estudio', width: 200 },
    {
      field: 'sexo',
      headerName: 'Sexo',
      width: 100,
      valueFormatter: (params) => {
        if (params.value === 'M') {
          return 'MASCULINO';
        }
        return 'FEMENINO';
      },
    },
    {
      field: 'sueldoBase',
      headerName: 'Sueldo Base',
      width: 100,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '----';
        }
        return fCurrency(parseFloat(params.value));
      },
    },
    { field: 'observacion', headerName: 'Observacion', width: 250 },
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
  const [buscar, setBuscar] = React.useState('');
  const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);
  const [datosfilas, setDatosFilas] = React.useState([]);
  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
  const Buscar = (e) => {
    // console.log(e.target.value);
    setBuscar(e.target.value);
    const texto = String(e.target.value).toLocaleUpperCase();
    const resultado = resultadobusqueda.filter(
      (b) =>
        String(b.codigo_Empleado).toLocaleUpperCase().includes(texto) ||
        String(b.nombres).toLocaleUpperCase().includes(texto) ||
        String(b.cedula).toLocaleUpperCase().includes(texto)
    );
    setDatosFilas(resultado);
  };

  const Editar = (e) => {
    console.log(e);
    navegacion(`/sistema/parametros/formularioempleado`, { state: { modo: 'editar', id: e.id } });
  };

  const Nuevo = () => {
    navegacion(`/sistema/parametros/formularioempleado`, { state: { modo: 'nuevo', id: 0 } });
  };

  React.useEffect(() => {
    async function getDatos() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/empleados/listar`, config, setMostrarProgreso(true));
        setDatosFilas(data);
        setResultadoBusqueda(data);
      } catch (error) {
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          messajeTool('error', 'Su inicio de sesion expiro');
        } else if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        } else {
          messajeTool('error', 'Problemas al guardar verifique si se encuentra registrado');
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    getDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cerrarModalMensaje = () => {
    setopenModal2((p) => !p);
  };

  return (
    <>
      <MensajesGenericos
        openModal={openModal2}
        closeModal={cerrarModalMensaje}
        mantenimmiento={mantenimmiento}
        codigo={codigomod}
        nombre={nombre}
        modomantenimiento={modoMantenimiento}
        texto={texto}
        tipo={tipo}
      />
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
      <Page title="Empleado">
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading="Empleados"
              links={[{ name: 'Parametros' }, { name: 'Empleado' }, { name: 'Lista' }]}
              action={
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    Nuevo();
                  }}
                  startIcon={<AddCircleRoundedIcon />}
                >
                  Nuevo
                </Button>
              }
            />
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card sx={{ ml: 3, mr: 3, p: 1 }}>
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
                      // disabled
                      fullWidth
                      variant="text"
                      href={`${URLAPILOCAL}/empleados/generarexcel`}
                      target="_blank"
                      startIcon={<ViewComfyRoundedIcon />}
                    >
                      Excel
                    </Button>
                  </Grid>
                  <Grid item md={1.5} sm={3} xs={6}>
                    <Button
                      // disabled
                      fullWidth
                      variant="text"
                      href={`${URLAPILOCAL}/empleados/generarpdf?operador=${usuario.tipo_Persona}`}
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
                  padding: '0.5rem',
                  height: '55vh',
                  width: '100%',
                }}
              >
                <DataGrid
                  density="compact"
                  rowHeight={28}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  onRowDoubleClick={(e) => Editar(e)}
                  sx={estilosdatagrid}
                  rows={datosfilas}
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
