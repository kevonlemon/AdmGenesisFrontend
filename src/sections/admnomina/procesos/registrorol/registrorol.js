import { Grid, Fade, Box, Card, TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import es from 'date-fns/locale/es';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { obtenerMaquina } from '../../../../utils/sistema/funciones';
import ModalGenerico from '../../../../components/modalgenerico';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import RequiredTextField from '../../../../sistema/componentes/formulario/RequiredTextField';
// import CajaGenerica from '../../../../components/cajagenerica';

import { MenuMantenimiento } from '../../../../components/sistema/menumatenimiento';
import Page from '../../../../components/Page';

import TipoCredito from './componentes/tipocredito';

import MotivoCredito from './componentes/motivocredito';

export default function RegistroRol() {
  const { enqueueSnackbar } = useSnackbar();
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${usuario.token}`,
    },
  };
  const [datosgenerales, setdatosgenerales] = useState({
    fechaemision: new Date(),
    empleado: 0,
    codigoempleado: '',
    nombreempleado: '',
    tipocreditos: '',
    tipo: 'I',
    opcionesmonto: true,
    valormontocredito: 0,
    codigomonto: 'COMICI',
    porcentaje: 0,
    sueldobase: 0,
    debito: 0,
    observacion: '',
    usuario: usuario.codigo,
    maquina: '',
    reset: '',
  });

  const opciones = [
    { nombre: 'Acreditar en el Rol de Pago', value: 'I' },
    { nombre: 'Debitar en el Rol de Pago', value: 'E' },
  ];
  const opcionesMontocredito = [
    { nombre: 'Usar Valor Asociado', value: true },
    { nombre: 'Poner Valor Manualmente', value: false },
  ];
  // Para coger el codigo del Hijo

  // useEffect(() => {
  //   onPorsentaje();
  // }, []);

  // Parte del Modal
  const [tiposBusquedas] = useState([{ tipo: 'nombres' }, { tipo: 'codigo' }]);

  const [listarempleados, setlistarempleados] = useState([]);
  const [openmodalEmpleados, setopenmodalEmpleados] = useState(false);
  const [activarimpresion, setactivarimoresion] = useState(true);
  const toggleShowEmpleados = () => setopenmodalEmpleados((p) => !p);
  const handleCallbackEmpleados = (e) => {
    const item = e.row;
    setdatosgenerales({
      ...datosgenerales,
      empleado: item.id,
      nombreempleado: item.nombre,
      codigoempleado: item.codigoempleado,
      sueldobase: item.sueldobase,
    });
    toggleShowEmpleados();
  };
  useEffect(() => {
    async function getDatos() {
      const { data } = await axios(`${URLAPIGENERAL}/empleados/listar`);
      const lista = data.map((e) => ({
        id: e.codigo,
        codigo: e.codigo_Empleado,
        nombre: e.nombres,
        sueldobase: e.sueldoBase,
        codigoempleado: e.codigo_Empleado,
      }));
      // console.log(lista);
      setlistarempleados(lista);
    }
    getDatos();
  }, []);
  const onValor = (event) => {
    setdatosgenerales({ ...datosgenerales, codigomonto: event });
    setactivarimoresion(true);
  };

  const onPorsentaje = (porcentaje) => {
    // console.log(e);
    setdatosgenerales({
      ...datosgenerales,
      porcentaje,
      // valormontocredito: porcentaje * (datosgenerales.sueldobase / 100),
    });
    // console.log(datosgenerales.valormontocredito);
  };
  useEffect(() => {
    const Calculo = () => {
      setdatosgenerales({
        ...datosgenerales,
        valormontocredito: datosgenerales.porcentaje * (datosgenerales.sueldobase / 100),
      });
    };
    Calculo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datosgenerales.nombreempleado, datosgenerales.porcentaje]);

  const [error, seterror] = useState(false);
  const Nuevo = () => {
    setdatosgenerales({
      fechaemision: new Date(),
      empleado: 0,
      codigoempleado: '',
      nombreempleado: '',
      tipocreditos: '',
      tipo: 'I',
      opcionesmonto: true,
      valormontocredito: 0,
      codigomonto: 'COMICI',
      porcentaje: 0,
      sueldobase: 0,
      debito: 0,
      observacion: '',
      reset: '',
    });
    setactivarimoresion(true);
  };
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
  // eslint-disable-next-line consistent-return
  const Grabar = async () => {
    try {
      const maquina = await obtenerMaquina();
      const empleado = datosgenerales.empleado.length;
      const tipo = datosgenerales.tipo.length;
      const observacion = datosgenerales.observacion.trim();
      if (empleado === '') {
        messajeTool('error', 'Debe escoger un empleado');
        seterror(true);
        return false;
      }
      if (tipo === '') {
        messajeTool('error', 'Debe escoger un tipo');
        seterror(true);
        return false;
      }
      if (observacion === '') {
        messajeTool('error', 'Debe escoger una observacion');
        seterror(true);
        return false;
      }
      // console.log(datosgenerales)
      const datosfinales = {
        empleado: datosgenerales.empleado,
        tipo: datosgenerales.tipo,
        fecha: datosgenerales.fechaemision,
        monto: datosgenerales.valormontocredito,
        usuario: datosgenerales.usuario,
        maquina,
        observacion: datosgenerales.observacion,
      };
      // console.log(datosfinales);
      const { data } = await axios.post(`${URLAPIGENERAL}/ingresoegresorol`, datosfinales, config);
      if (data === 200) {
        mensajeSistema('Registro Guardados correctamente ', 'success');
        setactivarimoresion(false);
        const response = await axios(
          `${URLAPIGENERAL}/ingresoegresorol/buscar?Codigodescr=${datosgenerales.codigomonto}`
        );
        setdatosgenerales({ ...datosgenerales, debito: response.data.numero });
        Nuevo();
      }
    } catch {
      messajeTool('error', 'Se Obtuvo un error ');
      console.log('Caimos al grabar');
    }
  };

  // -----------------------------------------------------------------------------------------------------
  async function buscarEmpleados() {
    try {
      const { data } = await axios(`${URLAPILOCAL}/empleados/obtenerxcodigo?codigo=${datosgenerales.codigoempleado === '' ? 'string' : datosgenerales.codigoempleado}`, config)
      if (data.length === 0) {
        mensajeSistema('Código no encontrado', 'warning')
        setopenmodalEmpleados(true);
      } else {
        setdatosgenerales({
          ...datosgenerales,
          empleado: data.codigo,
          codigoempleado: data.codigo_Empleado,
          nombreempleado: data.nombres,
          sueldobase: data.sueldoBase
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  // -----------------------------------------------------------------------------------------------------

  return (
    <>
      <ModalGenerico
        nombre="Empleados"
        rowsData={listarempleados}
        busquedaTipo={tiposBusquedas}
        openModal={openmodalEmpleados}
        toggleShow={toggleShowEmpleados}
        parentCallback={handleCallbackEmpleados}
      />
      <Page title="Registro Rol">
        <MenuMantenimiento
          nomostrarvolver
          modo
          nuevo={Nuevo}
          grabar={Grabar}
          mostrarimprimir
          imprimir={`${URLAPIGENERAL}/ingresoegresorol/generarpdf?Codigodescr=${datosgenerales.codigomonto}`}
          desactivarimpresion={activarimpresion}
        />

        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
            <h2>Datos Generales</h2>
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={1}>
                <Grid container item spacing={1}>
                  <Grid item md={4} sm={4} xs={12}>
                    <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                      <MobileDatePicker
                        label="Fecha Emision"
                        inputFormat="dd/MM/yyyy"
                        value={datosgenerales.fechaemision}
                        error={error}
                        onChange={(newValue) => {
                          setdatosgenerales({
                            ...datosgenerales,
                            fechaemision: newValue,
                          });
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth variant="outlined" size="small" />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={2} sm={2} xs={12}>
                    <RequiredTextField
                      label="Empleado *"
                      fullWidth
                      size="small"
                      error={error}
                      value={datosgenerales.codigoempleado}
                      onChange={(e) => {
                        setdatosgenerales({
                          ...datosgenerales,
                          codigoempleado: e.target.value,
                        });
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => {
                                buscarEmpleados()
                              }}
                            >
                              <SearchRounded />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <TextField
                      label="Nombre Empleado *"
                      fullWidth
                      size="small"
                      error={error}
                      value={datosgenerales.nombreempleado}
                      onChange={(e) => {
                        setdatosgenerales({
                          ...datosgenerales,
                          nombreempleado: e.target.value,
                        });
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        backgroundColor: "#e5e8eb",
                        border: "none",
                        borderRadius: '10px',
                        color: "#212B36"
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={1}>
                  <Grid item md={4} sm={4} xs={12}>
                    <TextField
                      label="Sueldo Base"
                      error={error}
                      size="small"
                      fullWidth
                      value={datosgenerales.sueldobase}
                      onChange={(e) => ({
                        ...datosgenerales,
                        sueldobase: e.target.value,
                      })}
                      disabled
                      sx={{
                        backgroundColor: "#e5e8eb",
                        border: "none",
                        borderRadius: '10px',
                        color: "#212B36"
                      }}
                    />
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <TextField
                      label="Debito Nº"
                      size="small"
                      disabled
                      value={datosgenerales.debito}
                      onChange={(e) => setdatosgenerales({ ...datosgenerales, debito: e.target.value })}
                      sx={{
                        backgroundColor: "#e5e8eb",
                        border: "none",
                        borderRadius: '10px',
                        color: "#212B36"
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
            <h2>Datos del Movimiento</h2>
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={1}>
                <Grid container item spacing={1}>
                  <Grid item md={4} sm={4} xs={12}>
                    <RequiredTextField
                      select
                      label="Tipo de Movimiento"
                      fullWidth
                      error={error}
                      defaultValue="I"
                      size="small"
                      value={datosgenerales.tipo}
                      onChange={(e) => {
                        const nuevotipo = opciones.filter((tipof) => tipof.value === e.target.value);
                        setdatosgenerales({ ...datosgenerales, tipo: nuevotipo[0].value });
                      }}
                    >
                      {opciones.map((f) => (
                        <MenuItem key={f.value} value={f.value}>
                          {f.nombre}
                        </MenuItem>
                      ))}
                    </RequiredTextField>
                  </Grid>
                </Grid>
                <Grid container item spacing={1}>
                  <Grid item md={4} sm={4} xs={12}>
                    <TipoCredito data={datosgenerales} tipo={datosgenerales.tipo} onValor={onValor} />
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <TextField
                      label=" % Sueldo Base"
                      size="small"
                      disabled
                      error={error}
                      onChange={(e) => {
                        setdatosgenerales({
                          ...datosgenerales,
                          porcentaje: e.target.value,
                        });
                      }}
                      value={datosgenerales.porcentaje}
                      sx={{
                        backgroundColor: "#e5e8eb",
                        border: "none",
                        borderRadius: '10px',
                        color: "#212B36"
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={1}>
                  <Grid item md={4} sm={4} xs={12}>
                    <MotivoCredito codigo={datosgenerales.codigomonto} onPorcentaje={onPorsentaje} />
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <TextField
                      select
                      label="Opciones Monto Credito"
                      size="small"
                      fullWidth
                      error={error}
                      value={datosgenerales.opcionesmonto}
                      onChange={(e) => setdatosgenerales({ ...datosgenerales, opcionesmonto: e.target.value })}
                    >
                      {opcionesMontocredito.map((f) => (
                        <MenuItem key={f.value} value={f.value}>
                          {f.nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <TextField
                      disabled={datosgenerales.opcionesmonto}
                      type="number"
                      error={error}
                      label="Monto Credito"
                      size="small"
                      fullWidth
                      value={parseFloat(datosgenerales.valormontocredito)}
                      onChange={(e) => setdatosgenerales({ ...datosgenerales, valormontocredito: e.target.value })}
                    />
                  </Grid>
                </Grid>
                <Grid container item spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <TextField
                      label="Observacion"
                      type="text"
                      size="small"
                      error={error}
                      fullWidth
                      value={datosgenerales.observacion}
                      onChange={(e) =>
                        setdatosgenerales({
                          ...datosgenerales,
                          observacion: e.target.value,
                        })
                      }
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
