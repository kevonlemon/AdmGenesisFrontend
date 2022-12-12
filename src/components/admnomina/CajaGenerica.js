import * as React from 'react';
import PropTypes from 'prop-types';
import { Grid, InputAdornment } from '@mui/material';
import ModalGenerico from './ModalGenerico';
import DisableTextField from './DisabledTextField';
import RequiredTextField from './RequiredTextField';
import { BotonIconBuscar } from './Botones';
// import { buscarClientesEnLinea } from '../../services/clientes_cuentas_por_cobrar/clienteServices';
// import { buscarProductosEnLinea } from '../../services/inventario_kardex/productoServices';
// import { buscarProveedorEnLinea } from '../../services/proveedores_cuentas_por_cobrar/proveedorServices';
import useMensaje from '../../hooks/admnomina/useMensaje';

CajaGenerica.propTypes = {
  estadoInicial: PropTypes.object.isRequired, // codigoAlternativo y nombre,
  tituloTexto: PropTypes.object.isRequired, // nombre y descripcion ,
  busquedaEnLinea: PropTypes.bool, // activa la busqueda en linea
  tipobusquedaEnLinea: PropTypes.string, // 'cliente' || 'producto' || 'proveedor'
  tituloModal: PropTypes.string.isRequired, // nombre del modal
  retornarDatos: PropTypes.func.isRequired, // retorna los datos del modal al momento de seleccionar
  datos: PropTypes.array.isRequired, // datos que van a llenar la tabla,
  desactivarBusqueda: PropTypes.bool, // desactiva la opcion de buscar
  ejecutarDependencia: PropTypes.func,
  activarDependencia: PropTypes.bool,
  camposAdicionales: PropTypes.array,
  activarCamposAdicionales: PropTypes.bool,
};

function CajaGenerica(props) {
  const {
    estadoInicial,
    tituloTexto,
    busquedaEnLinea,
    tipobusquedaEnLinea,
    tituloModal,
    retornarDatos,
    desactivarBusqueda,
    datos,
    ejecutarDependencia,
    activarDependencia,
    // eslint-disable-next-line react/prop-types
    inputRef,
    camposAdicionales,
    activarCamposAdicionales
  } = props;

  const { mensajeSistema } = useMensaje();

  const [formulario, setFormulario] = React.useState(estadoInicial);

  const [abrirModalGenerico, setAbrilModalGenerico] = React.useState(false);
  const cerrarModalGenerico = () => setAbrilModalGenerico((p) => !p);
  const retornarDatosGenerico = (e) => {
    const item = e.row;
    // console.log(item);
    // setFormulario({
    //     codigoAlternativo: item.codigoalternativo,
    //     codigo: item.codigo,
    //     nombre: item.nombre
    // })
    retornarDatos(item);
    cerrarModalGenerico();
  };
  const retonarMensaje = () => {
    mensajeSistema({ texto: 'No existe el registro con el criterio indicado', variante: 'warning' });
    setFormulario({
      codigoAlternativo: datos[0].codigoalternativo,
      nombre: datos[0].nombre,
    });
    setAbrilModalGenerico(true);
    retornarDatos(datos[0]);
  };
  const buscarPorCodigo = () => {
    const esBusqueda = String(formulario.codigoAlternativo).trim().length === 0;
    if (busquedaEnLinea) {
      // if (!esBusqueda) {
      //   Promise.all([
      //     buscarClientesEnLinea({ cliente: String(formulario.codigoAlternativo).trim() }),
      //     buscarProductosEnLinea({ producto: String(formulario.codigoAlternativo).trim() }),
      //     buscarProveedorEnLinea({ proveedor: String(formulario.codigoAlternativo).trim() }),
      //   ]).then((res) => {
      //     /**
      //      * @type {Array<object>}
      //      */
      //     let filtro;
      //     if (tipobusquedaEnLinea === 'cliente')
      //       filtro = res[0].map((m) => ({ ...m, codigoalternativo: m.codigo_Cliente, nombre: m.razon_Social }));
      //     if (tipobusquedaEnLinea === 'producto')
      //       filtro = res[1].map((m) => ({ ...m, codigoalternativo: m.codigo_Producto }));
      //     if (tipobusquedaEnLinea === 'proveedor')
      //       filtro = res[2].map((m) => ({ ...m, codigoalternativo: m.codigo_Proveedor }));
      //     //   const esEncontrado = filtro.filter(
      //     //     (f) => String(f.codigoalternativo).trim() === String(formulario.codigoAlternativo).trim()
      //     //   );
      //     if (filtro.length === 0) {
      //       retonarMensaje();
      //       return;
      //     }
      //     retornarDatos(filtro[0]);
      //     setFormulario({
      //       codigoAlternativo: filtro[0].codigoalternativo,
      //       nombre: filtro[0].nombre,
      //     });
      //   });
      // } else {
      //   setAbrilModalGenerico(true);
      //   // setFormulario({
      //   //     codigoAlternativo: datos[0].codigoalternativo,
      //   //     nombre: datos[0].nombre
      //   // })
      //   // retornarDatos(datos[0]);
      // }
      // return;
    }
    if (!esBusqueda) {
      const resultado = datos.filter(
        (f) => String(f.codigoalternativo).trim() === String(formulario.codigoAlternativo).trim()
      );
      if (resultado.length === 0) {
        retonarMensaje();
        return;
      }
      setFormulario({
        ...formulario,
        nombre: resultado[0].nombre,
      });
      retornarDatos(resultado[0]);
    } else {
      setAbrilModalGenerico(true);
      // setFormulario({
      //     codigoAlternativo: datos[0].codigoalternativo,
      //     nombre: datos[0].nombre
      // })
      // retornarDatos(datos[0]);
    }
  };
  // const Buscarconenter = (e) => {
  //     const enter = e.keyCode;
  //     if (enter === 13) {
  //         buscarPorCodigo();
  //     }
  // };
  // window.onkeydown = Buscarconenter;

  React.useEffect(() => {
    setFormulario(estadoInicial);
  }, [estadoInicial]);
  return (
    <>
      <ModalGenerico
        busquedaEnLinea={busquedaEnLinea}
        tipobusquedaEnLinea={tipobusquedaEnLinea}
        nombre={tituloModal}
        abrirModal={abrirModalGenerico}
        retornarDatos={retornarDatosGenerico}
        cerrarModal={cerrarModalGenerico}
        datos={datos}
        camposAdicionales={camposAdicionales}
        activarCamposAdicionales={activarCamposAdicionales}
      />
      <Grid container item xs={12} spacing={1}>
        <Grid item md={4} sm={4} xs={12}>
          <RequiredTextField
            inputRef={inputRef}
            fullWidth
            size="small"
            disabled={desactivarBusqueda}
            label={`${tituloTexto.nombre}`}
            required
            value={formulario.codigoAlternativo}
            onChange={(e) => {
              if (activarDependencia) {
                ejecutarDependencia(e);
              }
              setFormulario({
                ...formulario,
                codigoAlternativo: e.target.value.toUpperCase(),
                nombre: '----',
              });
              //   estadoInicial.nombre = '----';
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {
                    <BotonIconBuscar
                      propiedades={{
                        disabled: desactivarBusqueda || datos.length === 0,
                        onClick: () => {
                          buscarPorCodigo();
                        },
                      }}
                    />
                  }
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item md={8} sm={8} xs={12}>
          <DisableTextField disabled fullWidth size="small" label={tituloTexto.descripcion} value={formulario.nombre} />
        </Grid>
      </Grid>
    </>
  );
}

export default React.memo(CajaGenerica);
