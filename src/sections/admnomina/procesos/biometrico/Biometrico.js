import React from 'react'
import Page from '../../../../components/Page';
import { BiometricoProvider } from './context/biometricoContext';
import Formulario from './components/formulario';

export default function Biometrico() {
    return (
        <>
            <BiometricoProvider>
                <Page title='Biométrico'>
                    <Formulario />
                </Page>
            </BiometricoProvider>
        </>
    )
}