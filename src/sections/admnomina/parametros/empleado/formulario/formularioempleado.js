import {
  TextField,
  Grid,
  Card,
  MenuItem,
  FormControlLabel,
  Button,
  Checkbox,
  Fade,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import * as React from 'react';
import { DataGrid, esES } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import InfoIcon from '@mui/icons-material/Info';
import es from 'date-fns/locale/es';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SearchRounded } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { NumericFormat } from 'react-number-format';
import Page from '../../../../../components/Page';
import { URLAPIGENERAL, URLRUC, URLAPILOCAL } from '../../../../../config';
import serviciosLocaciones from '../../../../../servicios/parametros_del_sistema/servicios_locaciones';
import serviciosMantenimientoGenerico from '../../../../../servicios/parametros_del_sistema/servicios_genericos';
import {
  esCedula,
  esCorreo,
  formaterarFecha,
  generarCodigo,
  obtenerMaquina
} from '../../../../../utils/sistema/funciones';
import { validarFecha } from '../../../../../utils/admnomina/funciones/funciones'
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
import { UploadMultiFile } from '../../../../../components/upload';
import useCargando from '../../../../../hooks/admnomina/useCargando';
import CircularProgreso from '../../../../../components/Cargando';
import ModalGenerico from '../../../../../components/modalgenerico';
import serviciosSucursal from '../../../../../servicios/parametros_del_sistema/servicios_sucursales';
import serviciosBanco from '../../../../../servicios/parametros_del_sistema/servicios_banco';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import { fCurrency } from '../../../../../utils/formatNumber';
import { styleActive, styleInactive, estilosdetabla, estilosdatagrid } from '../../../../../utils/csssistema/estilos';
import { CustomNoRowsOverlay } from '../../../../../utils/csssistema/iconsdatagrid';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
import MensajesGenericos from '../../../../../components/sistema/mensajesgenerico';
import CajaGenerica from '../../../../../components/admnomina/CajaGenerica';
import DateTextField from '../../../../../components/admnomina/DateTextField';
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import * as serviciosEmpleados from '../services/EmpleadoServices';

const meses = [
  { id: 1, nombre: 'Enero' },
  { id: 2, nombre: 'Febrero' },
  { id: 3, nombre: 'Marzo' },
  { id: 4, nombre: 'Abril' },
  { id: 5, nombre: 'Mayo' },
  { id: 6, nombre: 'Junio' },
  { id: 7, nombre: 'Julio' },
  { id: 8, nombre: 'Agosto' },
  { id: 9, nombre: 'Septiembre' },
  { id: 10, nombre: 'Octubre' },
  { id: 11, nombre: 'Noviembre' },
  { id: 12, nombre: 'Dicembre' },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography variant="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function FormularioEmpleado() {
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

  const { mensajeSistemaGenerico } = useMensajeGeneral()

  // CERTIFICADOS COLUMNA
  const columns = [
    {
      field: 'button',
      headerName: 'Eliminar',
      width: 90,
      renderCell: (param) => (
        <Button
          fullWidth
          variant="text"
          onClick={() => {
            eliminarCertficado(param);
          }}
          startIcon={<CancelRoundedIcon />}
        />
      ),
    },
    { field: 'empleado', headerName: 'Empleado', width: 120 },
    { field: 'nombre', headerName: 'Nombre', width: 200 },
    { field: 'empresaEmisora', headerName: 'Empresa', width: 100 },
    {
      field: 'caduca',
      headerName: 'Caduca',
      width: 100,
      renderCell: (param) =>
        param.row.caduca === true ? (
          <Button variant="containded" style={styleActive}>
            SI
          </Button>
        ) : (
          <Button variant="containded" style={styleInactive}>
            NO
          </Button>
        ),
    },
    {
      field: 'mesExpedicion',
      headerName: 'Mes',
      width: 100,
      valueFormatter: (params) => {
        const mes = meses.filter((f) => f.id === params.value);
        return mes[0].nombre;
      },
    },
    { field: 'anioExpedicion', headerName: 'Año', width: 100 },
    {
      field: 'fechaCaducidad',
      headerName: 'Fecha',
      width: 100,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '--/--/----';
        }
        const valueFormatted = formaterarFecha(params.value, '-', '/');
        return valueFormatted;
      },
    },

    { field: 'idCredencial', headerName: 'Credencial', width: 100 },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 100,
      valueFormatter: (params) => {
        if (params.value.trim() === 'P') {
          return 'PRESENCIAL';
        }
        return 'LINEA';
      },
    },
    { field: 'urlArchivo', headerName: 'Archivo', width: 100 },
  ];
  // EDITAR CERTIFICADO
  const columnsset = [
    { field: 'empleado', headerName: 'Empleado', width: 120 },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 200,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = `${params.props.value}`.trim().length !== 0;
        if (!hasError) {
          messajeTool('error', 'Complete el campo');
        }
        return { ...params.props, error: !hasError };
      },
    },
    {
      field: 'empresaEmisora',
      headerName: 'Empresa',
      width: 100,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = `${params.props.value}`.trim().length !== 0;
        if (!hasError) {
          messajeTool('error', 'Complete el campo');
        }
        return { ...params.props, error: !hasError };
      },
    },
    {
      field: 'caduca',
      headerName: 'Caduca',
      width: 100,
      type: 'boolean',
      editable: true,
      renderCell: (param) =>
        param.row.caduca === true ? (
          <Button variant="containded" style={styleActive}>
            SI
          </Button>
        ) : (
          <Button variant="containded" style={styleInactive}>
            NO
          </Button>
        ),
    },
    {
      field: 'mesExpedicion',
      headerName: 'Mes',
      width: 100,
      type: 'number',
      editable: true,
      valueFormatter: (params) => {
        try {
          const mes = meses.filter((f) => f.id === params.value);
          return mes[0].nombre;
        } catch (error) {
          return 'Enero';
        }
      },
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value < 13 && params.props.value > 0;
        if (!hasError) {
          messajeTool('error', 'Escriba del 1 al 12');
        }
        return { ...params.props, error: !hasError };
      },
    },
    { field: 'anioExpedicion', headerName: 'Año', width: 100, type: 'number', editable: true },
    {
      field: 'fechaCaducidad',
      headerName: 'Fecha',
      width: 100,
      type: 'date',
      editable: true,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '--/--/----';
        }
        const valueFormatted = formaterarFecha(params.value, '-', '/');
        return valueFormatted;
      },
    },

    {
      field: 'idCredencial',
      headerName: 'Credencial',
      width: 100,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = `${params.props.value}`.trim().length !== 0;
        if (!hasError) {
          messajeTool('error', 'Complete el campo');
        }
        return { ...params.props, error: !hasError };
      },
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 150,
      editable: true,
      valueFormatter: (params) => {
        if (params.value.trim() === 'P') {
          return 'PRESENCIAL';
        }
        return 'LINEA';
      },
      preProcessEditCellProps: (params) => {
        const hasError =
          `${params.props.value}`.trim().toUpperCase() === 'P' || `${params.props.value}`.trim().toUpperCase() === 'L';
        if (!hasError) {
          messajeTool('error', 'Solo se acepte P Y L');
        }
        return { ...params.props, error: !hasError };
      },
    },
    {
      field: 'urlArchivo',
      headerName: 'Archivo',
      width: 100,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = `${params.props.value}`.trim().length !== 0;
        if (!hasError) {
          messajeTool('error', 'Complete el campo');
        }
        return { ...params.props, error: !hasError };
      },
    },
  ];
  // COLUMNS
  const columns1 = [
    { field: 'empleado', headerName: 'Empleado', width: 120 },
    { field: 'parentezco', headerName: 'Parentezco', width: 120 },
    { field: 'nombres', headerName: 'Nombre', width: 300 },
    { field: 'cedula', headerName: 'Cedula', width: 100 },
    { field: 'direccion', headerName: 'Direccion', width: 300 },
    {
      field: 'button',
      headerName: 'Eliminar',
      width: 90,
      renderCell: (param) => (
        <Button
          fullWidth
          variant="text"
          onClick={() => {
            eliminarCarga(param);
          }}
          startIcon={<CancelRoundedIcon />}
        />
      ),
    },
  ];
  // COLUMNA CARGA EDITAR
  const columnscargaset = [
    { field: 'empleado', headerName: 'Empleado', width: 120 },
    {
      field: 'parentezco',
      headerName: 'Parentezco',
      width: 120,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = `${params.props.value}`.trim().length !== 0;
        if (!hasError) {
          messajeTool('error', 'Complete el campo');
        }
        return { ...params.props, error: !hasError };
      },
    },
    {
      field: 'nombres',
      headerName: 'Nombre',
      width: 300,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = `${params.props.value}`.trim().length !== 0;
        if (!hasError) {
          messajeTool('error', 'Complete el campo');
        }
        return { ...params.props, error: !hasError };
      },
    },
    {
      field: 'cedula',
      headerName: 'Cedula',
      width: 100,
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = esCedula(params.props.value);
        if (!hasError) {
          messajeTool('error', 'Digete una cedula valida');
        }
        return { ...params.props, error: !hasError };
      },
    },
    { field: 'direccion', headerName: 'Direccion', width: 300, editable: true },
  ];
  // TABS
  const [tabs, setTabs] = React.useState(0);

  const handleChangeTabs = (event, newValue) => {
    setTabs(newValue);
  };

  const { state } = useLocation();
  const { modo, id } = state;
  const [tipodoc, setTipoDoc] = React.useState('05');
  const [listatipodoc, setListaTipoDoc] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [errorcertificado, setErrorCertificado] = React.useState(false);
  const [errorcarga, setErrorCarga] = React.useState(false);
  const [errorcorreo, setErrorcorreo] = React.useState(false);
  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
  const [tablacertificado, setTablaCertificado] = React.useState([]);
  const [tablacertificadoedit, setTablaCertificadoEdit] = React.useState([]);
  const [tablacarga, setTablaCarga] = React.useState([]);
  const [tablacargaedit, setTablaCargaEdit] = React.useState([]);

  // FORMULARIO DE ENVIO

  // FORMULARIOS DE ENVIO DE DATOS
  const [maquina, setMaquina] = React.useState('');
  const [formularioempleado, setFormularioEmpleado] = React.useState({
    codigo: '',
    codigo_Empleado: '',
    nombres: '',
    direccion: '',
    telefonos: '',
    fecing: new Date(),
    cedula: '',
    correo: '',
    fechaNac: new Date(),
    cargo: '',
    nombrecargo: '',
    departamento: '',
    nombredepartamento: '',
    sexo: 'M',
    sueldoBase: 0,
    sueldoBaseview: '$0',
    estadocivil: 'S',
    fechaTitulacion: new Date(),
    institucion: '',
    titulo: '',
    registro: '',
    afiliadoSeguro: true,
    beneficioSocial: true,
    fondoReserva: true,
    pagoMensualDecimoTercero: true,
    pagoMensualDecimoCuarto: true,
    observacion: '',
    esdiscapacitado: false,
    porcentajediscapacidadview: 0,
    porcentajediscapacidad: 0,
    acargodiscapacitado: false,
    tipoctabanco: 'AHO',
    ctabanco: '',
    modoejecucion: '',
    estado: true,
    idBiometrico: '',
    fecha_ing: new Date(),
    maquina: '',
    usuario: 1,
    urlDocumentos: null
  });
  const [nivelEstudios, setNivelEstudios] = React.useState({
    codigo: '',
    codigoalternativo: '',
    nombre: ''
  })
  const [banco, setBanco] = React.useState({
    codigo: '',
    codigoalternativo: '',
    nombre: ''
  })
  const [listaSucursales, setListaSucursales] = React.useState([]);
  const [listaBancos, setListaBancos] = React.useState([]);
  const [sucursal, setSucursal] = React.useState(0);
  const [datosProvincia, setDatosProvincia] = React.useState({
    provincia: '',
    nombre_provincia: '----',
  });
  const [datosCanton, setDatosCanton] = React.useState({
    canton: '',
    nombre_canton: '----',
  });
  const [datosParroquia, setDatosParroquia] = React.useState({
    parroquia: '',
    nombre_parroquia: '----',
  });
  const [provincias, setProvincias] = React.useState([]);
  const [cantones, setCantones] = React.useState([]);
  const [parroquias, setParroquias] = React.useState([]);

  const [formulariocertificado, setFormularioCertificado] = React.useState({
    empleado: 1,
    nombre: '',
    empresaEmisora: '',
    caduca: true,
    mesExpedicion: new Date().getMonth() + 1,
    anioExpedicion: new Date().getFullYear(),
    fechaCaducidad: new Date(),
    idCredencial: '',
    tipo: 'P',
    urlArchivo: '',
  });

  const [formulariocarga, setFormularioCarga] = React.useState({
    empleado: 1,
    parentezco: '',
    nombres: '',
    cedula: '',
    direccion: '',
  });

  const [listafunciones, setListaFunciones] = React.useState([])
  const [funciones, setFunciones] = React.useState({
    codigo: '',
    nombre: ''
  })

  const [listajornadas, setListaJornadas] = React.useState([])
  const [jornadas, setJornadas] = React.useState({
    codigo: '',
    nombre: ''
  })

  const [listaformapago, setListaFormaPago] = React.useState([])
  const [formapago, setFormaPago] = React.useState({
    codigo: '',
    nombre: ''
  })

  const [listamodoejecucion, setListaModoEjecucion] = React.useState([]);

  const cambiarFechaTitulacion = (e) => setFormularioEmpleado({
    ...formularioempleado,
    fechaTitulacion: validarFecha(e) ? e : new Date()
  });

  // SUBIDA DE DOCUMENTOS
  const { empezarCarga, terminarCarga } = useCargando();
  const [archivo, setArchivo] = React.useState([]);
  const cargarArchivos = React.useCallback(
    (archivos) => {
      const noEsPdf = archivos.at(0).type !== 'application/pdf';
      if (noEsPdf) {
        messajeTool('warning', 'Solo puede subir un archivo en formato .pdf');
        return;
      }
      if (archivo.length >= 1) {
        messajeTool('warning', 'Solo puede subir un archivo');
        return;
      }
      if (archivos.at(0).size / 1000000 > 2) {
        messajeTool('warning', 'Solo puede subir un archivo que pese máximo 2mb');
        return;
      }
      const nuevosArchivos = archivos.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setArchivo([...archivo, ...nuevosArchivos]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [archivo]
  );
  const removerArchivo = (archivoRemovido) => {
    const archivosEliminados = archivo.filter((file) => file !== archivoRemovido);
    setArchivo(archivosEliminados);
  };
  const removerTodosLosArchivos = () => setArchivo([]);
  const enviarArchivos = () => {
    const nombre = formularioempleado.nombres;
    const codigo = formularioempleado.codigo_Empleado;
    const fechahoy = new Date().toISOString();
    const nombrepdf = `${nombre}_${codigo}_${fechahoy.substring(0, 10)}.pdf`
    const lecturArchivo = new FileReader();
    lecturArchivo.readAsDataURL(archivo.at(0));
    lecturArchivo.onloadend = (e) => {
      const datos = {
        codigoempleado: formularioempleado.codigo_Empleado,
        // `${formularioempleado.nombres}_${formularioempleado.codigo_Empleado}_${fechahoy.toLocaleDateString()}.pdf`
        nombreArchivo: nombrepdf,
        archivo: e.target.result.split('base64,')[1]
      }
      empezarCarga();
      serviciosEmpleados.subirArchivos(datos)
        .then((res) => {
          if (res !== 200) {
            messajeTool('error', 'Error al subir el documento');
            return;
          }
          messajeTool('succes', 'Documento subido con éxito');
          limpiarCampos();
        })
        .catch(() => {
          messajeTool('error', 'Problemas con el servidor contácte con soporte');
        })
        .finally(() => {
          terminarCarga();
        })
    }
  };

  // METODO PARA OBTENER EL RUC

  // METODO PARA LIMPIAR LOS CAMPOS
  const limpiarCampos = () => {
    setFormularioEmpleado({
      ...formularioempleado,
      nombres: '',
      direccion: '',
      telefonos: '',
      fecing: new Date(),
      cedula: '',
      correo: '',
      fechaNac: new Date(),
      cargo: '',
      nombrecargo: '',
      departamento: '',
      nombredepartamento: '',
      nivelEstudio: '',
      sexo: 'M',
      estadocivil: 'S',
      fechaTitulacion: new Date(),
      institucion: '',
      titulo: '',
      registro: '',
      sueldoBase: 0,
      sueldoBaseview: '$0',
      afiliadoSeguro: true,
      beneficioSocial: true,
      fondoReserva: true,
      pagoMensualDecimoTercero: true,
      pagoMensualDecimoCuarto: true,
      observacion: '',
      esdiscapacitado: false,
      porcentajediscapacidadview: 0,
      porcentajediscapacidad: 0,
      acargodiscapacitado: false,
      tipoctabanco: 'AHO',
      ctabanco: '',
      modoejecucion: '',
      estado: true,
      idBiometrico: '',
      fecha_ing: new Date()
    });
    setDatosProvincia({
      provincia: '',
      nombre_provincia: '----',
    })
    setDatosCanton({
      canton: '',
      nombre_canton: '----',
    })
    setDatosParroquia({
      parroquia: '',
      nombre_parroquia: '----',
    })
    setNivelEstudios({
      codigo: '',
      codigoalternativo: '',
      nombre: ''
    })
    setFunciones({
      codigo: '',
      nombre: ''
    })
    setJornadas({
      codigo: '',
      nombre: ''
    })
    setFormaPago({
      codigo: '',
      nombre: ''
    })
    setBanco({
      codigo: '',
      codigoalternativo: '',
      nombre: ''
    })
    setFormularioCertificado({
      empleado: 1,
      nombre: '',
      empresaEmisora: '',
      caduca: true,
      mesExpedicion: new Date().getMonth(),
      anioExpedicion: new Date().getFullYear(),
      fechaCaducidad: new Date(),
      idCredencial: '',
      tipo: 'PRE',
      urlArchivo: '',
    });
    setFormularioCarga({
      empleado: 1,
      parentezco: '',
      nombres: '',
      cedula: '',
      direccion: '',
    });
    setTablaCarga([]);
    setTablaCertificado([]);
    setError(false);
    setErrorcorreo(false);
    setErrorCarga(false);
    setErrorCertificado(false);
  };

  const limpiarSecciones = () => {
    switch (tabs) {
      case 0:
        setFormularioEmpleado({
          ...formularioempleado,
          nombres: '',
          direccion: '',
          cedula: '',
          telefonos: '',
          sexo: 'M',
          correo: '',
          fechaNac: new Date(),
          fecing: new Date(),
          sueldoBaseview: '$0',
          sueldoBase: 0,
          departamento: '',
          nombredepartamento: '',
          cargo: '',
          nombrecargo: '',
          observacion: '',
          estadocivil: 'S',
          afiliadoSeguro: true,
          beneficioSocial: true,
          fondoReserva: true,
          pagoMensualDecimoTercero: true,
          pagoMensualDecimoCuarto: true,
          estado: true,
          idBiometrico: '',
        })
        setDatosProvincia({
          provincia: '',
          nombre_provincia: ''
        })
        setDatosCanton({
          canton: '',
          nombre_canton: ''
        })
        setDatosParroquia({
          parroquia: '',
          nombre_parroquia: ''
        })
        break;
      case 1:
        setNivelEstudios({
          codigo: '',
          codigoalternativo: '',
          nombre: ''
        })
        setFormularioEmpleado({
          ...formularioempleado,
          fechaTitulacion: new Date(),
          institucion: '',
          titulo: '',
          registro: ''
        })
        break;
      case 2:
        setFunciones({
          codigo: '',
          nombre: ''
        })
        setFormularioEmpleado({
          ...formularioempleado,
          esdiscapacitado: false,
          porcentajediscapacidad: 0,
          porcentajediscapacidadview: '0%',
          acargodiscapacitado: false,
          tipoctabanco: 'AHO',
          ctabanco: ''
        })
        setJornadas({
          codigo: '',
          nombre: ''
        })
        setFormaPago({
          codigo: '',
          nombre: ''
        })
        setBanco({
          codigo: '',
          codigoalternativo: '',
          nombre: ''
        })
        break;
      case 3:
        setFormularioCarga({
          cedula: '',
          direccion: '',
          empleado: '',
          nombres: '',
          parentezco: ''
        })
        break;
      case 4:
        setFormularioCertificado({
          empleado: 1,
          nombre: '',
          empresaEmisora: '',
          caduca: true,
          mesExpedicion: new Date().getMonth() + 1,
          anioExpedicion: new Date().getFullYear(),
          fechaCaducidad: new Date(),
          idCredencial: '',
          tipo: 'P',
          urlArchivo: ''
        })
        break;
      default:
        console.log('problemas con las Tabs')
    }
  }

  // GUARDAR INFORMACION
  const Volver = () => {
    navegacion(`/sistema/parametros/empleado`);
  };

  const consultarIdentificacion = async (identificacion, opcion) => {
    try {
      if (opcion === 'empleado') {
        if (tipodoc === '05') {
          const { data } = await axios(`${URLRUC}GetCedulas?id=${identificacion}`);
          const fechaNac = new Date(formaterarFecha(data[0].FechaNacimiento, '/', '-'));
          setFormularioEmpleado({
            ...formularioempleado,
            nombres: data[0].Nombre,
            direccion: data[0].Direccion,
            fechaNac,
          });
        } else {
          messajeTool('error', 'Solo busca con cedula');
        }
      }
      if (opcion === 'carga') {
        const { data } = await axios(`${URLRUC}GetCedulas?id=${identificacion}`);
        setFormularioCarga({
          ...formulariocarga,
          nombres: data[0].Nombre,
          direccion: data[0].Direccion,
        });
      }
    } catch (error) {
      messajeTool('error', 'Error al buscar indentificacion');
    }
  };
  const agregarCertificado = () => {
    // validaciones
    if (formulariocertificado.nombre.trim().length === 0) {
      messajeTool('warning', 'Ingrese un nombre');
      setErrorCertificado(true);
      return;
    }
    if (formulariocertificado.empresaEmisora.trim().length === 0) {
      messajeTool('warning', 'Ingrese una empresa emisora');
      setErrorCertificado(true);
      return;
    }
    if (`${formulariocertificado.anioExpedicion}`.trim().length === 0) {
      messajeTool('warning', 'Ingrese un año');
      setErrorCertificado(true);
      return;
    }
    if (formulariocertificado.idCredencial.trim().length === 0) {
      messajeTool('warning', 'Ingrese credencial');
      setErrorCertificado(true);
      return;
    }
    // if (formulariocertificado.urlArchivo.trim().length === 0) {
    //     mensajeSistema('Ingrese un nombre', 'error')
    //     return
    // }
    const existe = tablacertificado.filter(
      (f) =>
        f.idCredencial === formulariocertificado.idCredencial &&
        f.empresaEmisora === formulariocertificado.empresaEmisora &&
        f.urlArchivo === formulariocertificado.urlArchivo
    );
    if (existe.length > 0) {
      messajeTool('warning', 'No puede agregar el mismo certificado');
      return;
    }

    setErrorCertificado(false);
    const codigo = tablacertificado.length === 0 ? 1 : tablacertificado.length + 1;
    const add = {
      codigo,
      empleado: formularioempleado.codigo_Empleado,
      nombre: formulariocertificado.nombre,
      empresaEmisora: formulariocertificado.empresaEmisora,
      caduca: formulariocertificado.caduca,
      mesExpedicion: formulariocertificado.mesExpedicion,
      anioExpedicion: formulariocertificado.anioExpedicion,
      idCredencial: formulariocertificado.idCredencial,
      fechaCaducidad: formulariocertificado.fechaCaducidad.toISOString(),
      tipo: formulariocertificado.tipo,
      urlArchivo: formulariocertificado.urlArchivo,
    };
    setTablaCertificado([...tablacertificado, add]);
  };
  const agregarCarga = () => {
    if (formulariocarga.parentezco.trim().length === 0) {
      messajeTool('warning', 'Ingrese un parentezco');
      setErrorCarga(true);
      return;
    }
    if (formulariocarga.nombres.trim().length === 0) {
      messajeTool('warning', 'Ingrese un nombre');
      setErrorCarga(true);
      return;
    }
    if (formulariocarga.cedula.trim().length === 0) {
      messajeTool('warning', 'Ingrese cédula');
      setErrorCarga(true);
      return;
    }
    if (!esCedula(`${formulariocarga.cedula}`)) {
      messajeTool('warning', 'Ingrese una cédula valida');
      setErrorCarga(true);
      return;
    }
    const existe = tablacarga.filter((f) => f.cedula === formulariocarga.cedula.trim());
    if (existe.length > 0) {
      messajeTool('warning', 'No puede agregar una persona con un número de cédula ya ingresado');
      return;
    }

    setErrorCarga(false);
    const codigo = tablacarga.length === 0 ? 1 : tablacarga.length + 1;
    const add = {
      codigo,
      empleado: formularioempleado.codigo_Empleado,
      parentezco: formulariocarga.parentezco,
      nombres: formulariocarga.nombres,
      direccion: formulariocarga.direccion,
      cedula: formulariocarga.cedula,
    };
    setTablaCarga([...tablacarga, add]);
  };
  const eliminarCertficado = (e) => {
    const nuevalista = tablacertificado.filter((l) => l.codigo !== e.row.codigo);
    setTablaCertificado(nuevalista);
  };
  const eliminarCarga = (e) => {
    const nuevalista = tablacarga.filter((l) => l.codigo !== e.row.codigo);
    setTablaCarga(nuevalista);
  };

  // -------------------------------- REF PARA EL FOCUS ---------------------------------------------------------------------------
  const nombresref = React.useRef();
  const direccionref = React.useRef();
  const identificacionref = React.useRef();
  const telefonoref = React.useRef();
  const correoref = React.useRef();
  const sueldobaseref = React.useRef();
  const departamentoref = React.useRef();
  const cargoref = React.useRef();
  const idBiometricoref = React.useRef();
  const nivelestudioref = React.useRef();
  const institucionref = React.useRef();
  const tituloref = React.useRef();
  const registroref = React.useRef();
  const funcionref = React.useRef();
  const jornadaref = React.useRef();
  const formapagoref = React.useRef();
  const porcentajediscapacitadoref = React.useRef();
  const cuentabcoref = React.useRef();
  // ------------------------------------------------------------------------------------------------------------------------------

  const validacionEmpleado = () => {
    if (formularioempleado.nombres.trim().length === 0) {
      messajeTool('warning', 'Ingrese un nombre');
      nombresref.current.focus();
      return false;
    }
    if (formularioempleado.direccion.trim().length === 0) {
      messajeTool('warning', 'Ingrese un dirección');
      direccionref.current.focus();
      return false;
    }
    if (`${formularioempleado.cedula}`.trim().length === 0) {
      messajeTool('warning', 'Ingrese cédula');
      identificacionref.current.focus();
      return false;
    }
    if (!esCedula(`${formularioempleado.cedula}`)) {
      messajeTool('warning', 'Ingrese una cédula valida');
      identificacionref.current.focus();
      return false;
    }
    if (`${formularioempleado.telefonos}`.trim().length === 0) {
      messajeTool('warning', 'Ingrese teléfono');
      telefonoref.current.focus();
      return false;
    }
    if (!esCorreo(formularioempleado.correo)) {
      messajeTool('warning', 'Correo Inválido');
      correoref.current.focus();
      return false;
    }
    if (formularioempleado.sueldoBaseview === "" || formularioempleado.sueldoBaseview === "$0") {
      messajeTool('warning', 'Ingrese un sueldo Base mayor a 0');
      sueldobaseref.current.focus();
      return false;
    }
    if (formularioempleado.departamento.trim().length === 0) {
      messajeTool('warning', 'Seleccione un departamento');
      departamentoref.current.focus();
      return false;
    }
    if (formularioempleado.cargo.trim().length === 0) {
      messajeTool('warning', 'Seleccione un cargo');
      cargoref.current.focus();
      return false;
    }
    // if (formularioempleado.idBiometrico.trim().length === 0) {
    //   messajeTool('warning', 'Ingrese un id de Biométrico');
    //   idBiometricoref.current.focus();
    //   return false;
    // }
    if (nivelEstudios.codigo.trim().length === 0) {
      messajeTool('warning', 'Seleccione un nivel de estudio');
      nivelestudioref.current.focus();
      return false;
    }
    if (formularioempleado.institucion.trim().length === 0) {
      messajeTool('warning', 'Ingrese la institución de estudio');
      institucionref.current.focus();
      return false;
    }
    if (formularioempleado.titulo.trim().length === 0) {
      messajeTool('warning', 'Ingrese el titulo obtenido');
      tituloref.current.focus();
      return false;
    }
    if (formularioempleado.registro.trim().length === 0) {
      messajeTool('warning', 'Ingrese un registro de Estudios');
      registroref.current.focus();
      return false;
    }
    if (funciones.codigo.trim().length === 0) {
      messajeTool('warning', 'Seleccione alguna función para el empleado');
      funcionref.current.focus();
      return false;
    }
    if (jornadas.codigo.trim().length === 0) {
      messajeTool('warning', 'Seleccione alguna jornada para el empleado');
      jornadaref.current.focus();
      return false;
    }
    if (formapago.codigo.trim().length === 0) {
      messajeTool('warning', 'Seleccione alguna forma de pago para el empleado');
      formapagoref.current.focus();
      return false;
    }
    if (formularioempleado.esdiscapacitado) {
      if (formularioempleado.porcentajediscapacidad === "0" || formularioempleado.porcentajediscapacidad === "") {
        messajeTool('warning', 'Ha indicado que el empleado es discapacitado pero no ha específicado el porcentaje de discapacidad, por favor ingrese un porcentaje de discapacidad');
        porcentajediscapacitadoref.current.focus();
        return false;
      }
    }
    if (banco.codigoalternativo.trim().length !== 0) {
      if (formularioempleado.ctabanco.trim().length === 0) {
        messajeTool('warning', 'Ha seleccionado un banco pero no ha ingresado un número de cuenta de banco, por favor ingrese un número de cuenta de banco');
        cuentabcoref.current.focus();
        return false;
      }
      if (formularioempleado.tipoctabanco.trim().length === 0) {
        messajeTool('warning', 'Ha seleccionado un banco pero no ha específicado el tipo de cuenta de banco, por favor específique un tipo de cuenta de banco');
        cuentabcoref.current.focus();
        return false;
      }
    }
    return true;
  };
  const Grabar = async () => {
    try {
      if (!validacionEmpleado()) {
        return;
      }
      setError(false);
      if (modo === 'nuevo') {
        tablacertificado.forEach((t) => {
          t.empleado = 0;
        });
        tablacarga.forEach((t) => {
          t.empleado = 0;
        });

        const enviarjson = {
          codigo: 0,
          codigo_Empleado: formularioempleado.codigo_Empleado,
          nombres: formularioempleado.nombres,
          direccion: formularioempleado.direccion,
          telefonos: formularioempleado.telefonos,
          fecing: formularioempleado.fecing,
          cedula: formularioempleado.cedula,
          correo: formularioempleado.correo,
          fechaNac: formularioempleado.fechaNac,
          cargo: formularioempleado.cargo,
          departamento: formularioempleado.departamento,
          funciones: funciones.codigo,
          nivelEstudio: nivelEstudios.codigo,
          institucion: formularioempleado.institucion,
          tituloObtenido: formularioempleado.titulo,
          fechaTitulacion: formularioempleado.fechaTitulacion,
          registro: formularioempleado.registro,
          sexo: formularioempleado.sexo,
          estadoCivl: formularioempleado.estadocivil,
          sueldoBase: parseFloat(formularioempleado.sueldoBase),
          afiliadoSeguro: formularioempleado.afiliadoSeguro,
          beneficioSocial: formularioempleado.beneficioSocial,
          fondoReserva: formularioempleado.fondoReserva,
          pagoMensualDecimoTercero: formularioempleado.pagoMensualDecimoTercero,
          pagoMensualDecimoCuarto: formularioempleado.pagoMensualDecimoCuarto,
          observacion: formularioempleado.observacion,
          discapacidad: formularioempleado.esdiscapacitado,
          porcentajeDiscapacidad: parseFloat(formularioempleado.porcentajediscapacidad),
          responsableDiscapacitado: formularioempleado.acargodiscapacitado,
          banco: banco.codigoalternativo,
          tipoCuenta: formularioempleado.tipoctabanco,
          numeroCuenta: formularioempleado.ctabanco,
          urlDocumentos: null,
          jornada: jornadas.codigo,
          modoEjecucion: formularioempleado.modoejecucion,
          provincina: datosProvincia.provincia,
          canton: datosCanton.canton,
          parroquia: datosParroquia.parroquia,
          formaPago: formapago.codigo,
          sucursal,
          estado: formularioempleado.estado,
          idBiometrico: formularioempleado.idBiometrico.trim() === '' ? null : formularioempleado.idBiometrico,
          fecha_ing: new Date(),
          maquina,
          usuario: usuario.codigo,
          carga: [...tablacarga],
          certificado: [...tablacertificado],
        };
        console.log(enviarjson);
        console.log('archivo', archivo.length)
        const { data } = await axios.post(`${URLAPILOCAL}/empleados`, enviarjson, config, setMostrarProgreso(true));
        if (data === 200) {
          setGuardado(true);
          mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Empleado guardado correctamente!' })
          if (archivo.length !== 0) {
            enviarArchivos()
          }
          Volver();
        }
      }
      if (modo === 'editar') {
        tablacertificado.forEach((t) => {
          t.empleado = 0;
          t.codigo = 0;
        });

        tablacarga.forEach((t) => {
          t.empleado = 0;
          t.codigo = 0;
        });


        const enviarjson = {
          codigo: formularioempleado.codigo,
          codigo_Empleado: formularioempleado.codigo_Empleado,
          nombres: formularioempleado.nombres,
          direccion: formularioempleado.direccion,
          telefonos: formularioempleado.telefonos,
          fecing: formularioempleado.fecing,
          cedula: formularioempleado.cedula,
          correo: formularioempleado.correo,
          fechaNac: formularioempleado.fechaNac,
          cargo: formularioempleado.cargo,
          departamento: formularioempleado.departamento,
          funciones: funciones.codigo,
          nivelEstudio: nivelEstudios.codigo,
          institucion: formularioempleado.institucion,
          tituloObtenido: formularioempleado.titulo,
          fechaTitulacion: formularioempleado.fechaTitulacion,
          registro: formularioempleado.registro,
          sexo: formularioempleado.sexo,
          estadoCivl: formularioempleado.estadocivil,
          sueldoBase: parseFloat(formularioempleado.sueldoBase),
          afiliadoSeguro: formularioempleado.afiliadoSeguro,
          beneficioSocial: formularioempleado.beneficioSocial,
          fondoReserva: formularioempleado.fondoReserva,
          pagoMensualDecimoTercero: formularioempleado.pagoMensualDecimoTercero,
          pagoMensualDecimoCuarto: formularioempleado.pagoMensualDecimoCuarto,
          observacion: formularioempleado.observacion,
          discapacidad: formularioempleado.esdiscapacitado,
          porcentajeDiscapacidad: formularioempleado.porcentajediscapacidad,
          responsableDiscapacitado: formularioempleado.acargodiscapacitado,
          banco: banco.codigoalternativo,
          tipoCuenta: formularioempleado.tipoctabanco,
          numeroCuenta: formularioempleado.ctabanco,
          urlDocumentos: null,
          jornada: jornadas.codigo,
          modoEjecucion: formularioempleado.modoejecucion,
          provincina: datosProvincia.provincia,
          canton: datosCanton.canton,
          parroquia: datosParroquia.parroquia,
          formaPago: formapago.codigo,
          sucursal,
          estado: formularioempleado.estado,
          idBiometrico: formularioempleado.idBiometrico.trim() === '' ? null : formularioempleado.idBiometrico,
          fecha_ing: new Date(),
          maquina,
          usuario: usuario.codigo,
          carga: [...tablacarga, ...tablacargaedit],
          certificado: [...tablacertificado, ...tablacertificadoedit],
        };
        console.log("mira edit", enviarjson)
        const { data } = await axios.put(`${URLAPILOCAL}/empleados`, enviarjson, config, setMostrarProgreso(true));
        if (data === 200) {
          setGuardado(true);
          mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Empleado editado correctamente!' })
          if (archivo.length !== 0) {
            enviarArchivos()
          }
          Volver();
        }
        // console.log(data);
      }
    } catch (error) {

      if (error.response.status === 401) {
        navegacion(`${PATH_AUTH.login}`);
        messajeTool('error', 'Su inicio de sesion expiro');
      } else if (error.response.status === 500) {
        messajeTool('error', 'Problemas con el servidor al guardar intente nuevamente, si el problema persiste contácte con soporte');
      } else {
        messajeTool('error', 'Problemas al guardar verifique si se encuentra registrado');
      }
    } finally {
      setMostrarProgreso(false);
    }
  };
  const editarCertificado = (e) => {
    console.log('miraa', e);
    if (e.field === 'nombre') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: e.id === n.codigo ? `${e.value}`.toUpperCase() : n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'empresaEmisora') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: e.id === n.codigo ? `${e.value}`.toUpperCase() : n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'caduca') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: e.id === n.codigo ? e.value : n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'mesExpedicion') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: e.id === n.codigo ? e.value : n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'anioExpedicion') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: e.id === n.codigo ? e.value : n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'fechaCaducidad') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: e.id === n.codigo ? new Date(e.value).toISOString() : n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'idCredencial') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: e.id === n.codigo ? e.value : n.idCredencial,
        tipo: n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'tipo') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: e.id === n.codigo ? `${e.value}`.toUpperCase() : n.tipo,
        urlArchivo: n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
    if (e.field === 'urlArchivo') {
      const nuevalista = tablacertificadoedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        nombre: n.nombre,
        empresaEmisora: n.empresaEmisora,
        caduca: n.caduca,
        mesExpedicion: n.mesExpedicion,
        anioExpedicion: n.anioExpedicion,
        fechaCaducidad: n.fechaCaducidad,
        idCredencial: n.idCredencial,
        tipo: n.tipo,
        urlArchivo: e.id === n.codigo ? e.value : n.urlArchivo,
      }));
      setTablaCertificadoEdit(nuevalista);
    }
  };
  const editarCarga = (e) => {
    console.log(e);
    if (e.field === 'parentezco') {
      const nuevalista = tablacargaedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        parentezco: e.id === n.codigo ? `${e.value}`.toUpperCase() : n.parentezco,
        nombres: n.nombres,
        cedula: n.cedula,
        direccion: n.direccion,
      }));
      setTablaCargaEdit(nuevalista);
    }
    if (e.field === 'nombres') {
      const nuevalista = tablacargaedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        parentezco: n.parentezco,
        nombres: e.id === n.codigo ? `${e.value}`.toUpperCase() : n.nombres,
        cedula: n.cedula,
        direccion: n.direccion,
      }));
      setTablaCargaEdit(nuevalista);
    }
    if (e.field === 'cedula') {
      const nuevalista = tablacargaedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        parentezco: n.parentezco,
        nombres: n.nombres,
        cedula: e.id === n.codigo ? e.value : n.cedula,
        direccion: n.direccion,
      }));
      setTablaCargaEdit(nuevalista);
    }
    if (e.field === 'direccion') {
      const nuevalista = tablacargaedit.map((n) => ({
        codigo: n.codigo,
        empleado: n.empleado,
        parentezco: n.parentezco,
        nombres: n.nombres,
        cedula: n.cedula,
        direccion: e.id === n.codigo ? `${e.value}`.toUpperCase() : n.direccion,
      }));
      setTablaCargaEdit(nuevalista);
    }
  };
  React.useEffect(() => {
    async function obtenerDatos() {
      try {
        const tipodoc = await axios(
          `${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=CXC_TIPODOC`,
          config,
          setMostrarProgreso(true)
        );
        setListaTipoDoc(tipodoc.data);

        const ip = await obtenerMaquina();
        setMaquina(ip);

        if (modo === 'nuevo') {
          const inicial = await axios(`${URLAPIGENERAL}/iniciales/buscar?opcion=ADM`, config, setMostrarProgreso(true));
          const codigogenerado = generarCodigo('EM', inicial.data[0].numero, '0000');

          setFormularioEmpleado({
            ...formularioempleado,
            codigo_Empleado: codigogenerado,
          });

          Promise.all([
            serviciosLocaciones.listarProvincias(),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_FUNCION' }),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_JORDANA' }),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_FORMAPAGO' }),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_MODOEJECUCION' }),
            serviciosSucursal.Listar(),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'CXC_BANCO' })
          ])
            .then(res => {
              setProvincias(res[0].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaFunciones(res[1].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaJornadas(res[2].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaFormaPago(res[3].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaModoEjecucion(res[4]);
              setListaSucursales(res[5]);
              setSucursal(res[5].at(0).codigo)
              const bancos = res[6].map((m) => ({
                codigo: m.codigo,
                codigoalternativo: m.codigo,
                nombre: m.nombre
              }))
              setListaBancos(bancos)
            })
        }
        if (modo === 'editar') {
          Promise.all([
            serviciosLocaciones.listarProvincias(),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_FUNCION' }),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_JORDANA' }),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_FORMAPAGO' }),
            serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'NOM_MODOEJECUCION' }),
            serviciosSucursal.Listar(),
            serviciosBanco.Listar()
          ])
            .then(res => {
              setProvincias(res[0].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaFunciones(res[1].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaJornadas(res[2].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaFormaPago(res[3].map((m) => ({ ...m, codigoalternativo: m.codigo })));
              setListaModoEjecucion(res[4]);
              setListaSucursales(res[5])
              const bancos = res[6].map((m) => ({
                codigo: m.codigo,
                codigoalternativo: m.inicial_Banco,
                nombre: m.nombre
              }))
              setListaBancos(bancos)
            })
          const empleado = await axios(
            `${URLAPIGENERAL}/empleados/obtener?codigo=${id}`,
            config,
            setMostrarProgreso(true)
          );
          console.log(empleado)
          setFormularioEmpleado({
            codigo: empleado.data.codigo,
            codigo_Empleado: empleado.data.codigo_Empleado,
            nombres: empleado.data.nombres,
            direccion: empleado.data.direccion,
            telefonos: empleado.data.telefonos.trim(),
            fecing: empleado.data.fecing,
            cedula: empleado.data.cedula,
            correo: empleado.data.correo,
            fechaNac: empleado.data.fechaNac,
            cargo: empleado.data.cargo,
            nombrecargo: empleado.data.nombreCargo,
            departamento: empleado.data.departamento,
            nombredepartamento: empleado.data.nombreDepartamento,
            nivelEstudio: empleado.data.nivelEstudio,
            nombrenivelEstudio: empleado.data.nombreNivelEstudio,
            fechaTitulacion: empleado.data.fechaTitulacion,
            institucion: empleado.data.institucion,
            titulo: empleado.data.tituloObtenido,
            registro: empleado.data.registro,
            sexo: empleado.data.sexo,
            estadocivil: empleado.data.estadoCivl,
            sueldoBase: empleado.data.sueldoBase,
            sueldoBaseview: `${empleado.data.sueldoBase}`,
            afiliadoSeguro: empleado.data.afiliadoSeguro,
            beneficioSocial: empleado.data.beneficioSocial,
            fondoReserva: empleado.data.fondoReserva,
            pagoMensualDecimoTercero: empleado.data.pagoMensualDecimoTercero,
            pagoMensualDecimoCuarto: empleado.data.pagoMensualDecimoCuarto,
            observacion: empleado.data.observacion,
            esdiscapacitado: empleado.data.discapacidad,
            porcentajediscapacidadview: `${empleado.data.porcentajeDiscapacidad}`,
            porcentajediscapacidad: empleado.data.porcentajeDiscapacidad,
            acargodiscapacitado: empleado.data.responsableDiscapacitado,
            tipoctabanco: empleado.data.tipoCuenta === null ? "" : empleado.data.tipoCuenta,
            ctabanco: empleado.data.numeroCuenta === null ? "" : empleado.data.numeroCuenta,
            modoejecucion: empleado.data.modoEjecucion,
            estado: empleado.data.estado,
            idBiometrico: empleado.data.idBiometrico,
            urlDocumentos: empleado.data.urlDocumentos
          });
          setDatosProvincia({
            provincia: empleado.data.provincina,
            nombre_provincia: empleado.data.nombreProvincia
          })
          setDatosCanton({
            canton: empleado.data.canton,
            nombre_canton: empleado.data.nombreCanton
          })
          setDatosParroquia({
            parroquia: empleado.data.parroquia,
            nombre_parroquia: empleado.data.nombreParroquia
          })
          setFunciones({
            codigo: empleado.data.funciones,
            nombre: empleado.data.nombreFuncion
          })
          setJornadas({
            codigo: empleado.data.jornada,
            nombre: empleado.data.nombreJornada
          })
          setFormaPago({
            codigo: empleado.data.formaPago,
            nombre: empleado.data.nombreFormaPago
          })
          setNivelEstudios({
            codigo: empleado.data.nivelEstudio,
            codigoalternativo: empleado.data.nivelEstudio,
            nombre: empleado.data.nombreNivelEstudio,
          })
          setBanco({
            codigo: empleado.data.banco === null ? "" : empleado.data.banco === null,
            codigoalternativo: empleado.data.banco === null ? "" : empleado.data.banco,
            nombre: empleado.data.nombreBanco === null ? "" : empleado.data.nombreBanco
          })
          // let idc = 0;
          // let idce = 0;

          // empleado.data.carga.forEach(f => {
          //     idc += 1;
          //     f.codigo = idc
          // })
          // empleado.data.certificado.forEach(f => {
          //     idce += 1;
          //     f.codigo = idce
          // })
          setTablaCargaEdit(empleado.data.carga);
          setTablaCertificadoEdit(empleado.data.certificado);
          setSucursal(empleado.data.sucursal)
        }
      } catch (error) {
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          messajeTool('error', 'Su inicio de sesion expiro');
        } else if (error.response.status === 500) {
          // navegacion(`${PATH_PAGE.page500}`);
          messajeTool('error', 'Problemas con el servidor al obtener datos intente nuevamente, si el problema persiste contácte con soporte');
        } else {
          messajeTool('error', 'Problemas al guardar verifique si se encuentra registrado');
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    obtenerDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------------------------------------------------------------------
  const [tiposBusquedasD, setTiposBusquedaD] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  const [openModalD, setOpenModalD] = React.useState(false);
  const toggleShowD = () => setOpenModalD((p) => !p);
  const handleCallbackChildD = (e) => {
    const item = e.row;
    setFormularioEmpleado({
      ...formularioempleado,
      departamento: item.codigo,
      nombredepartamento: item.nombre,
    });
    toggleShowD();
  };
  const [departamentos, setDepartamentos] = React.useState([]);
  React.useEffect(() => {
    async function getDepartamentos() {
      const { data } = await axios(
        `${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=ADM_DEPARTAMENTO`,
        config
      );
      const departamentos = data.map((m) => ({
        codigo: m.codigo,
        nombre: m.nombre,
      }));
      setDepartamentos(departamentos);
    }
    getDepartamentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function buscarDepartamentos() {
    if (formularioempleado.departamento === '') {
      setOpenModalD(true);
    } else {
      try {
        const { data } = await axios(
          `${URLAPIGENERAL}/mantenimientogenerico/obtener?codigo=${formularioempleado.departamento === '' ? 'string' : formularioempleado.departamento
          }&tabla=ADM_DEPARTAMENTO`,
          config
        );
        if (data.length === 0) {
          messajeTool('warning', 'Código no encontrado');
          setOpenModalD(true);
        } else {
          setFormularioEmpleado({
            ...formularioempleado,
            departamento: data.codigo,
            nombredepartamento: data.nombre,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  // -----------------------------------------------------------------------------------------------------------------------------------
  const [tiposBusquedasC, setTiposBusquedaC] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  const [openModalC, setOpenModalC] = React.useState(false);
  const toggleShowC = () => setOpenModalC((p) => !p);
  const handleCallbackChildC = (e) => {
    const item = e.row;
    setFormularioEmpleado({
      ...formularioempleado,
      cargo: item.codigo,
      nombrecargo: item.nombre,
    });
    toggleShowC();
  };
  const [cargos, setCargos] = React.useState([]);
  React.useEffect(() => {
    async function getCargos() {
      const { data } = await axios(`${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=ADM_CARGO`, config);
      const cargos = data.map((m) => ({
        codigo: m.codigo,
        nombre: m.nombre,
      }));
      setCargos(cargos);
    }
    getCargos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function buscarCargos() {
    if (formularioempleado.cargo === '') {
      setOpenModalC(true);
    } else {
      try {
        const { data } = await axios(
          `${URLAPIGENERAL}/mantenimientogenerico/obtener?codigo=${formularioempleado.cargo === '' ? 'string' : formularioempleado.cargo
          }&tabla=ADM_CARGO`,
          config
        );
        if (data.length === 0) {
          messajeTool('warning', 'Código no encontrado');
          setOpenModalC(true);
        } else {
          setFormularioEmpleado({
            ...formularioempleado,
            cargo: data.codigo,
            nombrecargo: data.nombre,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  // -----------------------------------------------------------------------------------------------------------------------------------
  const [tiposBusquedasE, setTiposBusquedaE] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  const [openModalE, setOpenModalE] = React.useState(false);
  const toggleShowE = () => setOpenModalE((p) => !p);
  const handleCallbackChildE = (e) => {
    const item = e.row;
    setFormularioEmpleado({
      ...formularioempleado,
      nivelEstudio: item.codigo,
      nombrenivelEstudio: item.nombre,
    });
    toggleShowE();
  };
  const [estudios, setEstudios] = React.useState([]);
  React.useEffect(() => {
    async function getEstudios() {
      const { data } = await axios(
        `${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=ADM_NIVEL_ESTUDIO`,
        config
      );
      const estudios = data.map((m) => ({
        codigo: m.codigo,
        codigoalternativo: m.codigo,
        nombre: m.nombre,
      }));
      setEstudios(estudios);
    }
    getEstudios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function buscarEstudios() {
    if (formularioempleado.nivelEstudio === '') {
      setOpenModalE(true);
    } else {
      try {
        const { data } = await axios(
          `${URLAPIGENERAL}/mantenimientogenerico/obtener?codigo=${formularioempleado.nivelEstudio === '' ? 'string' : formularioempleado.nivelEstudio
          }&tabla=ADM_NIVEL_ESTUDIO`,
          config
        );
        if (data.length === 0) {
          messajeTool('warning', 'Código no encontrado');
          setOpenModalE(true);
        } else {
          setFormularioEmpleado({
            ...formularioempleado,
            nivelEstudio: data.codigo,
            nombrenivelEstudio: data.nombre,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  // -----------------------------------------------------------------------------------------------------------------------------------
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
      <ModalGenerico
        nombre="Departamento"
        openModal={openModalD}
        busquedaTipo={tiposBusquedasD}
        toggleShow={toggleShowD}
        rowsData={departamentos}
        parentCallback={handleCallbackChildD}
      />
      <ModalGenerico
        nombre="Cargo"
        openModal={openModalC}
        busquedaTipo={tiposBusquedasC}
        toggleShow={toggleShowC}
        rowsData={cargos}
        parentCallback={handleCallbackChildC}
      />
      <ModalGenerico
        nombre="Estudio"
        openModal={openModalE}
        busquedaTipo={tiposBusquedasE}
        toggleShow={toggleShowE}
        rowsData={estudios}
        parentCallback={handleCallbackChildE}
      />
      <Page title="Empleados">
        <CircularProgreso
          open={mostrarprogreso}
          handleClose1={() => {
            setMostrarProgreso(false);
          }}
        />
        <MenuMantenimiento modo nuevo={() => limpiarCampos()} grabar={() => Grabar()} volver={() => Volver()} />
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
            <h1>{String(modo).toUpperCase().substring(0, 1) + String(modo).substring(1, modo.length)} Empleado</h1>
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 2 }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Tabs value={tabs} onChange={handleChangeTabs} aria-label="basic tabs example">
                      <Tab label="Datos Empleado" {...a11yProps(0)} />
                      <Tab label="Estudios" {...a11yProps(1)} />
                      <Tab label="Adicionales" {...a11yProps(2)} />
                      <Tab label="Cargas" {...a11yProps(3)} />
                      <Tab label="Certificados" {...a11yProps(4)} />
                      <Tab label="Subir Documentos" {...a11yProps(5)} />
                    </Tabs>
                  </Grid>
                  <Grid item container xs={12} justifyContent="flex-end">
                    <Grid item md={2} sm={3} xs={12}>
                      <Button
                        endIcon={<BackspaceIcon />}
                        variant="text"
                        onClick={() => limpiarSecciones()}
                      >
                        Limpiar Campos
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              {/* formulario empleado */}
              <TabPanel value={tabs} index={0}>
                <Grid container spacing={1}>
                  <Grid container item md={6} xs={12} spacing={1}>
                    <Grid item md={4} sm={6} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        size="small"
                        label="Codigo"
                        variant="outlined"
                        value={formularioempleado.codigo_Empleado}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            codigo_Empleado: e.target.value.toUpperCase(),
                          });
                        }}
                        sx={{
                          backgroundColor: '#e5e8eb',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#212B36',
                        }}
                      />
                    </Grid>
                    <Grid item md={8} sm={6} xs={12}>
                      <RequiredTextField
                        error={error}
                        fullWidth
                        inputRef={nombresref}
                        size="small"
                        label="Nombres*"
                        variant="outlined"
                        value={formularioempleado.nombres}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            nombres: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <RequiredTextField
                        error={error}
                        fullWidth
                        inputRef={direccionref}
                        size="small"
                        label="Direccion*"
                        variant="outlined"
                        value={formularioempleado.direccion}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            direccion: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <RequiredTextField
                        select
                        label="Tipo"
                        value={tipodoc}
                        onChange={(e) => {
                          setTipoDoc(e.target.value);
                        }}
                        fullWidth
                        size="small"
                      >
                        {listatipodoc.map((t) => (
                          <MenuItem key={t.codigo} value={t.codigo}>
                            {' '}
                            {t.nombre}
                          </MenuItem>
                        ))}
                      </RequiredTextField>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <RequiredTextField
                        error={error}
                        fullWidth
                        inputRef={identificacionref}
                        type="number"
                        size="small"
                        label="Identificacion*"
                        variant="outlined"
                        value={formularioempleado.cedula}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            cedula: e.target.value,
                          });
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => consultarIdentificacion(formularioempleado.cedula, 'empleado')}
                                size="small"
                              >
                                <SearchRounded />
                              </IconButton>
                            </InputAdornment>
                          ),
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <RequiredTextField
                        error={error}
                        fullWidth
                        inputRef={telefonoref}
                        type="number"
                        size="small"
                        label="Telefono*"
                        variant="outlined"
                        value={formularioempleado.telefonos}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            telefonos: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <RequiredTextField
                        select
                        label="Sexo"
                        value={formularioempleado.sexo}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            sexo: e.target.value,
                          });
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="M"> MASCULINO</MenuItem>
                        <MenuItem value="F"> FEMENINO </MenuItem>
                      </RequiredTextField>
                    </Grid>
                    <Grid item md={8} sm={8} xs={12}>
                      <RequiredTextField
                        error={error}
                        fullWidth
                        inputRef={correoref}
                        type="email"
                        size="small"
                        label="Correo*"
                        variant="outlined"
                        value={formularioempleado.correo}
                        onChange={(e) => {
                          const input = e.target.value;
                          if (!esCorreo(input)) setErrorcorreo(true);
                          else setErrorcorreo(false);
                          setFormularioEmpleado({
                            ...formularioempleado,
                            correo: input,
                          });
                        }}
                        helperText={errorcorreo ? 'correo invalido: example@example.com' : ''}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                        <DesktopDatePicker
                          label="Fecha Nacimiento*"
                          value={formularioempleado.fechaNac}
                          inputFormat="dd/MM/yyyy"
                          onChange={(newValue) => {
                            setFormularioEmpleado({
                              ...formularioempleado,
                              fechaNac: validarFecha(newValue) ? newValue : new Date()
                            });
                          }}
                          renderInput={(params) => <RequiredTextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                        <DesktopDatePicker
                          label="Fecha Ingreso*"
                          value={formularioempleado.fecing}
                          inputFormat="dd/MM/yyyy"
                          onChange={(newValue) => {
                            setFormularioEmpleado({
                              ...formularioempleado,
                              fecing: validarFecha(newValue) ? newValue : new Date()
                            });
                          }}
                          renderInput={(params) => <RequiredTextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <NumericFormat
                        fullWidth
                        inputRef={sueldobaseref}
                        label="Sueldo Base*"
                        customInput={RequiredTextField}
                        value={formularioempleado.sueldoBaseview}
                        onValueChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            sueldoBaseview: e.formattedValue,
                            sueldoBase: e.floatValue
                          })
                        }}
                        prefix={'$'}
                        size='small'
                        type="text"
                        thousandSeparator
                      />
                    </Grid>
                    <Grid item container xs={12} md={12} spacing={1}>
                      <Grid item md={4} sm={4} xs={12}>
                        <RequiredTextField
                          label="Departamento"
                          fullWidth
                          inputRef={departamentoref}
                          size="small"
                          value={formularioempleado.departamento}
                          onChange={(e) => {
                            setFormularioEmpleado({
                              ...formularioempleado,
                              departamento: e.target.value,
                            });
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    buscarDepartamentos();
                                  }}
                                >
                                  <SearchRounded />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item md={8} sm={8} xs={12}>
                        <TextField
                          disabled
                          label="Nombre Departamento"
                          fullWidth
                          size="small"
                          value={formularioempleado.nombredepartamento}
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
                    </Grid>
                    <Grid item container xs={12} md={12} spacing={1}>
                      <Grid item md={4} sm={4} xs={12}>
                        <RequiredTextField
                          label="Cargo"
                          fullWidth
                          inputRef={cargoref}
                          size="small"
                          value={formularioempleado.cargo}
                          onChange={(e) => {
                            setFormularioEmpleado({
                              ...formularioempleado,
                              cargo: e.target.value,
                            });
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    buscarCargos();
                                  }}
                                >
                                  <SearchRounded />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item md={8} sm={8} xs={12}>
                        <TextField
                          disabled
                          label="Nombre Cargo"
                          fullWidth
                          size="small"
                          value={formularioempleado.nombrecargo}
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
                    </Grid>
                    <Grid item container xs={12} md={12} spacing={1}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Observacion"
                          variant="outlined"
                          value={formularioempleado.observacion}
                          onChange={(e) => {
                            setFormularioEmpleado({
                              ...formularioempleado,
                              observacion: e.target.value.toUpperCase(),
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container item md={6} xs={12} spacing={1}>
                    <Grid item md={6} sm={6} xs={12}>
                      <RequiredTextField
                        select
                        label="Estado Civil"
                        value={formularioempleado.estadocivil}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            estadocivil: e.target.value,
                          });
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="S"> SOLTERO(A)</MenuItem>
                        <MenuItem value="C"> CASADO(A) </MenuItem>
                      </RequiredTextField>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <RequiredTextField
                        select
                        label="Sucursal"
                        value={sucursal}
                        onChange={(e) => {
                          setSucursal(e.target.value)
                        }}
                        fullWidth
                        size="small"
                      >
                        {listaSucursales.map((f) => (
                          <MenuItem key={f.codigo} value={f.codigo}>
                            {f.nombre}
                          </MenuItem>
                        ))}
                      </RequiredTextField>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControlLabel
                        value={formularioempleado.afiliadoSeguro}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            afiliadoSeguro: e.target.checked,
                          });
                        }}
                        control={<Checkbox defaultChecked />}
                        label="Afiliado Seguro"
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControlLabel
                        value={formularioempleado.beneficioSocial}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            beneficioSocial: e.target.checked,
                          });
                        }}
                        control={<Checkbox defaultChecked />}
                        label="Beneficio Social"
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControlLabel
                        value={formularioempleado.fondoReserva}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            fondoReserva: e.target.checked,
                          });
                        }}
                        control={<Checkbox defaultChecked />}
                        label="Fondo de Reserva"
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControlLabel
                        value={formularioempleado.pagoMensualDecimoTercero}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            pagoMensualDecimoTercero: e.target.checked,
                          });
                        }}
                        control={<Checkbox defaultChecked />}
                        label="Pago Mensual Decimo Tercero"
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControlLabel
                        value={formularioempleado.pagoMensualDecimoCuarto}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            pagoMensualDecimoCuarto: e.target.checked,
                          });
                        }}
                        control={<Checkbox defaultChecked />}
                        label="Pago Mensual Decimo Cuarto"
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <FormControlLabel
                        disabled={modo !== 'editar'}
                        value={formularioempleado.estado}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            estado: e.target.checked,
                          });
                        }}
                        control={<Checkbox defaultChecked disabled />}
                        label="Activo"
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      {/*  */}
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      {/*  */}
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      {/*  */}
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <CajaGenerica
                        estadoInicial={{
                          codigoAlternativo: datosProvincia.provincia,
                          nombre: datosProvincia.nombre_provincia,
                        }}
                        tituloTexto={{ nombre: 'Cod. Prov.', descripcion: 'Provincia' }}
                        tituloModal="Provincias"
                        retornarDatos={(e) => {
                          setDatosProvincia({
                            ...datosProvincia,
                            provincia: e.codigo,
                            nombre_provincia: e.nombre,
                          });
                          serviciosLocaciones.listarCantones({ provincia: e.codigo }).then((res) => {
                            setCantones(res.map((m) => ({ ...m, codigoalternativo: m.codigo })));
                          });
                          setDatosCanton({
                            canton: '',
                            nombre_canton: '----',
                          });
                          setDatosParroquia({
                            parroquia: '',
                            nombre_parroquia: '----',
                          });
                        }}
                        activarDependencia
                        ejecutarDependencia={(e) => {
                          setDatosProvincia({
                            ...datosProvincia,
                            provincia: String(e.target.value).toUpperCase(),
                            nombre_provincia: '----',
                          });
                          setDatosCanton({
                            canton: '',
                            nombre_canton: '----',
                          });
                          setDatosParroquia({
                            parroquia: '',
                            nombre_parroquia: '----',
                          });
                        }}
                        datos={provincias}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <CajaGenerica
                        estadoInicial={{
                          codigoAlternativo: datosCanton.canton,
                          nombre: datosCanton.nombre_canton,
                        }}
                        tituloTexto={{ nombre: 'Cod. Cant.', descripcion: 'Canton' }}
                        tituloModal="Cantones"
                        retornarDatos={(e) => {
                          setDatosCanton({
                            ...datosCanton,
                            canton: e.codigo,
                            nombre_canton: e.nombre,
                          });
                          serviciosLocaciones.listarParroquias({ canton: e.codigo }).then((res) => {
                            setParroquias(res.map((m) => ({ ...m, codigoalternativo: m.codigo })));
                          });
                          setDatosParroquia({
                            parroquia: '',
                            nombre_parroquia: '----',
                          });
                        }}
                        activarDependencia
                        ejecutarDependencia={(e) => {
                          setDatosCanton({
                            canton: String(e.target.value).toUpperCase(),
                            nombre_canton: '----',
                          });
                          setDatosParroquia({
                            parroquia: '',
                            nombre_parroquia: '----',
                          });
                        }}
                        datos={cantones}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <CajaGenerica
                        estadoInicial={{
                          codigoAlternativo: datosParroquia.parroquia,
                          nombre: datosParroquia.nombre_parroquia,
                        }}
                        tituloTexto={{ nombre: 'Cod. Parrq.', descripcion: 'Parroquia' }}
                        tituloModal="Parroquias"
                        retornarDatos={(e) => {
                          setDatosParroquia({
                            ...datosParroquia,
                            parroquia: e.codigo,
                            nombre_parroquia: e.nombre,
                          });
                        }}
                        activarDependencia
                        ejecutarDependencia={(e) => {
                          setDatosParroquia({
                            parroquia: String(e.target.value).toUpperCase(),
                            nombre_parroquia: '----',
                          });
                        }}
                        datos={parroquias}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      {/*  */}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Id. Biométrico"
                        variant="outlined"
                        value={formularioempleado.idBiometrico}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            idBiometrico: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      {/*  */}
                    </Grid>
                  </Grid>
                </Grid>
              </TabPanel>
              {/* Estudios */}
              <TabPanel value={tabs} index={1}>
                <Grid container spacing={1}>
                  <Grid item container xs={12} spacing={1} justifyContent="space-between">
                    <Grid item md={6} sm={8} xs={12}>
                      <CajaGenerica
                        inputRef={nivelestudioref}
                        estadoInicial={{
                          codigoAlternativo: nivelEstudios.codigoalternativo,
                          nombre: nivelEstudios.nombre
                        }}
                        tituloTexto={{ nombre: 'Código', descripcion: 'Nivel de Estudio' }}
                        tituloModal="Nivel de Estudio"
                        retornarDatos={(e) => {
                          setNivelEstudios({
                            codigo: e.codigo,
                            codigoalternativo: e.codigoalternativo,
                            nombre: e.nombre
                          })
                        }}
                        datos={estudios}
                      />
                    </Grid>
                    <Grid item md={3} sm={4} xs={12}>
                      <DateTextField
                        label='Fecha Titulación'
                        value={formularioempleado.fechaTitulacion}
                        onChange={(e) => {
                          cambiarFechaTitulacion(e);
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs={12} spacing={1}>
                    <Grid item md={6} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        inputRef={institucionref}
                        size="small"
                        label="Institución*"
                        variant="outlined"
                        value={formularioempleado.institucion}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            institucion: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        size="small"
                        inputRef={tituloref}
                        label="Titulo Obtenido*"
                        variant="outlined"
                        value={formularioempleado.titulo}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            titulo: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container spacing={1} xs={12}>
                    <Grid item md={6} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        size="small"
                        inputRef={registroref}
                        label="Registro*"
                        variant="outlined"
                        value={formularioempleado.registro}
                        onChange={(e) => {
                          setFormularioEmpleado({
                            ...formularioempleado,
                            registro: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </TabPanel>
              {/* Adicionales */}
              <TabPanel value={tabs} index={2}>
                <Grid container spacing={1}>
                  <Grid item container spacing={1} md={6}>
                    <Grid item xs={12}>
                      <CajaGenerica
                        inputRef={funcionref}
                        estadoInicial={{
                          codigoAlternativo: funciones.codigo,
                          nombre: funciones.nombre
                        }}
                        tituloTexto={{ nombre: 'Cod. Función', descripcion: 'Función' }}
                        tituloModal="Funciones"
                        retornarDatos={(e) => {
                          setFunciones({
                            codigo: e.codigo,
                            nombre: e.nombre
                          })
                        }}
                        datos={listafunciones}
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={1.5} sm={4} xs={6}>
                    <FormControlLabel
                      onChange={(e) => {
                        setFormularioEmpleado({
                          ...formularioempleado,
                          esdiscapacitado: e.target.checked,
                        });
                      }}
                      value={formularioempleado.esdiscapacitado}
                      control={<Checkbox />}
                      label="Discapacitado"
                    />
                  </Grid>
                  <Grid item md={2.5} sm={4} xs={6}>
                    <NumericFormat
                      inputRef={porcentajediscapacitadoref}
                      disabled={!formularioempleado.esdiscapacitado}
                      label='Porcentaje'
                      customInput={RequiredTextField}
                      value={formularioempleado.porcentajediscapacidadview}
                      onValueChange={(e) => {
                        setFormularioEmpleado({
                          ...formularioempleado,
                          porcentajediscapacidadview: e.formattedValue,
                          porcentajediscapacidad: e.value
                        })
                      }}
                      suffix={'%'}
                      size='small'
                      type="text"
                      thousandSeparator
                    />
                  </Grid>
                  <Grid item md={2} sm={4} xs={12}>
                    <FormControlLabel
                      onChange={(e) => {
                        setFormularioEmpleado({
                          ...formularioempleado,
                          acargodiscapacitado: e.target.checked,
                        });
                      }}
                      value={formularioempleado.acargodiscapacitado}
                      control={<Checkbox />}
                      label="A Cargo de un Discapacitado"
                    />
                  </Grid>
                  <Grid item container spacing={1} md={6}>
                    <Grid item xs={12}>
                      <CajaGenerica
                        inputRef={jornadaref}
                        estadoInicial={{
                          codigoAlternativo: jornadas.codigo,
                          nombre: jornadas.nombre
                        }}
                        tituloTexto={{ nombre: 'Cod. Jornada', descripcion: 'Jornada' }}
                        tituloModal="Jornadas"
                        retornarDatos={(e) => {
                          setJornadas({
                            codigo: e.codigo,
                            nombre: e.nombre
                          })
                        }}
                        datos={listajornadas}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container spacing={1} md={6}>
                    <Grid item xs={12}>
                      <CajaGenerica
                        inputRef={formapagoref}
                        estadoInicial={{
                          codigoAlternativo: formapago.codigo,
                          nombre: formapago.nombre
                        }}
                        tituloTexto={{ nombre: 'Cod. Pago', descripcion: 'Forma de Pago' }}
                        tituloModal="Formas de Pago"
                        retornarDatos={(e) => {
                          setFormaPago({
                            codigo: e.codigo,
                            nombre: e.nombre
                          })
                        }}
                        datos={listaformapago}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container spacing={1} md={6}>
                    <Grid item xs={12}>
                      <CajaGenerica
                        estadoInicial={{
                          codigoAlternativo: banco.codigoalternativo,
                          nombre: banco.nombre
                        }}
                        tituloTexto={{ nombre: 'Cod. Banco', descripcion: 'Banco' }}
                        tituloModal="Banco"
                        retornarDatos={(e) => {
                          setBanco({
                            codigo: e.codigo,
                            codigoalternativo: e.codigoalternativo,
                            nombre: e.nombre
                          })
                        }}
                        datos={listaBancos}
                        borrarCampos
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={3} sm={4} xs={12}>
                    <RequiredTextField
                      select
                      label="Tipo de Cuenta"
                      value={formularioempleado.tipoctabanco}
                      onChange={(e) => {
                        setFormularioEmpleado({
                          ...formularioempleado,
                          tipoctabanco: e.target.value,
                        });
                      }}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="AHO"> AHORRO </MenuItem>
                      <MenuItem value="COR"> CORRIENTE </MenuItem>
                    </RequiredTextField>
                  </Grid>
                  <Grid item md={3} sm={8} xs={12}>
                    <RequiredTextField
                      fullWidth
                      inputRef={cuentabcoref}
                      size="small"
                      label="Cuenta*"
                      variant="outlined"
                      value={formularioempleado.ctabanco}
                      onChange={(e) => {
                        setFormularioEmpleado({
                          ...formularioempleado,
                          ctabanco: e.target.value.toUpperCase(),
                        });
                      }}
                    />
                  </Grid>
                  <Grid item md={4} sm={4} xs={12}>
                    <TextField
                      select
                      label="Modo Ejecución"
                      value={formularioempleado.modoejecucion}
                      onChange={(e) => {
                        setFormularioEmpleado({
                          ...formularioempleado,
                          modoejecucion: e.target.value,
                        });
                      }}
                      fullWidth
                      size="small"
                    >
                      {listamodoejecucion.map((m) => (
                        <MenuItem key={m.codigo} value={m.codigo}>
                          {' '}
                          {m.nombre}{' '}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </TabPanel>
              {/* Cargas */}
              <TabPanel value={tabs} index={3}>
                <Grid container spacing={1}>
                  <Grid item container md={12} sm={12} xs={12} spacing={1}>
                    <Grid item md={2} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        error={errorcarga}
                        size="small"
                        label="Parentezco*"
                        variant="outlined"
                        value={formulariocarga.parentezco}
                        onChange={(e) => {
                          setFormularioCarga({
                            ...formulariocarga,
                            parentezco: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        error={errorcarga}
                        size="small"
                        label="Nombre*"
                        variant="outlined"
                        value={formulariocarga.nombres}
                        onChange={(e) => {
                          setFormularioCarga({
                            ...formulariocarga,
                            nombres: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={2} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        error={errorcarga}
                        type="number"
                        size="small"
                        label="Cedula*"
                        variant="outlined"
                        value={formulariocarga.cedula}
                        onChange={(e) => {
                          setFormularioCarga({
                            ...formulariocarga,
                            cedula: e.target.value,
                          });
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  consultarIdentificacion(formulariocarga.cedula, 'carga');
                                }}
                                size="small"
                              >
                                <SearchRounded />
                              </IconButton>
                            </InputAdornment>
                          ),
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                      />
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Direccion"
                        variant="outlined"
                        value={formulariocarga.direccion}
                        onChange={(e) => {
                          setFormularioCarga({
                            ...formulariocarga,
                            direccion: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={1.2} sm={6} xs={12}>
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => {
                          agregarCarga();
                        }}
                        startIcon={<AddCircleRoundedIcon />}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Box sx={estilosdetabla}>
                  <div
                    style={{
                      padding: '0.5rem',
                      height: modo !== 'editar' ? '55vh' : '30vh',
                      width: '100%',
                    }}
                  >
                    <DataGrid
                      density="compact"
                      rowHeight={28}
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      // onRowDoubleClick={(e) => Editar(e)}
                      sx={estilosdatagrid}
                      rows={tablacarga}
                      columns={columns1}
                      getRowId={(datosfilas) => datosfilas.codigo}
                      components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                      }}
                    />
                  </div>
                </Box>
                {modo === 'editar' ? (
                  <Box sx={estilosdetabla}>
                    <div
                      style={{
                        padding: '0.5rem',
                        height: modo !== 'editar' ? '55vh' : '30vh',
                        width: '100%',
                      }}
                    >
                      <DataGrid
                        density="compact"
                        rowHeight={28}
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        onCellEditCommit={(e) => {
                          editarCarga(e);
                        }}
                        sx={estilosdatagrid}
                        rows={tablacargaedit}
                        columns={columnscargaset}
                        getRowId={(datosfilas) => datosfilas.codigo}
                        components={{
                          NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                      />
                    </div>
                  </Box>
                ) : (
                  ''
                )}
              </TabPanel>
              {/* Certificados */}
              <TabPanel value={tabs} index={4}>
                <Grid container spacing={1}>
                  <Grid item container md={12} sm={12} xs={12} spacing={1}>
                    <Grid item md={3} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        error={errorcertificado}
                        size="small"
                        label="Nombre*"
                        variant="outlined"
                        value={formulariocertificado.nombre}
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            nombre: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        error={errorcertificado}
                        size="small"
                        label="Empresa Emisora*"
                        variant="outlined"
                        value={formulariocertificado.empresaEmisora}
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            empresaEmisora: e.target.value.toUpperCase(),
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={2} sm={12} xs={12}>
                      <TextField
                        select
                        label="Tipo"
                        value={formulariocertificado.tipo}
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            tipo: e.target.value,
                          });
                        }}
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="P"> PRESENCIAL </MenuItem>
                        <MenuItem value="L"> LINEA </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      <TextField
                        select
                        label="Mes"
                        value={formulariocertificado.mesExpedicion}
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            mesExpedicion: e.target.value,
                          });
                        }}
                        fullWidth
                        size="small"
                      >
                        {meses.map((m) => (
                          <MenuItem key={m.id} value={m.id}>
                            {' '}
                            {m.nombre}{' '}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      <RequiredTextField
                        error={errorcertificado}
                        label="Año*"
                        value={formulariocertificado.anioExpedicion}
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            anioExpedicion: e.target.value,
                          });
                        }}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item md={2} sm={4} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                        <DesktopDatePicker
                          label="Fecha Caducidad*"
                          value={formulariocertificado.fechaCaducidad}
                          inputFormat="dd/MM/yyyy"
                          onChange={(newValue) => {
                            setFormularioCertificado({
                              ...formulariocertificado,
                              fechaCaducidad: validarFecha(newValue) ? newValue : new Date()
                            });
                          }}
                          renderInput={(params) => <RequiredTextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item md={2} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        error={errorcertificado}
                        size="small"
                        label="Codigo Credencial*"
                        variant="outlined"
                        value={formulariocertificado.idCredencial}
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            idCredencial: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <RequiredTextField
                        fullWidth
                        size="small"
                        label="Archivo*"
                        variant="outlined"
                        value={formulariocertificado.urlArchivo}
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            urlArchivo: e.target.value,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item md={1.2} sm={6} xs={12}>
                      <FormControlLabel
                        onChange={(e) => {
                          setFormularioCertificado({
                            ...formulariocertificado,
                            caduca: e.target.checked,
                          });
                        }}
                        value={formulariocertificado.caduca}
                        control={<Checkbox defaultChecked />}
                        label="Caduca"
                      />
                    </Grid>
                    <Grid item md={2} sm={6} xs={12}>
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => {
                          agregarCertificado();
                        }}
                        startIcon={<AddCircleRoundedIcon />}
                      >
                        Agregar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Box sx={estilosdetabla}>
                  <div
                    style={{
                      padding: '0.5rem',
                      height: modo !== 'editar' ? '55vh' : '30vh',
                      width: '100%',
                    }}
                  >
                    <DataGrid
                      density="compact"
                      rowHeight={28}
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      // onRowDoubleClick={(e) => Editar(e)}
                      sx={estilosdatagrid}
                      rows={tablacertificado}
                      columns={columns}
                      getRowId={(rows) => rows.codigo}
                      components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                      }}
                    />
                  </div>
                </Box>

                {modo === 'editar' ? (
                  <Box sx={estilosdetabla}>
                    <Typography variant="h6"> Editar </Typography>
                    <div
                      style={{
                        padding: '0.5rem',
                        height: modo !== 'editar' ? '55vh' : '30vh',
                        width: '100%',
                      }}
                    >
                      <DataGrid
                        density="compact"
                        rowHeight={28}
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        onCellEditCommit={(e) => {
                          editarCertificado(e);
                        }}
                        sx={estilosdatagrid}
                        rows={tablacertificadoedit}
                        columns={columnsset}
                        getRowId={(rows) => rows.codigo}
                        components={{
                          NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                      />
                    </div>
                  </Box>
                ) : (
                  ''
                )}
              </TabPanel>
              {/* Subida de documentos */}
              <TabPanel value={tabs} index={5}>
                <Grid container spacing={1}>
                  {
                    formularioempleado.urlDocumentos !== null ?
                      <Grid item container xs={12} justifyContent="flex-end">
                        <Grid item xs={12}>
                          <Tooltip
                            title='El empleado seleccionado ya cuenta con un documento adjunto, si desea reemplazarlo puede subir uno nuevo'
                          >
                            <Chip
                              icon={<InfoIcon />}
                              label="El empleado seleccionado ya cuenta con un documento adjunto, si desea reemplazarlo puede subir uno nuevo"
                              color="primary"
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <Button
                            onClick={() => {
                              window.open(`${URLAPIGENERAL}/empleados/descargardocumento?url=${formularioempleado.urlDocumentos}&codigoEmpleado=${formularioempleado.codigo_Empleado}&nombres=${formularioempleado.nombres}`)
                            }}
                          >
                            Descargar Documento
                          </Button>
                        </Grid>
                      </Grid>
                      : null
                  }
                  <Grid item xs={12}>
                    <UploadMultiFile
                      multiple
                      files={archivo}
                      onDrop={cargarArchivos}
                      onRemove={removerArchivo}
                      onRemoveAll={removerTodosLosArchivos}
                      onUpload={() => enviarArchivos()}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </Card>
        </Fade>
      </Page>
    </>
  );
}
