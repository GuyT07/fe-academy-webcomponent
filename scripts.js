// Create a class for the element
class NASAArticle extends HTMLElement {

    initAttributes() {
        const defaultValues = {
            date: '01-01-1970',
            explanation: 'Fill in your explanation',
            hdurl: '',
            media_type: '',
            service_version: '',
            title: 'Title',
            url: 'Url'
        };
        for (let prop in defaultValues) {
            let value = this.getAttribute(prop);
            defaultValues[prop] = (value && value.trim()) ? value : defaultValues[prop];
        }
        return defaultValues;
    }

    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        const shadow = this.attachShadow({mode: 'open'});

        const attributes = this.initAttributes();

        // Create spans
        const container = document.createElement('div');
        container.setAttribute('class', 'container');

        const dateElement = document.createElement('span');
        dateElement.setAttribute('class', 'date');
        dateElement.innerText = `${attributes.date} - ${attributes.title}`;

        container.appendChild(dateElement);

        const explanationElement = document.createElement('div');
        explanationElement.setAttribute('class', 'explanation');
        explanationElement.innerText = attributes.explanation;

        container.appendChild(explanationElement);

        const imageElement = document.createElement('img');
        imageElement.setAttribute('class', 'image');
        imageElement.setAttribute('src', attributes.hdurl);

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
