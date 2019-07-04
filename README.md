# Smartour

![Jul-04-2019 18-07-06](https://user-images.githubusercontent.com/12172868/60658829-9985cd80-9e86-11e9-9fa1-b05d89fc1849.gif)

Once a website has changed its UI, usually they would set a list of tour guide to tell the visitors, that some modules were moved to the other places. We named it as "tour guide", and Smartour is a solution for making tour guide much easier.

See live demo here: https://jrainlau.github.io/smartour

# Install
**Smartour** was built to an `umd` and `es modules` package.

```
npm install smartour
```

```
/* ES Modules */
import Smartour from 'smartour/dist/index.esm.js'
/* CommandJS */
const Smartour = require('smartour')
/* <script> */
<script src="smartour/dist/index.js"></script>
```

# Basic usage

**Smartour** provides a very simple API `focus()`, it's the easist way to highlight an element.

```javascript
let tour = new Smartour()

tour.focus({
  el: '#basic-usage'
})
```

# Slot

`slot` is a html string that allows you to add a description to the highlighted element.

## Pure string:
```javascript
let tour = new Smartour()

tour.focus({
  el: '#pure-string',
  slot: 'This is a pure string'
})
```

## Html string
```javascript
let tour = new Smartour()

tour.focus({
  el: '#html-string',
  slot: `
    <div>
      <p>This is a html string</p>
    </div>
  `
})
```

## Slot positions

There are 4 positions to place a slot: `top`, `right`, `left`, `bottom`.

Set the `options.slotPosition` attribute to overwrite the default `top`.

```javascript
let tour = new Smartour()

tour.focus({
  el: '#slot-positions',
  slot: `top`,
  options: {
    slotPosition: 'top' // default is `top`
  }
})
```

## Slot events
The slot element could bind events, too. We can use the `keyNodes` attribute to bind events to them.

`keyNodes` is an array contains with `keyNode`. The attribute `keyNode.el` is a css selector, and the other `keyNode.event` is the binding event.

```javascript
let tour = new Smartour()

tour.focus({
  el: '.slot-events-demo',
  options: {
    slotPosition: 'right'
  },
  slot: `
    <button class="demo-btn occur-1">
      Click here to occur an alert event
    </button>
    <button class="demo-btn occur-2">
      Click here to occur an alert event
    </button>
  `,
  keyNodes: [{
    el: '.occur-1',
    event: () => { alert('Event!!') }
  }, {
    el: '.occur-2',
    event: () => { alert('Another event!!') }
  }]
})
```

# Queue
Sometimes there are more than one tour guide to show. **Smartour** allows you to put the tour guides together as a queue and show them one by one.

```javascript
let tour = new Smartour()

tour
  .queue([{
    el: '.li-1',
    options: {
      layerEvent: tour.next.bind(tour)
    },
    slot: 'This is the 1st line.'
  }, {
    el: '.li-2',
    options: {
      layerEvent: tour.next.bind(tour)
    },
    slot: 'This is the 2nd line.'
  }, {
    el: '.li-3',
    options: {
      layerEvent: tour.next.bind(tour)
    },
    slot: 'This is the 3rd line.'
  }])
  .run() // don't forget to trigger api `run()` to show the first tour guide
```

# Options
**Smartour** is a constructor and receives an `options` parameter to overwrite the default.

Let's take a look at the default options:

```javascript
{
  prefix: 'smartour', // class prefix
  padding: 5, // padding of the highlight area
  maskColor: 'rgba(0, 0, 0, .5)', // maskColor with alpha
  animate: true, // use animate while changing tour guides
  slotPosition: 'top' // default slot position
  layerEvent: smartour.over // events while clicking the layer
}
```

# APIs
Besides `.focus()`, `.queue()` and `.run()`, **Smartour** alse privides two apis to handle the tour guide playing.

- `.next()`: Show the next tour guide. (Only work with `.queue()`)

- `.prev()`: Show the previous tour guide. (Only work with `.queue()`)

# Principles of Smartour

**Smartour** uses api `element.getBoundingClientRect()` to detect the size and position of the target element, than place a rect element with `box-shadow` over it as the highlight area.

Because click events could not be triigered from the `box-shadow` area, **Smartour** place another transparent layer over the page, and bind `layerEvent()` to it to solve this problem.

The position of the highlight area and slot are `absolute`. Every time the page scrolled, the value of `document.documentElement.scrollTop` or `document.documentElement.scrollLeft` would be changed, and **Smartour** will use these values to correct the position.

# License
MIT
