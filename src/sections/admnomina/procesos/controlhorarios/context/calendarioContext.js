import { createContext, useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from '../../../../../redux/store';
import { getEvents, openModal, closeModal, updateEvent, selectEvent, selectRange } from '../../../../../redux/slices/calendar';
import useSettings from '../../../../../hooks/useSettings';
import useResponsive from '../../../../../hooks/useResponsive';
import useCargando from "../../../../../hooks/admnomina/useCargando";
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import { FormularioContext } from "./formularioContext"

export const CalendarioContext = createContext();

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export const CalendarioContextProvider = ({ children }) => {
    const { empleado } = useContext(FormularioContext);
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico, mensajeSistemaPregunta } = useMensajeGeneral()

    // función para la selección de eventos (horario del dia)
    const selectedEventSelector = (state) => {
        const { events, selectedEventId } = state.calendar;
        if (selectedEventId) {
            return events.find((_event) => _event.id === selectedEventId);
        }
        return null;
    };

    // disenio del calendario
    const { themeStretch } = useSettings();
    const isDesktop = useResponsive('up', 'sm');
    const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

    // variables(estados) y funciones del redux para el funcionamiento del calendario
    const dispatch = useDispatch();
    const calendarRef = useRef(null);
    const [fecha, setFecha] = useState(new Date());
    const selectedEvent = useSelector(selectedEventSelector);
    const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);


    // funciones del calendario ------------------------------------------------------------------------------
    // regresa el calendario al día actual
    const handleClickToday = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.today();
            setFecha(calendarApi.getDate());
        }
    };
    // cambia la relación de aspecto del toolbar del calendario
    const handleChangeView = (newView) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.changeView(newView);
            setView(newView);
        }
    };
    // retrocede al mes anterior
    const handleClickDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.prev();
            setFecha(calendarApi.getDate());
        }
    };
    // avanza al mes siguiente
    const handleClickDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.next();
            setFecha(calendarApi.getDate());
        }
    };
    // selecciona un rango de fechas en el calendario
    const handleSelectRange = (arg) => {
        console.log('arg', arg)
        if (empleado.nombre === '') {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Para agregar un horario debe seleccionar el empleado al que se va a asignar el horario primero' });
            return
        }
        const fechaSeleccionada = arg.startStr
        const existeYahorario = events.filter(f => f.start.substring(0, 10) === fechaSeleccionada)
        if (existeYahorario.length !== 0) {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Ya existe un horario en la fecha seleccionada' });
            return
        }
        console.log('existe?', existeYahorario)
        const calendarEl = calendarRef.current;
        console.log('calendaref', calendarEl)
        console.log('events', events)
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.unselect();
        }
        dispatch(selectRange(arg.start, arg.end));
    };
    // selecciona un evento (horario) en el calendario
    const handleSelectEvent = (arg) => {
        dispatch(selectEvent(arg.event.id));
    };
    // ?
    const handleResizeEvent = async ({ event }) => {
        try {
            dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                })
            );
        } catch (error) {
            console.error(error);
        }
    };
    // ?
    const handleDropEvent = async ({ event }) => {
        try {
            dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                })
            );
        } catch (error) {
            console.error(error);
        }
    };
    // abre un modal para agg un nuevo evento (horario)
    const handleAddEvent = () => {
        dispatch(openModal());
    };
    // cierra el modal
    const handleCloseModal = () => {
        dispatch(closeModal());
    };

    // obtiene el horario cada vez que se cambia de empleado
    useEffect(() => {
        if (empleado.nombre !== '') {
            const calendario = 'horarios';
            const datos = {
                codigoEmpleado: empleado.codigo
            }
            dispatch(getEvents(calendario, datos));
        }
    }, [dispatch, empleado]);

    // cambia el formato de vista de acuerdo a la relación de la pantalla
    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [isDesktop]);

    return (
        <CalendarioContext.Provider
            value={{ 
                themeStretch, view, isDesktop,
                fecha, selectedEvent, events, isOpenModal, selectedRange, calendarRef,
                handleClickToday, handleChangeView, handleClickDatePrev, handleClickDateNext, handleSelectRange,
                handleSelectEvent, handleResizeEvent, handleDropEvent, handleAddEvent, handleCloseModal
            }}
        >
            { children }
        </CalendarioContext.Provider>
    )
}