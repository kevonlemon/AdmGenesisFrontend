import { createContext, useEffect, useState } from "react";
import * as xlsx from 'xlsx';
import useCargando from "../../../../../hooks/admnomina/useCargando";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';

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
        { field: 'idBiometrico', headerName: 'AC - No.', width: 120 },
        { field: 'nombre', headerName: 'Nombre', width: 320 },
        { field: 'departamento', headerName: 'Departamento', width: 250 },
        { field: 'fecha', headerName: 'Fecha', headerAlign: 'center', width: 130 },
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
                console.log('data excel',data)
                const workBook = xlsx.read(data, { type: 'array' });
                
            }
            console.log("🚀 ~ file: biometricoContext.js:33 ~ CargarExcel ~ reader:", reader)
        }
        // e.target.value = null;
    }

    return (
        <BiometricoContext.Provider
            value={{ 
                sucursalLogeada, usuarioLogeado, ip,
                columnas,
                datosExcel, setDatosExcel,
                CargarExcel
            }}
        >
            {children}
        </BiometricoContext.Provider>
    )
}