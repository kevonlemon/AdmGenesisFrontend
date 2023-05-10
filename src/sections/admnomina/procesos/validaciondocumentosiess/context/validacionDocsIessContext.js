import { createContext, useEffect, useState, useCallback } from "react";
import { IconButton, Button } from "@mui/material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import FileDownloadDoneRoundedIcon from '@mui/icons-material/FileDownloadDoneRounded';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { URLAPIGENERAL } from '../../../../../config';
import serviciosEmpleados from '../../../../../servicios/parametros_del_sistema/servicios_empleado';
import useCargando from "../../../../../hooks/admnomina/useCargando";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import { obtenerMaquina, formatearFecha } from "../../../../../utils/admnomina/funciones/funciones";
import servicesValidacionDocsIESS from "../services/ValidacionDocIessServices";

export const ValidacionDocumentosIessContext = createContext();

// eslint-disable-next-line react/prop-types
export const ValidacionDocumentosIessProvider = ({ children }) => {
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico } = useMensajeGeneral()

    const sucursalLocal = window.localStorage.getItem('sucursal');
    const usuarioLocal = JSON.parse(window.localStorage.getItem('usuario'))
    const sucursalLogeada = sucursalLocal === null ? 0 : parseFloat(sucursalLocal);
    const usuarioLogeado = usuarioLocal === null ? 0 : usuarioLocal.codigo;
    const [ip, setIp] = useState('')

    const [listaEmpleados, setListaEmpleados] = useState([])
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
        fechahasta: new Date()
    })
    const [listValidados, setListValidados] = useState([]);
    const [ocultarSubidaDocumentos, setOcultarSubidaDocumentos] = useState(true)
    const [numeroSolicitud, setNumeroSolicitud] = useState(0)
    const [empleadoSolicitud, setEmpleadoSolicitud] = useState('')
    const [codigoSolicitud, setCodigoSolicitud] = useState(0)
    const [archivo, setArchivo] = useState([]);
    const [rows, setRows] = useState([]);

    const columns = [
        {
            field: 'descargar', headerName: 'Ver Solicitud', width: 95, align: 'center',
            renderCell: (params) => (
                <IconButton
                    color="primary"
                    size="medium"
                    onClick={() => {
                        const url = params.row.urlDocumento;
                        const nombres = params.row.empleado;
                        const motivoSolicitud = params.row.motivo
                        descargarSolicitudes(url, nombres, motivoSolicitud)
                    }}
                >
                    <RemoveRedEyeIcon />
                </IconButton>
            )
        },
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
                const valueFormatted = formatearFecha({ fecha: params.value, separador: '-', union: '/' });
                return valueFormatted;
            },
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
                const valueFormatted = formatearFecha({ fecha: params.value, separador: '-', union: '/' });
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
                const valueFormatted = formatearFecha({ fecha: params.value, separador: '-', union: '/' });
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
                const valueFormatted = formatearFecha({ fecha: params.value, separador: '-', union: '/' });
                return valueFormatted;
            },
        },
        { field: 'totalHoras', headerName: 'Total Horas', width: 100, align: 'center' },
        {
            field: 'cargar', headerName: 'Documento', width: 110, align: 'center',
            renderCell: (params) => (
                <>
                    <Button
                        variant="text"
                        fullWidth
                        endIcon={ params.row.urlDocValidacion === "" ? <FileUploadRoundedIcon /> : <FileDownloadDoneRoundedIcon />}
                        onClick={() => {
                            setNumeroSolicitud(params.row.numero)
                            setEmpleadoSolicitud(params.row.empleado)
                            setCodigoSolicitud(params.row.codigo)
                            setOcultarSubidaDocumentos(false)
                        }}
                    >
                        Subir Archivo
                    </Button>
                </>
            )
        },
        {
            headerAlign: 'center',
            headerName: 'VALIDAR',
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            width: 80,
            align: 'center',
            renderHeader: () => <strong>{'Selecc'}</strong>,
        }
    ]

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

    function buscarSolicitudesIESS() {
        empezarCarga()
        servicesValidacionDocsIESS.ListarSolicitudesIESS({
            fechadesde: formatDate(formulario.fechadesde),
            fechahasta: formatDate(formulario.fechahasta),
            empleadodesde: empleadoDesde.codigo,
            empleadohasta: empleadoHasta.codigo
        })
            .then(res => {
                const { data } = res;
                if (data.length === 0) {
                    mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'No se encontraron solicitudes del IESS para los parámetros específicados' });
                } else {
                    let codigo = 0;
                    data.forEach((f) => {
                        codigo += 1;
                        f.id = codigo;
                        f.urlDocValidacion = "";
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

    function limpiarCampos() {
        setRows([])
        setListValidados([])
        setArchivo([])
        setOcultarSubidaDocumentos(true)
        setNumeroSolicitud(0)
        setEmpleadoSolicitud('')
        setCodigoSolicitud(0)
    }

    function Procesar() {
        if (listValidados.length === 0) {
            return
        }
        const filtro = listValidados.filter(f => f.urlDocumentoValidacion === "")
        if (filtro.length !== 0) {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Existen solicitudes marcadas a las cuales no se les ha subido ningún documento, asegurése de subir un documento a todos los registros seleccionados para poder Procesar' });
            return;
        }
        empezarCarga()
        servicesValidacionDocsIESS.ValidarDocumentosIess({ form: listValidados })
            .then(res => {
                console.log(res)
                mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Documentos validados correctamente' });
                limpiarCampos()
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al validar documentos, intente nuevamente recargando la página, si el problema persiste contácte con soporte' });
            })
            .finally(
                terminarCarga()
            )
    }

    const cargarArchivos = useCallback(
        (archivos) => {
            const noEsPdf = archivos.at(0).type !== 'application/pdf';
            if (noEsPdf) {
                mensajeSistemaGenerico({ mensaje: 'Solo puede subir un archivo en formato .pdf' });
                return;
            }
            if (archivo.length >= 1) {
                mensajeSistemaGenerico({ mensaje: 'Solo puede subir un archivo' });
                return;
            }
            if (archivos.at(0).size / 1000000 > 3) {
                mensajeSistemaGenerico({ mensaje: 'Solo puede subir un archivo que pese maximo 3mb' });
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

    function enviarArchivos() {
        const fechahoy = new Date().toISOString();
        const nombrepdf = `SOLICITUD${numeroSolicitud}_${empleadoSolicitud}_VALIDADA_${fechahoy}.pdf`;
        const lecturArchivo = new FileReader();
        lecturArchivo.readAsDataURL(archivo.at(0));
        lecturArchivo.onloadend = (e) => {
            const datos = {
                nombreArchivo: nombrepdf,
                archivo: e.target.result.split('base64,')[1],
                codigoSolicitud,
                usuario: usuarioLogeado,
                fechaIng: new Date(),
                maquina: ip
            }
            empezarCarga()
            servicesValidacionDocsIESS.SubirDocumento({ documento: datos })
                .then(res => {
                    console.log('respuesta', res)
                    const newRows = rows.map((m) => ({
                        ...m,
                        urlDocValidacion: m.codigo === codigoSolicitud ? res.data : m.urlDocValidacion
                    }))
                    setRows(newRows);
                    setCodigoSolicitud(0);
                    setOcultarSubidaDocumentos(true)
                    removerTodosLosArchivos()
                    mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Documento subido con éxito' });
                })
                .catch((error) => {
                    console.log(error)
                    mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas con el servidor intente nuevamente, si el problema persiste contácte con soporte' });
                })
                .finally(() => {
                    terminarCarga();
                })
        }
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
        <ValidacionDocumentosIessContext.Provider
            value={{
                columns,
                rows,
                listaEmpleados,
                empleadoDesde, empleadoHasta,
                setEmpleadoDesde, setEmpleadoHasta,
                listValidados, setListValidados,
                ocultarSubidaDocumentos, setOcultarSubidaDocumentos,
                formulario, setFormulario, ip, usuarioLogeado, sucursalLogeada,
                cambiarFechaDesde, cambiarFechaHasta,
                buscarSolicitudesIESS, Procesar, limpiarCampos,
                archivo, enviarArchivos, cargarArchivos, removerArchivo, removerTodosLosArchivos, numeroSolicitud, empleadoSolicitud
            }}
        >
            {children}
        </ValidacionDocumentosIessContext.Provider>
    )
}