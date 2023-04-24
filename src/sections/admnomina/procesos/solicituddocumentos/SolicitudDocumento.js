import React from 'react'
import Page from '../../../../components/Page';
import { SolicitudDocumentoProvider } from './context/solicitudDocumentoContext';
import Formulario from './components/formulario';


export default function SolicitudDocumentos() {
    return (
        <>
            <SolicitudDocumentoProvider>
                <Page title='Solicitud de Documentos'>
                    <Formulario />
                </Page>
            </SolicitudDocumentoProvider>
        </>
    )
}