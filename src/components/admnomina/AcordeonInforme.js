import { memo } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { estilosacordeon } from '../../utils/admnomina/estilos/estilos';

AcordeonInforme.prototype = {
    children : PropTypes.node,
    titulo: PropTypes.string
}

function AcordeonInforme(props) {
    // eslint-disable-next-line react/prop-types
    const { children, titulo } = props;
    return (
        <Accordion defaultExpanded>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                sx={estilosacordeon}
            >
                <Typography sx={{ fontWeight: 'bold' }}>{titulo}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

export default memo(AcordeonInforme);