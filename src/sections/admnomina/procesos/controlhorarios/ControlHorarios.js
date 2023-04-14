import React from 'react'
import Page from '../../../../components/Page';
import { FormularioContextProvider } from './context/formularioContext';
import { CalendarioContextProvider } from './context/calendarioContext';
import Formulario from './components/formulario';
import Calendario from './components/calendario';


export default function ControlHorarios() {
  return (
    <>
      <FormularioContextProvider>
        <CalendarioContextProvider>
          <Page title='Control de Horarios'>
            <Formulario />
            <Calendario />
          </Page>
        </CalendarioContextProvider>
      </FormularioContextProvider>
    </>
  )
}
