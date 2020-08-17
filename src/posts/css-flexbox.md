---
title: CSS Flexbox
date: '2020-08-17'
---

These two videos contain a good intro to Flexbox.
Worth running through whenever you need a Flexbox refresher.

- [Lesson 1](https://www.leveluptutorials.com/tutorials/modern-css-layouts/how-to-get-started-with-flexbox)
- [Lesson 2](https://www.leveluptutorials.com/tutorials/modern-css-layouts/flexbox-container-children)

I'll include some code snippets here when I get around to it.

## Align items inside container



```html
<style>
  h1 {
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 100;
    width: 200px;
  }
  .parent {
    display: flex;
    border: 1px solid blue;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 800px;
    height: 800px;
  }

  .el {
    width: 200px;
    border: 1px solid red;
    text-align: center;
  }
</style>

<main>
  <div class="parent">
    <h1>Svelte Min</h1>
    <p>
      Here is some text
    </p>
    <div class="el">One</div>
    <div class="el">Two</div>
  </div>
</main>
```


![Flex align](/images/flex-align-1.png)
