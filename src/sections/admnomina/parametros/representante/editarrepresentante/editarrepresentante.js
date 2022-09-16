import {
  TextField,
  Grid,
  Card,
  FormControlLabel,
  Checkbox,
  Fade,
  InputAdornment,
  IconButton,
} from '@mui/material';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { SearchRounded } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { MenuMantenimiento } from "../../../../../components/sistema/menumatenimiento";
import { URLAPIGENERAL, URLRUC } from '../../../../../config';
import Page from '../../../../../components/Page';
import { noEsVacio, esCorreo } from "../../../../../utils/sistema/funciones";
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';

export default function FormularioRepresentanteLegal() {
  document.body.style.overflowX = 'hidden';
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      'Authorization': `Bearer ${usuario.token}`
    }
  }
  const navegacion = useNavigate();
  const { state } = useLocation()
  const { id } = state;
  const { enqueueSnackbar } = useSnackbar();
  const [errorcorreo, setErrorcorreo] = React.useState(false);
  // const [id, setId] = React.useState([])
  const mensajeSistema = (mensaje, variante) => {
    enqueueSnackbar(mensaje, {
      variant: variante,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };
  const [formulario, setFormulario] = React.useState({
    codigo: '',
    ruc: '',
    cedula: '',
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    fechaingreso: new Date(),
    fechasalida: new Date(),
    registro: '',
    estado: true,
  });

  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };
  // METODO PARA OBTENER EL RUC
  const [error, setError] = React.useState(false);
  // eslint-disable-next-line consistent-return
  const Grabar = async () => {
    console.log(formulario);
    try {
      const noesvacio = noEsVacio(formulario);
      const ruc = formulario.ruc.trim().length;
      const nombre = formulario.nombre.length;
      const telefono = formulario.telefono.length;
      const cedula = formulario.cedula.length;
      const registro = formulario.registro.trim();
      const correo = esCorreo(formulario);
      const direccion = formulario.direccion.trim();
      if (!noesvacio) {
        mensajeSistema('Complete los campos requeridos', 'error');
        setError(true);
        return false;
      }
      if (ruc < 13) {
        messajeTool('error', 'Verifique su Ruc.');
        setError(true);
        return false;
      }
      if (nombre < 3) {
        messajeTool('error', 'El Nombre debe tener al menos 3 caracteres.');
        setError(true);
        return false;
      }

      if (telefono < 8) {
        messajeTool('error', 'El telefono tener al menos 9 digitos.');
        setError(true);
        return false;
      }
      if (cedula < 10) {
        messajeTool('error', 'verifique la cedula ingresada');
        setError(true);
        return false;
      }
      if (registro === '') {
        messajeTool('error', 'Verifique su registro.');
        setError(true);
        return false;
      }
      if (correo === '') {
        messajeTool('error', 'Verigfique su correo.');
        setError(true);
        return false;
      }
      if (direccion === '') {
        messajeTool('error', 'Verifque su direccion.');
        setError(true);
        return false;
      }
      const { data } = await axios.post(`${URLAPIGENERAL}/RepresentanteLegal/editar`, formulario, config);
      if (data === 200) {
        mensajeSistema('Registros guardado correctamente', 'success');
        Volver()
      }
    } catch (error) {
      mensajeSistema('Error al guardar el registro', 'error');
    }
  };
  // const Eliminar = () => {
  //   mensajeSistema('Eliminado Correctamente', 'success');
  //   // limpiarCampos()
  // };
  const limpiarCampos = () => {
    setFormulario({
      codigo: 0,
      ruc: '',
      cedula: '',
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      fecha_ingreso: new Date(),
      fecha_salida: new Date(),
      registro: '',
      estado: true,
    });
  };
  const consultarRuc = async () => {
    try {
      const { data } = await axios(`${URLRUC}GetRucs?id=${formulario.ruc}`);
      if (data.length > 0) {
        setFormulario({
          ...formulario,
          ruc: data[0].Num_ruc,
          cedula: data[0].Representante_legal,
          nombre: data[0].Agente_representante,
          direccion: data[0].Direccion_completa,
        });
      } else {
        mensajeSistema('No se encontro ninguna identificacion', 'error');
        limpiarCampos();
      }
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
  };

  React.useEffect(() => {
    async function obtenerRepresentante() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/RepresentanteLegal/buscar?codigo=${id}`, config);
        setFormulario(data);
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
    obtenerRepresentante();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const Volver = () => {
    navegacion(`/sistema/parametros/representante`);
  };
  const Nuevo = () => {
    navegacion(`/sistema/parametros/nuevorepresentante`);
  };
  return (
    <>
      <Page title="Representantes">
        <MenuMantenimiento modo={false} nuevo={() => Nuevo()} grabar={() => Grabar()} volver={() => Volver()} />
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
            <h1>Editar Representantes</h1>
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={1}>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2} sm={3} xs={12}>
                    <TextField
                      fullWidth
                      disabled
                      size="small"
                      label="Codigo"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={formulario.codigo}
                      sx={{
                        backgroundColor: "#e5e8eb",
                        border: "none",
                        borderRadius: '10px',
                        color: "#212B36"
                      }}
                    />
                  </Grid>
                  <Grid item md={3} sm={4} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      type="number"
                      error={error}
                      label="Ruc *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          ruc: e.target.value,
                        });
                      }}
                      value={formulario.ruc}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => consultarRuc()} size="small">
                              <SearchRounded />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2} sm={3} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      type="number"
                      error={error}
                      label="Cedula *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          cedula: e.target.value,
                        });
                      }}
                      value={formulario.cedula}
                    />
                  </Grid>
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      label="Nombre *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          nombre: e.target.value,
                        });
                      }}
                      value={formulario.nombre}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={6} sm={8} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      label="Direccion *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          direccion: e.target.value,
                        });
                      }}
                      value={formulario.direccion}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2} sm={3} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      type="tel"
                      label="Telefono *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          telefono: e.target.value,
                        });
                      }}
                      value={formulario.telefono}
                    />
                  </Grid>
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      type="email"
                      error={errorcorreo}
                      label="Correo *"
                      variant="outlined"
                      helperText={errorcorreo ? 'correo invalido: mailto:example@example.com' : ''}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (!esCorreo(input)) setErrorcorreo(true);
                        else setErrorcorreo(false);
                        setFormulario({
                          ...formulario,
                          correo: input,
                        });
                        // setValue(input)
                      }}
                      value={formulario.correo}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2} sm={4} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDatePicker
                        label="Fecha de ingreso"
                        inputFormat="dd/MM/yyyy"
                        value={formulario.fecha_ingreso}
                        onChange={(newValue) => {
                          setFormulario({
                            ...formulario,
                            fecha_ingreso: newValue,
                          });
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={2} sm={4} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDatePicker
                        label="Fecha de salida"
                        inputFormat="dd/MM/yyyy"
                        value={formulario.fecha_salida}
                        onChange={(newValue) => {
                          setFormulario({
                            ...formulario,
                            fecha_salida: newValue,
                          });
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={2} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      type="text"
                      error={error}
                      label="Registro *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          registro: e.target.value,
                        });
                      }}
                      value={formulario.registro}
                    />
                  </Grid>
                  <Grid item md={2} sm={2} xs={12}>
                    <FormControlLabel
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          estado: e.target.checked,
                        });
                      }}
                      control={<Checkbox checked={formulario.estado} />}
                      label="Activo"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Fade>
      </Page>
    </>
  );
}