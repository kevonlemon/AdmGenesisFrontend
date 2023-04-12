import { createSlice } from '@reduxjs/toolkit';
import serviciosControlHorario from '../../../services/servicesControlHorarios';
import { dispatch } from '../storeCalendario';

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
        // empezar carga
        startLoading(state) {
            state.isLoading = true;
        },
        // en caso de error
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        // obtener eventos (dias de horario)
        getEventSuccess(state, action) {
            state.isLoading = false;
            state.events = action.payload;
        },
        // crear eventos (asignar un nuevo horario)
        createEventSuccess(state, action) {
            const newEvent = action.payload;
            state.isLoading = false;
            state.events = [...state.events, newEvent];
        },
        // actualizar eventos (modificar un horario)
        updateEventSuccess(state, action) {
            const event = action.payload;
            const updateEvent = state.events.map((m) => {
                if (m.id === event.id) {
                    return event;
                }
                return event;
            })
            state.isLoading = false;
            state.events = updateEvent;
        },
        // eliminar eventos (eliminar un horario)
        deleteEventSuccess(state, action) {
            const { eventId } = action.payload;
            const deleteEvent = state.events.filter((f) => f.id !== eventId);
            state.events = deleteEvent;
        },
        // seleccionar eventos (seleccionar un horario)
        selectEvent(state, action) {
            const eventId = action.payload;
            state.isOpenModal = true;
            state.selectedEventId = eventId;
        },
        // seleccionar rango (seleccionar un rango de dias de horario)
        selectRange(state, action) {
            const { start, end } = action.payload;
            state.isOpenModal = true;
            state.selectedRange = { start, end };
        },
        // abrir modal (modal con un formulario donde se registrará un nuevo horario o se modificará uno ya existente)
        openModal(state) {
            state.isOpenModal = true;
        },
        // cerrar modal (no hace falta explicarlo ya sabes que hace)
        closeModal(state) {
            state.isOpenModal = false;
            state.selectedEventId = null;
            state.selectedRange = null;
        }
    }
})

// Reducer
export default slice.reducer;

// Acciones
export const { openModal, closeModal, selectEvent } = slice.actions;

// -------------------------------------- FUNCIONES CRUD PARA EL CALENDARIO -------------------------------------------------------------
// obtiene toda la lista de horarios 
export function getEvents() {
    return async () => {
        dispatch(slice.actions.startLoading());
        serviciosControlHorario.Listar()
            .then((res) => {
                console.log('lista horarios?', res)
                
                dispatch(slice.actions.getEventSuccess(res.data))
            })
            .catch((error) => {
                dispatch(slice.actions.hasError(error))
            })
    }
}

// buscar el horario del empleado indicado
export function getEventsSpecific(empleado) {
    return async () => {
        dispatch(slice.actions.startLoading());
        serviciosControlHorario.Buscar({ empleado })
            .then((res) => {
                console.log('busca horarios?', res)
                dispatch(slice.actions.getEventSuccess(res.data))
            })
            .catch((error) => {
                dispatch(slice.actions.hasError(error))
            })
    }
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
    return async () => {
      dispatch(slice.actions.startLoading());
      try {
        // const response = await axios.post('/api/calendar/events/new', newEvent);
        // dispatch(slice.actions.createEventSuccess(response.data.event));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    };
  }
  
  // ----------------------------------------------------------------------
  
  export function updateEvent(eventId, updateEvent) {
    return async () => {
      dispatch(slice.actions.startLoading());
      try {
        // const response = await axios.post('/api/calendar/events/update', {
        //   eventId,
        //   updateEvent,
        // });
        // dispatch(slice.actions.updateEventSuccess(response.data.event));
      } catch (error) {
        dispatch(slice.actions.hasError(error));
      }
    };
  }
  
  // ----------------------------------------------------------------------
  
  export function deleteEvent(eventId) {
    return async () => {
      dispatch(slice.actions.startLoading());
      try {
        // await axios.post('/api/calendar/events/delete', { eventId });
        // dispatch(slice.actions.deleteEventSuccess({ eventId }));
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