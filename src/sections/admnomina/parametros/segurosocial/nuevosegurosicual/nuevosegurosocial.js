import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Box, Card, Fade, Checkbox, FormControlLabel, Button, MenuItem } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { NumericFormat } from 'react-number-format';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import CircularProgreso from '../../../../../components/Cargando';
// import { MenuMantenimiento } from "../../../../../sistema/componentes/opciones";
import { URLAPIGENERAL } from '../../../../../config';
import Page from '../../../../../components/Page';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
import MensajesGenericos from '../../../../../components/sistema/mensajesgenerico';
import { obtenerMaquina } from '../../../../../components/sistema/funciones';

export default function newnominasegurosocial() {
  // eslint-disable-next-line camelcase
  const { token } = JSON.parse(window.localStorage.getItem('usuario'));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModal2, setopenModal2] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mantenimmiento, setMantenimmiento] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [codigomod, setCodigomod] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [nombre, setNombre] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modoMantenimiento, setModoMantenimiento] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [texto, setTexto] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tipo2, setTipo2] = React.useState('succes');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [guardado, setGuardado] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navegacion = useNavigate();
  // MANEJADOR DE ERRORES
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error1, setError1] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error2, setError2] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error3, setError3] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error4, setError4] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error5, setError5] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [numerosecuencial, setNumeroSecuencial] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mostrarprogreso, setMostrarProgreso] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dataNuevo, setnuevo] = useState({
    codigo: '',
    nombre: '',
    factor: 0,
    mespago: 0,
    porcentaje: 0, // float
    tipo: '',
    ingegremp: '', // cuenta
    estado: true,
    aplicarol: false,
    segurosocial: false,
    sistema: false,
    aplica: false,
  });
  const limpiar = () => {
    setnuevo({
      codigo: dataNuevo.codigo,
      nombre: '',
      factor: 0,
      mespago: 0,
      porcentaje: 0, // float
      tipo: '',
      ingegremp: '',
      estado: false,
      aplicarol: false,
      segurosocial: false,
      sistema: false,
      aplica: false,
    });
    setError(false);
    setError1(false);
    setError2(false);
    setError3(false);
    setError4(false);
    setError5(false);
  };

  const SelecTipo = (e) => {
    const cuentaselect = e.target.value;
    setnuevo({ ...dataNuevo, tipo: `${cuentaselect}` });
    setError1(false);
  };

  const cuenta = [
    {
      codigo: 'I',
      nombre: 'INGRESO',
    },
    {
      codigo: 'E',
      nombre: 'EGRESO',
    },
  ];

  const selectCuenta = (e) => {
    const tipocuenta = e.target.value;
    setnuevo({ ...dataNuevo, ingegremp: tipocuenta });
    setError2(false);
  };

  const tipo = [
    {
      codigo: 'BEN',
      nombre: 'BENEFICIO',
    },
    {
      codigo: 'APO',
      nombre: 'APORTACIÓN',
    },
  ];

  // MENSAJE GENERICO
  const messajeTool = (variant, msg, modoman) => {
    const unTrue = true;
    setCodigomod(dataNuevo.codigo);
    setNombre(dataNuevo.nombre);
    setModoMantenimiento(modoman);
    setTexto(msg);
    setTipo2(variant);
    setMantenimmiento(true);
    setopenModal2(unTrue);
  };

  const validation = () => {
    // Validar nombre
    const nombre = dataNuevo.nombre.length;

    if (nombre === 0) {
      messajeTool('error', 'Debe Ingresar un Nombre');
      setError(true);
      return false;
    }

    // Validar tipo
    const tipoval = dataNuevo.tipo;
    if (tipoval === '') {
      messajeTool('error', 'Debe Asignar un Tipo');
      setError1(true);
      return false;
    }

    // Validar tipocuenta
    const ingegrempval = dataNuevo.ingegremp;
    if (ingegrempval === '') {
      messajeTool('error', 'Debe Asignar una Cuenta');
      setError2(true);
      return false;
    }

    // Validar nombre
    const factorval = dataNuevo.factor;
    if (factorval === '') {
      messajeTool('error', 'Debe Ingresar un Valor Factor');
      setError3(true);
      return false;
    }

    // Validar mes pago
    const mespagoval = dataNuevo.mespago;
    if (mespagoval === '') {
      messajeTool('error', 'Debe Ingresar un Valor Mes-Pago');
      setError4(true);
      return false;
    }

    // Validar mes porcentaje
    const porcentajeval = dataNuevo.porcentaje;
    if (porcentajeval === '') {
      messajeTool('error', 'Debe Ingresar un Valor Porcentaje');
      setError5(true);
      return false;
    }

    return true;
  };

  const Grabar = async () => {
    const maquina = await obtenerMaquina();
    // const { codigo } = JSON.parse(window.localStorage.getItem('session'));
    // console.log('FUAFUAFUAUF', codigo);
    if (validation() === false) {
      return 0;
    }
    setMostrarProgreso(true);
    try {
      const Json = {
        fecha_ing: new Date(),
        maquina: `${maquina}`,
        // usuario: codigo,
        codigo: dataNuevo.codigo,
        Nombre: dataNuevo.nombre,
        Factor: parseInt(dataNuevo.factor, 10),
        MesPago: parseInt(dataNuevo.mespago, 10),
        AplicaRol: dataNuevo.aplicarol,
        SeguroSocial: dataNuevo.segurosocial,
        Estado: dataNuevo.estado,
        Sistema: dataNuevo.sistema,
        Tipo: dataNuevo.tipo.trim(),
        IngEgrEmp: dataNuevo.ingegremp.trim(),
        Porcentaje: parseFloat(dataNuevo.porcentaje),
        Aplica: dataNuevo.aplica,
      };

      const { data } = await axios.post(`${URLAPIGENERAL}/segurosocial/grabar`, Json, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data === 200) {
        setGuardado(true);
        messajeTool('succes', '', 'grabar');
      }
    } catch (error) {
      if (error.response.status === 401) {
        navegacion(`/auth/login`);
        messajeTool('error', 'Su inicio de sesión expiro.');
      }
      if (error.response.status !== 401) {
        messajeTool('error', 'Error al Grabar en el servidor');
      }
    } finally {
      setMostrarProgreso(false);
    }
  };

  const generarCodigo = (letra, num) => {
    const ceros = '0000';
    const nums = num.toString();
    const cero1 = ceros.split('');
    // eslint-disable-next-line no-plusplus
    for (let step = 0; step < nums.length; step++) {
      cero1.pop();
    }

    const cero2 = cero1.join('');
    return `${letra}${cero2}${num}`;
  };

  async function contarDatos() {
    const letra = await axios(`${URLAPIGENERAL}/iniciales/buscar?opcion=NOM_SEGURO_SOCIAL`);
    const letraa = letra.data[0].inicial;
    const numbsecuencial = letra.data[0].numero + 1;
    setNumeroSecuencial(numbsecuencial);
    const codigo = generarCodigo(letraa, numbsecuencial);

    setnuevo({
      ...dataNuevo,
      codigo,
    });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    contarDatos();
  }, []);

  const Volver = () => {
    navegacion(`/sistema/parametros/segurosocial`);
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
        tipo={tipo2}
      />
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Nueva Seguro Social">
          {/* <MenuMantenimiento
                    modo
                    nuevo={() => limpiar()}
                    grabar={() => Grabar()}
                    volver={() =>  volver()}
                /> */}
          <Box sx={{ ml: 3, mr: 3, p: 0 }}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item md={1.2} sm={2} xs={6}>
                <Button
                  fullWidth
                  name=""
                  variant="text"
                  size="small"
                  onClick={() => limpiar()}
                  startIcon={<InsertDriveFileRoundedIcon />}
                >
                  Nuevo
                </Button>
              </Grid>
              <Grid item md={1.2} sm={2} xs={6}>
                <Button fullWidth variant="text" startIcon={<SaveRoundedIcon />} size="small" onClick={Grabar}>
                  Grabar
                </Button>
              </Grid>
              <Grid item md={1.2} sm={2} xs={12}>
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  onClick={Volver}
                  startIcon={<ArrowCircleLeftRoundedIcon />}
                >
                  Volver
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Nuevo Seguro Social</h1>
          </Box>
          <Card sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={2} justifyContent="flex-start" style={{ fontWeight: '400px' }}>
                <Grid item container spacing={1}>
                  <Grid container item xs={12} spacing={1} pb={0.5}>
                    <Grid item md={4} sm={3} xs={12}>
                      <TextField
                        fullWidth
                        required
                        name="codigo"
                        InputProps={{
                          readOnly: true,
                        }}
                        label="Código"
                        value={dataNuevo.codigo}
                        id="outlined-size-small"
                        size="small"
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
                        error={error}
                        fullWidth
                        required
                        helperText="El nombre debe al menos 3 caracteres"
                        label="Nombre"
                        onChange={(e) => {
                          setnuevo({
                            ...dataNuevo,
                            nombre: e.target.value.toLocaleUpperCase(),
                          });
                          setError(false);
                        }}
                        value={dataNuevo.nombre}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={1} pb={0.5}>
                    <Grid item md={4} sm={3} xs={12}>
                      <RequiredTextField
                        error={error1}
                        fullWidth
                        required
                        select
                        label="Tipo"
                        id="outlined-size-small"
                        size="small"
                        onChange={SelecTipo}
                        value={dataNuevo.tipo}
                      >
                        {Object.values(tipo).map((val) => (
                          <MenuItem key={val.codigo} value={val.codigo}>
                            {val.nombre}
                          </MenuItem>
                        ))}
                      </RequiredTextField>
                    </Grid>
                    <Grid item md={4} sm={3} xs={12}>
                      <RequiredTextField
                        error={error2}
                        fullWidth
                        required
                        select
                        label="Ingreso / Egreso"
                        id="outlined-size-small"
                        size="small"
                        onChange={selectCuenta}
                        value={dataNuevo.ingegremp}
                      >
                        {Object.values(cuenta).map((val) => (
                          <MenuItem key={val.nombre} value={val.codigo}>
                            {val.nombre}
                          </MenuItem>
                        ))}
                      </RequiredTextField>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={1} pb={0.5}>
                    <Grid item md={4} sm={3} xs={12}>
                      <RequiredTextField
                        error={error3}
                        fullWidth
                        required
                        type="Number"
                        label="Factor"
                        onChange={(e) => {
                          setnuevo({
                            ...dataNuevo,
                            factor: e.target.value,
                          });
                          setError(false);
                        }}
                        value={dataNuevo.factor}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Grid>

                    <Grid item md={4} sm={3} xs={12}>
                      <RequiredTextField
                        error={error4}
                        fullWidth
                        type="Number"
                        required
                        label="Mes Pago"
                        onChange={(e) => {
                          setnuevo({
                            ...dataNuevo,
                            mespago: e.target.value,
                          });
                          setError(false);
                        }}
                        value={dataNuevo.mespago}
                        id="outlined-size-small"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={1} pb={0.5}>
                    <Grid item sm={4} xs={12} md={4}>
                      {/* <RequiredTextField
                      error={error5}
                      fullWidth
                      required
                      type="Number"
                      label="Porcentaje"
                      onChange={(e) => {
                        setnuevo({
                          ...dataNuevo,
                          porcentaje: e.target.value,
                        });
                        setError(false);
                      }}
                      InputProps={{
                        // readOnly: true,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      value={dataNuevo.porcentaje}
                      id="outlined-size-small"
                      size="small"
                    /> */}
                      <NumericFormat
                        customInput={TextField}
                        fullWidth
                        error={error5}
                        size="small"
                        type="text"
                        suffix={'%'}
                        decimalScale={2}
                        thousandSeparator
                        label="Porcentaje"
                        name="porcentaje"
                        variant="outlined"
                        value={dataNuevo.porcentaje}
                        onValueChange={(value) => setnuevo({ ...dataNuevo, porcentaje: value.floatValue || 0 })}
                      />
                    </Grid>
                  </Grid>

                  {/* CHECKBOX */}
                  <Grid container item xs={12} spacing={1} pb={0.5}>
                    <Grid item sm={4} xs={12} md={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dataNuevo.aplicarol}
                            onChange={(e) => {
                              setnuevo({ ...dataNuevo, aplicarol: e.target.checked });
                            }}
                          />
                        }
                        label="Aplica Rol"
                        name="estado"
                      />
                    </Grid>

                    <Grid item sm={4} xs={12} md={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dataNuevo.segurosocial}
                            onChange={(e) => {
                              setnuevo({ ...dataNuevo, segurosocial: e.target.checked });
                            }}
                          />
                        }
                        label="Seguro social"
                        name="estado"
                      />
                    </Grid>

                    {/* <Grid item sm={4} xs={12} md={2}>
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            checked={dataNuevo.estado}
                            onChange={(e) => {
                              setnuevo({ ...dataNuevo, estado: e.target.checked });
                            }}
                          />
                        }
                        label="Activo"
                        name="estado"
                      />
                    </Grid> */}

                    <Grid item sm={4} xs={12} md={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dataNuevo.sistema}
                            onChange={(e) => {
                              setnuevo({ ...dataNuevo, sistema: e.target.checked });
                            }}
                          />
                        }
                        label="Sistema"
                        name="estado"
                      />
                    </Grid>

                    <Grid item sm={4} xs={12} md={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dataNuevo.aplica}
                            onChange={(e) => {
                              setnuevo({ ...dataNuevo, aplica: e.target.checked });
                            }}
                          />
                        }
                        label="Aplica"
                        name="estado"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Page>
      </Fade>
    </>
  );
}
