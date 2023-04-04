import React from 'react'
import Page from '../../../../components/Page';
import TablaJefeDepartamento from './components/tablaJefeDepartamento';
import { JefeDepartamentoContextProvider } from './context/jefeDepartamentoContext';

export default function JefeDepartamento() {

    return (
        <>
            <JefeDepartamentoContextProvider>
                <Page title="Jefe Departamento">
                    <TablaJefeDepartamento/>
                </Page>
            </JefeDepartamentoContextProvider>
        </>
    )
}