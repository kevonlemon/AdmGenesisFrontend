import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router";
import { Button } from '@mui/material';
import useCargando from "../../../../../hooks/admnomina/useCargando";
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
    const navegacion = useNavigate()
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
    const [modo, setModo] = useState('')
    const usuario = JSON.parse(localStorage.getItem('usuario'))
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


    const Limpiar = () => 0
    const Grabar = () => 0
    const Nuevo = () => {
        navegacion(`/sistema/parametros/formulariojefedepartamento`)
    }

    const ObtenerDatos = async () => {
        try {
            empezarCarga()
            const ip = await obtenerMaquina()
            setFormulario({
                ...formulario,
                maquina: ip
            })
            Promise.all([
                serviciosJefeDepartamento.Listar(),
                serviciosMantenimientoGenerico.listarPorTabla({ tabla: 'ADM_DEPARTAMENTO' }),
                serviciosEmpleados.Listar()
            ])
            .then(res => {
                console.log(res)
                const jefesDepartamentos = res[0].map((m) => ({
                    ...m,
                    id: m.codigo
                }))
                setRows(jefesDepartamentos)
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
        catch (error) {
            console.log(error)
        }
        finally {
            terminarCarga()
        }
    }

    useEffect(() => {
        ObtenerDatos()
    }, [])

    return (
        <>
            <JefeDepartamentoContext.Provider
                value={{ 
                    columns,
                    rows,
                    Limpiar,
                    Grabar,
                    Nuevo,
                    buscar,
                    Buscar,
                    modo,
                    listaEmpleados,
                    listaDepartamentos,
                    empleado,
                    setEmpleado,
                    departamento,
                    setDepartamento
                }}
            >
                {children}
            </JefeDepartamentoContext.Provider>
        </>
    )
}