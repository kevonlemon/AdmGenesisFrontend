import { createContext, useEffect, useState } from "react";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { URLAPIGENERAL } from '../../../../../config';
import serviciosEmpleados from '../../../../../servicios/parametros_del_sistema/servicios_empleado';
import servicesSolicitudDocumento from "../../solicituddocumentos/services/servicesSolicitudDocumento";
import useCargando from "../../../../../hooks/admnomina/useCargando";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import { obtenerMaquina } from "../../../../../utils/admnomina/funciones/funciones";
import { formaterarFecha } from '../../../../../utils/sistema/funciones';
import BotonDescarga from "../components/botonDescarga";
import servicesAprobacionSolicitud from '../services/AprobacionSolicitudServices';


export const AprobacionSolicitudContext = createContext();

export const AprobacionSolicitudProvider = ({ children }) => {
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico } = useMensajeGeneral()

    const sucursalLocal = window.localStorage.getItem('sucursal');
    const usuarioLocal = JSON.parse(window.localStorage.getItem('usuario'))
    const sucursalLogeada = sucursalLocal === null ? 0 : parseFloat(sucursalLocal);
    const usuarioLogeado = usuarioLocal === null ? 0 : usuarioLocal.codigo;
    const [ip, setIp] = useState('')

    const [listaMotivos, setListaMotivos] = useState([])
    const [listaEmpleados, setListaEmpleados] = useState([])

    const [listAprobados, setListAprobados] = useState([]);

    const [empleadoDesde, setEmpleadoDesde] = useState({
        codigo: 0,
        codigoalternativo: '',
        nombre: '',
    })

    const [empleadoHasta, setEmpleadoHasta] = useState({
        codigo: 0,
        codigoalternativo: '',
        nombre: '',
    })

    const [formulario, setFormulario] = useState({
        fechadesde: new Date(),
        fechahasta: new Date(),
        motivo: 'todos',
        nombreMotivo: '',
        tipoMotivo: 0,
        nombreTipoMotivo: ''
    })
    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100, hide: true },
        { field: 'codigo', headerName: 'Codigo', width: 100, hide: true },
        { field: 'numero', headerName: 'Número', width: 80 },
        {
            field: 'fecha',
            headerName: 'Fecha Solicitud',
            width: 120,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        { 
            field: 'motivo', headerName: 'Motivo', width: 250,
            renderCell: (params) =>
                params.row.iess === true ? 
                (
                    <BotonDescarga 
                        texto={params.row.motivo}
                        accion={() => {
                            const url = params.row.urlDocumento
                            const nombres = params.row.empleado
                            const motivoSolicitud = params.row.motivo
                            descargarSolicitudes(url, nombres, motivoSolicitud)
                        }}
                    />
                ) :
                (
                    params.row.motivo
                ) 
        },
        { field: 'empleado', headerName: 'Empleado', width: 350 },
        {
            field: 'fechaInicio',
            headerName: 'Fecha Inicio',
            width: 120,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        {
            field: 'fechaFin',
            headerName: 'Fecha Fin',
            width: 120,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        {
            field: 'fechaRetorno',
            headerName: 'Fecha Retorno',
            width: 120,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '--/--/----';
                }
                const valueFormatted = formaterarFecha(params.value, '-', '/');
                return valueFormatted;
            },
        },
        { field: 'totalHoras', headerName: 'Total Horas', width: 100, align: 'center' },
        {
            headerAlign: 'center',
            headerName: 'APROBAR',
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            width: 80,
            align: 'center',
            renderHeader: () => <strong>{'Selecc'}</strong>,
        }
    ];

    function formatDate(fecha) {
        const formattedDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        return formattedDate;
    }
    const isValidDate = (d) => d instanceof Date && !d.isNaN;

    const cambiarFechaDesde = (e) => {
        setFormulario({
            ...formulario,
            fechadesde: isValidDate(e) ? e : new Date(),
        })
    }
    const cambiarFechaHasta = (e) => {
        setFormulario({
            ...formulario,
            fechahasta: isValidDate(e) ? e : new Date(),
        })
    }

    function limpiarCampos() {
        setFormulario({
            fechadesde: new Date(),
            fechahasta: new Date(),
            motivo: 'todos',
            nombreMotivo: '',
            tipoMotivo: 0,
            nombreTipoMotivo: ''
        })
        setEmpleadoDesde({
            codigo: 0,
            codigoalternativo: '',
            nombre: '',
        })
        setEmpleadoHasta({
            codigo: 0,
            codigoalternativo: '',
            nombre: '',
        })
        setListAprobados([])
        setRows([])
    }

    function buscarSolicitudes() {
        empezarCarga()
        servicesAprobacionSolicitud.ListarSolicitudes({
            fechadesde: formatDate(formulario.fechadesde),
            fechahasta: formatDate(formulario.fechahasta),
            empleadodesde: empleadoDesde.codigo,
            empleadohasta: empleadoHasta.codigo,
            motivo: formulario.motivo
        })
            .then(res => {
                const { data } = res;
                if (data.length === 0) {
                    mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'No se encontraron solicitudes para los datos dados' });
                } else {
                    let codigo = 0;
                    data.forEach((f) => {
                        codigo += 1;
                        f.id = codigo;
                    });
                    setRows(data);
                }
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al consultar verifique los datos e inténtelo nuevamente, si el problema persiste contácte a soporte' });
            })
            .finally(
                terminarCarga()
            )

    }

    function descargarSolicitudes(url, nombres, motivoSolicitud) {
        window.open(`${URLAPIGENERAL}/AprobacionSolicitudes/descargarsolicitud?url=${url}&nombres=${nombres}&motivoSolicitud=${motivoSolicitud}`)
    }

    const ObtenerEmpleados = () => {
        serviciosEmpleados.Listar()
            .then(res => {
                const empleados = res.map((m) => ({
                    ...m,
                    codigoalternativo: m.codigo_Empleado,
                    nombre: m.nombres
                }))
                setListaEmpleados(empleados)
                setEmpleadoDesde({
                    codigo: empleados[0].codigo,
                    nombre: empleados[0].nombre,
                    codigoalternativo: empleados[0].codigoalternativo
                })
                setEmpleadoHasta({
                    codigo: empleados.at(-1).codigo,
                    nombre: empleados.at(-1).nombre,
                    codigoalternativo: empleados.at(-1).codigoalternativo
                })
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener información de lista de Empleados' });
            })
    }

    const ObtenerMotivos = () => {
        servicesSolicitudDocumento.ListarMotivos()
            .then(res => {
                const motivos = res.data
                setListaMotivos(motivos)
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener información de los motivos' });
            })
    }

    async function Procesar() {
        empezarCarga()
        servicesAprobacionSolicitud.ActualizarSolicitudes({ form: listAprobados })
            .then(res => {
                console.log(res)
                mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Solicitudes aprobadas correctamente' });
                limpiarCampos();
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al aprobar solicitudes, intente nuevamente recargando la página, si el problema persiste contácte con soporte' });
            })
            .finally(
                terminarCarga()
            )
    }

    async function ObtenerDatos() {
        empezarCarga()
        try {
            const maquina = await obtenerMaquina();
            setIp(maquina);
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            setFormulario({
                ...formulario,
                fechadesde: firstDay
            })
            ObtenerEmpleados()
            ObtenerMotivos()
        } catch (error) {
            console.log(error)
            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener cargar datos, intente nuevamente recargando la página, si el problema persiste contácte con soporte' });
        }
        finally {
            terminarCarga()
        }
    }

    useEffect(() => {
        ObtenerDatos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AprobacionSolicitudContext.Provider
            value={{
                columns,
                rows,
                listaMotivos,
                listaEmpleados,
                empleadoDesde, empleadoHasta,
                setEmpleadoDesde, setEmpleadoHasta,
                formulario, setFormulario, ip, usuarioLogeado, sucursalLogeada,
                listAprobados, setListAprobados,
                limpiarCampos, cambiarFechaDesde, cambiarFechaHasta,
                buscarSolicitudes, Procesar
            }}
        >
            {children}
        </AprobacionSolicitudContext.Provider>
    )
}