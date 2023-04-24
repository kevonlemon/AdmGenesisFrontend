import { createContext, useEffect, useState } from "react";
import serviciosEmpleados from '../../../../../servicios/parametros_del_sistema/servicios_empleado';
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
        jornada: ''
    })
    const [formulario, setFormulario] = useState({
        fecha: new Date(),
        fechaInicio: new Date(),
        fechaFin: new Date(),
        motivo: '',
        tipoMotivo: 0,
        estado: false,
        aprobado: false,
        observacion: '',
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
                setListaMotivos(motivos)
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener información de los motivos' });
            })
    }

    function limpiarCampos() {
        setFormulario({
            fecha: new Date(),
            fechaInicio: new Date(),
            fechaFin: new Date(),
            motivo: '',
            tipoMotivo: 0,
            estado: false,
            aprobado: false,
            observacion: '',
        })
        setEmpleado({
            codigo: 0,
            codigoalternativo: '',
            nombre: '',
            jornada: ''
        })
        setNumeroSolicitud(0)
    }

    const validacion = () => {
        if (empleado.nombre === '') {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Seleccione un empleado' });
            return false;
        }
        return true;
    };

    async function Grabar() {
        if (validacion() === false) {
            return;
        }
        const numeroSolic = await servicesSolicitudDocumento.ObtenerUltimoNumSolicitud()
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
            urlDocumento: ' ',
            fechaing: new Date(),
            maquina: ip,
            usuario: usuarioLogeado,
            fechaapr: new Date(),
            maquinaapr: ' ',
            usuarioapr: 0,
        }
        console.log('tosend', form)
        // empezarCarga();
        // servicesSolicitudDocumento.GrabarSolicitud({ form })
        //     .then(res => {
        //         console.log(res)
        //         mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Datos registrados con éxito' });
        //         limpiarCampos()
        //         ObtenerDatos();
        //     })
        //     .catch(error => {
        //         console.log(error)
        //         mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al guardar verifique los datos e inténtelo nuevamente' });
        //     })
        //     .finally(
        //         terminarCarga()
        //     )
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

    useEffect(() => {
        ObtenerDatos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                Grabar
            }}
        >
            {children}
        </SolicitudDocumentoContext.Provider>
    )
}