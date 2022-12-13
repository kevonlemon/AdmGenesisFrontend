import { TextField, Grid, Card, FormControlLabel, Checkbox, Fade, InputAdornment, IconButton } from '@mui/material';
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { SearchRounded } from '@mui/icons-material';
import axios from 'axios';
import TipoPersona from '../components/tipopersona';
import Page from '../../../../../components/Page';
import { URLAPIGENERAL, URLRUC } from '../../../../../config';
import { obtenerMaquina } from '../../../../../utils/sistema/funciones';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
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
  const [errorcorreo, setErrorcorreo] = React.useState(false);
  const [openModal2, setopenModal2] = React.useState(false);
  const [mantenimmiento, setMantenimmiento] = React.useState(false);
  const [codigomod, setCodigomod] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [modoMantenimiento, setModoMantenimiento] = React.useState('');
  const [texto, setTexto] = React.useState('');
  const [tipo, setTipo] = React.useState('succes');

  // MENSAJE GENERICO
  // MENSAJE GENERICO
  const messajeTool = (variant, msg, modoman) => {
    const unTrue = true;
    setCodigomod(formulario.codigo);
    setNombre(formulario.nombre);
    setModoMantenimiento(modoman);
    setTexto(msg);
    setTipo(variant);
    setMantenimmiento(true);
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

  const esCorreo = (param) => {
    try {
      const correo = String(param);
      const valor = correo.includes('@') && correo.includes('.');
      return valor;
    } catch {
      return false;
    }
  };

  const validation = () => {
    // const noesvacio = noEsVacio(formulario);
    const nombre = formulario.nombre.length;
    const apellido = formulario.apellido.length;
    const tipopersona = formulario.tipo_persona;
    const cedula = formulario.cedula.length;
    const celular = formulario.celular.trim();
    const correo = esCorreo(formulario.correo);
    const clave = formulario.clave.length;
    const direccion = formulario.direccion.trim();
    // if (!noesvacio) {
    //   mensajeSistema('Complete los campos requeridos', 'error');
    //   setError(true);
    //   return false;
    // }
    if (cedula <= 9) {
      messajeTool('error', 'Debe ingresar una Cédula');
      setError(true);
      return false;
    }

    if (clave <= 2) {
      messajeTool('error', 'Debe ingresar una Clave');
      setError(true);
      return false;
    }
    if (nombre < 3) {
      messajeTool('error', 'Debe ingresar un Nombre.');
      setError(true);
      return false;
    }
    if (apellido < 3) {
      messajeTool('error', 'Debe ingresar un Apellido');
      setError(true);
      return false;
    }
    if (tipopersona === '----') {
      messajeTool('error', 'Debe seleccionar un tipo de persona');
      setError(true);
      return false;
    }

    if (celular <= 10) {
      messajeTool('error', 'Debe ingresar un número de Celular');
      setError(true);
      return false;
    }
    if (!correo) {
      messajeTool('error', 'Debe ingresar un Correo');
      setError(true);
      return false;
    }
    if (direccion === '') {
      messajeTool('error', 'Debe ingresar una Dirección');
      setError(true);
      return false;
    }
    return true;
  };

  // eslint-disable-next-line consistent-return
  const Grabar = async () => {
    const maquina = await obtenerMaquina();
    // const { codigo } = JSON.parse(window.localStorage.getItem('session'));
    if (validation() === false) {
      return 0;
    }

    try {
      const Json = {
        fecha_ing: new Date(),
        maquina: `${maquina}`,
        codigo: formulario.codigo,
        codigo_Usuario: formulario.codigo_Usuario,
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        tipo_persona: formulario.tipo_persona,
        cedula: formulario.cedula,
        celular: formulario.celular,
        correo: formulario.correo,
        clave: formulario.clave,
        direccion: formulario.direccion,
        observacion: formulario.observacion,
        usuario: formulario.usuario,
        estado: formulario.estado,
      };
      const { data } = await axios.post(`${URLAPIGENERAL}/usuarios/editar`, Json, config);
      if (data === 200) {
        messajeTool('succes', '', 'Editar');
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
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={5} xs={12}>
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
                      sx={{
                        backgroundColor: '#e5e8eb',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#212B36',
                      }}
                    />
                  </Grid>
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      label="Cedula *"
                      helperText="La Cédula debe tener 10 dígitos"
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
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
                      label="Codigo Usuario *"
                      helperText="El Código de Usuario debe tener al menos 3 caracteres"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          codigo_Usuario: e.target.value,
                        });
                      }}
                      value={formulario.codigo_Usuario}
                    />
                  </Grid>
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      type="password"
                      label="Clave *"
                      variant="outlined"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          clave: e.target.value,
                        });
                      }}
                      value={formulario.clave}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
                      label="Nombre *"
                      helperText="El Nombre debe tener al menos 3 caracteres"
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
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      type="text"
                      label="Apellido *"
                      helperText="El Apellido debe tener al menos 3 caracteres"
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

                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      type="number"
                      label="Celular *"
                      helperText="El Celular debe tener al menos 10 dígitos"
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

                  <Grid item md={4} sm={5} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={errorcorreo}
                      type="text"
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

                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={8} sm={10} xs={12}>
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

                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={8} sm={10} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      type="text"
                      label="Observacion"
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

                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={5} xs={12}>
                    <TipoPersona data={formulario} />
                  </Grid>
                  <Grid item md={4} sm={3} xs={12}>
                    <FormControlLabel
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          estado: e.target.checked,
                        });
                      }}
                      value={formulario.estado}
                      control={<Checkbox defaultChecked />}
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
