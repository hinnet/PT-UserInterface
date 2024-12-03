import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { getTrainings } from "../trainingapi";

export default function Calendar() {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
      handleFetch();
  }, []);

  // (Promise chain)
  const handleFetch = () => {
    getTrainings()
      .then(data => {
      const trainings = data._embedded.trainings;
      // Käydään läpi treenit ja jokaisen treenin asiakas. Lisätään tiedot fetchPromises-taulukkoon.
      const fetchPromises = trainings.map((training, index) => {
        training.id = index;
        if (training._links.customer) {
          return fetch(training._links.customer.href)
          .then(response => response.json())
          .then(customerData => {
            training.customer = `${customerData.firstname} ${customerData.lastname}`;
            return training;
          })
          .catch((err) => {
            console.error(err)
            training.customer = "";
            return training;
          });
        } else {
          return Promise.resolve(training);
        }
      });

      // Promise.all(fetchPromises) odottaa, että kaikki taulukossa olevat lupaukset (= fetch-pyynnöt) on tehty, jonka jälkeen siirrytään eteenpäin.
      Promise.all(fetchPromises)
      .then(trainingsWithCustomers => {
        setTrainings(trainingsWithCustomers);
      })
      // Promise.all error, virhe asiakastietojen hakemisessa
      .catch((err) => console.error(err));
    })
    // getTrainings() error, virhe treenien hakemisessa
    .catch((err) => console.error(err));
  };

  // W3 School ja chat.gpt
  const calculateEndDate = (startDate, duration) => {
    const endDate = new Date(startDate);
    endDate.setTime(endDate.getTime() + duration * 60 * 1000); // duration in minutes
    return endDate;
  };

  const events = trainings.map(training => ({
      title: training.activity,
      start: training.date,
      end: calculateEndDate(training.date, training.duration),
      description: training.customer,
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