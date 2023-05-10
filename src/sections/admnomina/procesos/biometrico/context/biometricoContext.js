import { createContext, useEffect, useState } from "react";
import * as xlsx from 'xlsx';
import useCargando from "../../../../../hooks/admnomina/useCargando";
import { obtenerMaquina } from "../../../../../utils/admnomina/funciones/funciones";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import servicesBiometrico from '../services/BiometricoServices';

export const BiometricoContext = createContext()

export const BiometricoProvider = ({ children }) => {
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico } = useMensajeGeneral()

    const sucursalLocal = window.localStorage.getItem('sucursal');
    const usuarioLocal = JSON.parse(window.localStorage.getItem('usuario'));
    const sucursalLogeada = sucursalLocal === null ? 0 : parseFloat(sucursalLocal);
    const usuarioLogeado = usuarioLocal === null ? 0 : usuarioLocal.codigo;
    const [ip, setIp] = useState('');

    const columnas = [
        { field: 'idBiometrico', headerName: 'Id Biométrico', width: 120 },
        { field: 'nombre', headerName: 'Nombre', width: 320 },
        { field: 'departamento', headerName: 'Departamento', width: 250 },
        { field: 'fecha', headerName: 'Fecha', headerAlign: 'center', align: 'center', width: 110 },
        { field: 'hora', headerName: 'Hora', headerAlign: 'center', width: 180 }
    ]

    const [datosExcel, setDatosExcel] = useState([])

    const CargarExcel = (e) => {
        setDatosExcel([])
        e.preventDefault();
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet);
                if (
                    worksheet.A1.v !== 'IdBiometrico' ||
                    worksheet.C1.v !== 'Departamento' ||
                    worksheet.D1.v !== 'Fecha' ||
                    worksheet.E1.v !== 'Hora'
                ) {
                    mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Revise la estrucura del documento' });
                    return;
                }
                const datosGrid = json.map((m, i) => ({
                    id: i,
                    idBiometrico: m.IdBiometrico,
                    nombre: m.Nombre,
                    departamento: m.Departamento,
                    fecha: m.Fecha,
                    hora: m.Hora === null ? '' : m.Hora
                }))
                setDatosExcel(datosGrid)
            }
            reader.readAsArrayBuffer(e.target.files[0]);
        }
        e.target.value = null;
    }
    console.log('data excel', datosExcel)
    const Grabar = () => {
        if (datosExcel.length === 0) {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Cargue el documento primero por favor' });
            return
        }
        empezarCarga();
        const datos = datosExcel.map((m) => {
            const fechaString = m.fecha;
            const partes = fechaString.split('/');
            const fechaConvertida = new Date(partes[2], partes[1] - 1, partes[0]);
            return {
                idBiometrico: m.idBiometrico,
                nombre: m.nombre,
                departamento: m.departamento,
                fecha: fechaConvertida,
                hora: m.hora === undefined ? '' : m.hora
            }
        }).filter(f => f.hora !== "")
        const form = {
            datos,
            fechaIng: new Date(),
            maquina: ip,
            usuario: usuarioLogeado
        }
        console.log('tosend', form)
        servicesBiometrico.Grabar({ form })
            .then(res => {
                console.log('respuesta',res)
                console.log('104',  res.data.a.filter(f => f.idBiometrico === '104'))
                console.log('106',  res.data.a.filter(f => f.idBiometrico === '106'))
                console.log('107',  res.data.a.filter(f => f.idBiometrico === '107'))
                console.log('108',  res.data.a.filter(f => f.idBiometrico === '108'))
                console.log('109',  res.data.a.filter(f => f.idBiometrico === '109'))
                console.log('110',  res.data.a.filter(f => f.idBiometrico === '110'))
                console.log('200',  res.data.a.filter(f => f.idBiometrico === '200'))
                console.log('201',  res.data.a.filter(f => f.idBiometrico === '201'))
                console.log('202',  res.data.a.filter(f => f.idBiometrico === '202'))
                console.log('203',  res.data.a.filter(f => f.idBiometrico === '203'))
                console.log('204',  res.data.a.filter(f => f.idBiometrico === '204'))
                console.log('205',  res.data.a.filter(f => f.idBiometrico === '205'))
                console.log('210',  res.data.a.filter(f => f.idBiometrico === '210'))
                console.log('212',  res.data.a.filter(f => f.idBiometrico === '212'))
                console.log('213',  res.data.a.filter(f => f.idBiometrico === '213'))
                console.log('217',  res.data.a.filter(f => f.idBiometrico === '217'))
                console.log('218',  res.data.a.filter(f => f.idBiometrico === '218'))
                console.log('302',  res.data.a.filter(f => f.idBiometrico === '302'))
                console.log('306',  res.data.a.filter(f => f.idBiometrico === '306'))
                console.log('307',  res.data.a.filter(f => f.idBiometrico === '307'))
                console.log('309',  res.data.a.filter(f => f.idBiometrico === '309'))
                console.log('312',  res.data.a.filter(f => f.idBiometrico === '312'))
                console.log('314',  res.data.a.filter(f => f.idBiometrico === '314'))
                console.log('315',  res.data.a.filter(f => f.idBiometrico === '315'))
                console.log('317',  res.data.a.filter(f => f.idBiometrico === '317'))
                console.log('318',  res.data.a.filter(f => f.idBiometrico === '318'))
                console.log('320',  res.data.a.filter(f => f.idBiometrico === '320'))
                console.log('403',  res.data.a.filter(f => f.idBiometrico === '403'))
                console.log('406',  res.data.a.filter(f => f.idBiometrico === '406'))
                console.log('409',  res.data.a.filter(f => f.idBiometrico === '409'))
                console.log('410',  res.data.a.filter(f => f.idBiometrico === '410'))
                console.log('414',  res.data.a.filter(f => f.idBiometrico === '414'))
                console.log('416',  res.data.a.filter(f => f.idBiometrico === '416'))
                console.log('418',  res.data.a.filter(f => f.idBiometrico === '418'))
                console.log('500',  res.data.a.filter(f => f.idBiometrico === '500'))
                mensajeSistemaGenerico({ tipo: 'success', mensaje: 'Datos Guardados con éxito' });
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Error al grabar datos, intente nuevamente, si el problema persiste contácte a soporte' });
            })
            .finally(
                terminarCarga()
            )
    }

    async function ObtenerDatos() {
        try {
            empezarCarga()
            const maquina = await obtenerMaquina();
            setIp(maquina);
        }
        catch (error) {
            console.log(error)
            mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Error al cargar datos, intente nuevamente recargando la página, si el problema persiste contácte a soporte' });
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
        <BiometricoContext.Provider
            value={{
                sucursalLogeada, usuarioLogeado, ip,
                columnas,
                datosExcel, setDatosExcel,
                CargarExcel,
                Grabar
                
            }}
        >
            {children}
        </BiometricoContext.Provider>
    )
}
