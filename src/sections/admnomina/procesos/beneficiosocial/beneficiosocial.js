import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Grid,
    IconButton,
    Card,
    Fade,
    MenuItem,
    InputAdornment,
    Box,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import es from 'date-fns/locale/es';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DataGrid, esES } from '@mui/x-data-grid';
import clsx from 'clsx';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import SearchIcon from '@mui/icons-material/Search';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
// import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { CustomNoRowsOverlay } from "../../../../utils/csssistema/iconsdatagrid";
import Cargando from '../../../../components/Cargando';
import { estilosdetabla, estilosdatagrid, estilosacordeon } from '../../../../utils/csssistema/estilos';
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import ModalGenerico from "./Componentes/ModalGenerico";
import ModalPacientes from "./Componentes/ModalPacientes";
// import { fDate } from '../../../../utils/formatTime';
import { obtenerMaquina, formaterarFecha } from '../../../../utils/sistema/funciones';

import { PATH_DASHBOARD, PATH_OPSISTEMA } from '../../../../routes/paths';
import { CORS, URLAPIGENERAL } from '../../../../config';
import Page from '../../../../components/Page';
import { fCurrency } from '../../../../utils/formatNumber';



export default function beneficiosocial() {
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${usuario.token}`
        }
    }
    document.body.style.overflowX = 'hidden';
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { enqueueSnackbar } = useSnackbar();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [numeroid, setIdnumero] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mostrarprogreso, setMostrarProgreso] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [lineaItem, setLineaItem] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cantiProduc, setCantiProduc] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [enableAñadir, setEnbleañadir] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error, setError] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error1, setError1] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [error2, setError2] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ fechaerror, setFechaerror] = useState(false); 
    const ocultaFooter = true;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [rows, setRows] = useState([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filas, setFila] = useState([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [producto, setProducto] = useState({});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = useState(false);

    let id = 0
    rows.forEach(p => {
        id += 1
        p.id = id
    })

    // console.log(filas)

    const messajeTool = (variant, msg) => {
        enqueueSnackbar(msg, {
            variant, anchorOrigin: { vertical: 'top', horizontal: 'center' },
            autoHideDuration: 5000
        });
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [Datospaciente, setDatospaciente] = useState({
        id: 0,
        codigo: '---', // int
        nombre: '---', // string 100
        cedula: '---', // string
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [Datospaciente2, setDatospaciente2] = useState({
        id: 0,
        codigo: '---', // int
        nombre: '---', // string 100
        cedula: '---', // string
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [codigogeneradoprescripcion, setCodigopres] = useState({
        codigo_prescripcion: '', // int

    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [fechaactual, setFechaactual] = useState({
        factual: new Date()
    });

    const limpiar = () => {
        setMostrarProgreso(true);

        const monthNameLong = tiempo.toLocaleString("es-Es", { month: "long" });
        setObservacion({
            observacion: `SEGURO SOCIAL DE ${monthNameLong.toLocaleUpperCase()} DEL ${anio.anio}`
        });
        setAnio({
            anio: tiempo.getFullYear()
        })
        const mesActual = tiempo.getMonth() + 1;
        setMes({ month: mesActual })

        setAnio({
            anio: tiempo.getFullYear()
        })

        // setButtonDisabled(true);
        setCantiProduc(0);
        setLineaItem(0);
        setChecked(false);
        // setactivarfecha(true);
        setRows([]);
        setFila([]);
        // setProveedorForm([]);
        setError(false);
        setError1(false);
        setError2(false);
        // sethabilitarbtn(true);
        // setenablePrint(true);
        setEnbleañadir(false);
        setFechaerror(false)
    };

    const nuevo = async () => {
        setMostrarProgreso(true);
        try {
            limpiar();
            const response = await axios(`${URLAPIGENERAL}/empleados/listar`);
            const dataRes = response.data;

            // const callback = v => v;
            const primervalor = dataRes[0];
            const ultimovalor = dataRes.length - 1;

            // console.log(primervalor)
            // console.log(dataRes[ultimovalor])

            setDatospaciente({
                id: primervalor.codigo, // int
                codigo: primervalor.codigo_Empleado, // int
                nombre: primervalor.nombres, // string 100
                cedula: primervalor.cedula, // string
            })


            // console.log('primer dato', Datospaciente)

            setDatospaciente2({
                id: dataRes[ultimovalor].codigo, // int
                codigo: dataRes[ultimovalor].codigo_Empleado, // int
                nombre: dataRes[ultimovalor].nombres, // string 100
                cedula: dataRes[ultimovalor].cedula, // string
            })
            messajeTool('success', 'Limpieza exitosa.');
        } catch (error) {
            // error
        } finally {
            setMostrarProgreso(false);
        }
    };

    const columns = [
        {
            headerAlign: 'left',
            field: 'id',
            type: 'number',
            headerName: 'Linea',
            width: 70,
            align: 'center',
            headerClassName: 'super-app-theme--header',
            hide: true
        },
        {
            headerAlign: 'center',
            field: 'codigo',
            headerName: 'Código',
            width: 100,
            editable: false,
            align: 'center',
        },
        {
            headerAlign: 'left',
            field: 'nombres',
            headerName: 'Nombres',
            width: 200,
            editable: false,
            // cellClassName: () => clsx('blueCell'),
            valueFormatter: params => {
                if (params.value === "" || params.value === null) {
                    return '--------';
                }
                return params.value;
            }
        },
        {
            headerAlign: 'center',
            field: 'sueldobase',
            headerName: 'Sueldo',
            width: 90,
            editable: false,
            align: 'center',
            valueFormatter: params => {
                if (params.value == null) {
                    return '';
                }
                return fCurrency(params.value);
            }
        },
        {
            headerAlign: 'center',
            field: 'porcentaje',
            headerName: 'Factor',
            width: 90,
            editable: false,
            align: 'center',
        },
        {
            headerAlign: 'center',
            field: 'beneficio',
            headerName: 'Beneficio',
            width: 110,
            editable: false,
            align: 'center',
            valueFormatter: params => {
                if (params.value == null) {
                    return '';
                }
                return fCurrency(params.value);
            }
        },
        {
            headerAlign: 'center',
            field: 'observacion',
            headerName: 'Observacion',
            width: 300,
            editable: false,
            align: 'center',
        },
        // {
        //     headerAlign: 'center',
        //     field: 'comision',
        //     headerName: 'Observacion',
        //     width: 150,
        //     editable: false,
        //     align: 'center',
        // },

    ];


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        async function getseteo() {
            const response = await axios(`${URLAPIGENERAL}/empleados/listar`);
            const dataRes = response.data;

            // const callback = v => v;
            const primervalor = dataRes[0];
            const ultimovalor = dataRes.length - 1;

            // console.log(primervalor)
            // console.log(dataRes[ultimovalor])

            setDatospaciente({
                ...Datospaciente,
                id: primervalor.codigo,
                codigo: primervalor.codigo_Empleado, // int
                nombre: primervalor.nombres, // string 100
                cedula: primervalor.cedula, // string
            })

            setDatospaciente2({
                ...Datospaciente2,
                id: dataRes[ultimovalor].codigo, // int
                codigo: dataRes[ultimovalor].codigo_Empleado, // int
                nombre: dataRes[ultimovalor].nombres, // string 100
                cedula: dataRes[ultimovalor].cedula, // string
            })
      

        }

        getseteo();

    }, []);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [getPaciente, setgetPaciente] = useState({});

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [tiposBusquedas, setTiposBusqueda] = useState([{ tipo: 'nombre' }, { tipo: 'codigo' }, { tipo: 'cedula' }]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [rowsParaModal, setRowsparaModal] = useState();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [openModallistpacientes, setOpenModallistpacientes] = useState(false);
    const toggleShowpacientes = () => setOpenModallistpacientes((p) => !p);
    const handleCallbackChildpacientes = (e) => {
        const item = e.row;
        // console.log(e)
        // const edad = calcularEdad(item.edad);
        setDatospaciente({
            ...Datospaciente,
            id: item.id,
            codigo: item.codigo,
            nombre: item.nombre,
            cedula: item.cedula,
            sexo: item.sexo === 'M' ? 'MASCULINO' : 'FEMENINO',
            //   edad
        })
        setIdnumero(item.codigo)
        toggleShowpacientes();
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        async function getPacientes() {
            const response = await axios(`${URLAPIGENERAL}/empleados/listar`);
            const dataRes = response.data;
            const getPaciente = dataRes.map((el) => ({
                id: el.codigo,
                codigo: el.codigo_Empleado,
                nombre: el.nombres,
                cedula: el.cedula,

            }));
            setgetPaciente(getPaciente);

        }
        getPacientes();

    }, []);


    // segunda lista

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [getPaciente2, setgetPaciente2] = useState({});

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [tiposBusquedasProducto, setTiposBusquedaProducto] = useState([{ tipo: 'nombre' }, { tipo: 'codigo' }, { tipo: 'cedula' }]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [rowsParaModalProducto, setRowsparaModalproducto] = useState();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [openModalProducto, setOpenModalProducto] = useState(false);

    const toggleShowProducto = () => setOpenModalProducto((p) => !p);
    const handleCallbackChildProducto = (e) => {
        const recoleccion = e.row;

        setDatospaciente2({
            ...Datospaciente2,
            id: recoleccion.id,
            codigo: recoleccion.codigo,
            nombre: recoleccion.nombre,
            cedula: recoleccion.cedula,
            sexo: recoleccion.sexo === 'M' ? 'MASCULINO' : 'FEMENINO',
            //   edad
        })

        toggleShowProducto();
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {

        async function getPacientes2() {
            const response = await axios(`${URLAPIGENERAL}/empleados/listar`);
            const dataRes = response.data;

            // const callback = v => v.codigo_Empleado >= numeroid;
            // const even = dataRes.filter(callback);

            const getPaciente2 = dataRes.map((el) => ({
                id: el.codigo,
                codigo: el.codigo_Empleado,
                nombre: el.nombres,
                cedula: el.cedula,
            }));


            setgetPaciente2(getPaciente2);


        }
        getPacientes2();
    }, [numeroid]);




    const validarsave = () => {

        const esfechaValida = anio.anio <= tiempo.getFullYear() ;

        if (!esfechaValida) {
            messajeTool('error', 'Por favor, debe colocar algun año anterior o el año actual.')
            // setError(true);
            setFechaerror(true)
            return false;
        }

        // const idpaciente1 = Datospaciente.codigo;
        const idpaciente2 = Datospaciente2.codigo;

        // if (idpaciente1 === '---') {
        //     messajeTool('error', 'Por favor, debe seleccionar un empleado inicial.')
        //     setError1(true);
        //     return false;
        // }

        if (idpaciente2 === '---') {
            messajeTool('error', 'Por favor, debe seleccionar un rango de empleado.')
            setError2(true);
            return false;
        }

        setFila([]);

        return true;
    }


    const BUSCAR = async () => {

        if (validarsave() === false) {
            return 0;
        }

        setFila([]);

        const { codigo } = JSON.parse(window.localStorage.getItem('usuario'));


        try {

            // console.log(' FDesde ', formulario.fdesde.toISOString().substr(0, 10))
            // console.log(' FHasta ', formulario.fhasta.toISOString().substr(0, 10))
            // console.log(' Emp 1 ', Datospaciente.id)
            // console.log(' Emp 2 ', Datospaciente2.id)
            // console.log(' año ', anio.anio) // int
            // console.log(' Mes ', getmes.month) // int
            // console.log('  Observacion ', dataobservacion.observacion) // añadir tabla


            const response =
                await axios(`${URLAPIGENERAL}/beneficioempleado/listar?Empleado1=${Datospaciente.id}&Empleado2=${Datospaciente2.id}`,config, setMostrarProgreso(true))

            const datos = response.data;
            if (response.status === 200) {



                if (datos.length > 0) {


                    let id = 0
                    datos.forEach(p => {
                        id += 1
                        p.id = id
                    })

                    let pivote = datos[0].codigo
                    let totalbeneficio = 0;
                    let totalgeneralbenecios = 0;
                    let calular = 0;
                    let factor = 0;
                    let salario = 0;
                    let siguiente;


                    const listagrupada = [];
                    const paragrabar = [];

                    listagrupada.push({

                        codigo: `${datos[0].codigo}`,
                        nombres: datos[0].nombre

                    });

                    for (let index = 0; index < datos.length; index += 1) {
                        siguiente = datos[index].codigo




                        if (pivote === siguiente) {
                            salario = parseFloat(datos[index].sueldobase);
                            factor = parseFloat(datos[index].porcentaje);
                            const beneficios = salario / 100 * factor;


                            totalbeneficio += beneficios

                            listagrupada.push({
                                // codigo: datos[index].codigo,
                                empleado: datos[index].empleado,
                                nombres: datos[index].nombres,
                                sueldobase: salario,
                                porcentaje: factor,
                                beneficio: beneficios,
                                ingegremp: datos[index].ingegremp,
                                observacion: dataobservacion.observacion
                            });

                            paragrabar.push({
                                anio: anio.anio,
                                mes: getmes.month,
                                fechadesde: formulario.fdesde.toISOString().substr(0, 10),
                                fechahasta: formulario.fhasta.toISOString().substr(0, 10),
                                beneficio: datos[index].codigo,
                                empleado: datos[index].empleado,
                                nombres: datos[index].nombres,
                                sueldobase: salario,
                                porcentaje: factor,
                                valorbeneficio: beneficios,
                                ingegremp: datos[index].ingegremp,
                                observacion: dataobservacion.observacion
                            });

                            setFila(paragrabar)

                            if (datos.length - 1 === index) {

                                listagrupada.push({
                                    codigo: '---------',
                                    nombres: 'TOTAL ==>',
                                    beneficio: totalbeneficio,
                                });

                                totalgeneralbenecios += totalbeneficio
                            }
                        } else {

                            listagrupada.push({
                                codigo: '---------',
                                nombres: 'TOTAL ==>',
                                beneficio: totalbeneficio,
                            },

                                {
                                    // nombre: `${datosprincipales[index].cuenta} - ${datosprincipales[index].nombre}`
                                    // nombre: ' '
                                },
                                {
                                    // nombre: `${datosprincipales[index].cuenta} - ${datosprincipales[index].nombre}`
                                    // nombre: ' '
                                }


                            );

                            totalgeneralbenecios += totalbeneficio
                            listagrupada.push({
                                codigo: `${datos[index].codigo}`,
                                nombres: datos[index].nombre
                            });

                            pivote = datos[index].codigo
                            index -= 1;
                            totalbeneficio = 0;
                            calular = 0;
                            factor = 0;
                            salario = 0;
                        }
                    }

                    listagrupada.forEach(l => {
                        id += 1;
                        l.id = id;
                    });

                    listagrupada.push({
                        // null
                    }, {
                        id: id + 1,
                        nombres: 'TOTAL BENEFICIOS -->',
                        beneficio: totalgeneralbenecios.toFixed(2)

                    });

                    messajeTool('success', 'Busqueda completada con exito.');

                    setRows(listagrupada)
                }

                if (datos.length <= 0) {

                    messajeTool('error', 'No existen datos relacionados.');

                    setRows(datos)
                }
            }


        } catch (error) {

            if (error.response.status === 500) {
                messajeTool('error', 'Debe colocar correctamente los rangos de empleado. ');
            }
            if (error.response.status !== 500) {
                messajeTool('error', 'Problemas con el servidor.');
            }
        } finally {
            setMostrarProgreso(false);
        }

    };

    const tiempo = new Date();

    const monthNameLong = tiempo.toLocaleString("es-Es", { month: "long" });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [anio, setAnio] = useState({
        anio: tiempo.getFullYear()
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dataobservacion, setObservacion] = useState({
        observacion: `SEGURO SOCIAL DE ${monthNameLong.toLocaleUpperCase()} DEL ${anio.anio}`
    });

    const mesActual = tiempo.getMonth() + 1;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [getmes, setMes] = useState({ month: mesActual })

    const Selecmeses = (e) => {
        setMes({
            ...getmes, month: e.target.value
        })

        const valor = e.target.value;

        meses.forEach(p => {
            if (p.codigo === valor) {

                const nombremes = p.nombre;

                setObservacion({
                    ...dataobservacion,
                    observacion: `SEGURO SOCIAL DE ${nombremes} DEL ${anio.anio}`
                })

            }
        })
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [formulario, setFormulario] = useState({
        fdesde: new Date(anio.anio, getmes.month - 1, 1),
        fhasta: new Date(anio.anio, getmes.month - 1 + 1, 0)
    });


    const meses = [

        {
            codigo: 1,
            nombre: 'ENERO',
        },
        {
            codigo: 2,
            nombre: 'FEBRERO',
        },
        {
            codigo: 3,
            nombre: 'MARZO',
        },
        {
            codigo: 4,
            nombre: 'ABRIL',
        },
        {
            codigo: 5,
            nombre: 'MAYO',
        },
        {
            codigo: 6,
            nombre: 'JUNIO',
        },
        {
            codigo: 7,
            nombre: 'JULIO',
        },
        {
            codigo: 8,
            nombre: 'AGOSTO',
        },
        {
            codigo: 9,
            nombre: 'SEPTIEMBRE',
        },
        {
            codigo: 10,
            nombre: 'OCTUBRE',
        },
        {
            codigo: 11,
            nombre: 'NOVIEMBRE',
        },
        {
            codigo: 12,
            nombre: 'DICIEMBRE',
        },

    ];

    const { codigo } = JSON.parse(window.localStorage.getItem('usuario'));
    const codigooperador = codigo;
    // console.log('ADM =>', codigooperador)

    const Grabar = async () => {



        try {

            const listaempleado = filas.map(m => ({
                anio: m.anio,
                mes: m.mes,
                fechadesde: m.fechadesde,
                fechahasta: m.fechahasta,
                beneficio: m.beneficio,
                empleado: m.empleado,
                ingegremp: m.ingegremp,
                observacion: m.observacion,
                Codigonomina: 0,
                PagaEmpleado: false,
                Comision: 0,
                OtroIngreso: 0,
                // Operador: `${codigo}`
            }))

            // console.log('grabado',listaempleado)

            const response = await axios.post(`${URLAPIGENERAL}/beneficioempleado/grabar`, listaempleado, config, setMostrarProgreso(true))

            if (response.status === 200) {
                messajeTool('success', 'Grabado con exito.');
            }

        } catch (error) {
            // console.log(error.response)
            if (error.response.status === 400) {
                messajeTool('error', 'Ya existe datos grabados con estas referencias ');
            }
            if (error.response.status !== 400) {
                messajeTool('error', 'Problemas con el servidor.');
            }
        } finally {
            setMostrarProgreso(false);
        }


    }


    // ------------------------Mostrar a pantalla---------------------------->

    return (
        <>

            <Cargando
                open={mostrarprogreso}
                handleClose1={() => {
                    setMostrarProgreso(false);
                }}
            />

            <ModalPacientes
                nombre="Lista de Empleados"
                openModal={openModallistpacientes}
                busquedaTipo={tiposBusquedas}
                toggleShow={toggleShowpacientes}
                rowsData={getPaciente}
                parentCallback={handleCallbackChildpacientes}
            />

            <ModalPacientes
                nombre="Lista de Empleados"
                openModal={openModalProducto}
                busquedaTipo={tiposBusquedasProducto}
                toggleShow={toggleShowProducto}
                rowsData={getPaciente2}
                parentCallback={handleCallbackChildProducto}
            />

            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Page title="Beneficio Social">
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <Box >
                            <Grid container >
                                <Grid item md={12} sm={12} xs={12}>
                                    <Box>
                                        <HeaderBreadcrumbs
                                            heading="Beneficio Social"
                                            links={[
                                                { name: 'Inicio', href: PATH_DASHBOARD.root },
                                                { name: 'Beneficio Social' },
                                                { name: 'Procesos' }
                                            ]}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Accordion
                            defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={estilosacordeon}
                            >
                                <Typography sx={{ fontWeight: 'bold' }}>Busqueda</Typography>
                            </AccordionSummary>
                            <AccordionDetails>


                                {/* Datos paciente */}
                                <Grid container spacing={2}>
                                    <Grid item container spacing={1}>
                                        <Grid item md={8} sm={12} xs={12} >
                                            {/* <Card sx={{ mb: 1, p: 1 }}> */}
                                            <Box sx={{ width: '100%' }}>
                                                <Grid container spacing={1}>
                                                    <Grid item container spacing={1} md={12}>

                                                        <Grid item sm={3} xs={5} md={3}>
                                                            <TextField
                                                                fullWidth
                                                                // disabled
                                                                error={error1}
                                                                required
                                                                label="Empleado desde"
                                                                id="outlined-size-small"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    setDatospaciente({
                                                                        ...Datospaciente,
                                                                        codigo: e.target.value
                                                                    })
                                                                }}
                                                                value={Datospaciente.codigo}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                    endAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <IconButton
                                                                                disabled={enableAñadir}
                                                                                aria-label="SearchIcon"
                                                                                onClick={() => {
                                                                                    setOpenModallistpacientes(true);
                                                                                    setError1(false);
                                                                                    setDatospaciente2({
                                                                                        codigo: '---', // int
                                                                                        nombre: '---', // string 100
                                                                                        cedula: '---', // string
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <SearchIcon />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item sm={6} xs={9} md={6}>
                                                            <TextField
                                                                fullWidth
                                                                // disabled
                                                                required
                                                                label="Nombres"
                                                                id="outlined-size-small"
                                                                size="small"
                                                                InputProps={{ readOnly: true }}
                                                                value={Datospaciente.nombre}
                                                            />
                                                        </Grid>
                                                        <Grid item md={3} xs={12} sm={3}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                                                                <MobileDatePicker
                                                                    label="Fecha Desde"
                                                                    inputFormat="dd/MM/yyyy"
                                                                    readOnly
                                                                    value={new Date(anio.anio, getmes.month - 1, 1)}
                                                                    onChange={() => {
                                                                        setFormulario({
                                                                            ...formulario,
                                                                            fdesde: new Date(anio.anio, getmes.month - 1, 1),
                                                                        });
                                                                        setError(false);
                                                                    }}
                                                                    renderInput={(params) => <TextField {...params} error={error} fullWidth size="small" />}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>

                                                        <Grid item sm={3} xs={5} md={3}>
                                                            <TextField
                                                                fullWidth
                                                                // disabled
                                                                required
                                                                error={error2}
                                                                label="Empleado hasta"
                                                                id="outlined-size-small"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    setDatospaciente2({
                                                                        ...Datospaciente2,
                                                                        codigo: e.target.value
                                                                    })
                                                                }}
                                                                value={Datospaciente2.codigo}
                                                                InputProps={{
                                                                    readOnly: true,
                                                                    endAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <IconButton
                                                                                // disabled={enableAñadir}
                                                                                aria-label="SearchIcon"
                                                                                onClick={() => {
                                                                                    setOpenModalProducto(true);
                                                                                    setError2(false);
                                                                                }}
                                                                            >
                                                                                <SearchIcon />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item sm={6} xs={9} md={6}>
                                                            <TextField
                                                                fullWidth
                                                                // disabled
                                                                required
                                                                label="Nombres"
                                                                id="outlined-size-small"
                                                                size="small"
                                                                InputProps={{ readOnly: true }}
                                                                value={Datospaciente2.nombre}
                                                            />
                                                        </Grid>
                                                        <Grid item md={3} xs={12} sm={3}>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                                                                <MobileDatePicker
                                                                    label="Fecha Hasta"
                                                                    readOnly
                                                                    inputFormat="dd/MM/yyyy"
                                                                    value={new Date(anio.anio, getmes.month - 1 + 1, 0)}
                                                                    onChange={(newValue) => {
                                                                        setFormulario({
                                                                            ...formulario,
                                                                            fhasta: newValue,
                                                                        });
                                                                    }}
                                                                    renderInput={(params) => <TextField {...params} error={error} fullWidth size="small" />}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>

                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <Grid>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Observacion"
                                                                    required
                                                                    id="outlined-basic"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={dataobservacion.observacion}
                                                                    onChange={(e) => {
                                                                        setObservacion({
                                                                            ...dataobservacion,
                                                                            observacion: e.target.value.toLocaleUpperCase(),
                                                                        });
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            {/* </Card> */}
                                        </Grid>


                                        <Grid item md={2} sm={2} xs={2}>
                                            <Grid container spacing={1}>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Grid>
                                                        <TextField
                                                            fullWidth
                                                            error={fechaerror}
                                                            label="Año"
                                                            id="outlined-basic"
                                                            required
                                                            variant="outlined"
                                                            type="number"
                                                            size="small"
                                                            value={anio.anio}
                                                            onChange={(e) => {
                                                                setAnio({
                                                                    ...anio,
                                                                    anio: e.target.value,
                                                                });
                                                                setFechaerror(false);
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Grid>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            select
                                                            label="Período"
                                                            id="outlined-basic"
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={Selecmeses}
                                                            value={getmes.month}
                                                        >
                                                            {
                                                                Object.values(meses).map(
                                                                    (val) => (
                                                                        <MenuItem key={val.nombre} value={val.codigo}>{val.nombre}</MenuItem>

                                                                    )
                                                                )
                                                            }
                                                        </TextField>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item md={2} sm={2} xs={4}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                                <MobileDatePicker
                                                    label="Fecha Actual"
                                                    inputFormat="dd/MM/yyyy"
                                                    value={fechaactual.factual}
                                                    readOnly
                                                    onChange={(e) => {
                                                        // console.log(e)
                                                    }}
                                                    renderInput={(params) => <TextField {...params} fullWidth
                                                        size="small" />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid container item xs={12} spacing={1} justifyContent="flex-start"  >
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    variant="text"
                                                    size='small'
                                                    onClick={nuevo}
                                                    startIcon={<InsertDriveFileRoundedIcon />}
                                                >
                                                    Nuevo
                                                </Button>
                                            </Grid>
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    disabled={rows.length <= 0}
                                                    fullWidth
                                                    variant="text"
                                                    startIcon={<SaveRoundedIcon />}
                                                    size='small'
                                                    onClick={Grabar}
                                                >
                                                    Grabar
                                                </Button>
                                            </Grid>
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    variant="text"
                                                    size='small'
                                                    onClick={BUSCAR}
                                                    startIcon={<SearchRoundedIcon />}
                                                >
                                                    Buscar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Box sx={{ width: '100%' }}>
                            <Accordion
                                defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    sx={estilosacordeon}
                                >
                                    <Typography sx={{ fontWeight: 'bold' }}>Detalles</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ borderRadius: '0.5rem' }}>
                                    <Box mb={1}>
                                        <Grid container spacing={1} justifyContent="flex-end" >
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    disabled={rows.length <= 0}
                                                    variant="text"
                                                    // eslint-disable-next-line camelcase
                                                    href={`${URLAPIGENERAL}/beneficioempleado/generarexcel?Anio=${anio.anio}&Mes=${getmes.month}&Empleado1=${Datospaciente.id}&Empleado2=${Datospaciente2.id}&Operador=${codigooperador}`}
                                                    // target="_blank"
                                                    startIcon={<ViewComfyRoundedIcon />}
                                                >
                                                    Excel
                                                </Button>
                                            </Grid>
                                            <Grid item md={1.2} sm={2} xs={6}>
                                                <Button
                                                    fullWidth
                                                    disabled={rows.length <= 0}
                                                    variant="text"
                                                    href={`${URLAPIGENERAL}/beneficioempleado/generarpdf?Anio=${anio.anio}&Mes=${getmes.month}&Empleado1=${Datospaciente.id}&Empleado2=${Datospaciente2.id}&Operador=${codigooperador}`}
                                                    target="_blank"
                                                    startIcon={<PictureAsPdfRoundedIcon />}
                                                >
                                                    Pdf
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box
                                        sx={estilosdetabla}
                                    >
                                        <div
                                            style={{
                                                padding: '1rem',
                                                height: '55vh',
                                                width: '100%',
                                            }}
                                        >
                                            <DataGrid
                                                sx={estilosdatagrid}
                                                density="compact"
                                                rowHeight={28}
                                                columns={columns}
                                                rows={rows}
                                                getRowId={rows => rows.id}
                                                components={{
                                                    NoRowsOverlay: CustomNoRowsOverlay,
                                                }}
                                                getCellClassName={(params) => {

                                                    if (params.value == null
                                                        || params.row.codigo === ''
                                                    ) {
                                                        return '';
                                                    }



                                                    if (params.row.codigo === '---------' && params.row.nombres === 'TOTAL ==>'

                                                    ) {
                                                        return 'yellowCell';
                                                    }

                                                    if (params.row.codigo == null && params.row.nombres === 'TOTAL BENEFICIOS -->'

                                                    ) {
                                                        return 'blueCell';
                                                    }

                                                    if (params.field === 'codigo' && params.row.codigo != null && params.row.codigo !== '---------') {
                                                        return 'orangeCell';
                                                    }

                                                    return '';
                                                }}
                                                hideFooter={rows.length < 3}
                                                disableColumnMenu={ocultaFooter}
                                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            />
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Box>
                </Page>
            </Fade>
        </>
    );
}
