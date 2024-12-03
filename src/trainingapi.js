const apiUrl = import.meta.env.VITE_API_URL;
const trainingsUrl = `${apiUrl}trainings`;

export function getTrainings() {
  return fetch(trainingsUrl).then((response) => {
    if (!response.ok) throw new Error("Error in fetch: " + response.statusText);

    return response.json();
  });
}

export function deleteTraining(url) {
  return fetch(url, { method: "DELETE" }).then((response) => {
    if (!response.ok)
      throw new Error("Error in delete: " + response.statusText);

    return response.json();
  });
}
