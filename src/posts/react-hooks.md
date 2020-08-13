---
title: React Hooks
date: '2020-08-13'
---

I'm a big fan of the Syntax.fm podcast and I recently did the Level Up Tutorials [Custom React Hooks](https://www.leveluptutorials.com/tutorials/custom-react-hooks) course.
It was really good and definitely helped me gain a deeper understanding of React Hooks, plus some best practices and code organisation techniques.

In particular, Lesson #12 (Custom Hooks for Context Providers) details this method for organising and using React Context.

Basically, it is a simple pattern that lets us import and use our app state like this:

```javascript
import { useAppState } from '../state'

const { isMenuOpen, toggleMenu } = useAppState()
```

No need to import `useContext` every time!

## Defining the hook

We start by writing the hook.
This is the only time you need to use either `createContext` or `useContext`.

`src/state/PageWrapper.js`

```javascript
import React, { createContext, useContext } from 'react'
import { useToggle } from '../hooks'

export const AppContext = createContext({
  isMenuOpen: false,
})

export const PageWrapper = ({ children }) => {
  const { isToggled, toggle } = useToggle(false)

  return (
    <AppContext.Provider
      value={{
        isMenuOpen: isToggled,
        toggleMenu: toggle,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppState = () => useContext(AppContext)
```

## Making it convenient

As long as our exports above are named appropraitely, this gives us a nice way of accessing all our state hooks in one place.

`src/state/index.js`

```
export * from "./PageWrapper";
```

## Setting it up

We need to wrap our App object in the PageWrapper:

`src/state/index.js`

```javascript
import { PageWrapper } from "./state";

function App() {
  return (
    <PageWrapper>
      <div>
        <Header>
          <Menu />
          <h1>Header</h1>
          // etc
        </Header>
      </div>
    </PageWrapper>
```

## Using it

Now we can use it in any child component:

```javascript
import React from 'react'
import { useAppState } from '../state'

const Nav = () => {
  const { isMenuOpen, toggleMenu } = useAppState()

  if (!isMenuOpen) return null
  return (
    <nav
      style={{
        background: 'var(--black)',
        color: 'white',
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        left: 0,
        right: 0,
      }}
    >
      <h1>Hello</h1>
      <button onClick={toggleMenu}>Close</button>
    </nav>
  )
}

export default Nav
```
