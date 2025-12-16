import { Capacitor } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

// ---------- Storage (iOS = Preferences, Web = localStorage) ----------
async function getStore(key, fallback) {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : fallback;
  }
  return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
}

async function setStore(key, value) {
  const str = JSON.stringify(value);
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key, value: str });
  } else {
    localStorage.setItem(key, str);
  }
}

// Зробимо доступним зі всіх файлів (щоб addPlanetModal.js міг зберігати в iOS Preferences)
window.store = {
  get: (key, fallback) => getStore(key, fallback),
  set: (key, value) => setStore(key, value),
};

// Подія для оновлення списку планет після додавання/видалення
window.dispatchPlanetsUpdated = () => {
  window.dispatchEvent(new CustomEvent('planets:updated'));
};


// ---------- HTTP (iOS = CapacitorHttp, Web = fetch) ----------
async function httpGetJson(url) {
  if (Capacitor.isNativePlatform()) {
    const r = await CapacitorHttp.get({ url });
    return r.data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


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
    this.planetsApi = [];
    this.sortMode = 'az';
  }

  mapApiPlanet(p) {
    return {
      name: p.name,
      image: p.imgSrc?.img || '',
      description: p.description || '',
      details: {
        mass: p.basicDetails?.mass || '',
        volume: p.basicDetails?.volume || '',
        wikiLink: p.wikiLink || ''
      },
      __local: false
    };
  }

  async fetchPlanetsData() {
    const loader = document.querySelector('ion-loading');
    await loader?.present();
    try {
      
      
      const url = Capacitor.isNativePlatform()
        ? 'https://university-api-alpha.vercel.app/api/planets'
        : 'https://corsproxy.io/?https://university-api-alpha.vercel.app/api/planets';

      const data = await httpGetJson(url);
      this.planetsApi = Array.isArray(data) ? data.map(x => this.mapApiPlanet(x)) : [];
      await setStore('cachedPlanets', this.planetsApi);
    } catch (e) {
      console.error(e);
      this.planetsApi = await getStore('cachedPlanets', []);
      if (!this.planetsApi.length) alert('Не вдалося завантажити дані');
    } finally {
      await loader?.dismiss();
    }
  }

  async getAllPlanets() {
    const saved = await getStore('planets', []);
    return this.planetsApi.concat(saved);
  }

  sortPlanets(list) {
    const arr = [...list];

    if (this.sortMode === 'az') arr.sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortMode === 'za') arr.sort((a, b) => b.name.localeCompare(a.name));

    if (this.sortMode === 'mass') {
      const num = (v) => {
        const m = String(v ?? '').match(/-?\d+(\.\d+)?/);
        return m ? parseFloat(m[0]) : 0;
      };
      arr.sort((a, b) => num(b.details?.mass) - num(a.details?.mass));
    }

    return arr;
  }

  async connectedCallback() {
    await this.fetchPlanetsData();
    await this.render();
    window.addEventListener('planets:updated', () => this.render());

  }

  async render() {
    const all = this.sortPlanets(await this.getAllPlanets());

    const cards = all.map((p) => `
      <ion-col size="12" size-md="6" size-lg="4">
        <a href="#/planet/${encodeURIComponent(p.name)}" style="text-decoration:none;">
          <ion-card>
            ${p.image ? `<ion-img class="planet-img" src="${p.image}" alt="${p.name}"></ion-img>` : ''}
            <ion-card-header><ion-card-title>${p.name}</ion-card-title></ion-card-header>
            <ion-card-content class="muted">${p.description || ''}</ion-card-content>
          </ion-card>
        </a>
      </ion-col>
    `).join('');

    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-title>Планети Сонячної системи</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div class="page-wrap">
          <p class="muted">Обери планету або додай власну.</p>

          <ion-segment id="sortSegment" value="${this.sortMode}">
            <ion-segment-button value="az">А → Я</ion-segment-button>
            <ion-segment-button value="za">Я → А</ion-segment-button>
            <ion-segment-button value="mass">За масою</ion-segment-button>
          </ion-segment>

          <ion-grid><ion-row>${cards}</ion-row></ion-grid>
        </div>
      </ion-content>
    `;

    const seg = this.querySelector('#sortSegment');
    seg?.addEventListener('ionChange', async (e) => {
      this.sortMode = e.detail.value;
      await this.render();
    });
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
    const path = window.location.hash.slice(1) || '/';
    const parts = path.split('/').filter(Boolean);
    const raw = parts[1] || '';
    const name = decodeURIComponent(raw);

    
    const saved = await getStore('planets', []);
    const localPlanet = saved.find(p => (p.name || '').toLowerCase() === name.toLowerCase());

    if (localPlanet) {
      this.renderPlanet(localPlanet);
      return;
    }

    
    const url = Capacitor.isNativePlatform()
      ? `https://university-api-alpha.vercel.app/api/planets/${encodeURIComponent(name)}`
      : `https://corsproxy.io/?https://university-api-alpha.vercel.app/api/planets/${encodeURIComponent(name)}`;

    const planet = await httpGetJson(url);

    
    const mapped = {
      name: planet.name || name,
      image: planet.imgSrc?.img || '',
      description: planet.description || '',
      details: {
        mass: planet.basicDetails?.mass || '',
        volume: planet.basicDetails?.volume || '',
        wikiLink: planet.wikiLink || ''
      }
    };

    this.renderPlanet(mapped);
  } catch (e) {
    console.error(e);
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

renderPlanet(planet) {
  const d = planet.details || {};
  this.innerHTML = `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button onclick="window.location.hash='#/';">
            <ion-icon name="arrow-back-outline" slot="start"></ion-icon>
            Назад
          </ion-button>
        </ion-buttons>
        <ion-title>${planet.name}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="page-wrap">
        <ion-breadcrumbs>
          <ion-breadcrumb href="#/">Головна</ion-breadcrumb>
          <ion-breadcrumb>${planet.name}</ion-breadcrumb>
        </ion-breadcrumbs>

        <ion-card>
          ${planet.image ? `<ion-img src="${planet.image}"></ion-img>` : ''}
          <ion-card-header><ion-card-title>${planet.name}</ion-card-title></ion-card-header>
          <ion-card-content>
            ${planet.description ? `<p class="muted">${planet.description}</p>` : ''}

            <div class="chips">
              ${d.mass ? `<ion-chip><ion-label><b>Маса:</b> ${d.mass}</ion-label></ion-chip>` : ''}
              ${d.volume ? `<ion-chip><ion-label><b>Обʼєм:</b> ${d.volume}</ion-label></ion-chip>` : ''}
            </div>

            ${d.wikiLink ? `<p><a href="${d.wikiLink}" target="_blank">Джерело</a></p>` : ''}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `;


  
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
