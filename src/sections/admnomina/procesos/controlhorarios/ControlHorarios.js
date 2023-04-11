import React from 'react'
import Page from '../../../../components/Page';
import { FormularioContextProvider } from './context/formularioContext'
import Formulario from './components/formulario';
import Calendario from './components/calendario';
import Calendar from '../../../../pages/dashboard/Calendar'


export default function ControlHorarios() {
  return (
    <>
        <FormularioContextProvider>
            <Page title='Control de Horarios'>
                <Formulario />
                <Calendario />
            </Page>
        </FormularioContextProvider>
        {/* <Calendar/> */}
    </>
  )
}
