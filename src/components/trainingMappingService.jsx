import { getTrainings } from "../trainingapi";

export default function mappingService() {
  // (Promise chain)
  // Käytetty apuna mm. chatgpt
  return getTrainings()
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
        .catch(err => {
          console.error(err)
          training.customer = "";
          return training;
        });
      } else { // Palauttaa treenin sellaisenaan, jos asiakaslinkkiä ei ole
        return Promise.resolve(training);
      }
    });

    // Promise.all(fetchPromises) odottaa, että kaikki taulukossa olevat lupaukset (= fetch-pyynnöt) on tehty, jonka jälkeen siirrytään eteenpäin.
    return Promise.all(fetchPromises);
  })
    .catch(err => {
      console.error(err);
      return [];
  });
};
