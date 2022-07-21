import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../config';
import { ordenarListaJson } from '../../../utils/sistema/funciones';

// import LoginContext from '../../../contexts/LoginContext';
// import { Mensajesistema } from '../../../components/Mensajesistema';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { enqueueSnackbar } = useSnackbar();
  const navegacion = useNavigate();
  // const [logincontext, setLoginContext] = useState({
  //   usuario: 'hola desde login',
  //   nombreusuario: 'hola'
  // });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formulario, setFormulario] = useState({
    user: '',
    password: ''
  });
  const mensajeSistema = (mensaje, variante) => {
    enqueueSnackbar(mensaje,
      {
        variant: variante,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      }
    )
  }

  const onLogin = async () => {
    try {
      // validaciones
      const noesvacio = formulario.user.trim().length > 0 && formulario.password.trim().length > 0;
      if (noesvacio) {
        const form = {
          usuario: formulario.user,
          password: formulario.password
        }
        // console.log(form)
        const { data } = await axios.post(`${URLAPIGENERAL}/login/authenticate`, form, setLoading(true));
        const config = {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        }
        const opciones = await axios.get(`${URLAPIGENERAL}/accesos/listarxoperador?operador=${data.codigo}`, config);


        if (opciones.data.length === 0) {
          mensajeSistema("No tiene accesso al sistema", "error");
          return;
        }
        // console.log("mira esto por fa",opciones.data);
        const opordenadas = ordenarListaJson(opciones.data, 'menu', 'asc');
        const listafinal = opordenadas.filter(m => m.menu !== null )
        // almacenamiento al localstorage
        window.localStorage.setItem('usuario', JSON.stringify(data));
        window.localStorage.setItem('opciones', JSON.stringify({ opciones: listafinal }));
        // contexto
        // setLoginContext({
        //   usuario: data.codigo_Usuario,
        //   nombreusuario: data.nombreCompleto
        // })
        
        // console.log(` MIRAAA /sistema/${listafinal[0].menu}${listafinal[0].url}`);
        navegacion(`/sistema/${listafinal[0].menu}${listafinal[0].url}`.toLocaleLowerCase());


      } else {
        setError(true);
        mensajeSistema("Complete los campos requeridos", "error");
      }
    } catch (error) {
      mensajeSistema("Usuario o contraseña incorrecta", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <LoginContext.Provider value={logincontext}> */}
      <Stack spacing={3}>
        <TextField
          error={error}
          label="Usuario*"
          fullWidth
          value={formulario.user}
          onChange={(e) => {
            setFormulario({
              ...formulario,
              user: e.target.value
            })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRoundedIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          error={error}
          label="Contraseña*"
          type="password"
          fullWidth
          value={formulario.password}
          onChange={(e) => {
            setFormulario({
              ...formulario,
              password: e.target.value
            })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyRoundedIcon />
              </InputAdornment>
            )
          }}

        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/*  */}
      </Stack>
      <LoadingButton fullWidth size="large" onClick={() => onLogin()} variant="contained" loading={loading} loadingIndicator="Accediendo...">
        Acceder
      </LoadingButton>
      {/* </LoginContext.Provider> */}
    </>
  );
}
