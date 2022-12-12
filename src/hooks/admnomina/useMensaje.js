import { useSnackbar } from 'notistack';

export default function useMensaje() {
  const { enqueueSnackbar } = useSnackbar();
  /**
   * Mensaje del sistema
   * @param {{ texto: string, variante: string, posicion:object, masOpciones: object }}
   */
  const mensajeSistema = ({ texto, variante, posicion, masOpciones }) => {
    const configuracion = {
      variant: variante.trim().length !== 0 ? variante : 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
        ...posicion,
      },
      ...masOpciones,
    };
    enqueueSnackbar(texto, configuracion);
  };
  return {
    mensajeSistema,
  };
}
