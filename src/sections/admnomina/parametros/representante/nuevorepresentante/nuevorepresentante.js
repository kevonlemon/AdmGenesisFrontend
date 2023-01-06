import { TextField, Grid, Card, FormControlLabel, Checkbox, Fade, InputAdornment, IconButton } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import axios from 'axios';
import { SearchRounded } from '@mui/icons-material';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
import { URLAPIGENERAL, URLRUC } from '../../../../../config';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import Page from '../../../../../components/Page';
import { noEsVacio, esCorreo } from '../../../../../utils/sistema/funciones';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
import MensajesGenericos from '../../../../../components/sistema/mensajesgenerico';
import { obtenerMaquina } from '../../../../../components/sistema/funciones';

export default function FormularioRepresentanteLegal() {
  document.body.style.overflowX = 'hidden';
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
  const [guardado, setGuardado] = React.useState(false);
  const [errorcorreo, setErrorcorreo] = React.useState(false);

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
        messajeTool('error', 'No se encontro ninguna identificacion');
        limpiarCampos();
      }
    } catch (error) {
      messajeTool('error', 'Revisar que la credencial sea la correcta');
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

  const validation = () => {
    const ruc = formulario.ruc.trim().length;
    const nombre = formulario.nombre.length;
    const telefono = formulario.telefono.length;
    const cedula = formulario.cedula.length;
    const registro = formulario.registro.trim();
    const correo = esCorreo(formulario);
    const direccion = formulario.direccion.trim();
    if (ruc < 13) {
      messajeTool('error', 'Debe ingresar un RUC');
      setError(true);
      return false;
    }
    if (nombre < 3) {
      messajeTool('error', 'Debe ingresar un Nombre');
      setError(true);
      return false;
    }

    if (telefono < 8) {
      messajeTool('error', 'Debe ingresar un número de Teléfono');
      setError(true);
      return false;
    }
    if (cedula < 10) {
      messajeTool('error', 'Debe ingresar una Cédula');
      setError(true);
      return false;
    }
    if (registro === '') {
      messajeTool('error', 'Debe ingresar un número de Registro');
      setError(true);
      return false;
    }
    if (correo === '') {
      messajeTool('error', 'Debe ingresar un correo');
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

  // GUARDAR INFORMACION
  // eslint-disable-next-line consistent-return
  const Grabar = async () => {
    const maquina = await obtenerMaquina();
    // const { codigo } = JSON.parse(window.localStorage.getItem('session'));
    // console.log('FUAFUAFUAUF', codigo);
    if (validation() === false) {
      return 0;
    }
    try {
      const Json = {
        fecha_ing: new Date(),
        maquina: `${maquina}`,
        // usuario: codigo,
        codigo: formulario.codigo,
        ruc: formulario.ruc,
        cedula: formulario.cedula,
        nombre: formulario.nombre,
        direccion: formulario.direccion,
        telefono: formulario.telefono,
        correo: formulario.correo,
        fechaingreso: formulario.fechaingreso,
        fechasalida: formulario.fechasalida,
        registro: formulario.registro,
        estado: formulario.estado,
      };
      const { data } = await axios.post(`${URLAPIGENERAL}/RepresentanteLegal`, Json, config);
      if (data === 200) {
        setGuardado(true);
        messajeTool('succes', '', 'Grabar');
      }
      // navegacion(`${PATH_SISTEMA.parametros_del_sistema.mantenimiento.representante.inicio}`);
    } catch (error) {
      if (error.response.status === 401) {
        navegacion(`${PATH_AUTH.login}`);
        messajeTool('error', 'Su inicio de sesion expiro');
      } else if (error.response.status === 500) {
        navegacion(`${PATH_PAGE.page500}`);
      } else {
        messajeTool('error', 'Problemas con la base de datos');
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

  const cerrarModalMensaje = () => {
    if (guardado === true) {
      setopenModal2((p) => !p);
      setGuardado(false);
      window.location.reload(true);
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
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={3} xs={12}>
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
                        backgroundColor: '#e5e8eb',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#212B36',
                      }}
                    />
                  </Grid>
                  <Grid item md={4} sm={3} xs={12}>
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

                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={3} xs={12}>
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
                  <Grid item md={4} sm={3} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
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
                </Grid>
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={8} sm={6} xs={12}>
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
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={3} xs={12}>
                    <RequiredTextField
                      fullWidth
                      size="small"
                      error={error}
                      type="tel"
                      label="Telefono *"
                      helperText="El Teléfono debe tener al menos 9 dígitos"
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
                  <Grid item md={4} sm={3} xs={12}>
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
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={3} xs={12}>
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
                  <Grid item md={4} sm={3} xs={12}>
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
                </Grid>
                <Grid container item xs={12} spacing={1} pb={1}>
                  <Grid item md={4} sm={3} xs={12}>
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
                  {/* <Grid item md={4} sm={3} xs={12}>
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
                  </Grid> */}
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Fade>
      </Page>
    </>
  );
}
