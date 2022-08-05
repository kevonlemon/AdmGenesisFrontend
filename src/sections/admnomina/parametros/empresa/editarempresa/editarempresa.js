// Autor: Javier Caicedo Delgado. version 1
import * as React from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import {
  Grid,
  TextField,
  Box,
  Card,
  Fade,
  Checkbox,
  FormControlLabel,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import axios from 'axios';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchIcon from '@mui/icons-material/Search';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
// import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { useSnackbar } from 'notistack';
import { CORS, URLAPIGENERAL } from '../../../../../config';
import Page from '../../../../../components/Page';

export default function editempresa() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navegacion = useNavigate();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { codigo } = useParams();

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
    giro_Negocio: 0,
    contribuyente: '',
    version: '',
    resolucion: '',
    secuenciaAutomaticaProductos: true,
    secuenciaProducto: 0,
    direccion: '',
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Version, setVersion] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dataversion, setDataversion] = React.useState({
    version: '',
  });

  //

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Contribuyentes, setContribuyentese] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datacontribuyentes, setDatacontribuyentes] = React.useState({
    contribuyente: '',
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getasigcontribuyente() {
      const response = await axios(`${URLAPIGENERAL}/Contribuyentes/listar`);
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
    }
    getasigcontribuyente();
  }, [datacontribuyentes]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Representantes1, setRepresentante] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datarepresentante, setDatarepresentante] = React.useState({
    representante: '',
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getasigrepresetante() {
      const response = await axios(`${URLAPIGENERAL}/RepresentanteLegal/listar`);
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
    }
    getasigrepresetante();
  }, [datarepresentante]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [gironegocio, setGironegocio] = React.useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datanegocio, setDatanegocio] = React.useState({
    giro_Negocio: 0,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getgironegocio() {
      const response = await axios(`${URLAPIGENERAL}/gironegocios/listar`);
      const dataRes = response.data;
      const tiponegocio = dataRes.map((el) => ({
        codigo: el.codigo,
        nombre: el.nombre,
      }));
      setGironegocio(tiponegocio);
      setDatanegocio({ ...datanegocio, giro_Negocio: tiponegocio[0].codigo, gironegocio: tiponegocio[0].nombre });
    }
    getgironegocio();
  }, [datanegocio]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = React.useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Contador, setContador] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [datacontador, setDatacontador] = React.useState({
    contador: '',
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getasigcontador() {
      const response = await axios(`${URLAPIGENERAL}/Contadores/listar`);
      const dataRes = response.data;
      const asigcontador = dataRes.map((el) => ({
        codigo: el.codigo,
        nombre: el.nombre,
      }));
      setContador(asigcontador);
      setDatacontador({ ...datacontador, contador: asigcontador[0].codigo, Contador: asigcontador[0].nombre });
    }
    getasigcontador();
  }, [datacontador]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getTipoversion() {
      const response = await axios(`${URLAPIGENERAL}/versiones/listar`);
      const dataRes = response.data;
      const tipoversion = dataRes.map((el) => ({
        codigo: el.codigo,
        nombre: el.nombre,
      }));
      setVersion(tipoversion);
      setDataversion({ ...dataversion, version: tipoversion[0].codigo, Version: tipoversion[0].nombre });
    }
    getTipoversion();
  }, [dataversion]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();

  const Enviocorrecto = () => {
    enqueueSnackbar('Guardado actualización...', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [inp, setInp] = React.useState('');

  

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [errorcorreo, setErrorcorreo] = React.useState(false);

  const validation = () => {
    // const codigo = dataNuevo.codigo.trim().length;
    const correo = formulario.correo.length;
    const validcorreo = errorcorreo.valueOf();
    const celular = formulario.celular.length;
    const telefono = formulario.telefono.length;

    if (correo < 3 || validcorreo===(true)  ) {
      messajeTool('error', 'El correo es invalido.');
      setError(true);
      return false;
    }

    if (telefono > 9  ) {
      messajeTool('error', 'El telefono debe tener 9 digitos');
      setError(true);
      return false;
    }

    if (telefono < 9  ) {
      messajeTool('error', 'El telefono debe tener 9 digitos');
      setError(true);
      return false;
    }

if (celular < 10 ) {
      messajeTool('error', 'El celular debe tener 10 digitos');
      setError(true);
      return false;
    }

    if (celular > 10 ) {
      messajeTool('error', 'El celular debe tener 10 digitos');
      setError(true);
      return false;
    }


    // if (correo.includes('@') && correo.includes('.')) {
    //   setErrorcorreo(false);
    //   setError(false);
    //   return false;
    // }

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

    try {
      // const { data } = await axios.post(`${URLAPILOCAL}/empresa/editar`, formulario, CORS);
      const { data } = await axios.post(`${URLAPIGENERAL}/empresa/editar`, formulario, CORS);

      if (data === 200) {
        Enviocorrecto();
        // navegacion(`${PATH_DASHBOARD.admempresa}`);
      }
      // setError(false);
    } catch (error) {
      mensajeSistema('Error al guardar el registro', 'error');
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function obtenerempresa() {
      try {
        //  const { data } = await axios(`${URLAPIGENERAL}/empresa/obtener?codigo=${codigo}`);
        const { data } = await axios(`${URLAPIGENERAL}/empresa/obtener?codigo=${codigo}`);
        // console.log(data);
        setFormulario({
          codigo: data.codigo,
          nombre: data.nombre,
          ruc: data.ruc,
          telefono: data.telefono,
          celular: data.celular,
          correo: data.correo,
          representante: data.representante,
          contador: data.contador,
          giro_Negocio: data.giro_Negocio,
          contribuyente: data.contribuyente,
          version: data.version,
          resolucion: data.resolucion,
          secuenciaAutomaticaProductos: data.secuenciaAutomaticaProductos,
          secuenciaProducto: data.secuenciaProducto,
          direccion: data.direccion,
        });
      } catch {
        //    error;
      }
    }
    obtenerempresa();
  }, [codigo]);

  // const consultarRuc = async () => {
  //   try {
  //     const { data } = await axios(`${URLRUC}GetRucs?id=${formulario.ruc}`);
  //     if (data.length > 0) {
  //       setFormulario({
  //         ...formulario,
  //         ruc: data[0].Num_ruc,
  //         nombre: data[0].Razon_social,
  //         direccion: data[0].Direccion_completa,
  //       });
  //     } else {
  //       mensajeSistema('No se encontro ninguna identificacion', 'error');
  //       limpiarCampos();
  //     }
  //   } catch (error) {
  //     mensajeSistema('Revisar que la credencial sea la correcta', 'error');
  //     limpiarCampos();
  //   }
  // };
  // const limpiarCampos = () => {
  //   setFormulario({
  //     codigo: 0,
  //     ruc: '',
  //     cedula: '',
  //     nombre: '',
  //     direccion: '',
  //     telefono: '',
  //     correo: '',

  //     estado: true,
  //   });
  // };

  return (
    <>
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Editar Empresa">
          <Box sx={{ ml: 3, mr: 3, p: 0 }}>
            <Grid container spacing={2} justifyContent="flex-end" alignItems="rigth">
              {/* <Grid item md={1.2} sm={2} xs={6}>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<InsertDriveFileRoundedIcon />}
                >
                  {''}
                  Nuevo{' '}
                </Button>
              </Grid> */}
              <Grid item md={1.2} sm={2} xs={6}>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<SaveRoundedIcon />}
                  onClick={actualizar}
                  //  variant="contained"
                >
                  {' '}
                  Grabar{' '}
                </Button>
              </Grid>
              <Grid item md={1.2} sm={2} xs={6}>
                <Button fullWidth variant="text" startIcon={<DeleteRoundedIcon />}>
                  {' '}
                  Eliminar{' '}
                </Button>
              </Grid>
              <Grid item md={1.2} sm={2} xs={12}>
                <Button
                  fullWidth
                  variant="text"
                  // component={RouterLink}
                  // to={PATH_DASHBOARD.admempresa}
                  startIcon={<ArrowCircleLeftRoundedIcon />}
                >
                  {' '}
                  Volver{' '}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Editar Empresa</h1>
          </Box>
          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
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
                    />
                  </Grid>
                  <Grid item sm={5} xs={12} md={5}>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item sm={12} xs={12} md={12}>
                    <TextField
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
                    <TextField
                      fullWidth
                      required
                      label="Teléfono"
                      type='number'
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
                    <TextField
                      fullWidth
                      required
                      type='number'
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
                    <TextField
                      fullWidth
                      required
                      error={errorcorreo}
                      helperText={errorcorreo ? "correo invalido: example@example.com" : ''}
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
                        })
                        // setValue(input)
                      }}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
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
                    </TextField>
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
                      select
                      required
                      label="Contador"
                      value={formulario.contador}
                      onChange={(e) => setFormulario({ ...formulario, contador: e.target.value })}
                      fullWidth
                      size="small"
                    >
                      {Object.values(Contador).map((val) => (
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
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
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
                    </TextField>
                  </Grid>

                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
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
                      label="Secuencia Automatica Productos"
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
}