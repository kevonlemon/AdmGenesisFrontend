import { createContext, useEffect, useState } from "react";
import serviciosEmpleados from '../../../../../servicios/parametros_del_sistema/servicios_empleado'
import useCargando from "../../../../../hooks/admnomina/useCargando";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import { obtenerMaquina } from "../../../../../utils/sistema/funciones";

export const FormularioContext = createContext();

// eslint-disable-next-line react/prop-types
export const FormularioContextProvider = ({ children }) => {
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico } = useMensajeGeneral()

    const sucursalLocal = window.localStorage.getItem('sucursal');
    const usuarioLocal = JSON.parse(window.localStorage.getItem('sucursal'))
    const sucursalLogeada = sucursalLocal === null ? 0 : sucursalLocal;
    const usuarioLogeado = usuarioLocal === null ? 0 : usuarioLocal.codigo;
    const [ip, setIp] = useState('')
    const [listaEmpleados, setListaEmpleados] = useState([])
    const [empleado, setEmpleado] = useState({
        codigo: 0,
        codigoalternativo: '',
        nombre: '',
        jornada: ''
    })
    const [fechasHorario, setFechasHorario] = useState({
        primerDiaAnio: new Date(),
        ultimoDiaAnio: new Date()
    })

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

    const ObtenerDatos = async () => {
        empezarCarga()
        try 
        {
            const fechaActual = new Date()
            const primero = new Date(fechaActual.getFullYear(), 0, 1)
            const ultimo = new Date(fechaActual.getFullYear(), 11, 31)
            setFechasHorario({
                primerDiaAnio: primero,
                ultimoDiaAnio: ultimo
            })
            const maquina = await obtenerMaquina();
            setIp(maquina);
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
        <FormularioContext.Provider
            value={{ 
                sucursalLogeada,
                usuarioLogeado,
                ip,
                listaEmpleados,
                empleado,
                fechasHorario,
                setEmpleado
            }}
        >
            {children}
        </FormularioContext.Provider>
    )
}