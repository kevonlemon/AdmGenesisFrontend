import React from 'react'
import Page from '../../../../components/Page';
import FormularioJefeDepartamento from './components/formularioJefeDepartamento'
import { JefeDepartamentoContextProvider } from './context/jefeDepartamentoContext';

export default function JefeDepartamentoFormulario() {

    return (
        <>
            <JefeDepartamentoContextProvider>
                <Page title="Jefe Departamento">
                    <FormularioJefeDepartamento/>
                </Page>
            </JefeDepartamentoContextProvider>
        </>
    )
}