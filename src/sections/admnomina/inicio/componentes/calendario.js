import * as React from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  Box,
  TextField,
  MenuItem,
  Grid,
  Fade,
  Modal,
  Typography,
  Button,
  Stack,
  CardContent,
} from '@mui/material';
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import listPlugin from '@fullcalendar/list'; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { StyleWrapper } from '../../../../components/admnomina/StyleWrapperCalendar';
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';

function Calendario() {
  const [events, setEvents] = useState([]);
  const handleDateClick = (arg) => {
    // bind with an arrow function
    console.log(arg.dateStr);
  };
  return (
    <>
      <StyleWrapper>
        <Box sx={{ mb: 1, mt: 1 }}>
          <Card sx={{ pt: 4, pb: 0, overflow: 'hidden' }}>
            <FullCalendar
              locale={esLocale}
              editable
              selectable
              events={[{ title: 'Meeting', start: new Date(), color : 'blue' }]}
              headerToolbar={{
                start: 'today prev next',
                center: 'title',
                end: 'dayGridMonth dayGridWeek dayGridDay listWeek',
              }}
              plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
              views={['dayGridMonth', 'dayGridWeek', 'dayGridDay', 'listWeek']}
              dateClick={handleDateClick}
              eventContent={renderEventContent}
              // eventClick={handleEventClick}
            />
          </Card>
        </Box>
      </StyleWrapper>
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function handleEventClick(clickInfo) {
  const stylemodal = {
    borderRadius: '1rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '60%', sm: '60%', md: '60%', lg: '45%' },
    height: 'auto',
    padding: '50px',
    bgcolor: 'background.paper',
    boxShadow: 24,
  };
  // HOOK MODAL CONFIRMACION
  /* const [anular, setAnular] = React.UseState(false);
  const toggleShowanular = () => {
    setAnular((p) => !p);
  }; 
  const handleCallbackChilanular = () => {
    toggleShowanular();
  }; */
  return (
    <>
      <Modal
        open
        // onClose={toggleShowanular}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
      >
        <Fade>
          <Box sx={stylemodal}>
            <Grid>
              <TextField size="small" fullWidth label="Titulo" value={clickInfo.event.title} />
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default React.memo(Calendario);
