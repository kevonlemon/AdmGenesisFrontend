import {
  TextField, Button, Grid, Card, FormControlLabel, MenuItem,
  InputAdornment, IconButton, Checkbox
} from "@mui/material";
import Box from '@mui/material/Box';
import * as React from 'react';
import es from 'date-fns/locale/es';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useSnackbar } from 'notistack';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { obtenerMaquina } from '../../../../../utils/sistema/funciones'
import { CORS, URLAPILOCAL } from '../../../../../config';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import ModalGenerico from '../../../../../components/modalgenerico';
import Page from '../../../../../components/Page';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';


// ----------------------------------------------------------------------




export default function NuevoBancoCia() {
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      'Authorization': `Bearer ${usuario.token}`
    }
  }

  // Contador Automatico
  const [contadorAuto, setContadorauto] = React.useState(true);

  // seteo vacio sin atributo
  const [checked, setChecked] = React.useState();

  // seteo del Ultimo cheque
  const [switchUcheque, setUcheque] = React.useState(true);


  const [error, setError] = React.useState(false); // Inicial
  const [error1, setError1] = React.useState(false); // Nombre banco
  const [error2, setError2] = React.useState(false); // nº de cuenta
  const [error3, setError3] = React.useState(false); // tipo de cuenta
  const [error4, setError4] = React.useState(false); // n1Cuenta
  const [error5, setError5] = React.useState(false); // N cuenta
  const [error6, setError6] = React.useState(false); // N ultimo cheque


  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' }, autoHideDuration: 5000 });
  };
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

  const fechaActual = new Date();

  const [dataBanco, setbanco] = React.useState({
    codigo: 0,
    inicial_Banco: '',
    cuenta: '',
    nombre_cuenta: '',
    nombre: '',
    numero_Cuenta: '',
    ultimo_Cheque: 0,
    tipo_Cuenta: '',
    anio: fechaActual.getFullYear(),
    contador_Automatico: false,
    cuenta_Cheque_Fecha: '',
    nombre_cta_cheque_fecha: '',
    estado: true,
    ultima_Conciliacion: new Date(),
    fecha_ing: new Date(),
    maquina: '',
    usuario: 0,
    sucursal: 0,
  });


  const limpiar = () => {
    setbanco({
      codigo: 0,
      inicial_Banco: '',
      cuenta: '',
      nombre_cuenta: '',
      nombre: '',
      numero_Cuenta: '',
      ultimo_Cheque: 0,
      tipo_Cuenta: '',
      anio: fechaActual.getFullYear(),
      contador_Automatico: false,
      cuenta_Cheque_Fecha: '',
      nombre_cta_cheque_fecha: '',
      estado: true,
      ultima_Conciliacion: new Date(),
      fecha_ing: new Date(),
      maquina: '',
      usuario: 0,
      sucursal: 0,
    });
    setUcheque(true);
    setChecked(false);
    setContadorauto(true);
    setError(false);
    setError1(false);
    setError2(false);
    setError3(false);
    setError4(false);
    setError5(false);
    setError6(false);

  };

  // -------- Axios atrae las cuentas contables 

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cateProv, setCateProv] = React.useState({});
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tiposBusquedas, setTiposBusqueda] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rowsParaModal, setRowsparaModal] = React.useState();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModalnivel1, setOpenModalnivel1] = React.useState(false);
  const toggleShownivel1 = () => setOpenModalnivel1((p) => !p);
  const handleCallbackChildnivel1 = (e) => {
    const item = e.row;
    setbanco({ ...dataBanco, cuenta: item.codigo, nombre_cuenta: item.nombre });
    toggleShownivel1();
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cateProv2, setCateProv2] = React.useState({});
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tiposBusquedas2, setTiposBusqueda2] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rowsParaModal2, setRowsparaModal2] = React.useState();


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModalnivel2, setOpenModalnivel2] = React.useState(false);
  const toggleShownivel2 = () => setOpenModalnivel2((p) => !p);
  const handleCallbackChildnivel2 = (e) => {
    const item = e.row;
    setbanco({ ...dataBanco, cuenta_Cheque_Fecha: item.codigo, nombre_cta_cheque_fecha: item.nombre });
    toggleShownivel2();
  };


  // eslint-disable-next-line react-hooks/rules-of-hooks
  // React.useEffect(() => {
  //   async function getDatos() {
  //     try {
  //       const response = await axios(`${URLAPILOCAL}/cuentascontables/listar`, config);
  //       const dataRes = response.data;
  //       const filtrado = dataRes.filter(f => f.auxiliar === true);
  //       const cateprov = filtrado.map((el) => ({
  //         codigo: el.cuenta,
  //         nombre: el.nombre,
  //       }));
  //       setCateProv(cateprov);
  //       setRowsparaModal(cateprov);
  //       setCateProv2(cateprov);
  //       setRowsparaModal2(cateprov);
  //     } catch (error) {
  //       if (error.response.status === 401) {
  //         navigate(`${PATH_AUTH.login}`);
  //         mensajeSistema("Su inicio de sesion expiro", "error");
  //       }
  //       else if (error.response.status === 500) {
  //         navigate(`${PATH_PAGE.page500}`);
  //       } else {
  //         mensajeSistema("Problemas con la base de datos", "error");
  //       }
  //     }

  //   }
  //   getDatos();
  // }, []);



  const [tipoCtas, setTipocuentabanco] = React.useState({});
  React.useEffect(() => {
    async function getTipoCuenta() {
      try {
        const response = await axios(`${URLAPILOCAL}/mantenimientogenerico/listarportabla?tabla=CNT_TIPOCUENTABANCO`, config);
        const dataRes = response.data;
        const tipocuentas = dataRes.map(el => ({
          codigo: el.codigo,
          nombre: el.nombre
        }))
        setTipocuentabanco(tipocuentas);
      } catch (error) {
        if (error.response.status === 401) {
          navigate(`${PATH_AUTH.login}`);
          mensajeSistema("Su inicio de sesion expiro", "error");
        }
        else if (error.response.status === 500) {
          navigate(`${PATH_PAGE.page500}`);
        } else {
          mensajeSistema("Problemas con la base de datos", "error");
        }
      }

      // setbanco({ ...dataBanco, tipo_Cuenta: tipocuentas[1].codigo, tipoCtas: tipocuentas[1].nombre })

    }
    getTipoCuenta()

  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Codigovalido, setCodigovalido] = React.useState([]);

  const [tipoC, setTipocuenta] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function obtenercodigo() {
      try {
        const response = await axios(`${URLAPILOCAL}/bancos/listar`, config);
        const res = response.data;
        const codigocaja = res.filter((list) => list.inicial_Banco === dataBanco.inicial_Banco);
        setCodigovalido(codigocaja);
      } catch (error) {
        if (error.response.status === 401) {
          navigate(`${PATH_AUTH.login}`);
          mensajeSistema("Su inicio de sesion expiro", "error");
        }
        else if (error.response.status === 500) {
          navigate(`${PATH_PAGE.page500}`);
        } else {
          mensajeSistema("Problemas con la base de datos", "error");
        }
      }
    }
    obtenercodigo();
  }, [dataBanco.inicial_Banco]);


  const habilitarCR = (e) => {

    const cuenta = e.target.value.toLocaleUpperCase();
    if (cuenta === 'AHO') {
      setUcheque(true);
      setChecked(false);
      setContadorauto(true);

    }
    if (cuenta === 'COR') {
      setUcheque(false);
      setChecked(false);
      setContadorauto(false)

    }
    setbanco({
      ...dataBanco, tipo_Cuenta: cuenta, ultimo_Cheque: 0,
      contador_Automatico: false,
    });

  }

  // falta el check para setear el input



  const checkFunc = (event) => {

    if (contadorAuto === false) {

      setChecked(event.target.checked);
      if (checked === false) {
        setUcheque(true);

      }

      if (checked === true) {
        setUcheque(false);
      }

      setbanco({
        ...dataBanco, contador_Automatico: event.target.checked,
        ultimo_Cheque: 0
      })
    }

    // if (contadorAuto === true) {
    //   setbanco({ ...dataBanco, contador_Automatico: false })
    // }

  };

  const ChequeFun = (e) => {

    // if (switchUcheque === true) {
    //   setbanco({ ...dataBanco, ultimo_Cheque: '0' })
    // }
    // if (switchUcheque === false) {
    setbanco({
      ...dataBanco,
      ultimo_Cheque: e.target.value.toLocaleUpperCase(),
    });
    // }
  }










  const validation = () => {
    // const Codigo = dataBanco.codigo;
    const list = Codigovalido.length;
    const inicalbanco = dataBanco.inicial_Banco.length;
    const Cuenta = dataBanco.cuenta;
    const Nombre = dataBanco.nombre.length;
    const ncuenta = dataBanco.numero_Cuenta;
    const ucheque = dataBanco.ultimo_Cheque;
    const tipocuenta = dataBanco.tipo_Cuenta;
    const anio = dataBanco.anio.length;
    const cuentaCheque = dataBanco.cuenta_Cheque_Fecha;


    if (list >= 1) {
      messajeTool('error', 'Ya existe un registro con la misma inicial, intente con otro.');
      // setError(true);
      return false;
    }

    if (inicalbanco < 1) {
      messajeTool('error', 'La inicial del banco no puede ir vacío');
      setError(true);
      return false;
    }

    if (inicalbanco > 10) {
      messajeTool('error', 'La inicial del banco no debe tener más de 10 caracteres');
      setError(true);
      return false;
    }

    if (Nombre < 3) {
      messajeTool('error', 'El nombre debe tener al menos 3 caracteres.');
      setError1(true);
      return false;
    }
    // if (ncuenta === '') {
    //   messajeTool('error', 'Debe ingresar número de cuenta.');
    //   setError2(true);
    //   return false;
    // }

    if (tipocuenta === '') {
      messajeTool('error', 'Debe ingresar el tipo de cuenta.');
      setError3(true);
      return false;
    }


    if (ucheque === '') {
      messajeTool('error', 'Debe ingresar el ultimo cheque.');
      setError6(true);
      return false;
    }

    // if (Cuenta === '') {
    //   messajeTool('error', 'Debe ingresar la cuenta.');
    //   setError4(true);
    //   return false;
    // }


    // if (anio === '') {
    //   messajeTool('error', 'Debe ingresar el año.');
    //   return false;
    // }
    // if (anio > 4) {
    //   messajeTool('error', 'La fecha del año no puede ser mayor a 4 digitos');
    //   return false;
    // }
    // if (cuentaCheque === '') {
    //   messajeTool('error', 'Debe ingresar la Cuenta Cheque a Fecha');
    //   setError5(true);
    //   return false;
    // }

    return true;
  }



  const Grabar = async () => {

    if (validation() === false) {
      return 0;
    }

    const maquina = await obtenerMaquina();
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));

    try {

      const json = {
        // codigo: 0,
        inicial_Banco: dataBanco.inicial_Banco,
        cuenta: dataBanco.cuenta,
        nombre_cuenta: dataBanco.nombre_cuenta,
        nombre: dataBanco.nombre,
        numero_Cuenta: dataBanco.numero_Cuenta,
        ultimo_Cheque: dataBanco.ultimo_Cheque,
        tipo_Cuenta: dataBanco.tipo_Cuenta,
        cuenta_Cheque_Fecha: dataBanco.cuenta_Cheque_Fecha,
        anio: fechaActual.getFullYear(),
        contador_Automatico: dataBanco.contador_Automatico,
        estado: dataBanco.estado,
        fecha_ing: new Date(),
        maquina: `${maquina}`,
        usuario: usuario.codigo,
      }
      const { data } = await axios.post(`${URLAPILOCAL}/bancos`, json, config);
      if (data === 200) {
        messajeTool('success', 'Grabado con exito!!');
        navigate(`/sistema/parametros/bancocia`);
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate(`${PATH_AUTH.login}`);
        mensajeSistema("Su inicio de sesion expiro", "error");
      }
      else if (error.response.status === 500) {
        navigate(`${PATH_PAGE.page500}`);
      } else {
        mensajeSistema("Problemas con la base de datos", "error");
      }
    }
  };


  return (
    <>
      <ModalGenerico
        nombre="Cuenta Contable"
        openModal={openModalnivel1}
        busquedaTipo={tiposBusquedas}
        toggleShow={toggleShownivel1}
        rowsData={cateProv}
        parentCallback={handleCallbackChildnivel1}
      />
      <ModalGenerico
        nombre="Cuenta Cheque Fecha"
        openModal={openModalnivel2}
        busquedaTipo={tiposBusquedas2}
        toggleShow={toggleShownivel2}
        rowsData={cateProv2}
        parentCallback={handleCallbackChildnivel2}
      />

      <Page title="Nuevo Banco">
        <Box sx={{ ml: 3, mr: 3, p: 0 }}>
          <Grid container spacing={1} justifyContent="flex-end">

            <Grid item md={1.2} sm={2} xs={6}>
              <Button
                fullWidth variant="text" onClick={() => limpiar()} size="small"
                startIcon={<InsertDriveFileRoundedIcon />}> Nuevo </Button>
            </Grid>

            <Grid item md={1.2} sm={2} xs={6}>
              <Button
                fullWidth variant="text" startIcon={<SaveRoundedIcon />} size="small"
                onClick={Grabar}> Grabar </Button>

            </Grid>
            <Grid item md={1.2} sm={2} xs={12}>
              <Button fullWidth variant="text" size="small"
                component={RouterLink}
                to="/sistema/parametros/bancocia"
                startIcon={<ArrowCircleLeftRoundedIcon />}> Volver </Button>
            </Grid>

          </Grid>
        </Box>
        <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
          <h1>Nuevo Banco</h1>
        </Box>
        <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }} >
          <Box sx={{ width: '100%', p: 2 }}>
            <Grid container spacing={2} >
              <Grid container item xs={12} sm={12} md={6} spacing={1} sx={{ mb: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography variant="h6" gutterBottom component="div">
                      Banco
                    </Typography>
                  </Grid>
                </Box>

                <Grid item md={4.5} xs={12} sm={5}>
                  <RequiredTextField
                    fullWidth
                    error={error}
                    size="small"
                    required
                    label="Inicial del Banco"
                    onChange={(e) => {
                      setbanco({
                        ...dataBanco,
                        inicial_Banco: e.target.value.toLocaleUpperCase(),
                      });
                    }}
                    value={dataBanco.inicial_Banco}
                    id="outlined-size-small"
                  />
                </Grid>
                <Grid item md={7.5} xs={12} sm={7}>
                  <RequiredTextField
                    fullWidth
                    error={error1}
                    size="small"
                    type="text"
                    required
                    label="Nombre Banco"
                    id="outlined-size-small"
                    onChange={(e) => {
                      setbanco({
                        ...dataBanco,
                        nombre: e.target.value.toLocaleUpperCase(),
                      });
                    }}
                    value={dataBanco.nombre}
                  />
                </Grid>

                <Grid container item xs={12} spacing={1} sx={{ mb: 1 }}>
                  <Grid item md={7} xs={12} sm={7}>
                    <RequiredTextField
                      fullWidth
                      error={error2}
                      size="small"
                      type="number"
                      label="Nº de Cuenta"
                      onChange={(e) => {
                        setbanco({
                          ...dataBanco,
                          numero_Cuenta: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataBanco.numero_Cuenta}
                      id="outlined-size-small"
                    />
                  </Grid>
                  <Grid item md={4} xs={12} sm={4}>
                    <RequiredTextField 
                      select
                      error={error3}
                      label="Tipo de Cuenta"
                      value={dataBanco.tipo_Cuenta}
                      onChange={habilitarCR}
                      fullWidth size="small"
                    >
                      {
                        Object.values(tipoCtas).map(
                          (val) => (
                            <MenuItem key={val.nombre} value={val.codigo}>{val.nombre}</MenuItem>
                          )
                        )
                      }
                    </RequiredTextField>
                  </Grid>
                </Grid>



                <Grid container item xs={12} spacing={1} sx={{ mb: 1 }}>
                  <Grid item md={5} xs={12} sm={5}>
                    <TextField
                      fullWidth
                      error={error6}
                      disabled={switchUcheque}
                      size="small"
                      type="number"
                      // InputProps={{
                      //   readOnly: contadorAuto,}}
                      label="Nº del Ultimo Cheque"
                      onChange={ChequeFun}
                      value={dataBanco.ultimo_Cheque}
                    />
                  </Grid>

                  <Grid item md={6} xs={12} sm={6} sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={<Checkbox
                        disabled={contadorAuto}
                        checked={dataBanco.contador_Automatico}
                        onChange={checkFunc}
                      />}
                      label="Contador Automatico" name="contador_automatico" />
                  </Grid>
                </Grid>

                {/* <Box sx={{ width: '100%' }}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography variant="h6" gutterBottom component="div">
                      Contabilidad
                    </Typography>
                  </Grid>
                </Box> */}
                {/* <Grid item md={12} xs={12} sm={12}>
                  <Typography variant="subtitle4" align="left" gutterBottom component="div">
                    Cuenta Contable:
                  </Typography>
                </Grid> */}
                {/* <Grid container item xs={12} spacing={1} sx={{ mb: 1 }}>

                  <Grid item md={5} xs={12} sm={5}>
                    <TextField
                      fullWidth
                      error={error4}
                      size="small"
                      required
                      label="Nº Cuenta"
                      onChange={(e) => {
                        setbanco({
                          ...dataBanco,
                          cuenta: e.target.value,
                        });
                      }}
                      value={dataBanco.cuenta}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              onClick={() => {
                                setOpenModalnivel1(true);
                              }}
                              aria-label="SearchIcon"
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={7} xs={12} sm={7} >
                    <TextField
                      fullWidth
                      error={error4}
                      size="small"
                      type="text"
                      label="Nombre Cuenta"
                      onChange={(e) => {
                        setbanco({
                          ...dataBanco,
                          nombre_cuenta: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataBanco.nombre_cuenta}
                      InputProps={{
                        readOnly: true,
                      }}
                      id="outlined-size-small"
                    />
                  </Grid>
                </Grid> */}

                {/* <Grid item md={12} xs={12} sm={12}>
                  <Typography variant="subtitle4" align="left" gutterBottom component="div">
                    Cuenta Cheque a Fecha:
                  </Typography>
                </Grid> */}
                {/* <Grid container item xs={12} spacing={1} >

                  <Grid item md={5} xs={12} sm={5}>
                    <TextField
                      fullWidth
                      size="small"
                      error={error5}
                      label="Nº Cuenta"
                      onChange={(e) => {
                        setbanco({
                          ...dataBanco,
                          cuenta_Cheque_Fecha: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataBanco.cuenta_Cheque_Fecha}
                      id="outlined-size-small"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              aria-label="SearchIcon"
                              onClick={() => {
                                setOpenModalnivel2(true);
                              }}
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item md={7} xs={12} sm={7} >
                    <TextField
                      fullWidth
                      error={error5}
                      size="small"
                      type="text"
                      label="Nombre Cta Cheque"
                      onChange={(e) => {
                        setbanco({
                          ...dataBanco,
                          nombre_cta_cheque_fecha: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataBanco.nombre_cta_cheque_fecha}
                      InputProps={{
                        readOnly: true,
                      }}
                      name="nombre cuenta"
                      variant="outlined"
                    />
                  </Grid>


                </Grid> */}
                {/* <Grid container item xs={12} spacing={1} sx={{ mb: 1 }}>
                  <Grid item md={2.5} xs={6} > */}
                    {/* <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                    <MobileDatePicker
                      disabled
                      label="Ultima Conciliacion"
                      value={valueDate}
                      onChange={(newValue) => {
                        setbanco(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />

                  </LocalizationProvider> */}
                  {/* </Grid>
                </Grid> */}

                <Grid container item xs={12} spacing={1} direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  {/* <Grid item md={2} xs={12} sm={2}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Año"
                      InputProps={{
                        readOnly: true,
                      }}
                      // onChange={(e) => {
                      //   setbanco({
                      //     ...dataBanco,
                      //     anio: e.target.value.toLocaleUpperCase(),
                      //   });
                      // }}
                      value={dataBanco.anio}
                      variant="outlined"
                    />
                  </Grid> */}
                  <Grid item md={2} xs={12} sm={2} sx={{ ml: 3 }}>
                    <FormControlLabel control={<Checkbox checked={dataBanco.estado}
                      disabled
                      onChange={(e) => {
                        setbanco({ ...dataBanco, estado: e.target.checked })
                      }} />}
                      label="Activo" name="estado" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Page>
    </>
  );
}