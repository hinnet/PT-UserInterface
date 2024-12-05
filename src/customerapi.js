const apiUrl = import.meta.env.VITE_API_URL;
const customersUrl = `${apiUrl}customers`;
const trainingsUrl = `${apiUrl}trainings`;

export function getCustomers() {
  return fetch(customersUrl).then((response) => {
    if (!response.ok) throw new Error("Error in fetch: " + response.statusText);

    return response.json();
  });
}

export function deleteCustomer(url) {
  return fetch(url, { method: "DELETE" }).then((response) => {
    if (!response.ok)
      throw new Error("Error in delete: " + response.statusText);

    return response.json();
  });
}

export function saveCustomer(newCustomer) {
  return fetch(customersUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCustomer),
  }).then((response) => {
    if (!response.ok)
      throw new Error("Error in saving: " + response.statusText);

    return response.json();
  });
}

export function updateCustomer(url, customer) {
  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  }).then((response) => {
    if (!response.ok)
      throw new Error("Error in saving: " + response.statusText);

    return response.json();
  });
}

export function saveTrainingOfCustomer(url, newTraining) {
  return fetch(trainingsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newTraining,
      customer: url,
    }),
  }).then((response) => {
    if (!response.ok)
      throw new Error("Error in saving: " + response.statusText);

    return response.json();
  });
}
