# selectricity
A concise and effective replacement for jQuery.

**selectricity** is a simple library used to emulate some of the functonality provided by jQuery without the hefty filesize and unneeded complexity. It is a great tool for dev teams that have junior developers who may be transitioning to using vanilla JS, but can be useful for developers of any skill level.

Some of the main features of selectricity include:

- Easy event listening
- Reduce excessive looping
- More concise and readable syntax than Vanilla JS

How to import:

```js
 import select from 'selectricity';
```

## Easy event listening

selectricity:
```js
  select('[data-foo]').listen('click', () => {
    console.log('bar');
  });
```

Compare to Vanilla JS:
```js
  const elements = document.querySelectorAll('[data-foo]');
  
  elements.forEach(($elem) => {
    $elem.addEventListener('click', () => {
      console.log('bar');
    });
  });
```

You can pass multiple event names to the "listen" method as you can in jQuery:

selectricity:
```js
  const hoverElements = select('[data-hotspot]');

  hoverElements.listen('mouseenter mouseleave', ({ $node }) => {
    $node.toggleClass('active');
  });
```

Compare to Vanilla JS:
```js
  const hoverElements = document.querySelectorAll('[data-hotspot]');

  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.classList.toggle('active');
    });
    el.addEventListener('mouseleave', () => {
      el.classList.toggle('active');
    });
  })
```

Use object destructuring within the **listen** callback function to leverage helpful data. The data returned from the listen method are:
- **$node** (the current node the event was fired on)
- **e** (the event)
- **index** (the index of the node in the query)

```js
  const buttons = select('[data-button]');
  
  buttons.listen('click', ({ $node, e, index }) => {
    // callback code here
  });
```

To add an event listener to a dynamic element, simply pass a value of **true** as the second argument of the **listen** method.

```js
  const buttons = select('[data-button]');
  
  buttons.listen('click', ({ $node, e, index }) => {
    // callback code here
  }, true);
```

## Reduce excessive looping

In the following example, we will update the active image based on the index of the currently selected button.

selectricity:
```js
  const buttons = select('[data-button]');
  const images = select('[data-image]');
  
  buttons.listen('click', ({ $node, e, index }) => {
    e.preventDefault();
    // remove active class from all buttons without looping!
    buttons.removeClass('active');
    // add active class to currently clicked button
    $node.addClass('active');
    // remove active class from all images without looping!
    images.removeClass('active');
    // add active class to image with the same index as the currently clicked button
    images[index].addClass('active');
  });
```

Compare to Vanilla JS:
```js
  const buttons = document.querySelectorAll('[data-button]');
  const images = document.querySelectorAll('[data-image]');

  buttons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      // notice here how loops also create problematic variable shadowing which require awkward variable names in the loop to avoid duplication of variable names in parent scopes.
      buttons.forEach((btn) => {
        btn.classList.remove('active');
      });
      images.forEach((image) => {
        image.classList.remove('active');
      });

      button.classList.add('active');
      images[index].classList.add('active');
    });
  });
```

By using select JS in this instance, we've reduced our code from 16 lines to 10, completely removed the presence of looping, and made the code much easier to scan.

By default, select will search for the selector at the document level, but a different parent in which to perform the query can be provided as the second argument to the function. This can be especially useful when using web components:

JS:

```js
  // update corresponing variant id on "Add to Cart" button as user selects different swatches.
  class AddToCart extends HTMLElement {
    constructor() {
      super();
      
      this.swatches = select('[data-swatch]', this);
      this.addToCart = select('[data-add-to-cart]', this);

      this.swatches.listen('click', ({ $node }) => {
        const { variantId } = $node.dataset;
        // remove active class from all swatches without looping!
        this.swatches.removeClass('swatch--selected');
        // add class to currently clicked node
        $node.addClass('swatch--selected');
        // update variant id value on add to cart button
        this.addToCart.dataset.addToCart = variantId;
      });
    }
  }
```

HTML:

```html
  <add-to-cart>
    <button class="btn btn--primary" data-add-to-cart="12345">
      Add To Cart
    </button>
    <ul class="swatch-list">
      <li>
        <button class="swatch swatch--selected" data-swatch data-variant-id="12345">
          Grey
        </button>
      </li>
      <li>
        <button class="swatch" data-swatch data-variant-id="23456">
          Green
        </button>
      </li>
      <li>
        <button class="swatch" data-swatch data-variant-id="34567">
          Brown
        </button>
      </li>
    </ul>
  </add-to-cart>
```
