import { TextField, Button, Card, Grid, InputAdornment, Fade } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import clsx from 'clsx';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CircularProgreso from '../../../../components/Cargando';
import Page from '../../../../components/Page';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { URLAPIGENERAL } from '../../../../config';
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from '../../../../utils/csssistema/estilos';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import MensajesGenericos from '../../../../components/sistema/mensajesgenerico';

export default function FormularioRegistroPersona() {
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${usuario.token}`,
    },
  };
  const navegacion = useNavigate();
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
    { field: 'codigo', headerName: 'Codigo', width: 100 },
    // { field: 'codigo_Usuario', headerName: 'Codigo Usuario', width: 120 },
    { field: 'nombre', headerName: 'Nombre', width: 200, cellClassName: () => clsx('yellowCell') },
    { field: 'apellido', headerName: 'Apellido', width: 130 },
    { field: 'tipo_persona', headerName: 'Tipo de Persona', width: 100 },
    { field: 'cedula', headerName: 'Cedula', width: 100, cellClassName: () => clsx('orangeCell') },
    { field: 'celular', headerName: 'Celular', width: 100 },
    { field: 'correo', headerName: 'Correo', width: 200 },
    { field: 'direccion', headerName: 'Direccion', width: 250 },
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
  const [buscar, setBuscar] = React.useState('');
  const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);
  const [datosfilas, setDatosFilas] = React.useState([]);
  const [openModal2, setopenModal2] = React.useState(false);
  const [mantenimmiento, setMantenimmiento] = React.useState(false);
  const [codigomod, setCodigomod] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [modoMantenimiento, setModoMantenimiento] = React.useState('');
  const [texto, setTexto] = React.useState('');
  const [tipo, setTipo] = React.useState('succes');
  const [guardado, setGuardado] = React.useState(false);

  const Buscar = (e) => {
    // console.log(e.target.value);
    setBuscar(e.target.value);
    const texto = String(e.target.value).toLocaleUpperCase();
    const resultado = resultadobusqueda.filter(
      (b) =>
        b.codigo === parseInt(e.target.value, 10) ||
        String(b.codigousuario).toLocaleUpperCase().includes(texto) ||
        String(b.nombre).toLocaleUpperCase().includes(texto) ||
        String(b.cedula).toLocaleUpperCase().includes(texto)
    );
    setDatosFilas(resultado);
  };

  const Editar = (e) => {
    console.log(e);
    navegacion(`/sistema/parametros/editarpersona`, { state: { id: e.id } });
  };

  React.useEffect(() => {
    async function getDatos() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/usuarios/Listar`, config);
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
      <Page title="Usuario">
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading="Usuario"
              links={[{ name: 'Parametros' }, { name: 'Usuario' }, { name: 'Lista' }]}
              action={
                <Button
                  fullWidth
                  variant="contained"
                  component={RouterLink}
                  to="/sistema/parametros/nuevopersona"
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
            <Box sx={{ ml: 1, mt: 1 }}>
              <Grid container>
                <Grid item md={3} sm={4} xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Buscar"
                    variant="outlined"
                    value={buscar}
                    onChange={Buscar}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ color: 'text.primary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
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
