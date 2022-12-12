import { memo } from 'react';
import { Fade, Box } from '@mui/material';
import PropTypes from 'prop-types';

Transicion.propTypes = {
  children: PropTypes.element.isRequired,
  estilos: PropTypes.object,
};

function Transicion(props) {
  const { children, estilos } = props;
  return (
    <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
      <Box sx={{ ml: 3, mr: 3, p: 1, ...estilos }}>{children}</Box>
      {/* {children} */}
    </Fade>
  );
}

export default memo(Transicion);
