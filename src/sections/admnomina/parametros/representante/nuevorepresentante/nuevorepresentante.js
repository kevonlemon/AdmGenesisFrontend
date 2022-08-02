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
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { SearchRounded } from '@mui/icons-material';
import { MenuMantenimiento } from "../../../../../components/sistema/menumatenimiento";
import { URLAPIGENERAL, URLRUC } from '../../../../../config';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import Page from '../../../../../components/Page';
import { noEsVacio, esCorreo } from "../../../../../utils/sistema/funciones";

export default function FormularioRepresentanteLegal() {
  document.body.style.overflowX = 'hidden';
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      'Authorization': `Bearer ${usuario.token}`
    }
  }
  const navegacion = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [errorcorreo, setErrorcorreo] = React.useState(false);
  // MENSAJE GENERICO
  const mensajeSistema = (mensaje, variante) => {
    enqueueSnackbar(mensaje, {
      variant: variante,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };
  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };
  // FORMULARIO DE ENVIO
  const [formulario, setFormulario] = React.useState({
    codigo: 0,
    ruc: '',
    cedula: '',
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    fecha_Ingreso: new Date(),
    fecha_Salida: new Date(),
    registro: '',
    estado: true,
  });
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
      mensajeSistema('Revisar que la credencial sea la correcta', 'error');
      limpiarCampos();
    }
  };
  const limpiarCampos = () => {
    setFormulario({
      codigo: 0,
      ruc: '',
      cedula: '',
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      estado: true,
    });
  };

  // METODO PARA OBTENER EL RUC
  const [error, setError] = React.useState(false);

  // GUARDAR INFORMACION
  // eslint-disable-next-line consistent-return
  const Grabar = async () => {
    // console.log(formulario)
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
      const { data } = await axios.post(`${URLAPIGENERAL}/RepresentanteLegal`, formulario, config);
      if (data === 200) {
        mensajeSistema('Registros guardado correctamente', 'success');
        navegacion(`/sistema/parametros/representante`);
      }
      // navegacion(`${PATH_SISTEMA.parametros_del_sistema.mantenimiento.representante.inicio}`);
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
  const Volver = () => {
    navegacion(`/sistema/parametros/representante`);
  };
  const Nuevo = () => {
    // navegacion(`${PATH_SISTEMA.parametros_del_sistema.mantenimiento.representante.nuevo}`);
    limpiarCampos();
  };
  return (
    <>
      <Page title="Representantes">
        <MenuMantenimiento modo nuevo={() => Nuevo()} grabar={() => Grabar()} volver={() => Volver()} />
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
            <h1>Ingreso de Representantes</h1>
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
                    />
                  </Grid>
                  <Grid item md={3} sm={4} xs={12}>
                    <TextField
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
                    <TextField
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
                    <TextField
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
                    <TextField
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
                    <TextField
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
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      error={errorcorreo}
                      label="Correo *"
                      variant="outlined"
                      helperText={errorcorreo ? 'correo invalido: example@example.com' : ''}
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
                    <TextField
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
                      value={formulario.estado}
                      control={<Checkbox defaultChecked disabled />}
                      label="Estado"
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
