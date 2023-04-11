import { useState, useEffect, createContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from '@mui/material';
import useCargando from "../../../../../hooks/admnomina/useCargando";
import { PATH_AUTH } from '../../../../../routes/paths';
import serviciosJefeDepartamento from "../../../../../servicios/parametros_del_sistema/servicios_Jefedepartamento"
import serviciosEmpleados from "../../../../../servicios/parametros_del_sistema/servicios_empleado";
import serviciosMantenimientoGenerico from '../../../../../servicios/parametros_del_sistema/servicios_genericos';
import { obtenerMaquina } from "../../../../../utils/sistema/funciones";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import { styleActive, styleInactive } from '../../../../../utils/admnomina/estilos/estilos';

export const JefeDepartamentoContext = createContext();

// eslint-disable-next-line react/prop-types
export const JefeDepartamentoContextProvider = ({ children }) => {
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico, mensajeSistemaPregunta } = useMensajeGeneral()
    const navegacion = useNavigate()
    const { state } = useLocation();
    const modo = state === null ? "" : state.modo;
    const idJefeDep = state === null ? 0 : state.id
    // ------------------------------------------------ TABLA JEFES DEPARTAMENTO -------------------------------------------------------------------------------
    const columns = [
        { field: 'id', headerName: 'ID', width: 100, headerClassName: 'super-app-theme--header', hide: true },
        { field: 'codigoEmpleado', headerName: 'Código empleado', headerClassName: 'super-app-theme--header', width: 130 },
        { field: 'nombreEmpleado', headerName: 'Empleado', headerClassName: 'super-app-theme--header', width: 425 },
        { field: 'nombreDepartamento', headerName: 'Departamento', headerClassName: 'super-app-theme--header', width: 325 },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 100,
            renderCell: (param) =>
                param.row.estado === true ? (
                    <Button variant="containded" style={styleActive}>
                        Activo
                    </Button>
                ) : (
                    <Button variant="containded" style={styleInactive}>
                        Inactivo
                    </Button>
                ),
        },
    ]
    const [rows, setRows] = useState([]);
    const [buscar, setBuscar] = useState('');
    const [resultadobusqueda, setResultadoBusqueda] = useState([]);
    function Buscar(e) {
        setBuscar(e.target.value);
        const texto = String(e.target.value).toLocaleUpperCase();
        const resultado = resultadobusqueda.filter(
            (b) =>
                String(b.codigoEmpleado).toLocaleUpperCase().includes(texto) ||
                String(b.nombreEmpleado).toLocaleUpperCase().includes(texto) ||
                String(b.nombreDepartamento).toLocaleUpperCase().includes(texto)
        );
        setRows(resultado)
    }
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------
    const [codigoJefeDepartamento, setCodigoJefeDepartamento] = useState(0)
    const usuario = JSON.parse(localStorage.getItem('usuario'))
    const nombreOpcion = "Jefes de Departamentos"
    const [formulario, setFormulario] = useState({
        usuario: usuario.codigo,
        fechaing: new Date(),
        maquina: ''
    })
    const [departamento, setDepartamento] = useState({
        codigo: '',
        codigoalternativo: '',
        nombre: ''
    })
    const [listaDepartamentos, setListaDepartamentos] = useState([])
    const [empleado, setEmpleado] = useState({
        codigo: 0,
        codigoalternativo: '',
        nombre: ''
    })
    const [listaEmpleados, setListaEmpleados] = useState([])

    // -------------------------------- REF PARA EL FOCUS ---------------------------------------------------------------------------
    const departamentoref = useRef();
    const empleadoref = useRef();
    // ------------------------------------------------------------------------------------------------------------------------------

    const validarJefeDepartamento = () => {
        if (departamento.nombre === "" || departamento.nombre === "----") {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Debe escoger un departamento' });
            departamentoref.current.focus()
            return false
        }
        if (empleado.nombre === "" || empleado.nombre === "----") {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Debe escoger un empleado' });
            empleadoref.current.focus()
            return false
        }
        return true
    }

    const Limpiar = () => {
        if (modo === "nuevo") {
            setDepartamento({
                codigo: '',
                codigoalternativo: '',
                nombre: ''
            })
            setEmpleado({
                codigo: '',
                codigoalternativo: '',
                nombre: ''
            })
        }
        if (modo === "editar") {
            setEmpleado({
                codigo: '',
                codigoalternativo: '',
                nombre: ''
            })
        }
    }
    const Grabar = () => {
        try {
            empezarCarga()
            if (!validarJefeDepartamento()) {
                return;
            }
            if (modo === "nuevo") {
                const datos = {
                    codigoDepartamento: departamento.codigoalternativo,
                    jefeDepartamento: empleado.codigo,
                    fechaIngreso: new Date(),
                    maquina: formulario.maquina,
                    usuario: formulario.usuario
                }
                serviciosJefeDepartamento.Grabar({ datos })
                    .then(res => {
                        if (res.data === 200) {
                            mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Jefe de Departamento guardado correctamente!' })
                            Volver()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        if (error.response.status === 401) {
                            navegacion(`${PATH_AUTH.login}`);
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Su inicio de sesión expiro' });
                        } else if (error.response.status === 500) {
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas con el servidor al grabar el empleado como jefe de departamento, si el problema persiste contácte con soporte' });
                        } else {
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Ocurrió un problema al grabar al empleado como Jefe de Departamento, intente nuevamente si el problema persiste contácte con soporte' });
                        }
                    })
            }
            if (modo === "editar") {
                const datos = {
                    codigo: idJefeDep,
                    codigoDepartamento: departamento.codigoalternativo,
                    jefeDepartamento: empleado.codigo,
                    fechaIngreso: new Date(),
                    maquina: formulario.maquina,
                    usuario: formulario.usuario
                }
                serviciosJefeDepartamento.Editar({ datos })
                    .then(res => {
                        if (res.data === 200) {
                            mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Jefe de Departamento editado correctamente!' })
                            Volver()
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        if (error.response.status === 401) {
                            navegacion(`${PATH_AUTH.login}`);
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Su inicio de sesión expiro' });
                        } else if (error.response.status === 500) {
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas con el servidor al editar el empleado, si el problema persiste contácte con soporte' });
                        } else {
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Ocurrió un problema al editar el empleado Jefe de Departamento, intente nuevamente si el problema persiste contácte con soporte' });
                        }
                    })
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            terminarCarga()
        }
    }
    const Volver = () => {
        navegacion(`/sistema/parametros/jefedepartamento`)
    }
    const Nuevo = () => {
        navegacion(`/sistema/parametros/formulariojefedepartamento`, { state: { modo: 'nuevo', id: 0 } })
    }
    const Editar = (e) => {
        setCodigoJefeDepartamento(e.row.codigo)
        // ObtenerDatosJefeDepartamento(e.row.codigo)
        navegacion(`/sistema/parametros/formulariojefedepartamento`, { state: { modo: 'editar', id: e.id } })
    }

    const Eliminar = () => {
        mensajeSistemaPregunta({
            mensaje: `Se dispone a eliminar el siguiente empleado del cargo de Jefe de Departamento, ¿Desea Continuar?`,
            ejecutarFuncion: () => {
                serviciosJefeDepartamento.Eliminar({ codigo: idJefeDep })
                    .then(res => {
                        if (res === 200) {
                            mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Proceso realizado con éxito!' })
                            Volver();
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        if (error.response.status === 401) {
                            navegacion(`${PATH_AUTH.login}`);
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Su inicio de sesión expiro' });
                        } else if (error.response.status === 500) {
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas con el servidor al remover el empleado, si el problema persiste contácte con soporte' });
                        } else {
                            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Ocurrió un problema al eliminar al empleado del cargo de Jefe de Departamento, intente nuevamente si el problema persiste contácte con soporte' });
                        }
                    })
            }
        })
    }

    const ObtenerDatosGenerales = async () => {
        try {
            empezarCarga()
            const ip = await obtenerMaquina()
            setFormulario({
                ...formulario,
                maquina: ip
            })
            if (modo === 'nuevo') {
                Promise.all([
                    serviciosJefeDepartamento.Listar(),
                    serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'ADM_DEPARTAMENTO' }),
                    serviciosEmpleados.Listar()
                ])
                    .then(res => {
                        const jefesDepartamentos = res[0].map((m) => ({
                            ...m,
                            id: m.codigo
                        }))
                        setRows(jefesDepartamentos)
                        setResultadoBusqueda(jefesDepartamentos)
                        const departamentos = res[1].map((m) => ({
                            ...m,
                            codigoalternativo: m.codigo
                        }))
                        setListaDepartamentos(departamentos)
                        const empleados = res[2].map((m) => ({
                            ...m,
                            codigoalternativo: m.codigo_Empleado,
                            nombre: m.nombres
                        }))
                        setListaEmpleados(empleados)
                    })
            } else if (modo === 'editar') {
                Promise.all([
                    serviciosJefeDepartamento.Listar(),
                    serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'ADM_DEPARTAMENTO' }),
                    serviciosEmpleados.Listar(),
                    serviciosJefeDepartamento.Buscar({ codigo: idJefeDep })
                ])
                    .then(res => {
                        const jefesDepartamentos = res[0].map((m) => ({
                            ...m,
                            id: m.codigo
                        }))
                        setRows(jefesDepartamentos)
                        setResultadoBusqueda(jefesDepartamentos)
                        const departamentos = res[1].map((m) => ({
                            ...m,
                            codigoalternativo: m.codigo
                        }))
                        setListaDepartamentos(departamentos)
                        const empleados = res[2].map((m) => ({
                            ...m,
                            codigoalternativo: m.codigo_Empleado,
                            nombre: m.nombres
                        }))
                        setListaEmpleados(empleados)
                        const datosJefeDep = res[3]
                        setDepartamento({
                            codigo: datosJefeDep.codigoDepartamento,
                            codigoalternativo: datosJefeDep.codigoDepartamento,
                            nombre: datosJefeDep.nombreDepartamento
                        })
                        setEmpleado({
                            codigo: datosJefeDep.jefeDepartamento,
                            codigoalternativo: datosJefeDep.codigoEmpleado,
                            nombre: datosJefeDep.nombreEmpleado
                        })
                    })
            } else {
                Promise.all([
                    serviciosJefeDepartamento.Listar(),
                    serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'ADM_DEPARTAMENTO' }),
                    serviciosEmpleados.Listar()
                ])
                    .then(res => {
                        const jefesDepartamentos = res[0].map((m) => ({
                            ...m,
                            id: m.codigo
                        }))
                        setRows(jefesDepartamentos)
                        setResultadoBusqueda(jefesDepartamentos)
                        const departamentos = res[1].map((m) => ({
                            ...m,
                            codigoalternativo: m.codigo
                        }))
                        setListaDepartamentos(departamentos)
                        const empleados = res[2].map((m) => ({
                            ...m,
                            codigoalternativo: m.codigo_Empleado,
                            nombre: m.nombres
                        }))
                        setListaEmpleados(empleados)
                    })
            }

        }
        catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Su inicio de sesion expiro' });
            } else if (error.response.status === 500) {
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas con el servidor al obtener los datos intente nuevamente, si el problema persiste contácte con soporte' });
            } else {
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al obtener los datos' });
            }
        }
        finally {
            terminarCarga()
        }
    }

    const filtrarEmpleados = () => {
        if (modo === "nuevo") {
            if (departamento.codigoalternativo !== "") {
                const empleadoFiltrado = listaEmpleados.filter(f => f.esJefeDepartamento === false)
                setListaEmpleados(empleadoFiltrado)
                console.log(rows)
                const departamentoconJefe = rows.filter(f => f.codigoDepartamento === departamento.codigoalternativo)
                if (departamentoconJefe.length !== 0) {
                    mensajeSistemaGenerico(
                        { tipo: 'warning', 
                          mensaje: `El departamento seleccionado ya cuenta con un jefe asignado: ${departamentoconJefe[0].codigoEmpleado} - ${departamentoconJefe[0].nombreEmpleado},
                                    si desea puede editar el jefe asignado o eliminar el registro para asignarle un nuevo jefe` 
                        })
                    setDepartamento({
                        codigo: '',
                        codigoalternativo: '',
                        nombre: ''
                    })
                }
            }
        } 
    }

    useEffect(() => {
        filtrarEmpleados()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departamento.codigoalternativo])

    useEffect(() => {
        ObtenerDatosGenerales()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <JefeDepartamentoContext.Provider
                value={{
                    usuario,
                    nombreOpcion,
                    columns,
                    rows,
                    Limpiar,
                    Grabar,
                    Nuevo,
                    Volver,
                    Eliminar,
                    buscar,
                    Buscar,
                    Editar,
                    modo,
                    listaEmpleados,
                    listaDepartamentos,
                    empleado,
                    empleadoref,
                    setEmpleado,
                    departamento,
                    departamentoref,
                    setDepartamento,
                    codigoJefeDepartamento,
                    setCodigoJefeDepartamento
                }}
            >
                {children}
            </JefeDepartamentoContext.Provider>
        </>
    )
}