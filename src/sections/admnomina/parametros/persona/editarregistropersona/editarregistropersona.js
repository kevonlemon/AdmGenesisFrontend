import { TextField, Grid, Card, FormControlLabel, Checkbox, Fade, InputAdornment, IconButton } from '@mui/material';
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { SearchRounded } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import TipoPersona from '../components/tipopersona';
import Page from '../../../../../components/Page'
import { URLAPIGENERAL, URLRUC } from "../../../../../config";
import { esCedula, noEsVacio, esCorreo, obtenerMaquina } from "../../../../../utils/sistema/funciones";
import { MenuMantenimiento } from "../../../../../components/sistema/menumatenimiento";
import CircularProgreso from "../../../../../components/Cargando";
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths'

export default function FormularioRegisroPersona() {
  document.body.style.overflowX = 'hidden';
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      'Authorization': `Bearer ${usuario.token}`
    }
  }
  const [formulario, setFormulario] = React.useState({
    codigo: 0,
    codigo_Usuario: '',
    nombre: '',
    apellido: '',
    tipo_persona: '',
    cedula: '',
    celular: '',
    correo: '',
    direccion: '',
    observacion: '',
    estado: true,
    fecha_ing: new Date(),
    maquina: '',
    usuario: usuario.codigo
  });
  function cambiar(param) {
    let apellido = [];
    let nombre = [];
    let nombrecompleto = param;
    nombrecompleto = nombrecompleto.split(' ');
    apellido = nombrecompleto.slice(0, 2);
    nombre = nombrecompleto.slice(2, 4);
    return [apellido.join(' '), nombre.join(' ')];
  }
  const [error, setError] = React.useState(false);
  const limpiarCampos = () => {
    setFormulario({
      codigo: 0,
      codigo_Usuario: '',
      nombre: '',
      apellido: '',
      tipo_persona: '',
      cedula: '',
      celular: '',
      correo: '',
      direccion: '',
      observacion: '',
      estado: true,
    });
  };
  const consultarCedula = async () => {
    try {
      const { data } = await axios(`${URLRUC}GetCedulas?id=${formulario.cedula}`);
      if (data.length > 0) {
        const [apellido, nombre] = cambiar(data[0].Nombre);
        console.log(apellido, nombre);
        setFormulario({
          ...formulario,
          nombre,
          apellido,
          direccion: data[0].Direccion,
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
  const navegacion = useNavigate();
  const { state } = useLocation();
  const { id } = state
  const { enqueueSnackbar } = useSnackbar();

  const mensajeSistema = (mensaje, variante) => {
    enqueueSnackbar(mensaje, {
      variant: variante,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };
  // const [id, setId] = React.useState([])

  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };
  const noEsVacio = (formulario, propiedades = []) => {
    try {
      let valido = false;
      if (propiedades.length > 0) {
        propiedades.forEach((prop) => {
          // eslint-disable-next-line no-prototype-builtins
          if (formulario.hasOwnProperty(prop)) {
            delete formulario[prop];
          }
        });
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const clave in formulario) {
        // eslint-disable-next-line no-prototype-builtins
        if (formulario.hasOwnProperty(clave)) {
          const valor = String(formulario[clave]).trimEnd().trimStart();
          valido = valor !== '';
          if (!valor) {
            break;
          }
        }
      }
      return valido;
    } catch {
      return false;
    }
  };

  const esCorreo = (param) => {
    try {
      const correo = String(param);
      const valor = correo.includes('@') && correo.includes('.');
      return valor;
    } catch {
      return false;
    }
  };
  // eslint-disable-next-line consistent-return
  const Grabar = async () => {
    console.log(formulario);
    try {
      formulario.maquina = await obtenerMaquina();
      
      const noesvacio = noEsVacio(formulario);
      const nombre = formulario.nombre.length;
      const apellido = formulario.apellido.length;
      const tipopersona = formulario.tipo_persona;
      const cedula = formulario.cedula.length;
      const celular = formulario.celular.trim();
      const correo = esCorreo(formulario.correo);

      const direccion = formulario.direccion.trim();
      if (!noesvacio) {
        mensajeSistema('Complete los campos requeridos', 'error');
        setError(true);
        return false;
      }

      if (nombre < 3) {
        messajeTool('error', 'Verifique su nombre.');
        setError(true);
        return false;
      }
      if (apellido === '') {
        messajeTool('error', 'Verifique su apellido.');
        setError(true);
        return false;
      }
      if (tipopersona === '----') {
        messajeTool('error', 'Seleccione su tipo de persona.');
        setError(true);
        return false;
      }
      if (cedula <= 9) {
        messajeTool('error', 'Verifique su cedula');
        setError(true);
        return false;
      }
      if (celular === '') {
        messajeTool('error', 'Verifique su celular.');
        setError(true);
        return false;
      }
      if (!correo) {
        messajeTool('error', 'Verifique su correo.');
        setError(true);
        return false;
      }
      if (direccion === '') {
        messajeTool('error', 'Verifique su  direccion.');
        setError(true);
        return false;
      }
      const { data } = await axios.post(`${URLAPIGENERAL}/usuarios/editar`, formulario, config);
      if (data === 200) {
        mensajeSistema('Registros guardado correctamente', 'success');
        navegacion(`/sistema/parametros/persona`);
      }
    } catch (error) {
      if (error.response.status === 401) {
        navegacion(`${PATH_AUTH.login}`);
        mensajeSistema("Su inicio de sesion expiro", "error");
      }
      mensajeSistema("Revisar si la informacion ingresada ya se encuentra registrada", "error");
    }
  };
  // const Eliminar = () => {
  //   mensajeSistema('Eliminado Correctamente', 'success');
  //   // limpiarCampos()
  // };
  React.useEffect(() => {
    async function obtenerRegistroPersona() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/usuarios/buscar?codigo=${id}`, config);
        console.log(data)
        setFormulario(data);
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
      }
    }
    obtenerRegistroPersona();
  }, [id]);
  const Volver = () => {
    navegacion(`/sistema/parametros/persona`);
  };
  const Nuevo = () => {
    navegacion(`/sistema/parametros/nuevopersona`);
  };
  return (
    <>
      <Page title="Usuario">
        <MenuMantenimiento modo={false} nuevo={() => Nuevo()} grabar={() => Grabar()} volver={() => Volver()} />
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
            <h1>Ingreso de Persona</h1>
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={1}>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      size="small"
                      type="text"
                      label="Codigo"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={formulario.codigo}
                    />
                  </Grid>
                  {/* <Grid item md={2} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
                      label="Codigo Usuario *"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          codigo_Usuario: e.target.value,
                        });
                      }}
                      value={formulario.codigo_Usuario}
                    />
                  </Grid> */}
                </Grid>

                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
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
                  <Grid item md={2.5} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
                      label="Apellido *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          apellido: e.target.value,
                        });
                      }}
                      value={formulario.apellido}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <TipoPersona data={formulario} />
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={6}>
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
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => consultarCedula()} size="small">
                              <SearchRounded />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={1}>
                  <Grid item md={2} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error}
                      type="number"
                      label="Celular *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          celular: e.target.value,
                        });
                      }}
                      value={formulario.celular}
                    />
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
                      label="Correo *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          correo: e.target.value,
                        });
                      }}
                      value={formulario.correo}
                    />
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={1}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
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
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
                      label="Observacion *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          observacion: e.target.value,
                        });
                      }}
                      value={formulario.observacion}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1}>
                  <Grid item md={3} xs={12} sm={6}>
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