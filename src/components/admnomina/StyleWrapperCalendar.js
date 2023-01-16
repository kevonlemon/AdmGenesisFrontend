import FullCalendar from '@fullcalendar/react';
import styled from '@emotion/styled';

export const StyleWrapper = styled.div`
  .fc table {
    font-size: 1.1em;
  }
  .fc th {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-right: 0px;
    border-left: 0px;
  }
  .fc tbody {
    border: none;
  }
  .fc td,
  .fc tr {
    border-right: 0px;
    border-bottom: 0px;
  }
  .fc th:last-child {
    border-right: 0px;
  }
  .fc .fc-scrollgrid {
    border: none;
  }
  .fc .fc-button-primary {
    background-color: #bb1f30;
    border-color: #bb1f30;
    box-shadow: 0 0 20px #cfd1d5;
  }
  .fc .fc-button-primary:not(:disabled).fc-button-active {
    opacity: 0.45;
  }
  .fc .fc-button:hover,
  .fc .fc-button:active {
    background: #bb5863;
    border-color: #bb5863;
  }
  .fc .fc-daygrid-event-harness {
    background: #80bddf;
    color: #3f51b5;
    margin: 5px;
    border-radius: 2px;
  }
  .fc .fc-toolbar.fc-header-toolbar {
    margin-left: 10px;
    margin-right: 10px;
  }
  .fc .fc-daygrid-day.fc-day-today {
    background-color: #edeff1;
  }
  .fc th {
    padding: 10px;
  }
  .fc .fc-col-header-cell {
    border: none;
  }
`;

export default StyleWrapper;

/*
table { 
    border-collapse: separate; 
}
td, th { 
    border: solid 1px rgba(0, 178, 255, 1); 
}
tr td, th { 
    border-top-right-radius: 0;               
    border-top-left-radius: 0; 
    border-bottom-left-radius: 0; 
    border-bottom-right-radius: 0; 
}
th:first-child { 
    border-top-left-radius: 10px; 
}
th:last-child {   
    border-top-right-radius: 10px; 
}
tr:last-child td:first-child { 
    border-bottom-left-radius: 10px; 
}
tr:last-child td:last-child { 
    border-bottom-right-radius: 10px; 
}
  .fc .fc-daygrid-event-harness{
    background: blue;
  }
*/
