import { TextField, Grid, Card, FormControlLabel, Checkbox, Fade, InputAdornment, IconButton } from '@mui/material';
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { SearchRounded } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import TipoPersona from '../components/tipopersona';
import Page from '../../../../../components/Page';
import { URLAPIGENERAL, URLRUC } from '../../../../../config';
import { esCedula, noEsVacio, esCorreo, obtenerMaquina } from '../../../../../utils/sistema/funciones';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
import CircularProgreso from '../../../../../components/Cargando';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
import MensajesGenericos from '../../../../../components/sistema/mensajesgenerico';

export default function FormularioRegisroPersona() {
  document.body.style.overflowX = 'hidden';
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${usuario.token}`,
    },
  };
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
    usuario: usuario.codigo,
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
  const [openModal2, setopenModal2] = React.useState(false);
  const [mantenimmiento, setMantenimmiento] = React.useState(false);
  const [codigomod, setCodigomod] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [modoMantenimiento, setModoMantenimiento] = React.useState('');
  const [texto, setTexto] = React.useState('');
  const [tipo, setTipo] = React.useState('succes');
  const [guardado, setGuardado] = React.useState(false);

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
        messajeTool('error', 'No se encontro ninguna identificacion');
        limpiarCampos();
      }
    } catch (error) {
      messajeTool('error', 'Revisar que la credencial sea la correcta');
      limpiarCampos();
    }
  };
  const navegacion = useNavigate();
  const { state } = useLocation();
  const { id } = state;

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
        messajeTool('error', 'Complete los campos requeridos');
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
        setGuardado(true);
        messajeTool('succes', 'Registros guardado correctamente');
      }
    } catch (error) {
      if (error.response.status === 401) {
        navegacion(`${PATH_AUTH.login}`);
        messajeTool('error', 'Su inicio de sesion expiro');
      }
      messajeTool('error', 'Revisar si la informacion ingresada ya se encuentra registrada');
    }
  };

  React.useEffect(() => {
    async function obtenerRegistroPersona() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/usuarios/buscar?codigo=${id}`, config);
        console.log(data);
        setFormulario(data);
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
    obtenerRegistroPersona();
  }, [id]);

  const Volver = () => {
    navegacion(`/sistema/parametros/persona`);
  };

  const Nuevo = () => {
    navegacion(`/sistema/parametros/nuevopersona`);
  };

  const cerrarModalMensaje = () => {
    if (guardado === true) {
      setopenModal2((p) => !p);
      setGuardado(false);
      Volver();
    }
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
        <MenuMantenimiento modo={false} nuevo={() => Nuevo()} grabar={() => Grabar()} volver={() => Volver()} />
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
            <h1>Editar Persona</h1>
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
                      sx={{
                        backgroundColor: '#e5e8eb',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#212B36',
                      }}
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
                    <RequiredTextField
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
                    <RequiredTextField
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
                    <RequiredTextField
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
                    <RequiredTextField
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
                    <RequiredTextField
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
                    <RequiredTextField
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
