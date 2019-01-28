import arrayFrom from 'array-from';
/* global responsiveVoice */

class Overview {
  constructor(options = {}) {
    this.element = options.element;
    this.apiUrl = '/api/';
    this.contents = {};
    this.overviewSlot = document.body.querySelector('#overview-slot');
    this.hash = new URLSearchParams(window.location.search).get('hash') || null;
  }

  init() {
    console.log('Overview initialized!');
    this.fetchContents();

  }

  fetchContents() {
    fetch(this.apiUrl)
      .then(res => res.json())
      .then((data) => {
        this.contents = data.contentlets;
        this.renderOverview(this.contents);
      });
  }

  renderOverview(contents) {
    console.log('Rendering Overview', contents);
    let overviewList = '';

    contents.forEach((overviewItem) => {
      const template = `
        <div class="overview-item" data-hash="${overviewItem.hash}">
          <div class="logo" style="background-image: url('${overviewItem.logo}'); background-size: cover; background-position: center center;">
          </div>
          <div class="wrapper">
            <h2>${overviewItem.title}</h2>
          </div>
          <div class="meta">
              <div class="meta-creator"><i class="la la-user-plus"></i>${overviewItem.creator}</div>
              <div class="meta-contributors"><i class="la la-users"></i>${overviewItem.contributors}</div>
            </div>
          <a href="?hash=${overviewItem.hash}" class="overview-item__link"></a>
        </div>
      `;

      overviewList += template;
    });

    this.overviewSlot.innerHTML = overviewList;
    this.checkForHash();
  }

  checkForHash() {
    if (this.hash !== null) {
      document.querySelector(`[data-hash="${this.hash}"]`).classList.add('active');
    }
  }
}

export default Overview;
