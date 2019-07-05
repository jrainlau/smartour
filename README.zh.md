在遇到网页内容有着较大调整的时候，往往需要一个导览功能去告诉用户，某某功能已经调整到另外一个位置。比较常规的办法是添加一个蒙层，高亮显示被调整的区域，然后通过文字介绍去完成引导。我们把这个功能称为“导览”，而 **Smartour** 则把这个导览的功能抽离出来，提供了一个开箱即用的解决方案。


# Install
**Smartour** 被构建成了 `umd` 和 `es module` 模块，允许用户通过不同的方式引入。

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

# 基本用法

**Smartour** 提供了一个非常简单的 API `focus()`, 这是高亮一个元素最简单的方式。

```javascript
let tour = new Smartour()

tour.focus({
  el: '#basic-usage'
})
```

# 插槽 Slot

插槽 `slot` 是用于为高亮元素提供描述的 html 字符串。

## 纯字符串:
```javascript
let tour = new Smartour()

tour.focus({
  el: '#pure-string',
  slot: 'This is a pure string'
})
```

## Html 字符串
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

## 插槽位置

插槽的位置可以选择4个不同的方向: `top`, `right`, `left`, `bottom`.

设置 `options.slotPosition` 属性即可覆盖默认的 `top` 位置。

```javascript
let tour = new Smartour()

tour.focus({
  el: '#slot-positions',
  slot: `top`,
  options: {
    slotPosition: 'top' // 默认为 `top`
  }
})
```buttonslot-bottom">Bottom</buttonbuttonbutton>

## 插槽事件
插槽所定义的元素也可以绑定事件。我们通过 `keyNodes` 属性来为插槽元素绑定事件。

`keyNodes` 是内容为一系列 `keyNode` 的数组。 属性 `keyNode.el` 是一个 css 选择器，而 `keyNode.event` 属性则是对应元素所绑定的事件。

```javascript
let tour = new Smartour()

tour.focus({
  el: '.slot-events-demo',
  options: {
    slotPosition: 'right'
  },
  slot: `

      Click here to occur an alert event
    </button>

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
有的时候页面需要不止一个导览。**Smartour** 允许你把一系列的导览通过 `.queue()` 放在一起，然后挨个挨个地展示它们。

举个例子:

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
  .run() // 别忘了调用 `run()` 方法去展示第一个导览
```

# 选项
**Smartour** 是一个构建函数，它接收一个 `options` 参数去覆盖其默认选项

让我们看看它的默认选项是什么样子的：

```javascript
{
  prefix: 'smartour', // class 前缀
  padding: 5, // 高亮区域内边距
  maskColor: 'rgba(0, 0, 0, .5)', // 带透明值的遮罩层颜色
  animate: true, // 是否使用动画
  slotPosition: 'top' // 默认的插槽位置
  layerEvent: smartour.over // 遮罩层点击事件，默认为结束导览
}
```

# APIs
除了 `.focus()`，`.queue()` 和 `.run()` API 以外，**Smartour** 还提供了另外三个 API 专门用于控制导览的展示。

- `.next()`：展示下一个导览（只能配合 `.queue()` 使用）。

- `.prev()`：展示上一个导览（只能配合 `.queue()` 使用）。
  
- `.over()`：结束全部导览。

# Smartour 的原理

**Smartour** 通过 `element.getBoundingClientRect()` api 来获取目标元素的宽高和位置信息，然后放置一个带着 `box-shadow` 样式的元素在其之上作为高亮区域。

由于点击事件无法再 `box-shadow` 的区域里触发，所以 **Smartour** 还放置了一个全屏透明的遮罩层用于绑定 `layerEvent` 事件。

高亮区域和插槽都被设置为 `absolute`。当页面滚动时，`document.documentElement.scrollTop` 或者 `document.documentElement.scrollLeft` 的值就会变化，然后 **Smartour** 会实时修正它的位置信息。

# 证书
MIT