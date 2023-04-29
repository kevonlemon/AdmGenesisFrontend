import { TextField, Button, Grid, Card, FormControlLabel, MenuItem, Checkbox, IconButton } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import * as React from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircle';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import axiosBirobid from '../../../../../utils/admnomina/axiosBirobid';
import CircularProgreso from '../../../../../components/Cargando';
import { obtenerMaquina } from '../../../../../utils/sistema/funciones';
import { CORS, URLAPIGENERAL, URLAPILOCAL } from '../../../../../config';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import ModalGenerico from '../../../../../components/modalgenerico';
import Page from '../../../../../components/Page';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
import MensajesGenericos from '../../../../../components/sistema/mensajesgenerico';
import { estilosdetabla, estilosdatagrid } from '../../../../../utils/csssistema/estilos';
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import { CustomNoRowsOverlay } from '../../../../../utils/csssistema/iconsdatagrid';

// ----------------------------------------------------------------------

export default function EditarBancoCia() {
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${usuario.token}`,
    },
  };
  //  eslint-disable-next-line react-hooks/rules-of-hooks
  const { state } = useLocation();
  const [openModal2, setopenModal2] = React.useState(false);
  const [mantenimmiento, setMantenimmiento] = React.useState(false);
  const [codigomod, setCodigomod] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [modoMantenimiento, setModoMantenimiento] = React.useState('');
  const [texto, setTexto] = React.useState('');
  const [tipo, setTipo] = React.useState('succes');
  const [guardado, setGuardado] = React.useState(false);
  const codigo = state.id;
  // Contador Automatico
  const [contadorAuto, setContadorauto] = React.useState(true);
  // seteo del Ultimo cheque
  const [switchUcheque, setUcheque] = React.useState(true);
  // Modal Progreso/ Carga
  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
  const [error, setError] = React.useState(false); // Inicial
  const [error1, setError1] = React.useState(false); // Nombre banco
  const [error2, setError2] = React.useState(false); // nº de cuenta
  const [error3, setError3] = React.useState(false); // tipo de cuenta
  const [error4, setError4] = React.useState(false); // n1Cuenta
  const [error5, setError5] = React.useState(false); // N cuenta
  const [error6, setError6] = React.useState(false); // N ultimo cheque

  const navigate = useNavigate();

  const { mensajeSistemaPregunta } = useMensajeGeneral()

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
    nombre_cta_cheque: '',
    estado: true,
    ultima_Conciliacion: new Date(),
    fecha_ing: new Date(),
    maquina: '',
    usuario: 0,
    sucursal: 0,

    campos: ''
  });

  const [datosCsvTxt, setDatosCsvTxt] = React.useState([]);

  async function EliminarCampo(campos) {
    try {
      const response = await axiosBirobid.post(`${URLAPIGENERAL}/bancos/eliminarcampocsvtxt`, campos, config, setMostrarProgreso(true))
      if (response.data === 200) {
        messajeTool('succes', 'Campo eliminado correctamente');
        const nuevalista = datosCsvTxt.filter((l) => l.id !== campos.codigo);
        setDatosCsvTxt(nuevalista)
      }
    } catch {
      if (error.response.status === 401) {
        navigate(`${PATH_AUTH.login}`);
        messajeTool('error', 'Su inicio de sesion expiro');
      } else if (error.response.status === 500) {
        navigate(`${PATH_PAGE.page500}`);
      } else {
        messajeTool('error', 'Problemas con la base de datos');
      }
    } finally {
      setMostrarProgreso(false);
    }
    

  }

  const eliminarCampoCsvTxt = async (e) => {
    console.log('e', e)
    if (e.row.origen === 'base') {
      const campos = {
        'codigo': e.id
      }
      mensajeSistemaPregunta({
        mensaje: `Esta acción eliminará desde la base de datos. ¿Está seguro de eliminar este campo?`,
        ejecutarFuncion: () => {
          EliminarCampo(campos)
        },
      });
    } else {
      const nuevalista = datosCsvTxt.filter((l) => l.id !== e.id);
      setDatosCsvTxt(nuevalista)
    }

  }
  const columnasCsvTxt = [
    { field: 'datosCsvTxt', headerName: 'Campos CSV/Txt', width: 370 },
    {
      field: 'eliminar',
      headerName: 'Eliminar',
      width: 100,
      sortable: false,
      renderCell: (param) => (
        <Button
          fullWidth
          variant="text"
          onClick={() => { eliminarCampoCsvTxt(param) }}
          startIcon={<CancelRoundedIcon />}
        />
      ),
    },
  ]

  function AgregarCamposCsvTxt() {
    const filtro = datosCsvTxt.filter(f => f.datosCsvTxt.trim() === dataBanco.campos.trim())
    const id = datosCsvTxt.length + 1
    setDatosCsvTxt(
      [...datosCsvTxt, { id, datosCsvTxt: dataBanco.campos, origen: 'web' }]
    )
    setbanco({ ...dataBanco, campos: '' })
  }
  console.log(datosCsvTxt)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function obtenermotv() {
      try {
        const { data } = await axios(
          `${URLAPIGENERAL}/bancos/obtener?codigo=${codigo}`,
          config,
          setMostrarProgreso(true)
        );
        console.log('data bancocia', data)
        setbanco(data);
        const dataCamposcsvtxt = data.camposCsvTxt.map((m) => ({
          id: m.codigo,
          datosCsvTxt: m.columna,
          origen: 'base'
        }))
        setDatosCsvTxt(dataCamposcsvtxt)

        if (data.tipo_Cuenta === 'COR') {
          setContadorauto(false);
        }
        if (data.tipo_Cuenta === 'AHOR') {
          setContadorauto(true);
          setUcheque(true);
        }
        if (data.ultimo_Cheque >= 1 && data.contador_Automatico === false) {
          setUcheque(false);
        }
        if (data.contador_Automatico === true) {
          setUcheque(true);
        }
        if (data.contador_Automatico === true) {
          setUcheque(true);
        }
      } catch {
        if (error.response.status === 401) {
          navigate(`${PATH_AUTH.login}`);
          messajeTool('error', 'Su inicio de sesion expiro');
        } else if (error.response.status === 500) {
          navigate(`${PATH_PAGE.page500}`);
        } else {
          messajeTool('error', 'Problemas con la base de datos');
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    obtenermotv();
  }, [codigo]);

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

  const [tipoCtas, setTipocuentabanco] = React.useState({});
  React.useEffect(() => {
    async function getTipoCuenta() {
      try {
        const response = await axios(
          `${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=CNT_TIPOCUENTABANCO`,
          config
        );
        const dataRes = response.data;
        const tipocuentas = dataRes.map((el) => ({
          codigo: el.codigo,
          nombre: el.nombre,
        }));
        setTipocuentabanco(tipocuentas);
      } catch (error) {
        if (error.response.status === 401) {
          navigate(`${PATH_AUTH.login}`);
          messajeTool('error', 'Su inicio de sesion expiro');
        } else if (error.response.status === 500) {
          navigate(`${PATH_PAGE.page500}`);
        } else {
          messajeTool('error', 'Problemas con la base de datos');
        }
      }
    }

    getTipoCuenta();
  }, []);

  const tipocuenta = (e) => {
    const tipocuenta = e.target.value;
    if (dataBanco.tipo_Cuenta === 'AHO') {
      setContadorauto(false);
      setUcheque(false);
      setbanco({
        ...dataBanco,
        ultimo_Cheque: 0,
      });
    }

    if (dataBanco.tipo_Cuenta === 'COR') {
      setContadorauto(true);
      setUcheque(true);
      setbanco({
        ...dataBanco,
        ultimo_Cheque: 0,
      });
    }
    setbanco({
      ...dataBanco,
      tipo_Cuenta: tipocuenta,
      ultimo_Cheque: 0,
      contador_Automatico: false,
    });
  };

  const actioncheckbox = (event) => {
    setUcheque(event.target.checked && dataBanco.tipo_Cuenta === 'COR');

    setbanco({
      ...dataBanco,
      contador_Automatico: event.target.checked,
      ultimo_Cheque: 0,
    });
  };

  const ultimocheque = (event) => {
    setbanco({ ...dataBanco, ultimo_Cheque: event.target.value });
  };

  const validation = () => {
    // implementar valdiadcion con motibo movimiento banco

    // CXP_PAGOS                NO DEBE EXISTIR EN ESAS DOS TABLAS PARA PODER ELIMINAR

    const Cuenta = dataBanco.cuenta;
    const Nombre = dataBanco.nombre.length;
    const ncuenta = dataBanco.numero_Cuenta;
    const ucheque = dataBanco.ultimo_Cheque;
    const tipocuenta = dataBanco.tipo_Cuenta;
    const cuentaCheque = dataBanco.cuenta_Cheque_Fecha;

    if (Nombre < 3) {
      messajeTool('error', 'El nombre debe tener al menos 3 caracteres.');
      setError1(true);
      return false;
    }

    if (ncuenta === '') {
      messajeTool('error', 'Debe ingresar número de cuenta.');
      setError2(true);
      return false;
    }

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

    if (Cuenta === '') {
      messajeTool('error', 'Debe ingresar la cuenta.');
      setError4(true);
      return false;
    }

    if (cuentaCheque === '') {
      messajeTool('error', 'Debe ingresar la Cuenta Cheque a Fecha');
      setError5(true);
      return false;
    }

    return true;
  };

  const actualizar = async () => {
    if (validation() === false) {
      return 0;
    }

    const maquina = await obtenerMaquina();
    const { codigo } = JSON.parse(window.localStorage.getItem('usuario'));

    const camposCsvTxt = datosCsvTxt.map((m) => ({
      codigo: m.id,
      columna: m.datosCsvTxt,
      origen: m.origen
    }))

    const Json = {
      Codigo: dataBanco.codigo,
      inicial_Banco: dataBanco.inicial_Banco,
      cuenta: dataBanco.cuenta,
      nombre_cuenta: dataBanco.nombre_cuenta,
      nombre: dataBanco.nombre,
      numero_Cuenta: dataBanco.numero_Cuenta,
      ultimo_Cheque: dataBanco.ultimo_Cheque,
      tipo_Cuenta: dataBanco.tipo_Cuenta,
      anio: fechaActual.getFullYear(),
      contador_Automatico: dataBanco.contador_Automatico,
      cuenta_Cheque_Fecha: dataBanco.cuenta_Cheque_Fecha,
      nombre_cta_cheque: dataBanco.nombre_cta_cheque,
      estado: dataBanco.estado,
      fecha_ing: new Date(),
      fechaRegistro: new Date(),
      maquina: `${maquina}`,
      usuario: codigo,
      camposCsvTxt
    };

    try {
      console.log('tosend', Json)
      const { data } = await axios.post(`${URLAPIGENERAL}/bancos/editar`, Json, config, setMostrarProgreso(true));
      if (data === 200) {
        setGuardado(true);
        messajeTool('succes', 'Registro guardado correctamente');
      }
      setError(false);
    } catch (error) {
      if (error.response.status === 401) {
        navigate(`${PATH_AUTH.login}`);
        messajeTool('error', 'Su inicio de sesion expiro');
      } else if (error.response.status === 500) {
        navigate(`${PATH_PAGE.page500}`);
      } else {
        messajeTool('error', 'Problemas con la base de datos');
      }
    } finally {
      setMostrarProgreso(false);
    }
  };

  const verificacioneliminar = async () => {
    try {
      // const { data } = await axios(`${URLAPILOCAL}/nivel3/filtrarnivel2?nivel2=${codigo}`);
      // if (lista === 0) {
      messajeTool('success', 'Explique el motivo de la eliminacion');
      setOpenModaldelet1(true);
      // // }
      // // if (lista > 0) {
      //   messajeTool('error', 'Existe movimiento, imposible eliminar!!!');
      // }
    } catch {
      if (error.response.status === 401) {
        navigate(`${PATH_AUTH.login}`);
        messajeTool('error', 'Su inicio de sesion expiro');
      } else if (error.response.status === 500) {
        navigate(`${PATH_PAGE.page500}`);
      } else {
        messajeTool('error', 'Problemas con la base de datos');
      }
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModaldelet, setOpenModaldelet1] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [emiMotivo, setMotivo] = React.useState('');

  const toggleShowdelete = () => setOpenModaldelet1((p) => !p);
  const handleCallbackChilddelete = (e) => {
    toggleShowdelete();
  };

  const Eliminar = async () => {
    verificacioneliminar();
    const maquina = await obtenerMaquina();
    const { codigo } = JSON.parse(window.localStorage.getItem('session'));
    const sucursal1 = JSON.parse(window.localStorage.getItem('sucursal'));

    setbanco({ ...dataBanco, maquina: `${maquina}`, usuario: codigo, sucursal: sucursal1 });
  };

  const JsonDelete = {
    codigo: `${dataBanco.codigo}`,
    nombre: dataBanco.nombre,
    fechaRegistro: new Date(),
    detalle: emiMotivo,
    maquina: dataBanco.maquina,
    fecha: dataBanco.fecha_ing,
    usuario: dataBanco.usuario,
    sucursal: dataBanco.sucursal,
  };

  const cerrarModalMensaje = () => {
    if (guardado === true) {
      setopenModal2((p) => !p);
      setGuardado(false);
      navigate(`/sistema/parametros/bancocia`);
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
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
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
      {/* <ModalGenericoDelete
        modulo="Banco Cia"
        codigo={dataBanco.inicial_Banco}
        nombre={dataBanco.nombre}
        urldelelte="bancos/eliminar"
        // urlredirect={PATH_SISTEMA.contabilidad_bancos.mantenimiento.bancocia.inicio}
        datos={JsonDelete}
        openModaldelete={openModaldelet}
        mensaje={(e) => setMotivo(e)}
        toggleShowdelete={toggleShowdelete}
        parentCallbackdelete={handleCallbackChilddelete}
      /> */}

      <Page title="Editar Banco">
        <Box sx={{ ml: 3, mr: 3, p: 0 }}>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item md={1.2} sm={2} xs={6}>
              <Button
                fullWidth
                variant="text"
                component={RouterLink}
                to="/sistema/parametros/nuevobancocia"
                size="small"
                startIcon={<AddCircleRoundedIcon />}
              >
                {' '}
                Nuevo{' '}
              </Button>
            </Grid>

            <Grid item md={1.2} sm={2} xs={6}>
              <Button fullWidth variant="text" startIcon={<SaveRoundedIcon />} size="small" onClick={actualizar}>
                {' '}
                Grabar{' '}
              </Button>
            </Grid>
            <Grid item md={1.2} sm={2} xs={6}>
              <Button
                disabled
                fullWidth
                variant="text"
                startIcon={<DeleteRoundedIcon />}
                onClick={Eliminar}
                size="small"
              >
                Eliminar
              </Button>
            </Grid>
            <Grid item md={1.2} sm={2} xs={6}>
              <Button
                fullWidth
                variant="text"
                size="small"
                component={RouterLink}
                to="/sistema/parametros/bancocia"
                startIcon={<ArrowCircleLeftRoundedIcon />}
              >
                {' '}
                Volver{' '}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
          <h1>Editar Banco</h1>
        </Box>
        <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
          <Box sx={{ width: '100%', p: 2 }}>
            <Grid container spacing={2}>
              <Grid container item xs={12} sm={12} md={6} spacing={1} sx={{ mb: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography variant="h6" gutterBottom component="div">
                      Banco
                    </Typography>
                  </Grid>
                </Box>

                <Grid item md={4.5} xs={12} sm={5}>
                  <TextField
                    fullWidth
                    error={error}
                    disabled
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
                    sx={{
                      backgroundColor: '#e5e8eb',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#212B36',
                    }}
                  />
                </Grid>
                <Grid item md={7.5} xs={12} sm={7}>
                  <TextField
                    fullWidth
                    disabled
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
                    sx={{
                      backgroundColor: '#e5e8eb',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#212B36',
                    }}
                  />
                </Grid>

                <Grid container item xs={12} spacing={1} sx={{ mb: 1 }}>
                  <Grid item md={7} xs={12} sm={7}>
                    <TextField
                      fullWidth
                      disabled
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
                      sx={{
                        backgroundColor: '#e5e8eb',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#212B36',
                      }}
                    />
                  </Grid>
                  <Grid item md={4} xs={12} sm={5}>
                    <RequiredTextField
                      select
                      error={error3}
                      label="Tipo de Cuenta"
                      value={dataBanco.tipo_Cuenta}
                      onChange={tipocuenta}
                      fullWidth
                      size="small"
                    >
                      {Object.values(tipoCtas).map((val) => (
                        <MenuItem key={val.nombre} value={val.codigo}>
                          {val.nombre}
                        </MenuItem>
                      ))}
                    </RequiredTextField>
                  </Grid>
                </Grid>

                <Grid container item xs={12} spacing={1} sx={{ mb: 1 }}>
                  <Grid item md={5} xs={12} sm={5}>
                    <TextField
                      fullWidth
                      error={error6}
                      disabled={
                        (switchUcheque && dataBanco.tipo_Cuenta === 'AHO') || dataBanco.contador_Automatico === true
                      }
                      size="small"
                      type="number"
                      // InputProps={{
                      //   readOnly: contadorAuto,}}
                      label="Nº del Ultimo Cheque"
                      onChange={ultimocheque}
                      value={dataBanco.ultimo_Cheque}
                    />
                  </Grid>

                  <Grid item md={6} xs={12} sm={6} sx={{ ml: 3 }}>
                    <FormControlLabel
                      disabled={contadorAuto}
                      control={
                        <Checkbox
                          checked={dataBanco.contador_Automatico && dataBanco.tipo_Cuenta === 'COR'}
                          // value={dataBanco.contador_Automatico}
                          onChange={actioncheckbox}
                        />
                      }
                      label="Contador Automatico"
                      name="contador_automatico"
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  item
                  xs={12}
                  spacing={1}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item md={2} xs={12} sm={2} sx={{ ml: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={dataBanco.estado}
                          disabled
                          onChange={(e) => {
                            setbanco({ ...dataBanco, estado: e.target.checked });
                          }}
                        />
                      }
                      label="Activo"
                      name="estado"
                    />
                  </Grid>
                </Grid>
                <Grid item container md={12} spacing={1}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography variant="h6" gutterBottom component="div">
                      Datos Adicionales
                    </Typography>
                  </Grid>
                  <Grid item container md={12} sm={12} xs={12} spacing={1}>
                    <Grid item md={11} sm={11} xs={11}>
                      <TextField
                        fullWidth
                        label="Campos CSV/Txt"
                        value={dataBanco.campos}
                        size="small"
                        onChange={(e) => {
                          setbanco({
                            ...dataBanco,
                            campos: e.target.value.toLocaleUpperCase()
                          })
                        }}
                      />
                    </Grid>
                    <Grid item md={1} sm={1} xs={1}>
                      <IconButton color='primary' onClick={() => AgregarCamposCsvTxt()}>
                        <AddCircleRoundedIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={estilosdetabla}>
                        <div
                          style={{
                            padding: '0.5rem',
                            height: '30vh',
                            width: '100%',
                          }}
                        >
                          <DataGrid
                            density="compact"
                            rowHeight={28}
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            // onRowDoubleClick={(e) => Editar(e)}
                            sx={estilosdatagrid}
                            rows={datosCsvTxt}
                            columns={columnasCsvTxt}
                            getRowId={(datosCsvTxt) => datosCsvTxt.id}
                            components={{
                              NoRowsOverlay: CustomNoRowsOverlay,
                            }}
                            hideFooter
                          />
                        </div>
                      </Box>
                    </Grid>
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
