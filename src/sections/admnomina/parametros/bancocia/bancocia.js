import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DataGrid, esES } from '@mui/x-data-grid';
import clsx from 'clsx';
import { Box, TextField, Button, Card, Grid, InputAdornment, Fade, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircle';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import Page from '../../../../components/Page';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from "../../../../utils/csssistema/estilos";
import { CustomNoRowsOverlay } from "../../../../utils/csssistema/iconsdatagrid";
import CircularProgreso from '../../../../components/Cargando';

// ----------------------------------------------------------------------

export default function CntBancoCia() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  document.body.style.overflowX = 'hidden';
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      'Authorization': `Bearer ${usuario.token}`
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };
  // NAVEGACION
  const navegacion = useNavigate();

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
    // { field: 'codigo', headerName: 'Codigo', width: 150 },
    { field: 'inicial_Banco', headerName: 'Inical Banco', width: 150 },
    { field: 'nombre', headerName: 'Nombre', width: 180, cellClassName: () => clsx('yellowCell') },
    { field: 'cuenta', headerName: 'Cuenta', width: 140, cellClassName: () => clsx('blueCell') },
    { field: 'numero_Cuenta', headerName: 'Numero de Cuenta', width: 140, cellClassName: () => clsx('orangeCell') },
    {
      field: 'tipo_Cuenta', headerName: 'Tipo de Cuenta', width: 150, align: 'center',
      renderCell: (param) =>
        // console.log("mira",param)
        param.row.tipo_Cuenta === 'COR' ? ('CORRIENTE') : ('AHORRO'),
    },
    { field: 'ultimo_Cheque', headerName: 'Ultimo Cheque', width: 140, align: 'center' },


    {
      field: 'contador_Automatico',
      headerName: 'Contador Automatico',
      width: 200,
      align: 'center',
      renderCell: (param) =>
        // console.log("mira",param)
        param.row.contador_Automatico === true ? (
          <Button variant="containded" style={styleActive}>
            Activo
          </Button>
        ) : (
          <Button variant="containded" style={styleInactive}>
            Inactivo
          </Button>
        ),
    },
    { field: 'cuenta_Cheque_Fecha', headerName: 'Cuenta Cheque Feha', width: 200 },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 120,
      align: 'center',
      renderCell: (param) =>
        // console.log("mira",param)
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
    { field: 'anio', headerName: 'Año', width: 90, align: 'center' },
    // { field: 'ultima_Conciliacion', type: 'date', headerName: 'Ultima Concilacion', width: 200, valueGetter: ({ value }) => value && new Date(value), },
  ];

  // bloque de evento Edit()
  const Edit = (e) => {
    navigate(`/sistema/parametros/editarbancocia`, { state: { id: e.id } });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getDatos() {
      try {
        const { data } = await axios(`${URLAPILOCAL}/bancos/listar`, config, setMostrarProgreso(true));
        setDatosFilas(data);
        setResultadoBusqueda(data);
        setDatosFilas(data);
        // Funciones de busqueda
        setItems(data);
        setResultadoBusqueda(data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate(`${PATH_AUTH.login}`);
          mensajeSistema("Su inicio de sesion expiro", "error");
        }
        else if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        } else {
          mensajeSistema("Problemas con la base de datos", "error");
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    getDatos();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [datosfilas, setDatosFilas] =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useState([]);
  // -----------------------Bloque de useState para Filtrar o Buscar id de la tabla------------------------->
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rowss, setItems] = React.useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [buscar, setBuscar] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);

  const Buscar = (e) => {
    // console.log(e.target.value);
    const texto1 = e.target.value.toLocaleUpperCase();
    setBuscar(texto1);
    const texto = String(e.target.value).toLocaleUpperCase();
    const resultado = resultadobusqueda.filter(
      (b) =>
        String(b.codigo).toLocaleUpperCase().includes(texto) || String(b.nombre).toLocaleUpperCase().includes(texto)
    );
    setItems(resultado);
  };

  return (
    <>
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
      <Page title="Banco Cia">
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading=" Banco Cia"
              links={[
                { name: 'Parametros' },
                { name: 'Banco Cia' },
                { name: 'Lista' },
              ]}
              action={
                <Button
                  fullWidth
                  variant="contained"
                  component={RouterLink}
                  to="/sistema/parametros/nuevobancocia"
                  startIcon={<AddCircleRoundedIcon />}
                >
                  Nuevo
                </Button>
              }
            />
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card sx={{ ml: 3, mr: 3, p: 1, mt: 1 }}>
            <Card sx={{ height: 'auto', width: '100%' }}>
              <Box sx={{ ml: 2, mr: 3, pt: 2 }}>
                <Grid container>
                  <Grid item container>
                    <Grid item xs={12} sm={4} md={4}>
                      <Grid>
                        <TextField
                          fullWidth
                          label="Buscar"
                          value={buscar}
                          onChange={Buscar}
                          id="outlined-size-small"
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                <IconButton aria-label="SearchIcon">
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={8} md={8}>
                      <Grid container justifyContent="flex-end" direction="row">
                        <Grid item md={2} sm={2} xs={12}>
                          <Button
                            fullWidth
                            variant="text"
                            startIcon={<ViewComfyRoundedIcon />}
                            href={`${URLAPIGENERAL}/bancos/generarexcel`}
                          >
                            Excel
                          </Button>
                        </Grid>
                        <Grid item md={2} sm={2} xs={12}>
                          <Button
                            fullWidth
                            variant="text"
                            startIcon={<PictureAsPdfRoundedIcon />}
                            href={`${URLAPIGENERAL}/bancos/generarpdf`}
                            target="_blank"
                          >
                            PDF
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
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
                    density="compact"
                    rowHeight={28}
                    onRowDoubleClick={(e) => Edit(e)}
                    sx={estilosdatagrid}
                    rows={rowss}
                    columns={columns}
                    getRowId={(rows) => rows.codigo}
                    components={{
                      NoRowsOverlay: CustomNoRowsOverlay,
                    }}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  />
                </div>
              </Box>
            </Card>
          </Card>
        </Fade>
      </Page>
    </>
  );
}
