const planets = [
  {
name: 'Меркурій',
image:
'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
description: 'Найменша планета Сонячної системи та найближча до Сонця.',

details: {
temperature: 'Вдень до 430°C, вночі до -180°C',
mass: '3.3011×10^23 кг',
distance: '57.9 млн км від Сонця',
discovery: 'Відома з давнини',
atmosphere: 'Відсутня',
satellites: 'Немає',
missions: ['Mariner 10', 'MESSENGER', 'BepiColombo']
}
},
{
name: 'Венера',
image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
description: 'Друга планета від Сонця, відома своєю густою атмосферою.',
details: {
temperature: 'Середня близько 464°C',
mass: '4.8675×10^24 кг',
distance: '108.2 млн км від Сонця',
discovery: 'Відома з давнини',
atmosphere: 'Вуглекислий газ, азот',
satellites: 'Немає',
missions: ['Venera', 'Magellan', 'Venus Express', 'Akatsuki']
}
},
{
name: 'Земля',
image:
'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg'
,
description: 'Наша рідна планета, єдина відома з життям.',
details: {
temperature: 'Середня близько 15°C',
mass: '5.97237×10^24 кг',
distance: '149.6 млн км від Сонця',
discovery: 'Не застосовується',
atmosphere: 'Азот, кисень',
satellites: 'Місяць',
missions: ['Apollo', 'Міжнародна космічна станція']
}
},
{
name: 'Марс',
image:
'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
description: 'Четверта планета від Сонця, відома як "Червона планета".',
details: {

temperature: 'Середня близько -63°C',
mass: '6.4171×10^23 кг',
distance: '227.9 млн км від Сонця',
discovery: 'Відома з давнини',
atmosphere: 'Вуглекислий газ, азот, аргон',
satellites: 'Фобос, Деймос',
missions: ['Viking', 'Mars Pathfinder', 'Mars Exploration Rovers', 'Curiosity',
'Perseverance']
}
},
{
name: 'Юпітер',
image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
description: 'Найбільша планета Сонячної системи, газовий гігант.',
details: {
temperature: 'Середня близько -108°C',
mass: '1.8982×10^27 кг',
distance: '778.5 млн км від Сонця',
discovery: 'Відома з давнини',
atmosphere: 'Водень, гелій',
satellites: 'Понад 79 супутників, включаючи Іо, Європу, Ганімед, Каллісто',
missions: ['Pioneer', 'Voyager', 'Galileo', 'Juno']
}
},
{
name: 'Сатурн',
image:
'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
description: 'Відома своїми кільцями, шоста планета від Сонця.',
details: {
temperature: 'Середня близько -139°C',
mass: '5.6834×10^26 кг',
distance: '1.43 млрд км від Сонця',
discovery: 'Відома з давнини',
atmosphere: 'Водень, гелій',
satellites: 'Понад 82 супутники, включаючи Титан, Енцелад',
missions: ['Pioneer 11', 'Voyager', 'Cassini–Huygens']
}
},
{
name: 'Уран',
image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
description: 'Сьома планета від Сонця, крижаний гігант з унікальним нахилом осі.',
details: {
temperature: 'Середня близько -195°C',
mass: '8.6810×10^25 кг',

distance: '2.87 млрд км від Сонця',
discovery: '1781 рік, Вільям Гершель',
atmosphere: 'Водень, гелій, метан',
satellites: '27 відомих супутників, включаючи Титанію, Оберон',
missions: ['Voyager 2']
}
},
{
name: 'Нептун',
image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg',
description: 'Восьма планета від Сонця, крижаний гігант з найсильнішими вітрами.',
details: {
temperature: 'Середня близько -201°C',
mass: '1.02413×10^26 кг',
distance: '4.5 млрд км від Сонця',
discovery: '1846 рік, Урбен Левер\'єр та Джон Куч Адамс',
atmosphere: 'Водень, гелій, метан',
satellites: '14 відомих супутників, включаючи Тритон',
missions: ['Voyager 2']
}
}
];

function slugifyUA(name) {
  
  return encodeURIComponent(name);
}
function unslugifyUA(slug) {
  return decodeURIComponent(slug || '');
}

function getPlanetByName(name) {
  return planets.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

function currentPathname() {
 
  return window.location.pathname;
}

function currentRoutePath() {
  // для use-hash="true": "#/planet/Марс" -> "/planet/Марс"
  const h = window.location.hash || '#/';
  return h.startsWith('#') ? h.slice(1) : h;
}


class HomePage extends HTMLElement {
  constructor() {
    super();
    this.planets = [];
    this.sortMode = 'az';
  }

  async fetchPlanetsData() {
  const loader = document.querySelector('ion-loading');
  await loader?.present();

  const API_URL = 'https://corsproxy.io/?https://university-api-alpha.vercel.app/api/planets';

  try {
    //  пробуємо API
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    //  мапінг API → формат застосунку
    this.planets = data.map((planet) => ({
      name: planet.name,
      image: planet.imgSrc?.img,
      description: planet.description,
      details: {
        mass: planet.basicDetails?.mass,
        volume: planet.basicDetails?.volume,
        wikiLink: planet.wikiLink
      }
    }));

    //  КЕШУЄМО 
    localStorage.setItem('cachedPlanets', JSON.stringify(this.planets));

  } catch (error) {
    console.warn('API недоступне, використовуємо localStorage');

    
    this.planets = JSON.parse(localStorage.getItem('cachedPlanets')) || [];

    if (this.planets.length === 0) {
      alert('Не вдалося завантажити дані з сервера');
    }
  } finally {
    await loader?.dismiss();
  }
}


  async connectedCallback() {
    await this.fetchPlanetsData();  // важливо
    this.render();                 // рендеримо після
  }

  render() {
    const savedPlanets = JSON.parse(localStorage.getItem('planets')) || [];
    const allPlanets = this.planets.concat(savedPlanets);

    this.innerHTML = `
      <ion-header><ion-toolbar><ion-title>Планети</ion-title></ion-toolbar></ion-header>
      <ion-content class="ion-padding">
        <ion-grid><ion-row>
          ${allPlanets.map(p => `
            <ion-col size="12" size-md="6" size-lg="4">
              <a href="#/planet/${encodeURIComponent(p.name)}" style="text-decoration:none;">
                <ion-card>
                  <ion-img src="${p.image || ''}"></ion-img>
                  <ion-card-header><ion-card-title>${p.name}</ion-card-title></ion-card-header>
                  <ion-card-content><p>${p.description || ''}</p></ion-card-content>
                </ion-card>
              </a>
            </ion-col>
          `).join('')}
        </ion-row></ion-grid>
      </ion-content>
    `;
  }
}




class PlanetPage extends HTMLElement {
  connectedCallback() {
    this.renderFromUrl();
    window.addEventListener('hashchange', () => this.renderFromUrl());
  }

  async renderFromUrl() {
  const loader = document.querySelector('ion-loading');
  await loader?.present();

  try {
    // "#/planet/Saturn" -> "Saturn"
    const path = window.location.hash.slice(1) || '/';
    const parts = path.split('/').filter(Boolean);
    const raw = parts[1] || '';
    const name = decodeURIComponent(raw);

    // ✅ ВАЖЛИВО: без "/" в кінці, і через proxy
    const API_ONE = `https://corsproxy.io/?https://university-api-alpha.vercel.app/api/planets/${encodeURIComponent(name)}`;

    let planet = null;

    try {
      const res = await fetch(API_ONE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      planet = await res.json();
      // кешуємо деталі по назві
      localStorage.setItem(`planet_${name}`, JSON.stringify(planet));
    } catch (e) {
      // fallback: з кешу
      planet = JSON.parse(localStorage.getItem(`planet_${name}`) || 'null');
    }

    // якщо нема ні API, ні кешу — пробуємо знайти у списку (home кеш)
    if (!planet) {
      const cachedList = JSON.parse(localStorage.getItem('cachedPlanets') || '[]');
      const fromList = cachedList.find(p => (p.name || '').toLowerCase() === name.toLowerCase());
      if (fromList) {
        planet = {
          name: fromList.name,
          description: fromList.description,
          imgSrc: { img: fromList.image },
          basicDetails: { mass: fromList.details?.mass, volume: fromList.details?.volume },
          wikiLink: fromList.details?.wikiLink
        };
      }
    }

    if (!planet) throw new Error('No data for planet');

    const img = planet.imgSrc?.img;
    const desc = planet.description;
    const mass = planet.basicDetails?.mass;
    const volume = planet.basicDetails?.volume;
    const wiki = planet.wikiLink;

    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button onclick="window.location.hash='#/';">
              <ion-icon name="arrow-back-outline" slot="start"></ion-icon>
              Назад
            </ion-button>
          </ion-buttons>
          <ion-title>${planet.name || name}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          ${img ? `<ion-img src="${img}"></ion-img>` : ''}
          <ion-card-header>
            <ion-card-title>${planet.name || name}</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            ${desc ? `<p class="muted">${desc}</p>` : ''}

            <div class="chips">
              ${mass ? `<ion-chip><ion-label><b>Маса:</b> ${mass}</ion-label></ion-chip>` : ''}
              ${volume ? `<ion-chip><ion-label><b>Обʼєм:</b> ${volume}</ion-label></ion-chip>` : ''}
            </div>

            ${wiki ? `<p><a href="${wiki}" target="_blank">Джерело</a></p>` : ''}
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;
  } catch (error) {
    console.error(error);
    this.innerHTML = `
      <ion-header><ion-toolbar><ion-title>Помилка</ion-title></ion-toolbar></ion-header>
      <ion-content class="ion-padding">
        <p>Не вдалося завантажити дані планети.</p>
        <ion-button onclick="window.location.hash='#/';">На головну</ion-button>
      </ion-content>
    `;
  } finally {
    await loader?.dismiss();
  }
}
}

class NotFoundPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `“
      <ion-header>
        <ion-toolbar>
          <ion-title>Сторінку не знайдено</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="page-wrap">
          <p>Перейди на головну сторінку.</p>
          <ion-button onclick="document.querySelector('ion-router').push('/');">На головну</ion-button>
        </div>
      </ion-content>
    `;
  }
}

class AboutPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-title>Про застосунок</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div class="page-wrap">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Лабораторна — Ionic</ion-card-title>
            </ion-card-header>
            <ion-card-content class="muted">
              <p>
  Цей застосунок демонструє роботу з бібліотекою компонентів <b>Ionic Core</b> у статичній HTML-сторінці.
</p>
<p>
  На головній сторінці відображається список планет у вигляді карток, реалізований через
  <b>ion-grid / ion-row / ion-col</b> та <b>ion-card</b>.
</p>
<p>
  Для кожної планети доступна детальна сторінка з навігацією та інтерактивними елементами:
  <b>ion-breadcrumbs</b>, <b>ion-chip</b>, <b>ion-accordion</b>.
</p>
<p>
  Додатково реалізовано інтерактивність: додавання нових планет через модальне вікно
  (<b>ion-modal</b>), збереження даних у <b>localStorage</b> та сортування списку.
</p>
<p class="muted">
  Проєкт виконано як один безперервний застосунок, де кожне наступне завдання розширює попередній функціонал.
</p>

            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    `;
  }
}


// Реєстрація кастомних елементів
customElements.define('page-home', HomePage);
customElements.define('page-planet', PlanetPage);
customElements.define('page-not-found', NotFoundPage);
customElements.define('page-about', AboutPage);

// Легка підстраховка: якщо відкрили /planet/... напряму — попросимо роутер підтягнути компонент
window.addEventListener('DOMContentLoaded', () => {
  const router = document.querySelector('#router').push('/');

  if (router && typeof router.push === 'function') {
    router.push(currentRoutePath() || '/');

  }
});
