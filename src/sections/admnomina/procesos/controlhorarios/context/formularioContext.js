import { createContext, useEffect, useState } from "react";

import serviciosEmpleados from '../../../../../servicios/parametros_del_sistema/servicios_empleado'
import useCargando from "../../../../../hooks/admnomina/useCargando";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';

export const FormularioContext = createContext();

// eslint-disable-next-line react/prop-types
export const FormularioContextProvider = ({ children }) => {
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico, mensajeSistemaPregunta } = useMensajeGeneral()

    const [listaEmpleados, setListaEmpleados] = useState([])
    const [empleado, setEmpleado] = useState({
        codigo: 0,
        codigoalternativo: '',
        nombre: ''
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

    const ObtenerDatos = () => {
        empezarCarga()
        try 
        {
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
                listaEmpleados,
                empleado,
                setEmpleado
            }}
        >
            {children}
        </FormularioContext.Provider>
    )
}