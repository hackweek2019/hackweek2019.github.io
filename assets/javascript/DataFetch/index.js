import arrayFrom from 'array-from';
/* global responsiveVoice */

class DataFetch {
  constructor(options = {}) {
    this.element = options.element;
    this.hash = new URLSearchParams(window.location.search).get('hash');

    this.urlPrefix = 'https://hackweek.matrix42.com/shop/';
    this.url = 'hacks/diva-e-vending-machine-info-app-iot-frontend-engineering-electron/';
    this.hashArray = [];
    this.readTextButton = '';
    this.pauseTextButton = '';
  }

  init() {
    window.responsiveVoice.init();

    this.fetchHash();
  }

  initActions() {
    // console.log('Init Actions', this.readTextButton);

    this.readTextButton.addEventListener('click', () => {
      console.log('Hello');
      this.readText();
      this.pauseTextButton.removeAttribute('data-paused');
    });

    this.pauseTextButton.addEventListener('click', () => {
      if (this.pauseTextButton.hasAttribute('data-paused')) {
        responsiveVoice.resume();
        this.pauseTextButton.removeAttribute('data-paused');
      } else if (!this.pauseTextButton.hasAttribute('data-paused')) {
        responsiveVoice.pause();
        this.pauseTextButton.setAttribute('data-paused', '');
      }
    });
  }

  fetchHash() {
    fetch('api')
      .then(res => res.json())
      .then((data) => {
        arrayFrom(data.contentlets).forEach((item) => {
          this.hashArray.push(item.hash);
          this.checkForHash(this.hash, data);
        });
      });
  }

  checkForHash(hash, data) {
    // console.log('Checking for: ', hash);
    if (this.hashArray.includes(hash)) {
      // console.log('Happiness', data);
      const index = this.hashArray.indexOf(hash);
      this.renderData(data, index);
      // console.log(data.contentlets);
    }
  }

  renderData(data, index) {
    const metaSlot = document.querySelector('#meta-slot');
    const renderMeta = `
      <div class="logo" style="background-image: url('${data.contentlets[index].logo}')"></div>
      <div id="buttons">
        <button id="read-text"><i class="la la-play"></i></button>
        <button id="pause-text"><i class="la la-pause"></i></button>
      </div>
      <div class="meta-creator"><i class="la la-user-plus"></i><strong>${data.contentlets[index].creator}</strong></div>
      <div class="meta-contributors"><i class="la la-users"></i><strong>${data.contentlets[index].contributors}</strong></div>
    `;
    metaSlot.innerHTML = renderMeta;

    const contentSlot = document.querySelector('#content-slot');
    const renderContent = `
      <div class="textarea">
        <h1>${data.contentlets[index].title}</h1>
        ${data.contentlets[index].text}
      </div>
    `;
    contentSlot.innerHTML = renderContent;

    const imagesSlot = document.querySelector('#images-slot');
    let renderImages = '';
    if (data.contentlets[index].images) {
      const images = arrayFrom(data.contentlets[index].images);

      images.forEach((image) => {
        const renderImage = `
          <figure>
            <img src="${image.url}" width="1000" />
          </figure>
        `;

        renderImages += renderImage;
      });

      imagesSlot.innerHTML = renderImages;
    }
    this.readTextButton = document.querySelector('#read-text');
    this.pauseTextButton = document.querySelector('#pause-text');

    document.body.querySelector('.article__main-output').classList.remove('hidden');
    // document.body.querySelector('#buttons').classList.remove('hidden');
    this.initActions();

  }

  readText() {
    console.log('Reading Text');
    const content = document.querySelector('#content-slot').innerText;
    // const voice = window.responsiveVoice;
    // responsiveVoicse.init();
    responsiveVoice.speak(content, 'UK English Male', { pitch: 1, rate: 1 });
  }
}

export default DataFetch;
