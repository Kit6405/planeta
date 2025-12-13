const addPlanetModal = document.querySelector('ion-modal[trigger="add-planet-modal"]');
const closeBtn = addPlanetModal.querySelector('#close-add-planet-modal');
const confirmBtn = addPlanetModal.querySelector('#confirm-add-planet');

closeBtn.addEventListener('click', async () => {
  await addPlanetModal.dismiss();
});

confirmBtn.addEventListener('click', async () => {
  const name = addPlanetModal.querySelector('#planetName').value.trim();
  const image = addPlanetModal.querySelector('#planetImage').value.trim();
  const description = addPlanetModal.querySelector('#planetDescription').value.trim();

  if (!name || !image || !description) {
    alert('Заповніть обовʼязкові поля');
    return;
  }

  const newPlanet = {
    name,
    image,
    description,
    details: {
      temperature: addPlanetModal.querySelector('#planetTemperature').value.trim(),
      mass: addPlanetModal.querySelector('#planetMass').value.trim(),
      atmosphere: addPlanetModal.querySelector('#planetAtmosphere').value.trim(),
      satellites: addPlanetModal.querySelector('#planetSatellites').value.split(',').map(s => s.trim()),
      missions: addPlanetModal.querySelector('#planetMissions').value.split(',').map(m => m.trim())
    }
  };

  const saved = JSON.parse(localStorage.getItem('planets')) || [];
  saved.push(newPlanet);
  localStorage.setItem('planets', JSON.stringify(saved));

  await addPlanetModal.dismiss();

  // оновити головну
  const home = document.querySelector('page-home');
  if (home) home.connectedCallback();
});
