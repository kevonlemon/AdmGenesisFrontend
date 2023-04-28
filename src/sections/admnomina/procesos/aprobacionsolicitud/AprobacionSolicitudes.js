import React from 'react'
import { Box } from '@mui/material';
import Page from '../../../../components/Page';
import { AprobacionSolicitudProvider } from './context/aprobacionSolicitudContext';
import Formulario from './components/formulario';
import Tabla from './components/tabla';


export default function AprobacionSolicitudes() {
    return (
        <>
            <AprobacionSolicitudProvider>
                <Page title='Aprobación de Solicitud'>
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <Formulario />
                        <Tabla />
                    </Box>
                </Page>
            </AprobacionSolicitudProvider>
        </>
    )
}
