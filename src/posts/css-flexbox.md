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
![Flex align](/images/layout.gif)

- main-axis: The main axis of a flex container is the primary axis along which flex items are laid out. The direction is based on the flex-direction property.
- Layout is set using (for example) `justify-content: center;`.
- cross axis: The axis perpendicular to the main axis is called the cross axis. Its direction depends on the main axis direction.
- Layout on this axis is set using (for example) `align-items: center;`.

https://www.freecodecamp.org/news/flexbox-the-ultimate-css-flex-cheatsheet/


When we set `flex-direction: column` we are setting the main axis to be vertical.
Then, if we want to align items along the *horizontal* axis, we need to use align-items. 
