class NASAArticle extends HTMLElement {
  #root
  #container
  #dateElement
  #explanationElement
  #imageElement

  #attributes = new Map

  static #defaults = new Map( [
    [ 'date'            , '01-01-1970'                    ],
    [ 'explanation'     , 'Fill in your explanation'      ],
    [ 'sdurl'           , 'https://picsum.photos/320/240' ],
    [ 'hdurl'           , ''                              ],
    [ 'media_type'      , ''                              ],
    [ 'service_version' , ''                              ],
    [ 'title'           , 'Title'                         ],
    [ 'url'             , 'Url'                           ],
  ] )

  initAttributes() {
    for ( const attr of NASAArticle.#defaults.keys() ) {
      const val = this.getAttribute( attr )

      this.#attributes.set(
        attr,
        ( val && val.trim() ) || NASAArticle.#defaults.get( attr )
      )
    }

    this.#attributes = Object.fromEntries( this.#attributes.entries() )

    return this
  }

  buildDom() {
    let c, d, e, i

    this.#container           = c = document.createElement( 'div' )
    this.#dateElement         = d = document.createElement( 'span'  )
    this.#explanationElement  = e = document.createElement( 'div' )
    this.#imageElement        = i = document.createElement( 'img' )

    c.setAttribute( 'class', 'container' )
    d.setAttribute( 'class', 'date' )
    e.setAttribute( 'class', 'explanation' )
    i.setAttribute( 'class', 'image' )

    c.appendChild( d )
    c.appendChild( e )
    c.appendChild( i )
    this.#root.appendChild( c )

    return this
  }

  buildStyles() {
    const style = document.createElement( 'style' )

    style.textContent = `.date { font-size: 1em; display: inline-block; margin-bottom: 20px; }
.image { max-width: 100%; }`

    this.#root.appendChild( style )

    return this
  }

  loadData() {
    this.#dateElement.innerText         = `${this.#attributes.date} - ${this.#attributes.title}`
    this.#explanationElement.innerText  = this.#attributes.explanation

    this.#imageElement.setAttribute( 'src', this.#attributes.sdurl )

    this.getHdImage()

    return this
  }

  constructor() {
    super();

    this.#root = this.attachShadow( { mode: 'open' } )

    this.initAttributes().buildDom().buildStyles().loadData()
  }

  getHdImage() {
    return fetch( this.#attributes.hdurl )
      .then( res => {
        const reader = res.body.getReader()

        return new ReadableStream( {
          async start( controller ) {
            while ( true ) {
              const { done, value } = await reader.read()

              if ( done ) break

              controller.enqueue( value )
            }

            controller.close()
            reader.releaseLock()
          }
        } )
      } )
      .then( res => new Response( res ) )
      .then( res => res.blob() )
      .then( blob => URL.createObjectURL( blob ) )
      .then( url => this.#imageElement.setAttribute( 'src', url ) )
      .catch( console.error )
  }
}

customElements.define( 'nasa-article', NASAArticle )
