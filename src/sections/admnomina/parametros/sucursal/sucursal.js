import { TextField, Button, Card, Grid, InputAdornment, Fade } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import axios from "axios";
import { useSnackbar } from 'notistack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import clsx from 'clsx';
import { URLAPIGENERAL } from '../../../../config';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import Page from '../../../../components/Page';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from "../../../../utils/csssistema/estilos";
import { CustomNoRowsOverlay } from "../../../../utils/csssistema/iconsdatagrid";



export default function FormularioSucursal() {
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
    { field: 'nombre', headerName: 'Nombre', width: 200, cellClassName: () => clsx('yellowCell') },
    { field: 'telefono', headerName: 'Telefono', width: 100 },
    { field: 'punto_emision', headerName: 'Punto de emision', width: 130 },
    { field: 'celular', headerName: 'Celular', width: 120 },
    { field: 'administrador', headerName: 'Administrador', width: 200 },
    { field: 'correo', headerName: 'Correo', width: 200 },
    { field: 'direccion', headerName: 'Direccion', width: 250 },
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

    {
      field: 'matriz',
      headerName: 'Matriz',
      width: 100,
      renderCell: (param) =>
        param.row.esmatriz === true ? (
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
  const [datosfilas, setDatosFilas] = React.useState([]);
  // const [, setItems] = React.useState([]);
  const [buscar, setBuscar] = React.useState('');
  const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);

  const Buscar = (e) => {
    // console.log(e.target.value);
    setBuscar(e.target.value);
    const texto = String(e.target.value).toLocaleUpperCase();
    const resultado = resultadobusqueda.filter(
      (b) =>
        b.codigo === parseInt(e.target.value, 10) ||
        String(b.nombre).toLocaleUpperCase().includes(texto)
    );
    setDatosFilas(resultado);
  };
  const Editar = (e) => {
    navegacion(`/sistema/parametros/editarsucursal`, { state: { id: e.id } });
  };

  React.useEffect(() => {
    async function getDatos() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/sucursales/listar`, config);
        setDatosFilas(data);
        setResultadoBusqueda(data)
      } catch (error) {
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          mensajeSistema("Su inicio de sesion expiro", "error");
        }
        else if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        } else {
          mensajeSistema("Problemas con la base de datos", "error");
        }
      }
    }
    getDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Page title="Secursal">
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading="Sucursal"
              links={[
                { name: 'Parametros' },
                { name: 'Sucursal' },
                { name: 'Lista' },
              ]}
              action={
                <Button
                  fullWidth
                  variant="contained"
                  component={RouterLink}
                  to="/sistema/parametros/nuevosucursal"
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
                  onRowDoubleClick={(e) => Editar(e)}
                  sx={estilosdatagrid}
                  rows={datosfilas}
                  columns={columns}
                  components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                  }}
                  getRowId={(datosfilas) => datosfilas.codigo}
                />
              </div>
            </Box>
          </Card>
        </Fade>
      </Page>
    </>
  );
}
