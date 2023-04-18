import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import axiosBirobid from '../../utils/admnomina/axiosBirobid';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;
      // const updateEvent = state.events.map((_event) => {
      //   if (_event.id === event.id) {
      //     return event;
      //   }
      //   return _event;
      // });
      state.isLoading = false;
      state.events = event;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = state.events.filter((event) => event.id !== eventId);
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = slice.actions;

// ----------------------------------------------------------------------

const pruebaJson = [
  {
    id: `0-24-2023-04-03`,
    codigo: 14,
    allDay: true,
    description: 'Pruebas de obtención de datos',
    start: `2023-04-03T05:00:00.000Z`,
    end: `2023-04-03T05:00:00.000Z`,
    textColor: "#00AB55",
    title: `06:00 - 17:00`,
    horaEntrada: '06:00:00',
    horaSalida: '17:00:00'
  },
  {
    id: `1-24-2023-04-04`,
    codigo: 14,
    allDay: true,
    description: 'Pruebas de obtención de datos',
    start: `2023-04-04T05:00:00.000Z`,
    end: `2023-04-04T05:00:00.000Z`,
    textColor: "#00AB55",
    title: `01:00 - 10:00`,
    horaEntrada: '01:00:00',
    horaSalida: '10:00:00'
  },
  {
    id: `2-24-2023-04-04`,
    codigo: 14,
    allDay: true,
    description: 'Pruebas de obtención de datos',
    start: `2023-04-04T05:00:00.000Z`,
    end: `2023-04-06T05:00:00.000Z`,
    textColor: "#00AB55",
    title: `17:00 - 02:00`,
    horaEntrada: '17:00:00',
    horaSalida: '02:00:00'
  },
  {
    id: `3-24-2023-04-05`,
    codigo: 14,
    allDay: true,
    description: 'Pruebas de obtención de datos',
    start: `2023-04-05T05:00:00.000Z`,
    end: `2023-04-05T05:00:00.000Z`,
    textColor: "#00AB55",
    title: `10:00 - 19:00`,
    horaEntrada: '10:00:00',
    horaSalida: '19:00:00'
  },
  {
    id: `4-24-2023-04-06`,
    codigo: 14,
    allDay: true,
    description: 'Pruebas de obtención de datos',
    start: `2023-04-06T05:00:00.000Z`,
    end: `2023-04-08T05:00:00.000Z`,
    textColor: "#00AB55",
    title: `03:00 - 12:00`,
    horaEntrada: '03:00:00',
    horaSalida: '12:00:00'
  }
]

export function getEvents(calendario, datos = {}) {
  return async () => {
    dispatch(slice.actions.startLoading());
    if (calendario === 'horarios') {
      console.log('datos a enviar', datos)
      try {
        const response = await axiosBirobid.get(`/controlhorarios/buscar?Empleado=${datos.codigoEmpleado}`);
        const { data } = response;
        console.log('data', data)
        const eventos = data.map((m, i) => ({
          id: `${i}-${m.empleado}-${m.fechaIniTrabajo.substring(0, 10)}`,
          codigo: m.codigo,
          allDay: true,
          description: 'Pruebas de obtención de datos',
          start: m.fechaIniTrabajo,
          end: `${m.fechaFinTrabajo}` !== `${m.fechaIniTrabajo}` ? m.fechaFinTrabajoCalendario : m.fechaFinTrabajo,
          textColor: "#00AB55",
          title: `${m.horaDesde.substring(0, 5)} - ${m.horaHasta.substring(0, 5)}`,
          fechaEntrada: m.fechaIniTrabajo,
          horaEntrada: m.horaDesde,
          fechaSalida: m.fechaFinTrabajo,
          horaSalida: m.horaHasta
        }))
        console.log('eventos', eventos)
        dispatch(slice.actions.getEventsSuccess(eventos));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    }
    if (calendario === 'plantilla') {
      try {
        const response = await axios.get('/api/calendar/events');
        dispatch(slice.actions.getEventsSuccess(response.data.events));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent, calendario = 'plantilla') {
  if (calendario === 'plantilla') {
    return async () => {
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.post('/api/calendar/events/new', newEvent);
        dispatch(slice.actions.createEventSuccess(response.data.event));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    };
  }
  if (calendario === 'horarios') {
    return async () => {
      dispatch(slice.actions.startLoading());
      try {
        const response = await axiosBirobid.post('/controlhorarios', newEvent)
        console.log('respuesta', response)
        dispatch(slice.actions.createEventSuccess(newEvent));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    }
  }
  return null;
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent, calendario = 'plantilla') {
  if (calendario === 'plantilla') {
    return async () => {
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.post('/api/calendar/events/update', {
          eventId,
          updateEvent,
        });
        dispatch(slice.actions.updateEventSuccess(response.data.event));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    };
  }
  if (calendario === 'horarios') {
    return () => {
      dispatch(slice.actions.startLoading());
      try {
        console.log('updatEven', updateEvent)
        dispatch(slice.actions.updateEventSuccess(updateEvent))
        // state.events = updateEvent;
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    }
  }
  return null;
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime(),
      })
    );
  };
}
