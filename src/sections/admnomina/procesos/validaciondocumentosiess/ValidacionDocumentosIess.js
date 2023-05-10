import React from 'react'
import { Box } from '@mui/material';
import Page from '../../../../components/Page';
import Formulario from './components/formulario';
import Tabla from './components/tabla';
import SubidaDocumentos from './components/subidaDocumentos';
import { ValidacionDocumentosIessProvider } from './context/validacionDocsIessContext';


export default function ValidacionDocumentosIess() {
    return (
        <>
            <ValidacionDocumentosIessProvider>
                <Page title='Validación Documentos IESS'>
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <Formulario />
                        <Tabla />
                        <SubidaDocumentos />
                    </Box>
                </Page>
            </ValidacionDocumentosIessProvider>
        </>
    )
}