const tour = new Smartour({
  slotPosition: 'top',
  maskStyle: `border-radius: 4px;`
}).queue([{
  el: '.title',
  slot: `
    <div class="guide guide-1">
      <p>This is my name!</p>
      <button class="btn btn-1">OK.</button>
    </div>
  `,
  keyNodes: [{
    el: '.btn-1',
    event () {
      tour.reset({
        slotPosition: 'bottom-right',
        maskStyle: `border-radius: 4px;`
      })
      tour.next()
    }
  }]
}, {
  el: '.desc',
  slot: `
    <div class="guide guide-2">
      <p>This is what my job is!</p>
      <button class="btn btn-2">Yeah.</button>
    </div>
  `,
  keyNodes: [{
    el: '.btn-2',
    event () {
      tour.reset({
        slotPosition: 'bottom',
        maskStyle: `border-radius: 4px;`
      })
      tour.next()
    }
  }]
}, {
  el: '.link',
  slot: `
    <div class="guide guide-3">
      <p>This is the document!</p>
      <button class="btn btn-3">Got it.</button>
    </div>
  `,
  keyNodes: [{
    el: '.btn-3',
    event () {
      tour.over(tour)
    }
  }]
}])

document.addEventListener('DOMContentLoaded', function () {
  tour.next()
})

console.log('====↓↓↓↓↓ The code of this demo ↓↓↓↓↓====')
console.log(`
const tour = new Smartour({
  slotPosition: 'top',
  maskStyle: \`border-radius: 4px;\`
}).queue([{
  el: '.title',
  slot: \`
    <div class="guide guide-1">
      <p>This is my name!</p>
      <button class="btn btn-1">OK.</button>
    </div>
  \`,
  keyNodes: [{
    el: '.btn-1',
    event () {
      tour.reset({
        slotPosition: 'bottom-right',
        maskStyle: \`border-radius: 4px;\`
      })
      tour.next()
    }
  }]
}, {
  el: '.desc',
  slot: \`
    <div class="guide guide-2">
      <p>This is what my job is!</p>
      <button class="btn btn-2">Yeah.</button>
    </div>
  \`,
  keyNodes: [{
    el: '.btn-2',
    event () {
      tour.reset({
        slotPosition: 'bottom',
        maskStyle: \`border-radius: 4px;\`
      })
      tour.next()
    }
  }]
}, {
  el: '.link',
  slot: \`
    <div class="guide guide-3">
      <p>This is the document!</p>
      <button class="btn btn-3">Got it.</button>
    </div>
  \`,
  keyNodes: [{
    el: '.btn-3',
    event () {
      tour.over(tour)
    }
  }]
}])

tour.next()
`)