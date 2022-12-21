// @KF-14/12/2022
import * as React from 'react';
import Page from '../../../../components/Page';
import { ContratoEmpleadosProvider } from './contextos/contratoEmpleadosContext';
import Formulario from './componentes/formulario';
import Cabecera from './componentes/cabecera';

export default function ContratoEmpleado() {
  return (
    <>
      <Page title="Contrato de Empleados">
        <ContratoEmpleadosProvider>
          <Cabecera />
          <Formulario />
        </ContratoEmpleadosProvider>
      </Page>
    </>
  );
}
