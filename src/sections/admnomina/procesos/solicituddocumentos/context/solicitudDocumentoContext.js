import { createContext, useEffect, useState, useCallback } from "react";
import serviciosEmpleados from '../../../../../servicios/parametros_del_sistema/servicios_empleado';
import serviciosJefeDepartamento from '../../../../../servicios/parametros_del_sistema/servicios_Jefedepartamento';
import useCargando from "../../../../../hooks/admnomina/useCargando";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import { obtenerMaquina, convertirFecha } from "../../../../../utils/admnomina/funciones/funciones";
import servicesSolicitudDocumento from "../services/servicesSolicitudDocumento";

export const SolicitudDocumentoContext = createContext();

// eslint-disable-next-line react/prop-types
export const SolicitudDocumentoProvider = ({ children }) => {
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico } = useMensajeGeneral()

    const sucursalLocal = window.localStorage.getItem('sucursal');
    const usuarioLocal = JSON.parse(window.localStorage.getItem('usuario'))
    const sucursalLogeada = sucursalLocal === null ? 0 : parseFloat(sucursalLocal);
    const usuarioLogeado = usuarioLocal === null ? 0 : usuarioLocal.codigo;
    const [ip, setIp] = useState('')

    const [numeroSolicitud, setNumeroSolicitud] = useState(0);
    const [listaMotivos, setListaMotivos] = useState([])
    const [listaEmpleados, setListaEmpleados] = useState([])
    const [empleado, setEmpleado] = useState({
        codigo: 0,
        codigoalternativo: '',
        nombre: '',
        jornada: '',
        departamento: '',
        correo: ''
    })
    const [jefeDepartamento, setJefeDepartamento] = useState({
        codigo: '',
        nombre: '',
        correo: '',
        nombreDept: ''
    })
    const [formulario, setFormulario] = useState({
        fecha: new Date(),
        fechaInicio: new Date(),
        fechaFin: new Date(),
        motivo: '',
        nombreMotivo: '',
        tipoMotivo: 0,
        nombreTipoMotivo: '',
        estado: false,
        aprobado: false,
        observacion: '',
        url: ''
    })

    const isValidDate = (d) => d instanceof Date && !d.isNaN;
    const cambiarFecha = (e) => {
        setFormulario({
            ...formulario,
            fecha: isValidDate(e) ? e : new Date(),
        })
    }
    const cambiarFechaInicio = (e) => {
        setFormulario({
            ...formulario,
            fechaInicio: isValidDate(e) ? e : new Date(),
        })
    }
    const cambiarFechaFin = (e) => {
        setFormulario({
            ...formulario,
            fechaFin: isValidDate(e) ? e : new Date(),
        })
    }

    function limpiarCampos() {
        setFormulario({
            fecha: new Date(),
            fechaInicio: new Date(),
            fechaFin: new Date(),
            motivo: '',
            nombreMotivo: '',
            tipoMotivo: 0,
            nombreTipoMotivo: '',
            estado: false,
            aprobado: false,
            observacion: '',
            url: ''
        })
        setEmpleado({
            codigo: 0,
            codigoalternativo: '',
            nombre: '',
            jornada: '',
            departamento: '',
            correo: ''
        })
        setJefeDepartamento({
            codigo: '',
            nombre: '',
            correo: '',
            nombreDept: ''
        })
        ObtenerSolicitudes()
    }

    // CARGA DE DOCUMENTOS ----------------------------------------------------------------------------------------------
    const [archivo, setArchivo] = useState([]);
    const cargarArchivos = useCallback(
        (archivos) => {
            const noEsPdf = archivos.at(0).type !== 'application/pdf';
            if (noEsPdf) {
                mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Solo puede subir un archivo en formato .pdf' });
                return;
            }
            if (archivo.length >= 1) {
                mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Solo puede subir un archivo' });
                return;
            }
            if (archivos.at(0).size / 1000000 > 2) {
                mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Solo puede subir un archivo que pese máximo 2mb' });
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
        const codigo = empleado.codigoalternativo;
        const fechahoy = new Date().toISOString();
        const nombrepdf = `${formulario.nombreMotivo.trim()}_${codigo}_${fechahoy.substring(0, 10)}.pdf`
        const lecturArchivo = new FileReader();
        lecturArchivo.readAsDataURL(archivo.at(0));
        lecturArchivo.onloadend = (e) => {
            const datos = {
                nombreArchivo: nombrepdf,
                archivo: e.target.result.split('base64,')[1]
            }
            empezarCarga();
            servicesSolicitudDocumento.SubirDocumento({ documento: datos })
                .then((res) => {
                    setFormulario({
                        ...formulario,
                        url: res.data
                    })
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
    };
    // ------------------------------------------------------------------------------------------------------------------

    const validacion = () => {
        if (empleado.nombre === '') {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Seleccione un empleado' });
            return false;
        }
        if (formulario.motivo === 'M0002') {
            if (formulario.url === '') {
                mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Para completar la solicitud primero debe subir el documento' });
                return false;
            }
        }
        return true;
    };

    async function Grabar() {
        if (validacion() === false) {
            return;
        }
        empezarCarga();
        const numeroSolic = await servicesSolicitudDocumento.ObtenerUltimoNumSolicitud()
        const datosCorreo = {
            nombreEmpleado: empleado.nombre,
            correoEmpleado: empleado.correo,
            motivoSolicitud: formulario.nombreMotivo,
            nombreJefeDpt: jefeDepartamento.nombre,
            correoJefeDpt: jefeDepartamento.correo,
            nombreDptJefe: jefeDepartamento.nombreDept
        }
        const form = {
            codigo: 0,
            numero: numeroSolic + 1,
            fecha: formulario.fecha,
            motivo: formulario.motivo,
            fechaInicio: convertirFecha(formulario.fechaInicio),
            fechaFin: convertirFecha(formulario.fechaFin),
            empleado: empleado.codigo,
            observacion: formulario.observacion,
            estado: true,
            aprobado: false,
            iess: formulario.nombreTipoMotivo === 'IESS',
            urlDocumento: formulario.url,
            fechaing: new Date(),
            maquina: ip,
            usuario: usuarioLogeado,
            fechaapr: new Date(),
            maquinaapr: ' ',
            usuarioapr: 0,
            datosCorreo
        }
        servicesSolicitudDocumento.GrabarSolicitud({ form })
            .then(res => {
                console.log(res)
                mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Solicitud registrada con éxito' });
                limpiarCampos()
                ObtenerDatos();
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al guardar verifique los datos e inténtelo nuevamente' });
            })
            .finally(
                terminarCarga()
            )
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
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener información de lista de Empleados' });
            })
    }

    const ObtenerSolicitudes = () => {
        let numero = 0
        servicesSolicitudDocumento.Listar()
            .then(res => {
                const solicitudes = res.data;
                const { [Object.keys(solicitudes).pop()]: lastItem } = solicitudes;
                setNumeroSolicitud(lastItem.numero + 1)
                numero = lastItem.numero + 1
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al consultar datos' });
                return 0;
            })
        return numero
    }

    const ObtenerMotivos = () => {
        servicesSolicitudDocumento.ListarMotivos()
            .then(res => {
                const motivos = res.data
                console.log(motivos)
                setListaMotivos(motivos)
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener información de los motivos' });
            })
    }

    async function ObtenerDatos() {
        empezarCarga()
        try {
            const maquina = await obtenerMaquina();
            setIp(maquina);
            ObtenerEmpleados()
            ObtenerMotivos()
            ObtenerSolicitudes()
        } catch (error) {
            console.log(error)
            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener cargar datos, intente nuevamente recargando la página, si el problema persiste contácte con soporte' });
        }
        finally {
            terminarCarga()
        }
    }

    const ObtenerJefeDepartamento = () => {
        serviciosJefeDepartamento.BuscarxDepartamento({ departamento: empleado.departamento })
            .then(res => {
                console.log('res', res)
                setJefeDepartamento({
                    codigo: res.codigoEmpleado,
                    nombre: res.nombreEmpleado,
                    correo: res.correo,
                    nombreDept: res.nombreDepartamento
                })
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener el jefe del departamento del empleado seleccionado' });
            })
    }

    useEffect(() => {
        ObtenerDatos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (empleado.departamento !== '') {
            ObtenerJefeDepartamento()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empleado.departamento])

    return (
        <SolicitudDocumentoContext.Provider
            value={{
                listaMotivos,
                listaEmpleados,
                empleado,
                setEmpleado,
                numeroSolicitud,
                formulario, setFormulario,
                limpiarCampos, validacion, cambiarFecha, cambiarFechaInicio, cambiarFechaFin,
                Grabar,
                archivo, cargarArchivos, removerArchivo, removerTodosLosArchivos, enviarArchivos
            }}
        >
            {children}
        </SolicitudDocumentoContext.Provider>
    )
}