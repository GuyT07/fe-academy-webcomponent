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
        const hdurl = this.gethdurl();

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

   async gethdurl() {
      return await getImageBlobUrl()
    }
}

// Define the new element
customElements.define('nasa-article', NASAArticle);

async function getImageBlobUrl() {
  return fetch( 'https://picsum.photos/4951/3301' )
  .then( response => {
    const reader = response.body.getReader();

    return new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          // When no more data needs to be consumed, break the reading
          if (done) {
            break;
          }
          // Enqueue the next data chunk into our target stream
          controller.enqueue(value);
        }
        // Close the stream
        controller.close();
        reader.releaseLock();
      }
    })
  })
  // Create a new response out of the stream
  .then(rs => new Response(rs))
  // Create an object URL for the response
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob))
  // Update image
  //.then(url => image.src = url)
  // .then(console.log)
  // .catch(console.error)
}
