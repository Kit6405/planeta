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
  // Для нашого набору вистачить encode/decode. Роут виглядає як /planet/Меркурій
  return encodeURIComponent(name);
}
function unslugifyUA(slug) {
  return decodeURIComponent(slug || '');
}

function getPlanetByName(name) {
  return planets.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

function currentPathname() {
  // Працює на Live Server: http://127.0.0.1:5500/...
  // Для file:// буде гірше — тому і просимо Live Server.
  return window.location.pathname;
}

class HomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const cards = planets
        .map((p) => {
          const href = `/planet/${slugifyUA(p.name)}`;

return `
  <ion-col size="12" size-md="6" size-lg="4">
    <ion-card button="true" onclick="document.querySelector('ion-router').push('${href}');">
      <ion-img class="planet-img" src="${p.image}" alt="${p.name}"></ion-img>
      <ion-card-header>
        <ion-card-title>${p.name}</ion-card-title>
      </ion-card-header>
      <ion-card-content class="muted">
        ${p.description}
      </ion-card-content>
    </ion-card>
  </ion-col>
`;

      })
      .join('');

    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-title>Планети Сонячної системи</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div class="page-wrap">
          <ion-text>
            <h2>Головна сторінка</h2>
          </ion-text>
          <p class="muted">
            Обери планету зі списку (мінімум 3). Список побудовано через ion-grid / ion-row / ion-col, а елементи — ion-card.
          </p>

          <ion-grid>
            <ion-row>
              ${cards}
            </ion-row>
          </ion-grid>
        </div>
      </ion-content>
    `;
  }
}

class PlanetPage extends HTMLElement {
  connectedCallback() {
    this.renderFromUrl();
    // Якщо користувач переходить назад/вперед — оновлюємо сторінку
    window.addEventListener('popstate', () => this.renderFromUrl());
  }

  renderFromUrl() {
    // Очікуємо /planet/:name
    const parts = currentPathname().split('/').filter(Boolean);
    const idx = parts.findIndex((x) => x === 'planet');
    const raw = idx >= 0 ? parts[idx + 1] : '';
    const name = unslugifyUA(raw);

    const planet = getPlanetByName(name);
    if (!planet) {
      this.innerHTML = `<page-not-found></page-not-found>`;
      return;
    }

    const crumbs = `
      <ion-breadcrumbs>
        <ion-breadcrumb href="/" onclick="event.preventDefault(); document.querySelector('ion-router').push('/');">Головна</ion-breadcrumb>
        <ion-breadcrumb>${planet.name}</ion-breadcrumb>
      </ion-breadcrumbs>
    `;

    const d = planet.details;

    const missions = Array.isArray(d.missions)
      ? `<ion-list>
          ${d.missions.map((m) => `<ion-item><ion-label>${m}</ion-label></ion-item>`).join('')}
         </ion-list>`
      : `<p>${d.missions}</p>`;

    this.innerHTML = `
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button fill="clear"
              onclick="document.querySelector('ion-router').push('/');">
              <ion-icon name="arrow-back-outline" slot="start"></ion-icon>
              Назад
            </ion-button>
          </ion-buttons>
          <ion-title>${planet.name}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div class="page-wrap">
          ${crumbs}

          <ion-card>
            <ion-img src="${planet.image}" alt="${planet.name}"></ion-img>
            <ion-card-header>
              <ion-card-title>${planet.name}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p class="muted">${planet.description}</p>
              <p>${planet.longText}</p>

              <h3>Основні характеристики</h3>
              <div class="chips">
                <ion-chip><ion-label><b>Температура:</b> ${d.temperature}</ion-label></ion-chip>
                <ion-chip><ion-label><b>Маса:</b> ${d.mass}</ion-label></ion-chip>
                <ion-chip><ion-label><b>Відстань:</b> ${d.distance}</ion-label></ion-chip>
                <ion-chip><ion-label><b>Відкриття:</b> ${d.discovery}</ion-label></ion-chip>
              </div>

              <h3 style="margin-top:14px;">Додаткова інформація</h3>
              <ion-accordion-group>
                <ion-accordion value="atmo">
                  <ion-item slot="header">
                    <ion-label>Хімічний склад атмосфери</ion-label>
                  </ion-item>
                  <div class="ion-padding" slot="content">
                    <p>${d.atmosphere}</p>
                  </div>
                </ion-accordion>

                <ion-accordion value="sats">
                  <ion-item slot="header">
                    <ion-label>Супутники</ion-label>
                  </ion-item>
                  <div class="ion-padding" slot="content">
                    <p>${d.satellites}</p>
                  </div>
                </ion-accordion>

                <ion-accordion value="missions">
                  <ion-item slot="header">
                    <ion-label>Експедиції та місії</ion-label>
                  </ion-item>
                  <div class="ion-padding" slot="content">
                    ${missions}
                  </div>
                </ion-accordion>
              </ion-accordion-group>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    `;
  }
}

class NotFoundPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
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
              <ion-card-title>Лабораторна №2 — Ionic</ion-card-title>
            </ion-card-header>
            <ion-card-content class="muted">
              <p>Демонстрація Ionic Core компонентів у статичній HTML сторінці.</p>
              <p>Реалізовано: ion-grid/ion-card, роутинг, breadcrumbs, chips, accordion, tabs.</p>
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
  const router = document.querySelector('ion-router');
  if (router && typeof router.push === 'function') {
    router.push(window.location.pathname || '/');
  }
});
