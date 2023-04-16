import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useContext } from 'react';
import { Card, Button, Container, DialogTitle } from '@mui/material';
import { DialogAnimate } from '../../../../../../components/animate';
import CalendarFormGenesis from './CalendarFormGenesis';
import CalendarStyleGenesis from './CalendarStyleGenesis';
import CalendarToolbarGenesis from './CalendarToolbarGenesis';
import { CalendarioContext } from '../../context/calendarioContext'

export default function CalendarGenesis() {

  const {
    themeStretch, view, isDesktop,
    fecha, selectedEvent, events, isOpenModal, selectedRange, calendarRef,
    handleClickToday, handleChangeView, handleClickDatePrev, handleClickDateNext, handleSelectRange,
    handleSelectEvent, handleResizeEvent, handleDropEvent, handleAddEvent, handleCloseModal
  } = useContext(CalendarioContext)


//   const events = {}


  return (
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <CalendarStyleGenesis>
            <CalendarToolbarGenesis
              date={fecha}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              locales={[esLocale]}
              weekends
              editable
              droppable
              selectable
              events={events}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={fecha}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventResizableFromStart
              select={handleSelectRange}
              dateClick={(e) => console.log(e)}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isDesktop ? 720 : 'auto'}
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            />
          </CalendarStyleGenesis>
        </Card>

        {/* <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent ? 'Editar Horario' : 'Agregar Horario'}</DialogTitle> */}

          <CalendarFormGenesis event={selectedEvent || {}} range={selectedRange} onCancel={handleCloseModal} />
        {/* </DialogAnimate> */}
      </Container>
  );
}
