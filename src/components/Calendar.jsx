import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import mappingService from "./trainingMappingService";

export default function Calendar() {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
      handleFetch();
  }, []);

  const handleFetch = () => {
    mappingService()
    .then(trainingsWithCustomers => {
      setTrainings(trainingsWithCustomers);
    })
    .catch((err) => console.log(err))
  };

  // Käytetty apuna W3 School ja chat.gpt
  const calculateEndDate = (startDate, duration) => {
    const endDate = new Date(startDate);
    endDate.setTime(endDate.getTime() + duration * 60 * 1000); // duration in minutes
    return endDate;
  };

  const events = trainings.map(training => ({
      title: `${training.activity} / ${training.customer}`,
      start: training.date,
      end: calculateEndDate(training.date, training.duration),
      display: 'block'
  }));

  return (
    <FullCalendar
      headerToolbar={{
        center: 'title',
        left: 'dayGridWeek,dayGridDay,dayGridMonth',
        right: 'today prev,next',
      }}
      plugins={[ dayGridPlugin ]}
      events={events}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24h-formaatti, stackoverflow: https://stackoverflow.com/questions/9080944/24-hour-time-format-so-no-am-to-pm-for-fullcalendar#:~:text=As%20of%20fullCalendar.io%20version%204%2C%20depending%20on%20where,hour%3A%20%272-digit%27%2C%20%2F%2F2-digit%2C%20numeric%20minute%3A%20%272-digit%27%2C%20%2F%2F2-digit%2C%20numeric
      }}
      displayEventEnd
    />
  )
}