// Autor: Javier Caicedo Delgado. version 1
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Box, Card, Fade, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import axios from 'axios';
import { useSnackbar } from 'notistack';
// import CircularProgreso from '../../../../../sistema/componentes/circuloprogreso';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// import { PATH_DASHBOARD, PATH_SISTEMA } from '../../../../../routes/paths';
import { URLAPIGENERAL } from '../../../../config';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import Page from '../../../../components/Page';
import RequiredTextField from '../../../../sistema/componentes/formulario/RequiredTextField';

export default function Homeempresa() {
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      'Authorization': `Bearer ${usuario.token}`
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [code, setCODE] = React.useState({ codigo: 0 });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Version, setVersion] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dataversion, setDataversion] = React.useState({ version: '' });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Representantes1, setRepresentante] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datarepresentante, setDatarepresentante] = React.useState({ representante: '' });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [gironegocio, setGironegocio] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datanegocio, setDatanegocio] = React.useState({ giro_Negocio: '' });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Contador, setContador] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datacontador, setDatacontador] = React.useState({ contador: '' });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [errorcorreo, setErrorcorreo] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Contribuyentes, setContribuyentese] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datacontribuyentes, setDatacontribuyentes] = React.useState({ contribuyente: '' });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navegacion = useNavigate();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formulario, setFormulario] = React.useState({
    codigo: 0,
    nombre: '',
    ruc: '',
    telefono: '',
    celular: '',
    correo: '',
    representante: '',
    contador: '',
    giro_Negocio: '',
    contribuyente: '',
    version: '',
    resolucion: '',
    secuenciaAutomaticaProductos: true,
    secuenciaProducto: 0,
    direccion: '',
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {

    async function getDatos() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/empresa/listar`, config, setMostrarProgreso(true));
        // console.log(res);
        // const codigoempresa = res.data[0].codigo;
        setFormulario({
          codigo: data[0].codigo,
          nombre: data[0].nombre,
          ruc: data[0].ruc,
          telefono: data[0].telefono,
          celular: data[0].celular,
          correo: data[0].correo,
          representante: data[0].representante,
          contador: data[0].contador,
          giro_Negocio: data[0].giro_Negocio,
          contribuyente: data[0].contribuyente,
          version: data[0].version,
          resolucion: data[0].resolucion,
          secuenciaAutomaticaProductos: data[0].secuenciaAutomaticaProductos,
          secuenciaProducto: data[0].secuenciaProducto,
          direccion: data[0].direccion,
        });
        // setCODE(codigoempresa);
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
      } finally {
        setMostrarProgreso(false);
      }
    }
    getDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {

    async function getasigcontribuyente() {
      try {
        const response = await axios(`${URLAPIGENERAL}/Contribuyentes/listar`, config);
        const dataRes = response.data;
        const asigcontribuyente = dataRes.map((el) => ({
          codigo: el.codigo,
          nombre: el.nombre,
        }));
        setContribuyentese(asigcontribuyente);
        setDatacontribuyentes({
          ...datacontribuyentes,
          contribuyente: asigcontribuyente[0].codigo,
          Contribuyente: asigcontribuyente[0].nombre,
        });
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
    getasigcontribuyente();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {

    async function getasigrepresetante() {
      try {
        const response = await axios(`${URLAPIGENERAL}/RepresentanteLegal/listar`, config);
        const dataRes = response.data;
        const asigrepresentante = dataRes.map((el) => ({
          codigo: el.codigo,
          nombre: el.nombre,
        }));
        setRepresentante(asigrepresentante);
        setDatarepresentante({
          ...datarepresentante,
          representante: asigrepresentante[0].codigo,
          Representantes1: asigrepresentante[0].nombre,
        });
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

    getasigrepresetante();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {

    async function getasigcontador() {
      try {
        const response = await axios(`${URLAPIGENERAL}/contadores/listar`, config);
        const dataRes = response.data;
        const asigcontador = dataRes.map((el) => ({
          codigo: el.codigo,
          nombre: el.nombre,
        }));
        setContador(asigcontador);
        setDatacontador({ ...datacontador, contador: asigcontador[0].codigo, Contador: asigcontador[0].nombre });
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
    getasigcontador();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();

  const Enviocorrecto = () => {
    enqueueSnackbar('Actualizado con exito!!', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };

  const validation = () => {
    // const codigo = dataNuevo.codigo.trim().length;
    const correo = formulario.correo.length;
    const validcorreo = errorcorreo.valueOf();
    const celular = formulario.celular.length;
    const telefono = formulario.telefono.length;

    if (correo < 3 || validcorreo === true) {
      messajeTool('error', 'El correo es invalido.');
      setError(true);
      return false;
    }

    if (telefono > 9) {
      messajeTool('error', 'El telefono debe tener 9 digitos');
      setError(true);
      return false;
    }

    if (telefono < 9) {
      messajeTool('error', 'El telefono debe tener 9 digitos');
      setError(true);
      return false;
    }

    if (celular < 10) {
      messajeTool('error', 'El celular debe tener 10 digitos');
      setError(true);
      return false;
    }

    if (celular > 10) {
      messajeTool('error', 'El celular debe tener 10 digitos');
      setError(true);
      return false;
    }

    return true;
  };

  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };

  const actualizar = async () => {
    // console.log(formulario);

    if (validation() === false) {
      return 0;
    }
    setMostrarProgreso(true);

    try {
      const { data } = await axios.post(`${URLAPIGENERAL}/empresa/editar`, formulario, config);

      if (data === 200) {
        Enviocorrecto();
        // navegacion(`${PATH_SISTEMA.parametros_del_sistema.mantenimiento.empresa.inicio}`);
      }
      // setError(false);
    } catch (error) {
      mensajeSistema('Error al guardar el registro', 'error');
    } finally {
      setMostrarProgreso(false);
    }
  };
  const mensajeSistema = async () => {
    enqueueSnackbar('Error, por favor verifique los datos...', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };

  return (
    <>
      {/* <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      /> */}
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Empresa">
          <Box sx={{ ml: 3, mr: 3, p: 0 }}>
            <Box>
              <HeaderBreadcrumbs
                heading="Empresa"
                links={[
                  { name: 'Parametros' },
                  { name: 'Empresa' },
                  { name: 'Mantenimiento' },
                ]}
                action={
                  <Grid item xs={12} sm={12} md={12}>
                    <Grid item md={1.2} sm={2} xs={6}>
                      <Button fullWidth variant="text" startIcon={<SaveRoundedIcon />} onClick={actualizar}>
                        Actualizar
                      </Button>
                    </Grid>
                  </Grid>
                }
              />
            </Box>
          </Box>


          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, mt: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={2}>
                <Grid item container spacing={1} md={7}>
                  <Grid item sm={2} xs={12} md={2}>
                    <TextField
                      fullWidth
                      disabled
                      label="Código"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          codigo: e.target.value.toLocaleUpperCase(),
                        });
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
                  <Grid item sm={5} xs={12} md={5}>
                    <RequiredTextField
                      fullWidth
                      // disabled
                      label="Nombre"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          nombre: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.nombre}
                    />
                  </Grid>
                  <Grid item sm={5} xs={12} md={5}>
                    <TextField
                      fullWidth
                      disabled
                      label="Ruc"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          ruc: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.ruc}
                      sx={{
                        backgroundColor: "#e5e8eb",
                        border: "none",
                        borderRadius: '10px',
                        color: "#212B36"
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} xs={12} md={12}>
                    <RequiredTextField
                      fullWidth
                      required
                      label="Dirección"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          direccion: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.direccion}
                    />
                  </Grid>
                  <Grid item sm={3.5} xs={12} md={3.5}>
                    <RequiredTextField
                      fullWidth
                      required
                      label="Teléfono"
                      type="number"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          telefono: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.telefono}
                    />
                  </Grid>
                  <Grid item sm={3.5} xs={12} md={3.5}>
                    <RequiredTextField
                      fullWidth
                      required
                      type="number"
                      label="Celular"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          celular: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.celular}
                    />
                  </Grid>
                  <Grid item sm={5} xs={12} md={5}>
                    <RequiredTextField
                      fullWidth
                      required
                      error={errorcorreo}
                      helperText={errorcorreo ? 'correo invalido: example@example.com' : ''}
                      label="Correo Electrónico"
                      id="outlined-size-small"
                      size="small"
                      value={formulario.correo}
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          correo: e.target.value.toLocaleUpperCase(),
                        });
                        const input = e.target.value;
                        if (!esCorreo(input)) setErrorcorreo(true);
                        else setErrorcorreo(false);
                        setFormulario({
                          ...formulario,
                          correo: input.toLocaleUpperCase(),
                        });
                        // setValue(input)
                      }}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <RequiredTextField
                      select
                      required
                      label="Repesentante"
                      value={formulario.representante}
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          representante: e.target.value,
                        });
                      }}
                      fullWidth
                      size="small"
                    >
                      {Object.values(Representantes1).map((val) => (
                        <MenuItem key={val.codigo} value={val.codigo}>
                          {val.nombre}
                        </MenuItem>
                      ))}
                    </RequiredTextField>
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <RequiredTextField
                      select
                      required
                      label="Contador"
                      value={formulario.contador}
                      onChange={(e) => setFormulario({ ...formulario, contador: parseInt(e.target.value, 10) })}
                      fullWidth
                      size="small"
                    >
                      {Object.values(Contador).map((val) => (
                        <MenuItem key={val.codigo} value={val.codigo}>
                          {val.nombre}
                        </MenuItem>
                      ))}
                    </RequiredTextField>
                  </Grid>

                  {/* <Grid item sm={6} xs={12} md={6}>
                    <TextField
                      select
                      disabled
                      label="Giro de Negocio"
                      fullWidth
                      size="small"
                      value={formulario.giro_Negocio}
                      onChange={(e) => setFormulario({ ...formulario, giro_Negocio: parseInt(e.target.value, 10) })}
                    >
                      {Object.values(gironegocio).map((val) => (
                        <MenuItem key={val.codigo} value={val.codigo}>
                          {val.nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
                      select
                      disabled
                      label="Version"
                      value={formulario.version}
                      onChange={(e) => setFormulario({ ...formulario, version: e.target.value })}
                      fullWidth
                      size="small"
                    >
                      {Object.values(Version).map((val) => (
                        <MenuItem key={val.nombre} value={val.codigo}>
                          {val.nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid> */}

                  <Grid item sm={6} xs={12} md={6}>
                    <RequiredTextField
                      required
                      select
                      label="Contribuyente"
                      value={formulario.contribuyente}
                      onChange={(e) => setFormulario({ ...formulario, contribuyente: e.target.value })}
                      fullWidth
                      size="small"
                    >
                      {Object.values(Contribuyentes).map((val) => (
                        <MenuItem key={val.nombre} value={val.codigo}>
                          {val.nombre}
                        </MenuItem>
                      ))}
                    </RequiredTextField>
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <RequiredTextField
                      required
                      fullWidth
                      // type="number"
                      label="Resolución"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          resolucion: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.resolucion}
                    />
                  </Grid>
                  <Grid item sm={7} xs={12} md={7}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formulario.secuenciaAutomaticaProductos}
                          onChange={(e) => {
                            setFormulario({ ...formulario, secuenciaAutomaticaProductos: e.target.checked });
                          }}
                        />
                      }
                      label="Calculo con biometrico"
                      name="secuenciaAutomaticaProductos"
                    />
                  </Grid>
                  {/* <Grid item sm={4} xs={12} md={5}>
                    <TextField
                      fullWidth
                      disabled
                      label="Secuencia de Producto"
                      id="outlined-size-small"
                      size="small"
                      type="number"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          secuenciaProducto: e.target.value,
                        });
                      }}
                      value={formulario.secuenciaProducto}
                    />
                  </Grid> */}
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Page>
      </Fade>
    </>
  );
}

export const esCorreo = (param) => {
  try {
    const correo = String(param);
    let valor = false;
    const expr = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (expr.test(correo)) {
      valor = true;
    }
    return valor;
  } catch (error) {
    console.log(error);
    return false;
  }
};
