// Create a class for the element
class NASAArticle extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        const shadow = this.attachShadow({mode: 'open'});

        const date = this.getAttribute('date');
        const explanation = this.getAttribute('explanation');
        const hdurl = this.getAttribute('hdurl');
        const media_type = this.getAttribute('media_type');
        const service_version = this.getAttribute('service_version');
        const title = this.getAttribute('title');
        const url = this.getAttribute('url');

        // Create spans
        const container = document.createElement('div');
        container.setAttribute('class', 'container');

        const dateElement = document.createElement('span');
        dateElement.setAttribute('class', 'date');
        dateElement.innerText = `${date} - ${title}`;

        container.appendChild(dateElement);

        const explanationElement = document.createElement('div');
        explanationElement.setAttribute('class', 'explanation');
        explanationElement.innerText = explanation;

        container.appendChild(explanationElement);

        const imageElement = document.createElement('img');
        imageElement.setAttribute('class', 'image');
        imageElement.setAttribute('src', hdurl);

        container.appendChild(imageElement);

        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');

        style.textContent = `
        .date {
          font-size: 1em;
          display: inline-block;
          margin-bottom: 20px;
        }

        .image {
          max-width: 100%;
        }
    `;

        // Attach the created elements to the shadow dom
        shadow.appendChild(style);
        console.log(style.isConnected);
        shadow.appendChild(container);
    }
}

// Define the new element
customElements.define('nasa-article', NASAArticle);
