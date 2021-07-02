;(function (l, r) {
  if (l.getElementById('livereloadscript')) return
  r = l.createElement('script')
  r.async = 1
  r.src =
    '//' +
    (window.location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1'
  r.id = 'livereloadscript'
  l.getElementsByTagName('head')[0].appendChild(r)
})(window.document)
var app = (function () {
  'use strict'

  function noop() {}
  const identity = (x) => x
  function assign(tar, src) {
    // @ts-ignore
    for (const k in src) tar[k] = src[k]
    return tar
  }
  function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
      loc: { file, line, column, char },
    }
  }
  function run(fn) {
    return fn()
  }
  function blank_object() {
    return Object.create(null)
  }
  function run_all(fns) {
    fns.forEach(run)
  }
  function is_function(thing) {
    return typeof thing === 'function'
  }
  function safe_not_equal(a, b) {
    return a != a
      ? b == b
      : a !== b || (a && typeof a === 'object') || typeof a === 'function'
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0
  }
  function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
      throw new Error(`'${name}' is not a store with a 'subscribe' method`)
    }
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      return noop
    }
    const unsub = store.subscribe(...callbacks)
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub
  }
  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback))
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn)
      return definition[0](slot_ctx)
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
      ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
      : $$scope.ctx
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty))
      if ($$scope.dirty === undefined) {
        return lets
      }
      if (typeof lets === 'object') {
        const merged = []
        const len = Math.max($$scope.dirty.length, lets.length)
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i]
        }
        return merged
      }
      return $$scope.dirty | lets
    }
    return $$scope.dirty
  }
  function update_slot(
    slot,
    slot_definition,
    ctx,
    $$scope,
    dirty,
    get_slot_changes_fn,
    get_slot_context_fn,
  ) {
    const slot_changes = get_slot_changes(
      slot_definition,
      $$scope,
      dirty,
      get_slot_changes_fn,
    )
    if (slot_changes) {
      const slot_context = get_slot_context(
        slot_definition,
        ctx,
        $$scope,
        get_slot_context_fn,
      )
      slot.p(slot_context, slot_changes)
    }
  }
  function exclude_internal_props(props) {
    const result = {}
    for (const k in props) if (k[0] !== '$') result[k] = props[k]
    return result
  }
  function null_to_empty(value) {
    return value == null ? '' : value
  }
  function set_store_value(store, ret, value = ret) {
    store.set(value)
    return ret
  }
  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy)
      ? action_result.destroy
      : noop
  }

  const is_client = typeof window !== 'undefined'
  let now = is_client ? () => window.performance.now() : () => Date.now()
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop

  const tasks = new Set()
  function run_tasks(now) {
    tasks.forEach((task) => {
      if (!task.c(now)) {
        tasks.delete(task)
        task.f()
      }
    })
    if (tasks.size !== 0) raf(run_tasks)
  }
  /**
   * Creates a new task that runs on each raf frame
   * until it returns a falsy value or is aborted
   */
  function loop(callback) {
    let task
    if (tasks.size === 0) raf(run_tasks)
    return {
      promise: new Promise((fulfill) => {
        tasks.add((task = { c: callback, f: fulfill }))
      }),
      abort() {
        tasks.delete(task)
      },
    }
  }

  function append(target, node) {
    target.appendChild(node)
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null)
  }
  function detach(node) {
    node.parentNode.removeChild(node)
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching)
    }
  }
  function element(name) {
    return document.createElement(name)
  }
  function text(data) {
    return document.createTextNode(data)
  }
  function space() {
    return text(' ')
  }
  function empty() {
    return text('')
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options)
    return () => node.removeEventListener(event, handler, options)
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute)
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value)
  }
  function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__)
    for (const key in attributes) {
      if (attributes[key] == null) {
        node.removeAttribute(key)
      } else if (key === 'style') {
        node.style.cssText = attributes[key]
      } else if (key === '__value') {
        node.value = node[key] = attributes[key]
      } else if (descriptors[key] && descriptors[key].set) {
        node[key] = attributes[key]
      } else {
        attr(node, key, attributes[key])
      }
    }
  }
  function to_number(value) {
    return value === '' ? undefined : +value
  }
  function children(element) {
    return Array.from(element.childNodes)
  }
  function set_input_value(input, value) {
    input.value = value == null ? '' : value
  }
  function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
      const option = select.options[i]
      if (option.__value === value) {
        option.selected = true
        return
      }
    }
  }
  function select_value(select) {
    const selected_option =
      select.querySelector(':checked') || select.options[0]
    return selected_option && selected_option.__value
  }
  function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent')
    e.initCustomEvent(type, false, false, detail)
    return e
  }

  const active_docs = new Set()
  let active = 0
  // https://github.com/darkskyapp/string-hash/blob/master/index.js
  function hash(str) {
    let hash = 5381
    let i = str.length
    while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i)
    return hash >>> 0
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration
    let keyframes = '{\n'
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p)
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`
    const name = `__svelte_${hash(rule)}_${uid}`
    const doc = node.ownerDocument
    active_docs.add(doc)
    const stylesheet =
      doc.__svelte_stylesheet ||
      (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet)
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {})
    if (!current_rules[name]) {
      current_rules[name] = true
      stylesheet.insertRule(
        `@keyframes ${name} ${rule}`,
        stylesheet.cssRules.length,
      )
    }
    const animation = node.style.animation || ''
    node.style.animation = `${
      animation ? `${animation}, ` : ``
    }${name} ${duration}ms linear ${delay}ms 1 both`
    active += 1
    return name
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ')
    const next = previous.filter(
      name
        ? (anim) => anim.indexOf(name) < 0 // remove specific animation
        : (anim) => anim.indexOf('__svelte') === -1, // remove all Svelte animations
    )
    const deleted = previous.length - next.length
    if (deleted) {
      node.style.animation = next.join(', ')
      active -= deleted
      if (!active) clear_rules()
    }
  }
  function clear_rules() {
    raf(() => {
      if (active) return
      active_docs.forEach((doc) => {
        const stylesheet = doc.__svelte_stylesheet
        let i = stylesheet.cssRules.length
        while (i--) stylesheet.deleteRule(i)
        doc.__svelte_rules = {}
      })
      active_docs.clear()
    })
  }

  let current_component
  function set_current_component(component) {
    current_component = component
  }
  function get_current_component() {
    if (!current_component)
      throw new Error(`Function called outside component initialization`)
    return current_component
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn)
  }
  function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn)
  }
  function createEventDispatcher() {
    const component = get_current_component()
    return (type, detail) => {
      const callbacks = component.$$.callbacks[type]
      if (callbacks) {
        // TODO are there situations where events could be dispatched
        // in a server (non-DOM) environment?
        const event = custom_event(type, detail)
        callbacks.slice().forEach((fn) => {
          fn.call(component, event)
        })
      }
    }
  }
  function setContext(key, context) {
    get_current_component().$$.context.set(key, context)
  }
  function getContext(key) {
    return get_current_component().$$.context.get(key)
  }

  const dirty_components = []
  const binding_callbacks = []
  const render_callbacks = []
  const flush_callbacks = []
  const resolved_promise = Promise.resolve()
  let update_scheduled = false
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true
      resolved_promise.then(flush)
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn)
  }
  let flushing = false
  const seen_callbacks = new Set()
  function flush() {
    if (flushing) return
    flushing = true
    do {
      // first, call beforeUpdate functions
      // and update components
      for (let i = 0; i < dirty_components.length; i += 1) {
        const component = dirty_components[i]
        set_current_component(component)
        update(component.$$)
      }
      dirty_components.length = 0
      while (binding_callbacks.length) binding_callbacks.pop()()
      // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i]
        if (!seen_callbacks.has(callback)) {
          // ...so guard against infinite loops
          seen_callbacks.add(callback)
          callback()
        }
      }
      render_callbacks.length = 0
    } while (dirty_components.length)
    while (flush_callbacks.length) {
      flush_callbacks.pop()()
    }
    update_scheduled = false
    flushing = false
    seen_callbacks.clear()
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update()
      run_all($$.before_update)
      const dirty = $$.dirty
      $$.dirty = [-1]
      $$.fragment && $$.fragment.p($$.ctx, dirty)
      $$.after_update.forEach(add_render_callback)
    }
  }

  let promise
  function wait() {
    if (!promise) {
      promise = Promise.resolve()
      promise.then(() => {
        promise = null
      })
    }
    return promise
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`))
  }
  const outroing = new Set()
  let outros
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros, // parent group
    }
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c)
    }
    outros = outros.p
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block)
      block.i(local)
    }
  }
  function transition_out(block, local, detach, callback) {
    if (block && block.o) {
      if (outroing.has(block)) return
      outroing.add(block)
      outros.c.push(() => {
        outroing.delete(block)
        if (callback) {
          if (detach) block.d(1)
          callback()
        }
      })
      block.o(local)
    }
  }
  const null_transition = { duration: 0 }
  function create_in_transition(node, fn, params) {
    let config = fn(node, params)
    let running = false
    let animation_name
    let task
    let uid = 0
    function cleanup() {
      if (animation_name) delete_rule(node, animation_name)
    }
    function go() {
      const { delay = 0, duration = 300, easing = identity, tick = noop, css } =
        config || null_transition
      if (css)
        animation_name = create_rule(
          node,
          0,
          1,
          duration,
          delay,
          easing,
          css,
          uid++,
        )
      tick(0, 1)
      const start_time = now() + delay
      const end_time = start_time + duration
      if (task) task.abort()
      running = true
      add_render_callback(() => dispatch(node, true, 'start'))
      task = loop((now) => {
        if (running) {
          if (now >= end_time) {
            tick(1, 0)
            dispatch(node, true, 'end')
            cleanup()
            return (running = false)
          }
          if (now >= start_time) {
            const t = easing((now - start_time) / duration)
            tick(t, 1 - t)
          }
        }
        return running
      })
    }
    let started = false
    return {
      start() {
        if (started) return
        delete_rule(node)
        if (is_function(config)) {
          config = config()
          wait().then(go)
        } else {
          go()
        }
      },
      invalidate() {
        started = false
      },
      end() {
        if (running) {
          cleanup()
          running = false
        }
      },
    }
  }

  const globals =
    typeof window !== 'undefined'
      ? window
      : typeof globalThis !== 'undefined'
      ? globalThis
      : global

  function get_spread_update(levels, updates) {
    const update = {}
    const to_null_out = {}
    const accounted_for = { $$scope: 1 }
    let i = levels.length
    while (i--) {
      const o = levels[i]
      const n = updates[i]
      if (n) {
        for (const key in o) {
          if (!(key in n)) to_null_out[key] = 1
        }
        for (const key in n) {
          if (!accounted_for[key]) {
            update[key] = n[key]
            accounted_for[key] = 1
          }
        }
        levels[i] = n
      } else {
        for (const key in o) {
          accounted_for[key] = 1
        }
      }
    }
    for (const key in to_null_out) {
      if (!(key in update)) update[key] = undefined
    }
    return update
  }
  function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null
      ? spread_props
      : {}
  }
  function create_component(block) {
    block && block.c()
  }
  function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$
    fragment && fragment.m(target, anchor)
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function)
      if (on_destroy) {
        on_destroy.push(...new_on_destroy)
      } else {
        // Edge case - component was destroyed immediately,
        // most likely as a result of a binding initialising
        run_all(new_on_destroy)
      }
      component.$$.on_mount = []
    })
    after_update.forEach(add_render_callback)
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$
    if ($$.fragment !== null) {
      run_all($$.on_destroy)
      $$.fragment && $$.fragment.d(detaching)
      // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)
      $$.on_destroy = $$.fragment = null
      $$.ctx = []
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component)
      schedule_update()
      component.$$.dirty.fill(0)
    }
    component.$$.dirty[(i / 31) | 0] |= 1 << i % 31
  }
  function init(
    component,
    options,
    instance,
    create_fragment,
    not_equal,
    props,
    dirty = [-1],
  ) {
    const parent_component = current_component
    set_current_component(component)
    const prop_values = options.props || {}
    const $$ = (component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      before_update: [],
      after_update: [],
      context: new Map(parent_component ? parent_component.$$.context : []),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
    })
    let ready = false
    $$.ctx = instance
      ? instance(component, prop_values, (i, ret, ...rest) => {
          const value = rest.length ? rest[0] : ret
          if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
            if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value)
            if (ready) make_dirty(component, i)
          }
          return ret
        })
      : []
    $$.update()
    ready = true
    run_all($$.before_update)
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes)
        nodes.forEach(detach)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c()
      }
      if (options.intro) transition_in(component.$$.fragment)
      mount_component(component, options.target, options.anchor)
      flush()
    }
    set_current_component(parent_component)
  }
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1)
      this.$destroy = noop
    }
    $on(type, callback) {
      const callbacks =
        this.$$.callbacks[type] || (this.$$.callbacks[type] = [])
      callbacks.push(callback)
      return () => {
        const index = callbacks.indexOf(callback)
        if (index !== -1) callbacks.splice(index, 1)
      }
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true
        this.$$set($$props)
        this.$$.skip_bound = false
      }
    }
  }

  function dispatch_dev(type, detail) {
    document.dispatchEvent(
      custom_event(type, Object.assign({ version: '3.24.1' }, detail)),
    )
  }
  function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node })
    append(target, node)
  }
  function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor })
    insert(target, node, anchor)
  }
  function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node })
    detach(node)
  }
  function listen_dev(
    node,
    event,
    handler,
    options,
    has_prevent_default,
    has_stop_propagation,
  ) {
    const modifiers =
      options === true
        ? ['capture']
        : options
        ? Array.from(Object.keys(options))
        : []
    if (has_prevent_default) modifiers.push('preventDefault')
    if (has_stop_propagation) modifiers.push('stopPropagation')
    dispatch_dev('SvelteDOMAddEventListener', {
      node,
      event,
      handler,
      modifiers,
    })
    const dispose = listen(node, event, handler, options)
    return () => {
      dispatch_dev('SvelteDOMRemoveEventListener', {
        node,
        event,
        handler,
        modifiers,
      })
      dispose()
    }
  }
  function attr_dev(node, attribute, value) {
    attr(node, attribute, value)
    if (value == null)
      dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute })
    else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value })
  }
  function set_data_dev(text, data) {
    data = '' + data
    if (text.wholeText === data) return
    dispatch_dev('SvelteDOMSetData', { node: text, data })
    text.data = data
  }
  function validate_each_argument(arg) {
    if (
      typeof arg !== 'string' &&
      !(arg && typeof arg === 'object' && 'length' in arg)
    ) {
      let msg = '{#each} only iterates over array-like objects.'
      if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
        msg += ' You can use a spread to convert this iterable into an array.'
      }
      throw new Error(msg)
    }
  }
  function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
      if (!~keys.indexOf(slot_key)) {
        console.warn(`<${name}> received an unexpected slot "${slot_key}".`)
      }
    }
  }
  class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
      if (!options || (!options.target && !options.$$inline)) {
        throw new Error(`'target' is a required option`)
      }
      super()
    }
    $destroy() {
      super.$destroy()
      this.$destroy = () => {
        console.warn(`Component was already destroyed`) // eslint-disable-line no-console
      }
    }
    $capture_state() {}
    $inject_state() {}
  }

  const subscriber_queue = []
  /**
   * Creates a `Readable` store that allows reading by subscription.
   * @param value initial value
   * @param {StartStopNotifier}start start and stop notifications for subscriptions
   */
  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe,
    }
  }
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */
  function writable(value, start = noop) {
    let stop
    const subscribers = []
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value
        if (stop) {
          // store is ready
          const run_queue = !subscriber_queue.length
          for (let i = 0; i < subscribers.length; i += 1) {
            const s = subscribers[i]
            s[1]()
            subscriber_queue.push(s, value)
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1])
            }
            subscriber_queue.length = 0
          }
        }
      }
    }
    function update(fn) {
      set(fn(value))
    }
    function subscribe(run, invalidate = noop) {
      const subscriber = [run, invalidate]
      subscribers.push(subscriber)
      if (subscribers.length === 1) {
        stop = start(set) || noop
      }
      run(value)
      return () => {
        const index = subscribers.indexOf(subscriber)
        if (index !== -1) {
          subscribers.splice(index, 1)
        }
        if (subscribers.length === 0) {
          stop()
          stop = null
        }
      }
    }
    return { set, update, subscribe }
  }
  function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores)
    const stores_array = single ? [stores] : stores
    const auto = fn.length < 2
    return readable(initial_value, (set) => {
      let inited = false
      const values = []
      let pending = 0
      let cleanup = noop
      const sync = () => {
        if (pending) {
          return
        }
        cleanup()
        const result = fn(single ? values[0] : values, set)
        if (auto) {
          set(result)
        } else {
          cleanup = is_function(result) ? result : noop
        }
      }
      const unsubscribers = stores_array.map((store, i) =>
        subscribe(
          store,
          (value) => {
            values[i] = value
            pending &= ~(1 << i)
            if (inited) {
              sync()
            }
          },
          () => {
            pending |= 1 << i
          },
        ),
      )
      inited = true
      sync()
      return function stop() {
        run_all(unsubscribers)
        cleanup()
      }
    })
  }

  const LOCATION = {}
  const ROUTER = {}

  /**
   * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
   *
   * https://github.com/reach/router/blob/master/LICENSE
   * */

  function getLocation(source) {
    return {
      ...source.location,
      state: source.history.state,
      key: (source.history.state && source.history.state.key) || 'initial',
    }
  }

  function createHistory(source, options) {
    const listeners = []
    let location = getLocation(source)

    return {
      get location() {
        return location
      },

      listen(listener) {
        listeners.push(listener)

        const popstateListener = () => {
          location = getLocation(source)
          listener({ location, action: 'POP' })
        }

        source.addEventListener('popstate', popstateListener)

        return () => {
          source.removeEventListener('popstate', popstateListener)

          const index = listeners.indexOf(listener)
          listeners.splice(index, 1)
        }
      },

      navigate(to, { state, replace = false } = {}) {
        state = { ...state, key: Date.now() + '' }
        // try...catch iOS Safari limits to 100 pushState calls
        try {
          if (replace) {
            source.history.replaceState(state, null, to)
          } else {
            source.history.pushState(state, null, to)
          }
        } catch (e) {
          source.location[replace ? 'replace' : 'assign'](to)
        }

        location = getLocation(source)
        listeners.forEach((listener) => listener({ location, action: 'PUSH' }))
      },
    }
  }

  // Stores history entries in memory for testing or other platforms like Native
  function createMemorySource(initialPathname = '/') {
    let index = 0
    const stack = [{ pathname: initialPathname, search: '' }]
    const states = []

    return {
      get location() {
        return stack[index]
      },
      addEventListener(name, fn) {},
      removeEventListener(name, fn) {},
      history: {
        get entries() {
          return stack
        },
        get index() {
          return index
        },
        get state() {
          return states[index]
        },
        pushState(state, _, uri) {
          const [pathname, search = ''] = uri.split('?')
          index++
          stack.push({ pathname, search })
          states.push(state)
        },
        replaceState(state, _, uri) {
          const [pathname, search = ''] = uri.split('?')
          stack[index] = { pathname, search }
          states[index] = state
        },
      },
    }
  }

  // Global history uses window.history as the source if available,
  // otherwise a memory history
  const canUseDOM = Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  )
  const globalHistory = createHistory(canUseDOM ? window : createMemorySource())
  const { navigate } = globalHistory

  /**
   * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
   *
   * https://github.com/reach/router/blob/master/LICENSE
   * */

  const paramRe = /^:(.+)/

  const SEGMENT_POINTS = 4
  const STATIC_POINTS = 3
  const DYNAMIC_POINTS = 2
  const SPLAT_PENALTY = 1
  const ROOT_POINTS = 1

  /**
   * Check if `string` starts with `search`
   * @param {string} string
   * @param {string} search
   * @return {boolean}
   */
  function startsWith(string, search) {
    return string.substr(0, search.length) === search
  }

  /**
   * Check if `segment` is a root segment
   * @param {string} segment
   * @return {boolean}
   */
  function isRootSegment(segment) {
    return segment === ''
  }

  /**
   * Check if `segment` is a dynamic segment
   * @param {string} segment
   * @return {boolean}
   */
  function isDynamic(segment) {
    return paramRe.test(segment)
  }

  /**
   * Check if `segment` is a splat
   * @param {string} segment
   * @return {boolean}
   */
  function isSplat(segment) {
    return segment[0] === '*'
  }

  /**
   * Split up the URI into segments delimited by `/`
   * @param {string} uri
   * @return {string[]}
   */
  function segmentize(uri) {
    return (
      uri
        // Strip starting/ending `/`
        .replace(/(^\/+|\/+$)/g, '')
        .split('/')
    )
  }

  /**
   * Strip `str` of potential start and end `/`
   * @param {string} str
   * @return {string}
   */
  function stripSlashes(str) {
    return str.replace(/(^\/+|\/+$)/g, '')
  }

  /**
   * Score a route depending on how its individual segments look
   * @param {object} route
   * @param {number} index
   * @return {object}
   */
  function rankRoute(route, index) {
    const score = route.default
      ? 0
      : segmentize(route.path).reduce((score, segment) => {
          score += SEGMENT_POINTS

          if (isRootSegment(segment)) {
            score += ROOT_POINTS
          } else if (isDynamic(segment)) {
            score += DYNAMIC_POINTS
          } else if (isSplat(segment)) {
            score -= SEGMENT_POINTS + SPLAT_PENALTY
          } else {
            score += STATIC_POINTS
          }

          return score
        }, 0)

    return { route, score, index }
  }

  /**
   * Give a score to all routes and sort them on that
   * @param {object[]} routes
   * @return {object[]}
   */
  function rankRoutes(routes) {
    return (
      routes
        .map(rankRoute)
        // If two routes have the exact same score, we go by index instead
        .sort((a, b) =>
          a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index,
        )
    )
  }

  /**
   * Ranks and picks the best route to match. Each segment gets the highest
   * amount of points, then the type of segment gets an additional amount of
   * points where
   *
   *  static > dynamic > splat > root
   *
   * This way we don't have to worry about the order of our routes, let the
   * computers do it.
   *
   * A route looks like this
   *
   *  { path, default, value }
   *
   * And a returned match looks like:
   *
   *  { route, params, uri }
   *
   * @param {object[]} routes
   * @param {string} uri
   * @return {?object}
   */
  function pick(routes, uri) {
    let match
    let default_

    const [uriPathname] = uri.split('?')
    const uriSegments = segmentize(uriPathname)
    const isRootUri = uriSegments[0] === ''
    const ranked = rankRoutes(routes)

    for (let i = 0, l = ranked.length; i < l; i++) {
      const route = ranked[i].route
      let missed = false

      if (route.default) {
        default_ = {
          route,
          params: {},
          uri,
        }
        continue
      }

      const routeSegments = segmentize(route.path)
      const params = {}
      const max = Math.max(uriSegments.length, routeSegments.length)
      let index = 0

      for (; index < max; index++) {
        const routeSegment = routeSegments[index]
        const uriSegment = uriSegments[index]

        if (routeSegment !== undefined && isSplat(routeSegment)) {
          // Hit a splat, just grab the rest, and return a match
          // uri:   /files/documents/work
          // route: /files/* or /files/*splatname
          const splatName = routeSegment === '*' ? '*' : routeSegment.slice(1)

          params[splatName] = uriSegments
            .slice(index)
            .map(decodeURIComponent)
            .join('/')
          break
        }

        if (uriSegment === undefined) {
          // URI is shorter than the route, no match
          // uri:   /users
          // route: /users/:userId
          missed = true
          break
        }

        let dynamicMatch = paramRe.exec(routeSegment)

        if (dynamicMatch && !isRootUri) {
          const value = decodeURIComponent(uriSegment)
          params[dynamicMatch[1]] = value
        } else if (routeSegment !== uriSegment) {
          // Current segments don't match, not dynamic, not splat, so no match
          // uri:   /users/123/settings
          // route: /users/:id/profile
          missed = true
          break
        }
      }

      if (!missed) {
        match = {
          route,
          params,
          uri: '/' + uriSegments.slice(0, index).join('/'),
        }
        break
      }
    }

    return match || default_ || null
  }

  /**
   * Check if the `path` matches the `uri`.
   * @param {string} path
   * @param {string} uri
   * @return {?object}
   */
  function match(route, uri) {
    return pick([route], uri)
  }

  /**
   * Add the query to the pathname if a query is given
   * @param {string} pathname
   * @param {string} [query]
   * @return {string}
   */
  function addQuery(pathname, query) {
    return pathname + (query ? `?${query}` : '')
  }

  /**
   * Resolve URIs as though every path is a directory, no files. Relative URIs
   * in the browser can feel awkward because not only can you be "in a directory",
   * you can be "at a file", too. For example:
   *
   *  browserSpecResolve('foo', '/bar/') => /bar/foo
   *  browserSpecResolve('foo', '/bar') => /foo
   *
   * But on the command line of a file system, it's not as complicated. You can't
   * `cd` from a file, only directories. This way, links have to know less about
   * their current path. To go deeper you can do this:
   *
   *  <Link to="deeper"/>
   *  // instead of
   *  <Link to=`{${props.uri}/deeper}`/>
   *
   * Just like `cd`, if you want to go deeper from the command line, you do this:
   *
   *  cd deeper
   *  # not
   *  cd $(pwd)/deeper
   *
   * By treating every path as a directory, linking to relative paths should
   * require less contextual information and (fingers crossed) be more intuitive.
   * @param {string} to
   * @param {string} base
   * @return {string}
   */
  function resolve(to, base) {
    // /foo/bar, /baz/qux => /foo/bar
    if (startsWith(to, '/')) {
      return to
    }

    const [toPathname, toQuery] = to.split('?')
    const [basePathname] = base.split('?')
    const toSegments = segmentize(toPathname)
    const baseSegments = segmentize(basePathname)

    // ?a=b, /users?b=c => /users?a=b
    if (toSegments[0] === '') {
      return addQuery(basePathname, toQuery)
    }

    // profile, /users/789 => /users/789/profile
    if (!startsWith(toSegments[0], '.')) {
      const pathname = baseSegments.concat(toSegments).join('/')

      return addQuery((basePathname === '/' ? '' : '/') + pathname, toQuery)
    }

    // ./       , /users/123 => /users/123
    // ../      , /users/123 => /users
    // ../..    , /users/123 => /
    // ../../one, /a/b/c/d   => /a/b/one
    // .././one , /a/b/c/d   => /a/b/c/one
    const allSegments = baseSegments.concat(toSegments)
    const segments = []

    allSegments.forEach((segment) => {
      if (segment === '..') {
        segments.pop()
      } else if (segment !== '.') {
        segments.push(segment)
      }
    })

    return addQuery('/' + segments.join('/'), toQuery)
  }

  /**
   * Combines the `basepath` and the `path` into one path.
   * @param {string} basepath
   * @param {string} path
   */
  function combinePaths(basepath, path) {
    return `${stripSlashes(
      path === '/'
        ? basepath
        : `${stripSlashes(basepath)}/${stripSlashes(path)}`,
    )}/`
  }

  /**
   * Decides whether a given `event` should result in a navigation or not.
   * @param {object} event
   */
  function shouldNavigate(event) {
    return (
      !event.defaultPrevented &&
      event.button === 0 &&
      !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    )
  }

  function hostMatches(anchor) {
    const host = location.host
    return (
      anchor.host == host ||
      // svelte seems to kill anchor.host value in ie11, so fall back to checking href
      anchor.href.indexOf(`https://${host}`) === 0 ||
      anchor.href.indexOf(`http://${host}`) === 0
    )
  }

  /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.24.1 */

  function create_fragment(ctx) {
    let current
    const default_slot_template = /*$$slots*/ ctx[6].default
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[5],
      null,
    )

    const block = {
      c: function create() {
        if (default_slot) default_slot.c()
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor)
        }

        current = true
      },
      p: function update(ctx, [dirty]) {
        if (default_slot) {
          if (default_slot.p && dirty & /*$$scope*/ 32) {
            update_slot(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[5],
              dirty,
              null,
              null,
            )
          }
        }
      },
      i: function intro(local) {
        if (current) return
        transition_in(default_slot, local)
        current = true
      },
      o: function outro(local) {
        transition_out(default_slot, local)
        current = false
      },
      d: function destroy(detaching) {
        if (default_slot) default_slot.d(detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance($$self, $$props, $$invalidate) {
    let $base
    let $location
    let $routes
    let { basepath = '/' } = $$props
    let { url = null } = $$props
    const locationContext = getContext(LOCATION)
    const routerContext = getContext(ROUTER)
    const routes = writable([])
    validate_store(routes, 'routes')
    component_subscribe($$self, routes, (value) =>
      $$invalidate(10, ($routes = value)),
    )
    const activeRoute = writable(null)
    let hasActiveRoute = false // Used in SSR to synchronously set that a Route is active.

    // If locationContext is not set, this is the topmost Router in the tree.
    // If the `url` prop is given we force the location to it.
    const location =
      locationContext ||
      writable(url ? { pathname: url } : globalHistory.location)

    validate_store(location, 'location')
    component_subscribe($$self, location, (value) =>
      $$invalidate(9, ($location = value)),
    )

    // If routerContext is set, the routerBase of the parent Router
    // will be the base for this Router's descendants.
    // If routerContext is not set, the path and resolved uri will both
    // have the value of the basepath prop.
    const base = routerContext
      ? routerContext.routerBase
      : writable({ path: basepath, uri: basepath })

    validate_store(base, 'base')
    component_subscribe($$self, base, (value) =>
      $$invalidate(8, ($base = value)),
    )

    const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
      // If there is no activeRoute, the routerBase will be identical to the base.
      if (activeRoute === null) {
        return base
      }

      const { path: basepath } = base
      const { route, uri } = activeRoute

      // Remove the potential /* or /*splatname from
      // the end of the child Routes relative paths.
      const path = route.default ? basepath : route.path.replace(/\*.*$/, '')

      return { path, uri }
    })

    function registerRoute(route) {
      const { path: basepath } = $base
      let { path } = route

      // We store the original path in the _path property so we can reuse
      // it when the basepath changes. The only thing that matters is that
      // the route reference is intact, so mutation is fine.
      route._path = path

      route.path = combinePaths(basepath, path)

      if (typeof window === 'undefined') {
        // In SSR we should set the activeRoute immediately if it is a match.
        // If there are more Routes being registered after a match is found,
        // we just skip them.
        if (hasActiveRoute) {
          return
        }

        const matchingRoute = match(route, $location.pathname)

        if (matchingRoute) {
          activeRoute.set(matchingRoute)
          hasActiveRoute = true
        }
      } else {
        routes.update((rs) => {
          rs.push(route)
          return rs
        })
      }
    }

    function unregisterRoute(route) {
      routes.update((rs) => {
        const index = rs.indexOf(route)
        rs.splice(index, 1)
        return rs
      })
    }

    if (!locationContext) {
      // The topmost Router in the tree is responsible for updating
      // the location store and supplying it through context.
      onMount(() => {
        const unlisten = globalHistory.listen((history) => {
          location.set(history.location)
        })

        return unlisten
      })

      setContext(LOCATION, location)
    }

    setContext(ROUTER, {
      activeRoute,
      base,
      routerBase,
      registerRoute,
      unregisterRoute,
    })

    const writable_props = ['basepath', 'url']

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<Router> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Router', $$slots, ['default'])

    $$self.$$set = ($$props) => {
      if ('basepath' in $$props) $$invalidate(3, (basepath = $$props.basepath))
      if ('url' in $$props) $$invalidate(4, (url = $$props.url))
      if ('$$scope' in $$props) $$invalidate(5, ($$scope = $$props.$$scope))
    }

    $$self.$capture_state = () => ({
      getContext,
      setContext,
      onMount,
      writable,
      derived,
      LOCATION,
      ROUTER,
      globalHistory,
      pick,
      match,
      stripSlashes,
      combinePaths,
      basepath,
      url,
      locationContext,
      routerContext,
      routes,
      activeRoute,
      hasActiveRoute,
      location,
      base,
      routerBase,
      registerRoute,
      unregisterRoute,
      $base,
      $location,
      $routes,
    })

    $$self.$inject_state = ($$props) => {
      if ('basepath' in $$props) $$invalidate(3, (basepath = $$props.basepath))
      if ('url' in $$props) $$invalidate(4, (url = $$props.url))
      if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute
    }

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$base*/ 256) {
        // This reactive statement will update all the Routes' path when
        // the basepath changes.
        {
          const { path: basepath } = $base

          routes.update((rs) => {
            rs.forEach((r) => (r.path = combinePaths(basepath, r._path)))
            return rs
          })
        }
      }

      if ($$self.$$.dirty & /*$routes, $location*/ 1536) {
        // This reactive statement will be run when the Router is created
        // when there are no Routes and then again the following tick, so it
        // will not find an active Route in SSR and in the browser it will only
        // pick an active Route after all Routes have been registered.
        {
          const bestMatch = pick($routes, $location.pathname)
          activeRoute.set(bestMatch)
        }
      }
    }

    return [routes, location, base, basepath, url, $$scope, $$slots]
  }

  class Router extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance, create_fragment, safe_not_equal, {
        basepath: 3,
        url: 4,
      })

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Router',
        options,
        id: create_fragment.name,
      })
    }

    get basepath() {
      throw new Error(
        "<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set basepath(value) {
      throw new Error(
        "<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    get url() {
      throw new Error(
        "<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set url(value) {
      throw new Error(
        "<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }
  }

  /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.24.1 */

  const get_default_slot_changes = (dirty) => ({
    params: dirty & /*routeParams*/ 2,
    location: dirty & /*$location*/ 16,
  })

  const get_default_slot_context = (ctx) => ({
    params: /*routeParams*/ ctx[1],
    location: /*$location*/ ctx[4],
  })

  // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
  function create_if_block(ctx) {
    let current_block_type_index
    let if_block
    let if_block_anchor
    let current
    const if_block_creators = [create_if_block_1, create_else_block]
    const if_blocks = []

    function select_block_type(ctx, dirty) {
      if (/*component*/ ctx[0] !== null) return 0
      return 1
    }

    current_block_type_index = select_block_type(ctx)
    if_block = if_blocks[current_block_type_index] = if_block_creators[
      current_block_type_index
    ](ctx)

    const block = {
      c: function create() {
        if_block.c()
        if_block_anchor = empty()
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor)
        insert_dev(target, if_block_anchor, anchor)
        current = true
      },
      p: function update(ctx, dirty) {
        let previous_block_index = current_block_type_index
        current_block_type_index = select_block_type(ctx)

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty)
        } else {
          group_outros()

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null
          })

          check_outros()
          if_block = if_blocks[current_block_type_index]

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[
              current_block_type_index
            ](ctx)
            if_block.c()
          }

          transition_in(if_block, 1)
          if_block.m(if_block_anchor.parentNode, if_block_anchor)
        }
      },
      i: function intro(local) {
        if (current) return
        transition_in(if_block)
        current = true
      },
      o: function outro(local) {
        transition_out(if_block)
        current = false
      },
      d: function destroy(detaching) {
        if_blocks[current_block_type_index].d(detaching)
        if (detaching) detach_dev(if_block_anchor)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_if_block.name,
      type: 'if',
      source:
        '(40:0) {#if $activeRoute !== null && $activeRoute.route === route}',
      ctx,
    })

    return block
  }

  // (43:2) {:else}
  function create_else_block(ctx) {
    let current
    const default_slot_template = /*$$slots*/ ctx[10].default
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[9],
      get_default_slot_context,
    )

    const block = {
      c: function create() {
        if (default_slot) default_slot.c()
      },
      m: function mount(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor)
        }

        current = true
      },
      p: function update(ctx, dirty) {
        if (default_slot) {
          if (
            default_slot.p &&
            dirty & /*$$scope, routeParams, $location*/ 530
          ) {
            update_slot(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[9],
              dirty,
              get_default_slot_changes,
              get_default_slot_context,
            )
          }
        }
      },
      i: function intro(local) {
        if (current) return
        transition_in(default_slot, local)
        current = true
      },
      o: function outro(local) {
        transition_out(default_slot, local)
        current = false
      },
      d: function destroy(detaching) {
        if (default_slot) default_slot.d(detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_else_block.name,
      type: 'else',
      source: '(43:2) {:else}',
      ctx,
    })

    return block
  }

  // (41:2) {#if component !== null}
  function create_if_block_1(ctx) {
    let switch_instance
    let switch_instance_anchor
    let current

    const switch_instance_spread_levels = [
      { location: /*$location*/ ctx[4] },
      /*routeParams*/ ctx[1],
      /*routeProps*/ ctx[2],
    ]

    var switch_value = /*component*/ ctx[0]

    function switch_props(ctx) {
      let switch_instance_props = {}

      for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
        switch_instance_props = assign(
          switch_instance_props,
          switch_instance_spread_levels[i],
        )
      }

      return {
        props: switch_instance_props,
        $$inline: true,
      }
    }

    if (switch_value) {
      switch_instance = new switch_value(switch_props())
    }

    const block = {
      c: function create() {
        if (switch_instance) create_component(switch_instance.$$.fragment)
        switch_instance_anchor = empty()
      },
      m: function mount(target, anchor) {
        if (switch_instance) {
          mount_component(switch_instance, target, anchor)
        }

        insert_dev(target, switch_instance_anchor, anchor)
        current = true
      },
      p: function update(ctx, dirty) {
        const switch_instance_changes =
          dirty & /*$location, routeParams, routeProps*/ 22
            ? get_spread_update(switch_instance_spread_levels, [
                dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
                dirty & /*routeParams*/ 2 &&
                  get_spread_object(/*routeParams*/ ctx[1]),
                dirty & /*routeProps*/ 4 &&
                  get_spread_object(/*routeProps*/ ctx[2]),
              ])
            : {}

        if (switch_value !== (switch_value = /*component*/ ctx[0])) {
          if (switch_instance) {
            group_outros()
            const old_component = switch_instance

            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1)
            })

            check_outros()
          }

          if (switch_value) {
            switch_instance = new switch_value(switch_props())
            create_component(switch_instance.$$.fragment)
            transition_in(switch_instance.$$.fragment, 1)
            mount_component(
              switch_instance,
              switch_instance_anchor.parentNode,
              switch_instance_anchor,
            )
          } else {
            switch_instance = null
          }
        } else if (switch_value) {
          switch_instance.$set(switch_instance_changes)
        }
      },
      i: function intro(local) {
        if (current) return
        if (switch_instance) transition_in(switch_instance.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        if (switch_instance) transition_out(switch_instance.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(switch_instance_anchor)
        if (switch_instance) destroy_component(switch_instance, detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_if_block_1.name,
      type: 'if',
      source: '(41:2) {#if component !== null}',
      ctx,
    })

    return block
  }

  function create_fragment$1(ctx) {
    let if_block_anchor
    let current
    let if_block =
      /*$activeRoute*/ ctx[3] !== null &&
      /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7] &&
      create_if_block(ctx)

    const block = {
      c: function create() {
        if (if_block) if_block.c()
        if_block_anchor = empty()
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor)
        insert_dev(target, if_block_anchor, anchor)
        current = true
      },
      p: function update(ctx, [dirty]) {
        if (
          /*$activeRoute*/ ctx[3] !== null &&
          /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7]
        ) {
          if (if_block) {
            if_block.p(ctx, dirty)

            if (dirty & /*$activeRoute*/ 8) {
              transition_in(if_block, 1)
            }
          } else {
            if_block = create_if_block(ctx)
            if_block.c()
            transition_in(if_block, 1)
            if_block.m(if_block_anchor.parentNode, if_block_anchor)
          }
        } else if (if_block) {
          group_outros()

          transition_out(if_block, 1, 1, () => {
            if_block = null
          })

          check_outros()
        }
      },
      i: function intro(local) {
        if (current) return
        transition_in(if_block)
        current = true
      },
      o: function outro(local) {
        transition_out(if_block)
        current = false
      },
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching)
        if (detaching) detach_dev(if_block_anchor)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$1.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$1($$self, $$props, $$invalidate) {
    let $activeRoute
    let $location
    let { path = '' } = $$props
    let { component = null } = $$props
    const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER)
    validate_store(activeRoute, 'activeRoute')
    component_subscribe($$self, activeRoute, (value) =>
      $$invalidate(3, ($activeRoute = value)),
    )
    const location = getContext(LOCATION)
    validate_store(location, 'location')
    component_subscribe($$self, location, (value) =>
      $$invalidate(4, ($location = value)),
    )

    const route = {
      path,
      // If no path prop is given, this Route will act as the default Route
      // that is rendered if no other Route in the Router is a match.
      default: path === '',
    }

    let routeParams = {}
    let routeProps = {}
    registerRoute(route)

    // There is no need to unregister Routes in SSR since it will all be
    // thrown away anyway.
    if (typeof window !== 'undefined') {
      onDestroy(() => {
        unregisterRoute(route)
      })
    }

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Route', $$slots, ['default'])

    $$self.$$set = ($$new_props) => {
      $$invalidate(
        13,
        ($$props = assign(
          assign({}, $$props),
          exclude_internal_props($$new_props),
        )),
      )
      if ('path' in $$new_props) $$invalidate(8, (path = $$new_props.path))
      if ('component' in $$new_props)
        $$invalidate(0, (component = $$new_props.component))
      if ('$$scope' in $$new_props)
        $$invalidate(9, ($$scope = $$new_props.$$scope))
    }

    $$self.$capture_state = () => ({
      getContext,
      onDestroy,
      ROUTER,
      LOCATION,
      path,
      component,
      registerRoute,
      unregisterRoute,
      activeRoute,
      location,
      route,
      routeParams,
      routeProps,
      $activeRoute,
      $location,
    })

    $$self.$inject_state = ($$new_props) => {
      $$invalidate(13, ($$props = assign(assign({}, $$props), $$new_props)))
      if ('path' in $$props) $$invalidate(8, (path = $$new_props.path))
      if ('component' in $$props)
        $$invalidate(0, (component = $$new_props.component))
      if ('routeParams' in $$props)
        $$invalidate(1, (routeParams = $$new_props.routeParams))
      if ('routeProps' in $$props)
        $$invalidate(2, (routeProps = $$new_props.routeProps))
    }

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$activeRoute*/ 8) {
        if ($activeRoute && $activeRoute.route === route) {
          $$invalidate(1, (routeParams = $activeRoute.params))
        }
      }

      {
        const { path, component, ...rest } = $$props
        $$invalidate(2, (routeProps = rest))
      }
    }

    $$props = exclude_internal_props($$props)

    return [
      component,
      routeParams,
      routeProps,
      $activeRoute,
      $location,
      activeRoute,
      location,
      route,
      path,
      $$scope,
      $$slots,
    ]
  }

  class Route extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$1, create_fragment$1, safe_not_equal, {
        path: 8,
        component: 0,
      })

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Route',
        options,
        id: create_fragment$1.name,
      })
    }

    get path() {
      throw new Error(
        "<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set path(value) {
      throw new Error(
        "<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    get component() {
      throw new Error(
        "<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set component(value) {
      throw new Error(
        "<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }
  }

  /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.24.1 */
  const file = 'node_modules/svelte-routing/src/Link.svelte'

  function create_fragment$2(ctx) {
    let a
    let current
    let mounted
    let dispose
    const default_slot_template = /*$$slots*/ ctx[11].default
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[10],
      null,
    )

    let a_levels = [
      { href: /*href*/ ctx[0] },
      { 'aria-current': /*ariaCurrent*/ ctx[2] },
      /*props*/ ctx[1],
    ]

    let a_data = {}

    for (let i = 0; i < a_levels.length; i += 1) {
      a_data = assign(a_data, a_levels[i])
    }

    const block = {
      c: function create() {
        a = element('a')
        if (default_slot) default_slot.c()
        set_attributes(a, a_data)
        add_location(a, file, 40, 0, 1249)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, a, anchor)

        if (default_slot) {
          default_slot.m(a, null)
        }

        current = true

        if (!mounted) {
          dispose = listen_dev(
            a,
            'click',
            /*onClick*/ ctx[5],
            false,
            false,
            false,
          )
          mounted = true
        }
      },
      p: function update(ctx, [dirty]) {
        if (default_slot) {
          if (default_slot.p && dirty & /*$$scope*/ 1024) {
            update_slot(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[10],
              dirty,
              null,
              null,
            )
          }
        }

        set_attributes(
          a,
          (a_data = get_spread_update(a_levels, [
            (!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
            (!current || dirty & /*ariaCurrent*/ 4) && {
              'aria-current': /*ariaCurrent*/ ctx[2],
            },
            dirty & /*props*/ 2 && /*props*/ ctx[1],
          ])),
        )
      },
      i: function intro(local) {
        if (current) return
        transition_in(default_slot, local)
        current = true
      },
      o: function outro(local) {
        transition_out(default_slot, local)
        current = false
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(a)
        if (default_slot) default_slot.d(detaching)
        mounted = false
        dispose()
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$2.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$2($$self, $$props, $$invalidate) {
    let $base
    let $location
    let { to = '#' } = $$props
    let { replace = false } = $$props
    let { state = {} } = $$props
    let { getProps = () => ({}) } = $$props
    const { base } = getContext(ROUTER)
    validate_store(base, 'base')
    component_subscribe($$self, base, (value) =>
      $$invalidate(14, ($base = value)),
    )
    const location = getContext(LOCATION)
    validate_store(location, 'location')
    component_subscribe($$self, location, (value) =>
      $$invalidate(15, ($location = value)),
    )
    const dispatch = createEventDispatcher()
    let href, isPartiallyCurrent, isCurrent, props

    function onClick(event) {
      dispatch('click', event)

      if (shouldNavigate(event)) {
        event.preventDefault()

        // Don't push another entry to the history stack when the user
        // clicks on a Link to the page they are currently on.
        const shouldReplace = $location.pathname === href || replace

        navigate(href, { state, replace: shouldReplace })
      }
    }

    const writable_props = ['to', 'replace', 'state', 'getProps']

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<Link> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Link', $$slots, ['default'])

    $$self.$$set = ($$props) => {
      if ('to' in $$props) $$invalidate(6, (to = $$props.to))
      if ('replace' in $$props) $$invalidate(7, (replace = $$props.replace))
      if ('state' in $$props) $$invalidate(8, (state = $$props.state))
      if ('getProps' in $$props) $$invalidate(9, (getProps = $$props.getProps))
      if ('$$scope' in $$props) $$invalidate(10, ($$scope = $$props.$$scope))
    }

    $$self.$capture_state = () => ({
      getContext,
      createEventDispatcher,
      ROUTER,
      LOCATION,
      navigate,
      startsWith,
      resolve,
      shouldNavigate,
      to,
      replace,
      state,
      getProps,
      base,
      location,
      dispatch,
      href,
      isPartiallyCurrent,
      isCurrent,
      props,
      onClick,
      $base,
      $location,
      ariaCurrent,
    })

    $$self.$inject_state = ($$props) => {
      if ('to' in $$props) $$invalidate(6, (to = $$props.to))
      if ('replace' in $$props) $$invalidate(7, (replace = $$props.replace))
      if ('state' in $$props) $$invalidate(8, (state = $$props.state))
      if ('getProps' in $$props) $$invalidate(9, (getProps = $$props.getProps))
      if ('href' in $$props) $$invalidate(0, (href = $$props.href))
      if ('isPartiallyCurrent' in $$props)
        $$invalidate(12, (isPartiallyCurrent = $$props.isPartiallyCurrent))
      if ('isCurrent' in $$props)
        $$invalidate(13, (isCurrent = $$props.isCurrent))
      if ('props' in $$props) $$invalidate(1, (props = $$props.props))
      if ('ariaCurrent' in $$props)
        $$invalidate(2, (ariaCurrent = $$props.ariaCurrent))
    }

    let ariaCurrent

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*to, $base*/ 16448) {
        $$invalidate(
          0,
          (href = to === '/' ? $base.uri : resolve(to, $base.uri)),
        )
      }

      if ($$self.$$.dirty & /*$location, href*/ 32769) {
        $$invalidate(
          12,
          (isPartiallyCurrent = startsWith($location.pathname, href)),
        )
      }

      if ($$self.$$.dirty & /*href, $location*/ 32769) {
        $$invalidate(13, (isCurrent = href === $location.pathname))
      }

      if ($$self.$$.dirty & /*isCurrent*/ 8192) {
        $$invalidate(2, (ariaCurrent = isCurrent ? 'page' : undefined))
      }

      if (
        $$self.$$.dirty &
        /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 45569
      ) {
        $$invalidate(
          1,
          (props = getProps({
            location: $location,
            href,
            isPartiallyCurrent,
            isCurrent,
          })),
        )
      }
    }

    return [
      href,
      props,
      ariaCurrent,
      base,
      location,
      onClick,
      to,
      replace,
      state,
      getProps,
      $$scope,
      $$slots,
    ]
  }

  class Link extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$2, create_fragment$2, safe_not_equal, {
        to: 6,
        replace: 7,
        state: 8,
        getProps: 9,
      })

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Link',
        options,
        id: create_fragment$2.name,
      })
    }

    get to() {
      throw new Error(
        "<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set to(value) {
      throw new Error(
        "<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    get replace() {
      throw new Error(
        "<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set replace(value) {
      throw new Error(
        "<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    get state() {
      throw new Error(
        "<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set state(value) {
      throw new Error(
        "<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    get getProps() {
      throw new Error(
        "<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set getProps(value) {
      throw new Error(
        "<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }
  }

  /**
   * An action to be added at a root element of your application to
   * capture all relative links and push them onto the history stack.
   *
   * Example:
   * ```html
   * <div use:links>
   *   <Router>
   *     <Route path="/" component={Home} />
   *     <Route path="/p/:projectId/:docId?" component={ProjectScreen} />
   *     {#each projects as project}
   *       <a href="/p/{project.id}">{project.title}</a>
   *     {/each}
   *   </Router>
   * </div>
   * ```
   */
  function links(node) {
    function findClosest(tagName, el) {
      while (el && el.tagName !== tagName) {
        el = el.parentNode
      }
      return el
    }

    function onClick(event) {
      const anchor = findClosest('A', event.target)

      if (
        anchor &&
        anchor.target === '' &&
        hostMatches(anchor) &&
        shouldNavigate(event) &&
        !anchor.hasAttribute('noroute')
      ) {
        event.preventDefault()
        navigate(anchor.pathname + anchor.search, {
          replace: anchor.hasAttribute('replace'),
        })
      }
    }

    node.addEventListener('click', onClick)

    return {
      destroy() {
        node.removeEventListener('click', onClick)
      },
    }
  }

  /* src/components/Logo.svelte generated by Svelte v3.24.1 */

  const file$1 = 'src/components/Logo.svelte'

  function create_fragment$3(ctx) {
    let a
    let img
    let img_src_value

    const block = {
      c: function create() {
        a = element('a')
        img = element('img')
        attr_dev(img, 'alt', 'Sapper')
        if (img.src !== (img_src_value = 'logo-192.png'))
          attr_dev(img, 'src', img_src_value)
        attr_dev(img, 'class', 'svelte-nsstmh')
        add_location(img, file$1, 9, 2, 100)
        attr_dev(a, 'href', '/')
        add_location(a, file$1, 8, 0, 85)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, a, anchor)
        append_dev(a, img)
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(a)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$3.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$3($$self, $$props) {
    const writable_props = []

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<Logo> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Logo', $$slots, [])
    return []
  }

  class Logo extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$3, create_fragment$3, safe_not_equal, {})

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Logo',
        options,
        id: create_fragment$3.name,
      })
    }
  }

  const showDemo = writable(false)

  /* src/components/Header.svelte generated by Svelte v3.24.1 */
  const file$2 = 'src/components/Header.svelte'

  // (74:4) {#if $showDemo}
  function create_if_block$1(ctx) {
    let a
    let t
    let a_class_value

    const block = {
      c: function create() {
        a = element('a')
        t = text('demo')
        attr_dev(
          a,
          'class',
          (a_class_value =
            '' +
            (null_to_empty(/*url*/ ctx[0].includes('/demo') ? 'selected' : '') +
              ' svelte-1nvom8m')),
        )
        attr_dev(a, 'href', '/demo')
        add_location(a, file$2, 74, 6, 1472)
      },
      m: function mount(target, anchor) {
        insert_dev(target, a, anchor)
        append_dev(a, t)
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*url*/ 1 &&
          a_class_value !==
            (a_class_value =
              '' +
              (null_to_empty(
                /*url*/ ctx[0].includes('/demo') ? 'selected' : '',
              ) +
                ' svelte-1nvom8m'))
        ) {
          attr_dev(a, 'class', a_class_value)
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(a)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_if_block$1.name,
      type: 'if',
      source: '(74:4) {#if $showDemo}',
      ctx,
    })

    return block
  }

  function create_fragment$4(ctx) {
    let header
    let nav
    let a0
    let t0
    let a0_class_value
    let t1
    let a1
    let t2
    let a1_class_value
    let t3
    let a2
    let t4
    let a2_class_value
    let t5
    let links_action
    let mounted
    let dispose
    let if_block = /*$showDemo*/ ctx[1] && create_if_block$1(ctx)

    const block = {
      c: function create() {
        header = element('header')
        nav = element('nav')
        a0 = element('a')
        t0 = text('home')
        t1 = space()
        a1 = element('a')
        t2 = text('about')
        t3 = space()
        a2 = element('a')
        t4 = text('Contact')
        t5 = space()
        if (if_block) if_block.c()
        attr_dev(
          a0,
          'class',
          (a0_class_value =
            '' +
            (null_to_empty(/*url*/ ctx[0] == '/' ? 'selected' : '') +
              ' svelte-1nvom8m')),
        )
        attr_dev(a0, 'href', '/')
        add_location(a0, file$2, 70, 4, 1236)
        attr_dev(
          a1,
          'class',
          (a1_class_value =
            '' +
            (null_to_empty(/*url*/ ctx[0] == '/about' ? 'selected' : '') +
              ' svelte-1nvom8m')),
        )
        attr_dev(a1, 'href', '/about')
        add_location(a1, file$2, 71, 4, 1298)
        attr_dev(
          a2,
          'class',
          (a2_class_value =
            '' +
            (null_to_empty(/*url*/ ctx[0] == '/contact' ? 'selected' : '') +
              ' svelte-1nvom8m')),
        )
        attr_dev(a2, 'href', '/contact')
        add_location(a2, file$2, 72, 4, 1371)
        attr_dev(nav, 'class', 'svelte-1nvom8m')
        add_location(nav, file$2, 69, 2, 1216)
        attr_dev(header, 'class', 'svelte-1nvom8m')
        add_location(header, file$2, 68, 0, 1205)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, header, anchor)
        append_dev(header, nav)
        append_dev(nav, a0)
        append_dev(a0, t0)
        append_dev(nav, t1)
        append_dev(nav, a1)
        append_dev(a1, t2)
        append_dev(nav, t3)
        append_dev(nav, a2)
        append_dev(a2, t4)
        append_dev(nav, t5)
        if (if_block) if_block.m(nav, null)

        if (!mounted) {
          dispose = action_destroyer((links_action = links.call(null, nav)))
          mounted = true
        }
      },
      p: function update(ctx, [dirty]) {
        if (
          dirty & /*url*/ 1 &&
          a0_class_value !==
            (a0_class_value =
              '' +
              (null_to_empty(/*url*/ ctx[0] == '/' ? 'selected' : '') +
                ' svelte-1nvom8m'))
        ) {
          attr_dev(a0, 'class', a0_class_value)
        }

        if (
          dirty & /*url*/ 1 &&
          a1_class_value !==
            (a1_class_value =
              '' +
              (null_to_empty(/*url*/ ctx[0] == '/about' ? 'selected' : '') +
                ' svelte-1nvom8m'))
        ) {
          attr_dev(a1, 'class', a1_class_value)
        }

        if (
          dirty & /*url*/ 1 &&
          a2_class_value !==
            (a2_class_value =
              '' +
              (null_to_empty(/*url*/ ctx[0] == '/contact' ? 'selected' : '') +
                ' svelte-1nvom8m'))
        ) {
          attr_dev(a2, 'class', a2_class_value)
        }

        if (/*$showDemo*/ ctx[1]) {
          if (if_block) {
            if_block.p(ctx, dirty)
          } else {
            if_block = create_if_block$1(ctx)
            if_block.c()
            if_block.m(nav, null)
          }
        } else if (if_block) {
          if_block.d(1)
          if_block = null
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(header)
        if (if_block) if_block.d()
        mounted = false
        dispose()
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$4.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$4($$self, $$props, $$invalidate) {
    let $locationContext
    let $showDemo
    validate_store(showDemo, 'showDemo')
    component_subscribe($$self, showDemo, ($$value) =>
      $$invalidate(1, ($showDemo = $$value)),
    )
    const locationContext = getContext(LOCATION)
    validate_store(locationContext, 'locationContext')
    component_subscribe($$self, locationContext, (value) =>
      $$invalidate(3, ($locationContext = value)),
    )
    const writable_props = []

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<Header> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Header', $$slots, [])

    $$self.$capture_state = () => ({
      Logo,
      links,
      showDemo,
      LOCATION,
      getContext,
      locationContext,
      url,
      $locationContext,
      $showDemo,
    })

    $$self.$inject_state = ($$props) => {
      if ('url' in $$props) $$invalidate(0, (url = $$props.url))
    }

    let url

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$locationContext*/ 8) {
        $$invalidate(0, (url = $locationContext.pathname))
      }
    }

    return [url, $showDemo, locationContext]
  }

  class Header extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {})

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Header',
        options,
        id: create_fragment$4.name,
      })
    }
  }

  function cubicOut(t) {
    const f = t - 1.0
    return f * f * f + 1.0
  }

  function fade(node, { delay = 0, duration = 400, easing = identity }) {
    const o = +getComputedStyle(node).opacity
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`,
    }
  }
  function fly(
    node,
    { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 },
  ) {
    const style = getComputedStyle(node)
    const target_opacity = +style.opacity
    const transform = style.transform === 'none' ? '' : style.transform
    const od = target_opacity * (1 - opacity)
    return {
      delay,
      duration,
      easing,
      css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - od * u}`,
    }
  }

  /* src/Blog.svelte generated by Svelte v3.24.1 */
  const file$3 = 'src/Blog.svelte'

  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice()
    child_ctx[1] = list[i]
    child_ctx[3] = i
    return child_ctx
  }

  // (37:4) {#if index}
  function create_if_block$2(ctx) {
    let hr

    const block = {
      c: function create() {
        hr = element('hr')
        add_location(hr, file$3, 37, 6, 691)
      },
      m: function mount(target, anchor) {
        insert_dev(target, hr, anchor)
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(hr)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_if_block$2.name,
      type: 'if',
      source: '(37:4) {#if index}',
      ctx,
    })

    return block
  }

  // (42:8) <Link to="blog/{post.slug}">
  function create_default_slot(ctx) {
    let t_value = /*post*/ ctx[1].title + ''
    let t

    const block = {
      c: function create() {
        t = text(t_value)
      },
      m: function mount(target, anchor) {
        insert_dev(target, t, anchor)
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*posts*/ 1 &&
          t_value !== (t_value = /*post*/ ctx[1].title + '')
        )
          set_data_dev(t, t_value)
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(t)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_default_slot.name,
      type: 'slot',
      source: '(42:8) <Link to=\\"blog/{post.slug}\\">',
      ctx,
    })

    return block
  }

  // (36:2) {#each posts as post, index}
  function create_each_block(ctx) {
    let t0
    let div1
    let h2
    let link
    let t1
    let p
    let t2_value = /*post*/ ctx[1].excerpt + ''
    let t2
    let t3
    let div0
    let span
    let t4
    let t5_value = /*post*/ ctx[1].printDate + ''
    let t5
    let t6
    let current
    let if_block = /*index*/ ctx[3] && create_if_block$2(ctx)

    link = new Link({
      props: {
        to: 'blog/' + /*post*/ ctx[1].slug,
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx },
      },
      $$inline: true,
    })

    const block = {
      c: function create() {
        if (if_block) if_block.c()
        t0 = space()
        div1 = element('div')
        h2 = element('h2')
        create_component(link.$$.fragment)
        t1 = space()
        p = element('p')
        t2 = text(t2_value)
        t3 = space()
        div0 = element('div')
        span = element('span')
        t4 = text('— ')
        t5 = text(t5_value)
        t6 = space()
        add_location(h2, file$3, 40, 6, 742)
        add_location(p, file$3, 43, 6, 821)
        attr_dev(span, 'class', 'post-item-date')
        add_location(span, file$3, 45, 8, 888)
        attr_dev(div0, 'class', 'post-item-footer')
        add_location(div0, file$3, 44, 6, 849)
        attr_dev(div1, 'class', 'post-item')
        add_location(div1, file$3, 39, 4, 712)
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor)
        insert_dev(target, t0, anchor)
        insert_dev(target, div1, anchor)
        append_dev(div1, h2)
        mount_component(link, h2, null)
        append_dev(div1, t1)
        append_dev(div1, p)
        append_dev(p, t2)
        append_dev(div1, t3)
        append_dev(div1, div0)
        append_dev(div0, span)
        append_dev(span, t4)
        append_dev(span, t5)
        append_dev(div1, t6)
        current = true
      },
      p: function update(ctx, dirty) {
        const link_changes = {}
        if (dirty & /*posts*/ 1)
          link_changes.to = 'blog/' + /*post*/ ctx[1].slug

        if (dirty & /*$$scope, posts*/ 17) {
          link_changes.$$scope = { dirty, ctx }
        }

        link.$set(link_changes)
        if (
          (!current || dirty & /*posts*/ 1) &&
          t2_value !== (t2_value = /*post*/ ctx[1].excerpt + '')
        )
          set_data_dev(t2, t2_value)
        if (
          (!current || dirty & /*posts*/ 1) &&
          t5_value !== (t5_value = /*post*/ ctx[1].printDate + '')
        )
          set_data_dev(t5, t5_value)
      },
      i: function intro(local) {
        if (current) return
        transition_in(link.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(link.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching)
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(div1)
        destroy_component(link)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_each_block.name,
      type: 'each',
      source: '(36:2) {#each posts as post, index}',
      ctx,
    })

    return block
  }

  function create_fragment$5(ctx) {
    let t0
    let div
    let h1
    let t2
    let p
    let t4
    let div_intro
    let current
    let each_value = /*posts*/ ctx[0]
    validate_each_argument(each_value)
    let each_blocks = []

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i))
    }

    const out = (i) =>
      transition_out(each_blocks[i], 1, 1, () => {
        each_blocks[i] = null
      })

    const block = {
      c: function create() {
        t0 = space()
        div = element('div')
        h1 = element('h1')
        h1.textContent = 'Blog'
        t2 = space()
        p = element('p')
        p.textContent =
          'Code snippets, patterns and recipes. This is mostly just my personal notepad.'
        t4 = space()

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c()
        }

        document.title = 'Blog'
        attr_dev(h1, 'class', 'svelte-1e9puaw')
        add_location(h1, file$3, 33, 2, 537)
        add_location(p, file$3, 34, 2, 553)
        attr_dev(div, 'class', 'container')
        add_location(div, file$3, 32, 0, 474)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, t0, anchor)
        insert_dev(target, div, anchor)
        append_dev(div, h1)
        append_dev(div, t2)
        append_dev(div, p)
        append_dev(div, t4)

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null)
        }

        current = true
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*posts*/ 1) {
          each_value = /*posts*/ ctx[0]
          validate_each_argument(each_value)
          let i

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx, each_value, i)

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty)
              transition_in(each_blocks[i], 1)
            } else {
              each_blocks[i] = create_each_block(child_ctx)
              each_blocks[i].c()
              transition_in(each_blocks[i], 1)
              each_blocks[i].m(div, null)
            }
          }

          group_outros()

          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i)
          }

          check_outros()
        }
      },
      i: function intro(local) {
        if (current) return

        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i])
        }

        if (!div_intro) {
          add_render_callback(() => {
            div_intro = create_in_transition(div, fly, {
              y: 200,
              duration: 500,
            })
            div_intro.start()
          })
        }

        current = true
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean)

        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i])
        }

        current = false
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(div)
        destroy_each(each_blocks, detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$5.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$5($$self, $$props, $$invalidate) {
    let { posts } = $$props
    const writable_props = ['posts']

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<Blog> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Blog', $$slots, [])

    $$self.$$set = ($$props) => {
      if ('posts' in $$props) $$invalidate(0, (posts = $$props.posts))
    }

    $$self.$capture_state = () => ({ Link, fade, fly, posts })

    $$self.$inject_state = ($$props) => {
      if ('posts' in $$props) $$invalidate(0, (posts = $$props.posts))
    }

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    return [posts]
  }

  class Blog extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {
        posts: 0,
      })

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Blog',
        options,
        id: create_fragment$5.name,
      })

      const { ctx } = this.$$
      const props = options.props || {}

      if (/*posts*/ ctx[0] === undefined && !('posts' in props)) {
        console.warn("<Blog> was created without expected prop 'posts'")
      }
    }

    get posts() {
      throw new Error(
        "<Blog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set posts(value) {
      throw new Error(
        "<Blog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }
  }

  /* src/Contact.svelte generated by Svelte v3.24.1 */

  const { Object: Object_1, console: console_1 } = globals
  const file$4 = 'src/Contact.svelte'

  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice()
    child_ctx[11] = list[i]
    return child_ctx
  }

  // (116:6) {#each reasons as reason}
  function create_each_block$1(ctx) {
    let option
    let t_value = /*reason*/ ctx[11] + ''
    let t
    let option_value_value

    const block = {
      c: function create() {
        option = element('option')
        t = text(t_value)
        option.__value = option_value_value = /*reason*/ ctx[11]
        option.value = option.__value
        add_location(option, file$4, 116, 8, 3022)
      },
      m: function mount(target, anchor) {
        insert_dev(target, option, anchor)
        append_dev(option, t)
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(option)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_each_block$1.name,
      type: 'each',
      source: '(116:6) {#each reasons as reason}',
      ctx,
    })

    return block
  }

  function create_fragment$6(ctx) {
    let t0
    let div
    let h1
    let t2
    let p
    let a
    let t4
    let t5
    let form
    let input0
    let t6
    let input1
    let t7
    let label
    let t9
    let select
    let t10
    let textarea
    let t11
    let button
    let mounted
    let dispose
    let each_value = /*reasons*/ ctx[4]
    validate_each_argument(each_value)
    let each_blocks = []

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(
        get_each_context$1(ctx, each_value, i),
      )
    }

    const block = {
      c: function create() {
        t0 = space()
        div = element('div')
        h1 = element('h1')
        h1.textContent = 'Contact'
        t2 = space()
        p = element('p')
        a = element('a')
        a.textContent = 'Make an appointment'
        t4 = text(' or fill out this form to get in touch.')
        t5 = space()
        form = element('form')
        input0 = element('input')
        t6 = space()
        input1 = element('input')
        t7 = space()
        label = element('label')
        label.textContent = 'What is this regarding?'
        t9 = space()
        select = element('select')

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c()
        }

        t10 = space()
        textarea = element('textarea')
        t11 = space()
        button = element('button')
        button.textContent = 'Send'
        document.title = 'Contact'
        add_location(h1, file$4, 104, 2, 2521)
        attr_dev(
          a,
          'href',
          'https://calendly.com/jake-brown/60min?month=2020-09',
        )
        add_location(a, file$4, 105, 3, 2541)
        add_location(p, file$4, 105, 0, 2538)
        attr_dev(input0, 'type', 'text')
        attr_dev(input0, 'id', 'name')
        attr_dev(input0, 'placeholder', 'Your Name')
        attr_dev(input0, 'class', 'svelte-1y44z7p')
        add_location(input0, file$4, 107, 4, 2704)
        attr_dev(input1, 'type', 'email')
        attr_dev(input1, 'id', 'email')
        attr_dev(input1, 'placeholder', 'Your Email')
        attr_dev(input1, 'class', 'svelte-1y44z7p')
        add_location(input1, file$4, 108, 4, 2782)
        attr_dev(label, 'for', 'country')
        add_location(label, file$4, 113, 4, 2888)
        attr_dev(select, 'class', 'svelte-1y44z7p')
        if (/*selectedReason*/ ctx[3] === void 0)
          add_render_callback(() =>
            /*select_change_handler*/ ctx[8].call(select),
          )
        add_location(select, file$4, 114, 4, 2945)
        attr_dev(textarea, 'name', 'message')
        attr_dev(textarea, 'rows', '5')
        attr_dev(textarea, 'placeholder', 'Message')
        attr_dev(textarea, 'class', 'svelte-1y44z7p')
        add_location(textarea, file$4, 119, 4, 3095)
        attr_dev(button, 'class', 'btn btn-send svelte-1y44z7p')
        add_location(button, file$4, 124, 4, 3203)
        attr_dev(form, 'class', 'contactForm')
        add_location(form, file$4, 106, 2, 2673)
        attr_dev(div, 'class', 'container svelte-1y44z7p')
        add_location(div, file$4, 103, 0, 2495)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, t0, anchor)
        insert_dev(target, div, anchor)
        append_dev(div, h1)
        append_dev(div, t2)
        append_dev(div, p)
        append_dev(p, a)
        append_dev(p, t4)
        append_dev(div, t5)
        append_dev(div, form)
        append_dev(form, input0)
        set_input_value(input0, /*name*/ ctx[0])
        append_dev(form, t6)
        append_dev(form, input1)
        set_input_value(input1, /*email*/ ctx[1])
        append_dev(form, t7)
        append_dev(form, label)
        append_dev(form, t9)
        append_dev(form, select)

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(select, null)
        }

        select_option(select, /*selectedReason*/ ctx[3])
        append_dev(form, t10)
        append_dev(form, textarea)
        set_input_value(textarea, /*message*/ ctx[2])
        append_dev(form, t11)
        append_dev(form, button)

        if (!mounted) {
          dispose = [
            listen_dev(input0, 'input', /*input0_input_handler*/ ctx[6]),
            listen_dev(input1, 'input', /*input1_input_handler*/ ctx[7]),
            listen_dev(select, 'change', /*select_change_handler*/ ctx[8]),
            listen_dev(textarea, 'input', /*textarea_input_handler*/ ctx[9]),
            listen_dev(
              button,
              'click',
              /*handleSubmit*/ ctx[5],
              false,
              false,
              false,
            ),
          ]

          mounted = true
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
          set_input_value(input0, /*name*/ ctx[0])
        }

        if (dirty & /*email*/ 2 && input1.value !== /*email*/ ctx[1]) {
          set_input_value(input1, /*email*/ ctx[1])
        }

        if (dirty & /*reasons*/ 16) {
          each_value = /*reasons*/ ctx[4]
          validate_each_argument(each_value)
          let i

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx, each_value, i)

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty)
            } else {
              each_blocks[i] = create_each_block$1(child_ctx)
              each_blocks[i].c()
              each_blocks[i].m(select, null)
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1)
          }

          each_blocks.length = each_value.length
        }

        if (dirty & /*selectedReason, reasons*/ 24) {
          select_option(select, /*selectedReason*/ ctx[3])
        }

        if (dirty & /*message*/ 4) {
          set_input_value(textarea, /*message*/ ctx[2])
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(div)
        destroy_each(each_blocks, detaching)
        mounted = false
        run_all(dispose)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$6.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$6($$self, $$props, $$invalidate) {
    let reasons = [
      `Select one...`,
      `EyeSpace`,
      `Other existing project`,
      `New project`,
      `Something else`,
    ]

    let name = ''
    let email = ''
    let message = ''
    let selectedReason = reasons[0]

    const encode = (data) => {
      return Object.keys(data)
        .map(
          (key) =>
            encodeURIComponent(key) + '=' + encodeURIComponent(data[key]),
        )
        .join('&')
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      console.log('submitting')

      let payload = {
        'form-name': 'contact',
        name,
        email,
        message,
        selectedReason,
      }

      console.log(payload)
      console.log('Selected reason: ' + selectedReason)

      try {
        let response = await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: encode(payload),
        })

        console.log(response)
        console.log(response.url)

        if (response.url.includes('index.html')) {
          alert('Intercepted by index.html. Not available locally.')
          return
        }

        alert('Thanks for your message!')
        $$invalidate(0, (name = ''))
        $$invalidate(1, (email = ''))
        $$invalidate(2, (message = ''))
        $$invalidate(3, (selectedReason = reasons[0]))
      } catch (err) {
        alert(err)
      }
    }

    const writable_props = []

    Object_1.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console_1.warn(`<Contact> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Contact', $$slots, [])

    function input0_input_handler() {
      name = this.value
      $$invalidate(0, name)
    }

    function input1_input_handler() {
      email = this.value
      $$invalidate(1, email)
    }

    function select_change_handler() {
      selectedReason = select_value(this)
      $$invalidate(3, selectedReason)
      $$invalidate(4, reasons)
    }

    function textarea_input_handler() {
      message = this.value
      $$invalidate(2, message)
    }

    $$self.$capture_state = () => ({
      reasons,
      name,
      email,
      message,
      selectedReason,
      encode,
      handleSubmit,
    })

    $$self.$inject_state = ($$props) => {
      if ('reasons' in $$props) $$invalidate(4, (reasons = $$props.reasons))
      if ('name' in $$props) $$invalidate(0, (name = $$props.name))
      if ('email' in $$props) $$invalidate(1, (email = $$props.email))
      if ('message' in $$props) $$invalidate(2, (message = $$props.message))
      if ('selectedReason' in $$props)
        $$invalidate(3, (selectedReason = $$props.selectedReason))
    }

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    return [
      name,
      email,
      message,
      selectedReason,
      reasons,
      handleSubmit,
      input0_input_handler,
      input1_input_handler,
      select_change_handler,
      textarea_input_handler,
    ]
  }

  class Contact extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$6, create_fragment$6, safe_not_equal, {})

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Contact',
        options,
        id: create_fragment$6.name,
      })
    }
  }

  /* src/Demo.svelte generated by Svelte v3.24.1 */

  const { console: console_1$1 } = globals
  const file$5 = 'src/Demo.svelte'

  function create_fragment$7(ctx) {
    let t0
    let div3
    let h1
    let t2
    let p0
    let t4
    let p1
    let t5
    let t6
    let t7
    let div0
    let label0
    let t9
    let input0
    let t10
    let div1
    let label1
    let t12
    let input1
    let t13
    let div2
    let button0
    let t15
    let button1
    let t17
    let button2
    let t19
    let button3
    let t20_value = /*$showDemo*/ (ctx[3] ? 'Hide' : 'Show') + ''
    let t20
    let t21
    let mounted
    let dispose

    const block = {
      c: function create() {
        t0 = space()
        div3 = element('div')
        h1 = element('h1')
        h1.textContent = 'Demo page'
        t2 = space()
        p0 = element('p')
        p0.textContent = 'Just a page to play around with some Svelte features.'
        t4 = space()
        p1 = element('p')
        t5 = text('Counter: ')
        t6 = text(/*j*/ ctx[2])
        t7 = space()
        div0 = element('div')
        label0 = element('label')
        label0.textContent = 'Sleep time:'
        t9 = space()
        input0 = element('input')
        t10 = space()
        div1 = element('div')
        label1 = element('label')
        label1.textContent = 'Name:'
        t12 = space()
        input1 = element('input')
        t13 = space()
        div2 = element('div')
        button0 = element('button')
        button0.textContent = 'Say hello'
        t15 = space()
        button1 = element('button')
        button1.textContent = 'Reset Input'
        t17 = space()
        button2 = element('button')
        button2.textContent = 'Reset Counter'
        t19 = space()
        button3 = element('button')
        t20 = text(t20_value)
        t21 = text(' Demo Link')
        document.title = 'Demo'
        add_location(h1, file$5, 44, 2, 787)
        add_location(p0, file$5, 45, 2, 808)
        add_location(p1, file$5, 46, 2, 871)
        add_location(label0, file$5, 49, 4, 904)
        attr_dev(input0, 'type', 'number')
        add_location(input0, file$5, 50, 4, 935)
        add_location(div0, file$5, 48, 2, 894)
        add_location(label1, file$5, 54, 4, 1004)
        add_location(input1, file$5, 55, 4, 1029)
        add_location(div1, file$5, 53, 2, 994)
        add_location(button0, file$5, 59, 4, 1101)
        add_location(button1, file$5, 60, 4, 1152)
        add_location(button2, file$5, 61, 4, 1207)
        add_location(button3, file$5, 62, 4, 1266)
        add_location(div2, file$5, 58, 2, 1091)
        attr_dev(div3, 'class', 'container')
        add_location(div3, file$5, 43, 0, 761)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, t0, anchor)
        insert_dev(target, div3, anchor)
        append_dev(div3, h1)
        append_dev(div3, t2)
        append_dev(div3, p0)
        append_dev(div3, t4)
        append_dev(div3, p1)
        append_dev(p1, t5)
        append_dev(p1, t6)
        append_dev(div3, t7)
        append_dev(div3, div0)
        append_dev(div0, label0)
        append_dev(div0, t9)
        append_dev(div0, input0)
        set_input_value(input0, /*sleepTime*/ ctx[0])
        append_dev(div3, t10)
        append_dev(div3, div1)
        append_dev(div1, label1)
        append_dev(div1, t12)
        append_dev(div1, input1)
        set_input_value(input1, /*name*/ ctx[1])
        append_dev(div3, t13)
        append_dev(div3, div2)
        append_dev(div2, button0)
        append_dev(div2, t15)
        append_dev(div2, button1)
        append_dev(div2, t17)
        append_dev(div2, button2)
        append_dev(div2, t19)
        append_dev(div2, button3)
        append_dev(button3, t20)
        append_dev(button3, t21)

        if (!mounted) {
          dispose = [
            listen_dev(input0, 'input', /*input0_input_handler*/ ctx[8]),
            listen_dev(input1, 'input', /*input1_input_handler*/ ctx[9]),
            listen_dev(input1, 'input', printInput, false, false, false),
            listen_dev(
              button0,
              'click',
              /*sayHello*/ ctx[4],
              false,
              false,
              false,
            ),
            listen_dev(
              button1,
              'click',
              /*resetInput*/ ctx[5],
              false,
              false,
              false,
            ),
            listen_dev(
              button2,
              'click',
              /*resetCounter*/ ctx[6],
              false,
              false,
              false,
            ),
            listen_dev(
              button3,
              'click',
              /*showDemoFunc*/ ctx[7],
              false,
              false,
              false,
            ),
          ]

          mounted = true
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*j*/ 4) set_data_dev(t6, /*j*/ ctx[2])

        if (
          dirty & /*sleepTime*/ 1 &&
          to_number(input0.value) !== /*sleepTime*/ ctx[0]
        ) {
          set_input_value(input0, /*sleepTime*/ ctx[0])
        }

        if (dirty & /*name*/ 2 && input1.value !== /*name*/ ctx[1]) {
          set_input_value(input1, /*name*/ ctx[1])
        }

        if (
          dirty & /*$showDemo*/ 8 &&
          t20_value !==
            (t20_value = /*$showDemo*/ (ctx[3] ? 'Hide' : 'Show') + '')
        )
          set_data_dev(t20, t20_value)
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(div3)
        mounted = false
        run_all(dispose)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$7.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function printInput(e) {
    console.log(e.target.value)
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function instance$7($$self, $$props, $$invalidate) {
    let $showDemo
    validate_store(showDemo, 'showDemo')
    component_subscribe($$self, showDemo, ($$value) =>
      $$invalidate(3, ($showDemo = $$value)),
    )

    function sayHello(e) {
      alert(`Hello ${name}`)
    }

    function resetInput(e) {
      $$invalidate(1, (name = 'Jake'))
      $$invalidate(0, (sleepTime = 1000))
    }

    function resetCounter(e) {
      $$invalidate(2, (j = 0))
    }

    let sleepTime = 1000
    let name = 'Jake'
    let j = 0

    async function run() {
      while (true) {
        $$invalidate(2, (j = j + 1))
        await sleep(sleepTime)
        console.log('Updating on schedule: ' + sleepTime)
      }
    }

    run()

    function showDemoFunc() {
      console.log('toggling demo')
      set_store_value(showDemo, ($showDemo = !$showDemo))
    }

    const writable_props = []

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console_1$1.warn(`<Demo> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Demo', $$slots, [])

    function input0_input_handler() {
      sleepTime = to_number(this.value)
      $$invalidate(0, sleepTime)
    }

    function input1_input_handler() {
      name = this.value
      $$invalidate(1, name)
    }

    $$self.$capture_state = () => ({
      showDemo,
      sayHello,
      resetInput,
      resetCounter,
      printInput,
      sleepTime,
      sleep,
      name,
      j,
      run,
      showDemoFunc,
      $showDemo,
    })

    $$self.$inject_state = ($$props) => {
      if ('sleepTime' in $$props)
        $$invalidate(0, (sleepTime = $$props.sleepTime))
      if ('name' in $$props) $$invalidate(1, (name = $$props.name))
      if ('j' in $$props) $$invalidate(2, (j = $$props.j))
    }

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    return [
      sleepTime,
      name,
      j,
      $showDemo,
      sayHello,
      resetInput,
      resetCounter,
      showDemoFunc,
      input0_input_handler,
      input1_input_handler,
    ]
  }

  class Demo extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$7, create_fragment$7, safe_not_equal, {})

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Demo',
        options,
        id: create_fragment$7.name,
      })
    }
  }

  /* src/About.svelte generated by Svelte v3.24.1 */

  const file$6 = 'src/About.svelte'

  function create_fragment$8(ctx) {
    let t0
    let div
    let h1
    let t2
    let figure
    let img
    let img_src_value
    let t3
    let figcaption
    let t5
    let p0
    let t7
    let p1
    let t8
    let i0
    let t10
    let i1
    let t12
    let t13
    let p2
    let t14
    let a
    let t16
    let t17
    let p3
    let t19
    let p4

    const block = {
      c: function create() {
        t0 = space()
        div = element('div')
        h1 = element('h1')
        h1.textContent = 'About'
        t2 = space()
        figure = element('figure')
        img = element('img')
        t3 = space()
        figcaption = element('figcaption')
        figcaption.textContent = 'Photo by Jake Brown'
        t5 = space()
        p0 = element('p')
        p0.textContent =
          "I'm a developer living in Adelaide, South Australia. I'm driven to find ways\n    to make people's jobs and their lives easier, through technology."
        t7 = space()
        p1 = element('p')
        t8 = text(
          "In 2012 I completed Honours in High Performance Computational Phyiscs at the\n    University of Adelaide. It's billed as\n    ",
        )
        i0 = element('i')
        i0.textContent =
          'solving difficult Physics problems with supercomputers'
        t10 = text(
          '\n    . But for me, it was about trying to understand the world through\n    mathematics and abstraction, and\n    ',
        )
        i1 = element('i')
        i1.textContent = 'finding programmatic solutions to real world problems'
        t12 = text('\n    .')
        t13 = space()
        p2 = element('p')
        t14 = text(
          'At EyeSpace™ which I co-founded in 2010, we produce software used by eyecare\n    practitioners and medical device manufacturers around the world for\n    designing, simulating, and manufacturing custom contact lenses. Our goal is\n    to make it easier for eyecare practitioners to improve the lives of their\n    patients. You can read more\n    ',
        )
        a = element('a')
        a.textContent = 'here'
        t16 = text('\n    .')
        t17 = space()
        p3 = element('p')
        p3.textContent =
          'I have a deep interest in software architecture and modern development\n    practices.'
        t19 = space()
        p4 = element('p')
        p4.textContent =
          'Outside of this, I enjoy hiking in the great outdoors, freediving, rock\n    climbing, and powerlifting.'
        document.title = 'About'
        add_location(h1, file$6, 24, 2, 327)
        if (img.src !== (img_src_value = 'profile-pic.jpg'))
          attr_dev(img, 'src', img_src_value)
        attr_dev(img, 'alt', 'Jake in Iceland.')
        attr_dev(img, 'class', 'svelte-1t712sc')
        add_location(img, file$6, 26, 4, 357)
        add_location(figcaption, file$6, 27, 4, 414)
        attr_dev(figure, 'class', 'svelte-1t712sc')
        add_location(figure, file$6, 25, 2, 344)
        add_location(p0, file$6, 29, 2, 473)
        add_location(i0, file$6, 37, 4, 770)
        add_location(i1, file$6, 40, 4, 943)
        add_location(p1, file$6, 34, 2, 638)
        attr_dev(a, 'href', 'https://www.eyespacelenses.com')
        add_location(a, file$6, 50, 4, 1371)
        add_location(p2, file$6, 44, 2, 1020)
        add_location(p3, file$6, 53, 2, 1436)
        add_location(p4, file$6, 57, 2, 1539)
        attr_dev(div, 'class', 'container')
        add_location(div, file$6, 23, 0, 301)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, t0, anchor)
        insert_dev(target, div, anchor)
        append_dev(div, h1)
        append_dev(div, t2)
        append_dev(div, figure)
        append_dev(figure, img)
        append_dev(figure, t3)
        append_dev(figure, figcaption)
        append_dev(div, t5)
        append_dev(div, p0)
        append_dev(div, t7)
        append_dev(div, p1)
        append_dev(p1, t8)
        append_dev(p1, i0)
        append_dev(p1, t10)
        append_dev(p1, i1)
        append_dev(p1, t12)
        append_dev(div, t13)
        append_dev(div, p2)
        append_dev(p2, t14)
        append_dev(p2, a)
        append_dev(p2, t16)
        append_dev(div, t17)
        append_dev(div, p3)
        append_dev(div, t19)
        append_dev(div, p4)
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(div)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$8.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$8($$self, $$props) {
    const writable_props = []

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<About> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('About', $$slots, [])
    return []
  }

  class About extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$8, create_fragment$8, safe_not_equal, {})

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'About',
        options,
        id: create_fragment$8.name,
      })
    }
  }

  /* src/Index.svelte generated by Svelte v3.24.1 */

  const { console: console_1$2 } = globals
  const file$7 = 'src/Index.svelte'

  function create_fragment$9(ctx) {
    let t0
    let div1
    let div0
    let h1
    let t2
    let p
    let t4
    let figure
    let img
    let img_src_value
    let mounted
    let dispose

    const block = {
      c: function create() {
        t0 = space()
        div1 = element('div')
        div0 = element('div')
        h1 = element('h1')
        h1.textContent = 'Jake Brown'
        t2 = space()
        p = element('p')
        p.textContent = 'Developer. EyeSpace™ co-founder and CTO.'
        t4 = space()
        figure = element('figure')
        img = element('img')
        document.title = 'Jake Brown'
        attr_dev(h1, 'class', 'svelte-1snqp8s')
        add_location(h1, file$7, 75, 4, 1063)
        attr_dev(p, 'class', 'svelte-1snqp8s')
        add_location(p, file$7, 76, 4, 1087)
        attr_dev(div0, 'class', 'home-copy svelte-1snqp8s')
        add_location(div0, file$7, 74, 2, 1035)
        attr_dev(img, 'alt', 'Robot')
        if (img.src !== (img_src_value = 'undraw-illustration-2.svg'))
          attr_dev(img, 'src', img_src_value)
        attr_dev(img, 'class', 'svelte-1snqp8s')
        add_location(img, file$7, 80, 4, 1184)
        attr_dev(figure, 'class', 'svelte-1snqp8s')
        add_location(figure, file$7, 79, 2, 1147)
        attr_dev(div1, 'class', 'home-container svelte-1snqp8s')
        add_location(div1, file$7, 73, 0, 1004)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, t0, anchor)
        insert_dev(target, div1, anchor)
        append_dev(div1, div0)
        append_dev(div0, h1)
        append_dev(div0, t2)
        append_dev(div0, p)
        append_dev(div1, t4)
        append_dev(div1, figure)
        append_dev(figure, img)

        if (!mounted) {
          dispose = listen_dev(
            figure,
            'click',
            /*showDemoFunc*/ ctx[0],
            false,
            false,
            false,
          )
          mounted = true
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(div1)
        mounted = false
        dispose()
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$9.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$9($$self, $$props, $$invalidate) {
    let $showDemo
    validate_store(showDemo, 'showDemo')
    component_subscribe($$self, showDemo, ($$value) =>
      $$invalidate(1, ($showDemo = $$value)),
    )

    function showDemoFunc() {
      console.log('toggling demo')
      set_store_value(showDemo, ($showDemo = !$showDemo))
    }

    const writable_props = []

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console_1$2.warn(`<Index> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Index', $$slots, [])
    $$self.$capture_state = () => ({ showDemo, showDemoFunc, $showDemo })
    return [showDemoFunc]
  }

  class Index extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$9, create_fragment$9, safe_not_equal, {})

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Index',
        options,
        id: create_fragment$9.name,
      })
    }
  }

  /* src/Post.svelte generated by Svelte v3.24.1 */

  const file$8 = 'src/Post.svelte'

  function create_fragment$a(ctx) {
    let title_value
    let t0
    let header
    let p
    let t1_value = /*post*/ ctx[0].printDate + ''
    let t1
    let t2
    let t3_value = /*post*/ ctx[0].printReadingTime + ''
    let t3
    let t4
    let h1
    let t5_value = /*post*/ ctx[0].title + ''
    let t5
    let t6
    let hr0
    let t7
    let div
    let article
    let raw_value = /*post*/ ctx[0].html + ''
    let t8
    let hr1
    document.title = title_value = /*post*/ ctx[0].title

    const block = {
      c: function create() {
        t0 = space()
        header = element('header')
        p = element('p')
        t1 = text(t1_value)
        t2 = text(' ~ ')
        t3 = text(t3_value)
        t4 = space()
        h1 = element('h1')
        t5 = text(t5_value)
        t6 = space()
        hr0 = element('hr')
        t7 = space()
        div = element('div')
        article = element('article')
        t8 = space()
        hr1 = element('hr')
        attr_dev(p, 'class', 'svelte-25xvoi')
        add_location(p, file$8, 31, 2, 392)
        attr_dev(h1, 'class', 'svelte-25xvoi')
        add_location(h1, file$8, 32, 2, 444)
        attr_dev(hr0, 'class', 'svelte-25xvoi')
        add_location(hr0, file$8, 33, 2, 468)
        attr_dev(header, 'class', 'svelte-25xvoi')
        add_location(header, file$8, 30, 0, 381)
        attr_dev(article, 'class', 'content')
        add_location(article, file$8, 36, 2, 511)
        add_location(hr1, file$8, 39, 2, 574)
        attr_dev(div, 'class', 'container')
        add_location(div, file$8, 35, 0, 485)
      },
      l: function claim(nodes) {
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, t0, anchor)
        insert_dev(target, header, anchor)
        append_dev(header, p)
        append_dev(p, t1)
        append_dev(p, t2)
        append_dev(p, t3)
        append_dev(header, t4)
        append_dev(header, h1)
        append_dev(h1, t5)
        append_dev(header, t6)
        append_dev(header, hr0)
        insert_dev(target, t7, anchor)
        insert_dev(target, div, anchor)
        append_dev(div, article)
        article.innerHTML = raw_value
        append_dev(div, t8)
        append_dev(div, hr1)
      },
      p: function update(ctx, [dirty]) {
        if (
          dirty & /*post*/ 1 &&
          title_value !== (title_value = /*post*/ ctx[0].title)
        ) {
          document.title = title_value
        }

        if (
          dirty & /*post*/ 1 &&
          t1_value !== (t1_value = /*post*/ ctx[0].printDate + '')
        )
          set_data_dev(t1, t1_value)
        if (
          dirty & /*post*/ 1 &&
          t3_value !== (t3_value = /*post*/ ctx[0].printReadingTime + '')
        )
          set_data_dev(t3, t3_value)
        if (
          dirty & /*post*/ 1 &&
          t5_value !== (t5_value = /*post*/ ctx[0].title + '')
        )
          set_data_dev(t5, t5_value)
        if (
          dirty & /*post*/ 1 &&
          raw_value !== (raw_value = /*post*/ ctx[0].html + '')
        )
          article.innerHTML = raw_value
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(header)
        if (detaching) detach_dev(t7)
        if (detaching) detach_dev(div)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$a.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$a($$self, $$props, $$invalidate) {
    let { post } = $$props
    const writable_props = ['post']

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<Post> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Post', $$slots, [])

    $$self.$$set = ($$props) => {
      if ('post' in $$props) $$invalidate(0, (post = $$props.post))
    }

    $$self.$capture_state = () => ({ post })

    $$self.$inject_state = ($$props) => {
      if ('post' in $$props) $$invalidate(0, (post = $$props.post))
    }

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    return [post]
  }

  class Post extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$a, create_fragment$a, safe_not_equal, {
        post: 0,
      })

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Post',
        options,
        id: create_fragment$a.name,
      })

      const { ctx } = this.$$
      const props = options.props || {}

      if (/*post*/ ctx[0] === undefined && !('post' in props)) {
        console.warn("<Post> was created without expected prop 'post'")
      }
    }

    get post() {
      throw new Error(
        "<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set post(value) {
      throw new Error(
        "<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }
  }

  /* src/Error.svelte generated by Svelte v3.24.1 */

  const { Error: Error_1 } = globals
  const file$9 = 'src/Error.svelte'

  function create_fragment$b(ctx) {
    let title_value
    let t0
    let h1
    let t1
    let t2
    let p
    let t3
    document.title = title_value = /*status*/ ctx[0]

    const block = {
      c: function create() {
        t0 = space()
        h1 = element('h1')
        t1 = text(/*status*/ ctx[0])
        t2 = space()
        p = element('p')
        t3 = text(/*message*/ ctx[1])
        attr_dev(h1, 'class', 'svelte-a2se1f')
        add_location(h1, file$9, 29, 0, 354)
        attr_dev(p, 'class', 'svelte-a2se1f')
        add_location(p, file$9, 31, 0, 373)
      },
      l: function claim(nodes) {
        throw new Error_1(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, t0, anchor)
        insert_dev(target, h1, anchor)
        append_dev(h1, t1)
        insert_dev(target, t2, anchor)
        insert_dev(target, p, anchor)
        append_dev(p, t3)
      },
      p: function update(ctx, [dirty]) {
        if (
          dirty & /*status*/ 1 &&
          title_value !== (title_value = /*status*/ ctx[0])
        ) {
          document.title = title_value
        }

        if (dirty & /*status*/ 1) set_data_dev(t1, /*status*/ ctx[0])
        if (dirty & /*message*/ 2) set_data_dev(t3, /*message*/ ctx[1])
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(h1)
        if (detaching) detach_dev(t2)
        if (detaching) detach_dev(p)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$b.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$b($$self, $$props, $$invalidate) {
    let { status } = $$props
    let { message } = $$props
    const writable_props = ['status', 'message']

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<Error> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('Error', $$slots, [])

    $$self.$$set = ($$props) => {
      if ('status' in $$props) $$invalidate(0, (status = $$props.status))
      if ('message' in $$props) $$invalidate(1, (message = $$props.message))
    }

    $$self.$capture_state = () => ({ status, message })

    $$self.$inject_state = ($$props) => {
      if ('status' in $$props) $$invalidate(0, (status = $$props.status))
      if ('message' in $$props) $$invalidate(1, (message = $$props.message))
    }

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    return [status, message]
  }

  class Error$1 extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$b, create_fragment$b, safe_not_equal, {
        status: 0,
        message: 1,
      })

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'Error',
        options,
        id: create_fragment$b.name,
      })

      const { ctx } = this.$$
      const props = options.props || {}

      if (/*status*/ ctx[0] === undefined && !('status' in props)) {
        console.warn("<Error> was created without expected prop 'status'")
      }

      if (/*message*/ ctx[1] === undefined && !('message' in props)) {
        console.warn("<Error> was created without expected prop 'message'")
      }
    }

    get status() {
      throw new Error_1(
        "<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set status(value) {
      throw new Error_1(
        "<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    get message() {
      throw new Error_1(
        "<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }

    set message(value) {
      throw new Error_1(
        "<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      )
    }
  }

  var Mod0 = {
    title: 'Corneal Topography',
    slug: 'corneal-topography',
    html:
      '<p>This comes from a lecture I did in 2013. \nYou can download the original slides <a href="/images/EyeSpace-Topography.pdf">here</a>.</p>\n<h2 id="topography-basics">Topography Basics</h2>\n<p>Using a Placido ring based topographer (eg. Medmont E300), what is measured?</p>\n<ul>\n<li>The spacing of the reflected rings</li>\n<li>Corneal slope (i.e. first derivative) is derived easily</li>\n</ul>\n<p>What can be calculated from the raw data? </p>\n<ul>\n<li>Tangential/axial Radius of Curvature (mm) </li>\n<li>Tangential/axial power (D)</li>\n<li>Corneal height (um)</li>\n</ul>\n<h2 id="reference-points">Reference points</h2>\n<p>Three main reference points:</p>\n<ol>\n<li>Geometric centre of cornea </li>\n<li>Patient’s line of sight</li>\n<li>Instrument axis</li>\n</ol>\n<p>Note the line of sight and geometric centre may not coincide.\nYou should ask the patient to shift their line of sight away from the instrument axis, so that geometric centre of the cornea corresponds with the instrument axis.</p>\n<h2 id="tangential-radius-of-curvature">Tangential Radius of Curvature</h2>\n<ul>\n<li>Radius of the circular arc that best approximates the curve at that point\n<img src="/images/tangential-roc.png" alt="Tangential RoC">\n<img src="/images/tangential-formula.png" alt="Tangential RoC"></li>\n</ul>\n<h2 id="axial-roc">Axial RoC</h2>\n<ul>\n<li>Also known as axial sagittal height </li>\n<li>Geometrically, just the distance from a point to the instrument axis, along the surface normal</li>\n</ul>\n<p><img src="/images/axial-roc.png" alt="Axial RoC"></p>\n<h2 id="comparison">Comparison</h2>\n<p><img src="/images/comparison.png" alt="Axial RoC"></p>\n<h2 id="small-scale-variation">Small scale variation</h2>\n<ul>\n<li>Localized corneal variations are more visible in tangential than axial maps</li>\n<li>We can see why (mathematically) from a simple example</li>\n</ul>\n<p><img src="/images/derivatives.png" alt="Derivatives amplify noise"></p>\n<h2 id="tangential-vs-axial">Tangential vs axial</h2>\n<ul>\n<li><p>Tangential:\n<img src="/images/tangential-formula.png" alt="Tangential RoC"></p>\n</li>\n<li><p>Axial: Simple geometric formula involving y’</p>\n</li>\n</ul>\n',
    date: '2020-08-14',
    excerpt: '',
    printDate: 'August 14, 2020',
    printReadingTime: '2 min read',
  }

  var Mod1 = {
    title: 'CSS Flexbox',
    slug: 'css-flexbox',
    html:
      '<p>These two videos contain a good intro to Flexbox.\nWorth running through whenever you need a Flexbox refresher.</p>\n<ul>\n<li><a target="_blank" rel="nofollow" href="https://www.leveluptutorials.com/tutorials/modern-css-layouts/how-to-get-started-with-flexbox">Lesson 1</a></li>\n<li><a target="_blank" rel="nofollow" href="https://www.leveluptutorials.com/tutorials/modern-css-layouts/flexbox-container-children">Lesson 2</a></li>\n</ul>\n<p>I&#39;ll include some code snippets here when I get around to it.</p>\n<h2 id="align-items-inside-container">Align items inside container</h2>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">></span></span><span class="token style"><span class="token language-css">\n  <span class="token selector">h1</span> <span class="token punctuation">{</span>\n    <span class="token property">text-transform</span><span class="token punctuation">:</span> uppercase<span class="token punctuation">;</span>\n    <span class="token property">font-size</span><span class="token punctuation">:</span> 3em<span class="token punctuation">;</span>\n    <span class="token property">font-weight</span><span class="token punctuation">:</span> 100<span class="token punctuation">;</span>\n    <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token selector">.parent</span> <span class="token punctuation">{</span>\n    <span class="token property">display</span><span class="token punctuation">:</span> flex<span class="token punctuation">;</span>\n    <span class="token property">border</span><span class="token punctuation">:</span> 1px solid blue<span class="token punctuation">;</span>\n    <span class="token property">flex-direction</span><span class="token punctuation">:</span> column<span class="token punctuation">;</span>\n    <span class="token property">justify-content</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>\n    <span class="token property">align-items</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>\n    <span class="token property">width</span><span class="token punctuation">:</span> 800px<span class="token punctuation">;</span>\n    <span class="token property">height</span><span class="token punctuation">:</span> 800px<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token selector">.el</span> <span class="token punctuation">{</span>\n    <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>\n    <span class="token property">border</span><span class="token punctuation">:</span> 1px solid red<span class="token punctuation">;</span>\n    <span class="token property">text-align</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>main</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>parent<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Svelte Min<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>\n      Here is some text\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>el<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>One<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>el<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Two<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>main</span><span class="token punctuation">></span></span></code></pre><p><img src="/images/flex-align-1.png" alt="Flex align">\n<img src="/images/layout.gif" alt="Flex align"></p>\n<ul>\n<li>main-axis: The main axis of a flex container is the primary axis along which flex items are laid out. The direction is based on the flex-direction property.</li>\n<li>Layout is set using (for example) <code>justify-content: center;</code>.</li>\n<li>cross axis: The axis perpendicular to the main axis is called the cross axis. Its direction depends on the main axis direction.</li>\n<li>Layout on this axis is set using (for example) <code>align-items: center;</code>.</li>\n</ul>\n<p><a target="_blank" rel="nofollow" href="https://www.freecodecamp.org/news/flexbox-the-ultimate-css-flex-cheatsheet/">https://www.freecodecamp.org/news/flexbox-the-ultimate-css-flex-cheatsheet/</a></p>\n<p>When we set <code>flex-direction: column</code> we are setting the main axis to be vertical.\nThen, if we want to align items along the <em>horizontal</em> axis, we need to use align-items. </p>\n',
    date: '2020-08-17',
    excerpt: '',
    printDate: 'August 17, 2020',
    printReadingTime: '2 min read',
  }

  var Mod2 = {
    title: 'Curl',
    slug: 'curl',
    html:
      '<h2 id="pretty-print-json">pretty-print json</h2>\n<pre class="language-bash"><code class="language-bash"><span class="token function">curl</span> http://example:5000/demo <span class="token operator">|</span> python -m json.tool</code></pre>',
    date: '2019-06-06T00:00:00.000Z',
    excerpt: '',
    printDate: 'June 6, 2019',
    printReadingTime: '1 min read',
  }

  var Mod3 = {
    title: 'Git',
    slug: 'git',
    html:
      '<h2 id="merge">merge</h2>\n<p>The <em>merge</em> command is used to integrate changes from another <em>branch</em>. The target of this integration (i.e. the <em>branch</em> that receives changes) is always the currently checked out HEAD <em>branch</em>. </p>\n<pre class="language-git"><code class="language-git">git merge xxx</code></pre><br>\n<hr>\n\n<h2 id="delete-tag">delete tag</h2>\n<p>Delete local and remote tag:</p>\n<p>From <a target="_blank" rel="nofollow" href="https://nathanhoad.net/how-to-delete-a-remote-git-tag/">here</a></p>\n<pre class="language-git"><code class="language-git">git tag -d 12345\ngit push origin :refs/tags/12345</code></pre><br>\n<hr>\n\n<h2 id="rebase">rebase</h2>\n<pre class="language-git"><code class="language-git">git rebase -i <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>after-this-commit</span><span class="token punctuation">></span></span></code></pre><p>and replace “pick” on the second and subsequent commits with “squash” or “fixup”, as described in the manual.</p>\n<p>In this example, <after-this-commit> is either the SHA1 hash or the relative location from the HEAD of the current branch from which commits are analyzed for the rebase command. </p>\n<p>For example, if the user wishes to view 5 commits from the current HEAD in the past the command is git rebase -I HEAD~5 </p>\n<h2 id="checkout-only-filedirectory-from-branch">checkout only file/directory from branch</h2>\n<pre class="language-git"><code class="language-git">git checkout feature-branch -- src/js/some-file.js</code></pre>',
    date: '2019-06-11T08:38:00.000Z',
    excerpt: '',
    printDate: 'June 11, 2019',
    printReadingTime: '1 min read',
  }

  var Mod4 = {
    title: 'Markdown Test Page',
    slug: 'markdown-test',
    html:
      '<p>This page is an adapted version of <a target="_blank" rel="nofollow" href="https://github.com/fullpipe/markdown-test-page">markdown-test-page</a>. It should give you an idea of how different elements are styled on this template.</p>\n<h2 id="-table-of-contents"><a name="top"></a> Table of Contents</h2>\n<ul>\n<li><a onclick="document.location.hash=\'Headings\';" href="javascript:;">Headings</a></li>\n<li><a onclick="document.location.hash=\'Paragraphs\';" href="javascript:;">Paragraphs</a></li>\n<li><a onclick="document.location.hash=\'Blockquotes\';" href="javascript:;">Blockquotes</a></li>\n<li><a onclick="document.location.hash=\'Lists\';" href="javascript:;">Lists</a></li>\n<li><a onclick="document.location.hash=\'Horizontal\';" href="javascript:;">Horizontal rule</a></li>\n<li><a onclick="document.location.hash=\'Table\';" href="javascript:;">Table</a></li>\n<li><a onclick="document.location.hash=\'Code\';" href="javascript:;">Code</a></li>\n<li><a onclick="document.location.hash=\'Inline\';" href="javascript:;">Inline elements</a></li>\n</ul>\n<hr>\n<h1 id="headings"><a name="Headings"></a>Headings</h1>\n<h1 id="heading-one">Heading one</h1>\n<p>Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat commodo id sunt. Nostrud enim ad commodo incididunt cupidatat in ullamco ullamco Lorem cupidatat velit enim et Lorem. Ut laborum cillum laboris fugiat culpa sint irure do reprehenderit culpa occaecat. Exercitation esse mollit tempor magna aliqua in occaecat aliquip veniam reprehenderit nisi dolor in laboris dolore velit.</p>\n<h2 id="heading-two">Heading two</h2>\n<p>Aute officia nulla deserunt do deserunt cillum velit magna. Officia veniam culpa anim minim dolore labore pariatur voluptate id ad est duis quis velit dolor pariatur enim. Incididunt enim excepteur do veniam consequat culpa do voluptate dolor fugiat ad adipisicing sit. Labore officia est adipisicing dolore proident eiusmod exercitation deserunt ullamco anim do occaecat velit. Elit dolor consectetur proident sunt aliquip est do tempor quis aliqua culpa aute. Duis in tempor exercitation pariatur et adipisicing mollit irure tempor ut enim esse commodo laboris proident. Do excepteur laborum anim esse aliquip eu sit id Lorem incididunt elit irure ea nulla dolor et. Nulla amet fugiat qui minim deserunt enim eu cupidatat aute officia do velit ea reprehenderit.</p>\n<h3 id="heading-three">Heading three</h3>\n<p>Voluptate cupidatat cillum elit quis ipsum eu voluptate fugiat consectetur enim. Quis ut voluptate culpa ex anim aute consectetur dolore proident voluptate exercitation eiusmod. Esse in do anim magna minim culpa sint. Adipisicing ipsum consectetur proident ullamco magna sit amet aliqua aute fugiat laborum exercitation duis et.</p>\n<h4 id="heading-four">Heading four</h4>\n<p>Commodo fugiat aliqua minim quis pariatur mollit id tempor. Non occaecat minim esse enim aliqua adipisicing nostrud duis consequat eu adipisicing qui. Minim aliquip sit excepteur ipsum consequat laborum pariatur excepteur. Veniam fugiat et amet ad elit anim laborum duis mollit occaecat et et ipsum et reprehenderit. Occaecat aliquip dolore adipisicing sint labore occaecat officia fugiat. Quis adipisicing exercitation exercitation eu amet est laboris sunt nostrud ipsum reprehenderit ullamco. Enim sint ut consectetur id anim aute voluptate exercitation mollit dolore magna magna est Lorem. Ut adipisicing adipisicing aliqua ullamco voluptate labore nisi tempor esse magna incididunt.</p>\n<h5 id="heading-five">Heading five</h5>\n<p>Veniam enim esse amet veniam deserunt laboris amet enim consequat. Minim nostrud deserunt cillum consectetur commodo eu enim nostrud ullamco occaecat excepteur. Aliquip et ut est commodo enim dolor amet sint excepteur. Amet ad laboris laborum deserunt sint sunt aliqua commodo ex duis deserunt enim est ex labore ut. Duis incididunt velit adipisicing non incididunt adipisicing adipisicing. Ad irure duis nisi tempor eu dolor fugiat magna et consequat tempor eu ex dolore. Mollit esse nisi qui culpa ut nisi ex proident culpa cupidatat cillum culpa occaecat anim. Ut officia sit ea nisi ea excepteur nostrud ipsum et nulla.</p>\n<h6 id="heading-six">Heading six</h6>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n<p><a onclick="document.location.hash=\'top\';" href="javascript:;">[Top]</a></p>\n<h1 id="paragraphs"><a name="Paragraphs"></a>Paragraphs</h1>\n<p>Incididunt ex adipisicing ea ullamco consectetur in voluptate proident fugiat tempor deserunt reprehenderit ullamco id dolore laborum. Do laboris laboris minim incididunt qui consectetur exercitation adipisicing dolore et magna consequat magna anim sunt. Officia fugiat Lorem sunt pariatur incididunt Lorem reprehenderit proident irure. Dolore ipsum aliqua mollit ad officia fugiat sit eu aliquip cupidatat ipsum duis laborum laborum fugiat esse. Voluptate anim ex dolore deserunt ea ex eiusmod irure. Occaecat excepteur aliqua exercitation aliquip dolor esse eu eu.</p>\n<p>Officia dolore laborum aute incididunt commodo nisi velit est est elit et dolore elit exercitation. Enim aliquip magna id ipsum aliquip consectetur ad nulla quis. Incididunt pariatur dolor consectetur cillum enim velit cupidatat laborum quis ex.</p>\n<p>Officia irure in non voluptate adipisicing sit amet tempor duis dolore deserunt enim ut. Reprehenderit incididunt in ad anim et deserunt deserunt Lorem laborum quis. Enim aute anim labore proident laboris voluptate elit excepteur in. Ex labore nulla velit officia ullamco Lorem Lorem id do. Dolore ullamco ipsum magna dolor pariatur voluptate ipsum id occaecat ipsum. Dolore tempor quis duis commodo quis quis enim.</p>\n<p><a onclick="document.location.hash=\'top\';" href="javascript:;">[Top]</a></p>\n<h1 id="blockquotes"><a name="Blockquotes"></a>Blockquotes</h1>\n<p>Ad nisi laborum aute cupidatat magna deserunt eu id laboris id. Aliquip nulla cupidatat sint ex Lorem mollit laborum dolor amet est ut esse aute. Nostrud ex consequat id incididunt proident ipsum minim duis aliqua ut ex et ad quis. Laborum sint esse cillum anim nulla cillum consectetur aliqua sit. Nisi excepteur cillum labore amet excepteur commodo enim occaecat consequat ipsum proident exercitation duis id in.</p>\n<blockquote>\n<p>Ipsum et cupidatat mollit exercitation enim duis sunt irure aliqua reprehenderit mollit. Pariatur Lorem pariatur laboris do culpa do elit irure. Eiusmod amet nulla voluptate velit culpa et aliqua ad reprehenderit sit ut.</p>\n</blockquote>\n<p>Labore ea magna Lorem consequat aliquip consectetur cillum duis dolore. Et veniam dolor qui incididunt minim amet laboris sit. Dolore ad esse commodo et dolore amet est velit ut nisi ea. Excepteur ea nulla commodo dolore anim dolore adipisicing eiusmod labore id enim esse quis mollit deserunt est. Minim ea culpa voluptate nostrud commodo proident in duis aliquip minim.</p>\n<blockquote>\n<p>Qui est sit et reprehenderit aute est esse enim aliqua id aliquip ea anim. Pariatur sint reprehenderit mollit velit voluptate enim consectetur sint enim. Quis exercitation proident elit non id qui culpa dolore esse aliquip consequat.</p>\n</blockquote>\n<p>Ipsum excepteur cupidatat sunt minim ad eiusmod tempor sit.</p>\n<blockquote>\n<p>Deserunt excepteur adipisicing culpa pariatur cillum laboris ullamco nisi fugiat cillum officia. In cupidatat nulla aliquip tempor ad Lorem Lorem quis voluptate officia consectetur pariatur ex in est duis. Mollit id esse est elit exercitation voluptate nostrud nisi laborum magna dolore dolore tempor in est consectetur.</p>\n</blockquote>\n<p>Adipisicing voluptate ipsum culpa voluptate id aute laboris labore esse fugiat veniam ullamco occaecat do ut. Tempor et esse reprehenderit veniam proident ipsum irure sit ullamco et labore ea excepteur nulla labore ut. Ex aute minim quis tempor in eu id id irure ea nostrud dolor esse.</p>\n<p><a onclick="document.location.hash=\'top\';" href="javascript:;">[Top]</a></p>\n<h1 id="lists"><a name="Lists"></a>Lists</h1>\n<h3 id="ordered-list">Ordered List</h3>\n<ol>\n<li>Longan</li>\n<li>Lychee</li>\n<li>Excepteur ad cupidatat do elit laborum amet cillum reprehenderit consequat quis.\n Deserunt officia esse aliquip consectetur duis ut labore laborum commodo aliquip aliquip velit pariatur dolore.</li>\n<li>Marionberry</li>\n<li>Melon<ul>\n<li>Cantaloupe</li>\n<li>Honeydew</li>\n<li>Watermelon</li>\n</ul>\n</li>\n<li>Miracle fruit</li>\n<li>Mulberry</li>\n</ol>\n<h3 id="unordered-list">Unordered List</h3>\n<ul>\n<li>Olive</li>\n<li>Orange<ul>\n<li>Blood orange</li>\n<li>Clementine</li>\n</ul>\n</li>\n<li>Papaya</li>\n<li>Ut aute ipsum occaecat nisi culpa Lorem id occaecat cupidatat id id magna laboris ad duis. Fugiat cillum dolore veniam nostrud proident sint consectetur eiusmod irure adipisicing.</li>\n<li>Passionfruit</li>\n</ul>\n<p><a onclick="document.location.hash=\'top\';" href="javascript:;">[Top]</a></p>\n<h1 id="horizontal-rule"><a name="Horizontal"></a>Horizontal rule</h1>\n<p>In dolore velit aliquip labore mollit minim tempor veniam eu veniam ad in sint aliquip mollit mollit. Ex occaecat non deserunt elit laborum sunt tempor sint consequat culpa culpa qui sit. Irure ad commodo eu voluptate mollit cillum cupidatat veniam proident amet minim reprehenderit.</p>\n<hr>\n<p>In laboris eiusmod reprehenderit aliquip sit proident occaecat. Non sit labore anim elit veniam Lorem minim commodo eiusmod irure do minim nisi. Dolor amet cillum excepteur consequat sint non sint.</p>\n<p><a onclick="document.location.hash=\'top\';" href="javascript:;">[Top]</a></p>\n<h1 id="table"><a name="Table"></a>Table</h1>\n<p>Duis sunt ut pariatur reprehenderit mollit mollit magna dolore in pariatur nulla commodo sit dolor ad fugiat. Laboris amet ea occaecat duis eu enim exercitation deserunt ea laborum occaecat reprehenderit. Et incididunt dolor commodo consequat mollit nisi proident non pariatur in et incididunt id. Eu ut et Lorem ea ex magna minim ipsum ipsum do.</p>\n<table>\n<thead>\n<tr>\n<th align="left">Table Heading 1</th>\n<th align="left">Table Heading 2</th>\n<th align="center">Center align</th>\n<th align="right">Right align</th>\n<th align="left">Table Heading 5</th>\n</tr>\n</thead>\n<tbody><tr>\n<td align="left">Item 1</td>\n<td align="left">Item 2</td>\n<td align="center">Item 3</td>\n<td align="right">Item 4</td>\n<td align="left">Item 5</td>\n</tr>\n<tr>\n<td align="left">Item 1</td>\n<td align="left">Item 2</td>\n<td align="center">Item 3</td>\n<td align="right">Item 4</td>\n<td align="left">Item 5</td>\n</tr>\n<tr>\n<td align="left">Item 1</td>\n<td align="left">Item 2</td>\n<td align="center">Item 3</td>\n<td align="right">Item 4</td>\n<td align="left">Item 5</td>\n</tr>\n<tr>\n<td align="left">Item 1</td>\n<td align="left">Item 2</td>\n<td align="center">Item 3</td>\n<td align="right">Item 4</td>\n<td align="left">Item 5</td>\n</tr>\n<tr>\n<td align="left">Item 1</td>\n<td align="left">Item 2</td>\n<td align="center">Item 3</td>\n<td align="right">Item 4</td>\n<td align="left">Item 5</td>\n</tr>\n</tbody></table>\n<p>Minim id consequat adipisicing cupidatat laborum culpa veniam non consectetur et duis pariatur reprehenderit eu ex consectetur. Sunt nisi qui eiusmod ut cillum laborum Lorem officia aliquip laboris ullamco nostrud laboris non irure laboris. Cillum dolore labore Lorem deserunt mollit voluptate esse incididunt ex dolor.</p>\n<p><a onclick="document.location.hash=\'top\';" href="javascript:;">[Top]</a></p>\n<h1 id="code"><a name="Code"></a>Code</h1>\n<h2 id="inline-code">Inline code</h2>\n<p>Ad amet irure est magna id mollit Lorem in do duis enim. Excepteur velit nisi magna ea pariatur pariatur ullamco fugiat deserunt sint non sint. Duis duis est <code>code in text</code> velit velit aute culpa ex quis pariatur pariatur laborum aute pariatur duis tempor sunt ad. Irure magna voluptate dolore consectetur consectetur irure esse. Anim magna <code>&lt;strong&gt;in culpa qui officia&lt;/strong&gt;</code> dolor eiusmod esse amet aute cupidatat aliqua do id voluptate cupidatat reprehenderit amet labore deserunt.</p>\n<h2 id="highlighted">Highlighted</h2>\n<p>Et fugiat ad nisi amet magna labore do cillum fugiat occaecat cillum Lorem proident. In sint dolor ullamco ad do adipisicing amet id excepteur Lorem aliquip sit irure veniam laborum duis cillum. Aliqua occaecat minim cillum deserunt magna sunt laboris do do irure ea nostrud consequat ut voluptate ex.</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>md:flex<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>md:flex-shrink-0<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>rounded-lg md:w-56<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=448&amp;q=80<span class="token punctuation">"</span></span> <span class="token attr-name">alt</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Woman paying for a purchase<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>mt-4 md:mt-0 md:ml-6<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>uppercase tracking-wide text-sm text-indigo-600 font-bold<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Marketing<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Finding customers for your new business<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>mt-2 text-gray-600<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></code></pre><p>Ex amet id ex aliquip id do laborum excepteur exercitation elit sint commodo occaecat nostrud est. Nostrud pariatur esse veniam laborum non sint magna sit laboris minim in id. Aliqua pariatur pariatur excepteur adipisicing irure culpa consequat commodo et ex id ad.</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">let</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">handleClick</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    count <span class="token operator">+=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name"><span class="token namespace">on:</span>click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span>{handleClick}</span><span class="token punctuation">></span></span>\n    Clicked {count} {count === 1 ? \'time\' : \'times\'}\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span></code></pre><p><a onclick="document.location.hash=\'top\';" href="javascript:;">[Top]</a></p>\n<h1 id="inline-elements"><a name="Inline"></a>Inline elements</h1>\n<p>Sint ea anim ipsum ad commodo cupidatat do <strong>exercitation</strong> incididunt et minim ad labore sunt. Minim deserunt labore laboris velit nulla incididunt ipsum nulla. Ullamco ad laborum ea qui et anim in laboris exercitation tempor sit officia laborum reprehenderit culpa velit quis. <strong>Consequat commodo</strong> reprehenderit duis <a onclick="document.location.hash=\'\';" href="javascript:;">irure</a> esse esse exercitation minim enim Lorem dolore duis irure. Nisi Lorem reprehenderit ea amet excepteur dolor excepteur magna labore proident voluptate ipsum. Reprehenderit ex esse deserunt aliqua ea officia mollit Lorem nulla magna enim. Et ad ipsum labore enim ipsum <strong>cupidatat consequat</strong>. Commodo non ea cupidatat magna deserunt dolore ipsum velit nulla elit veniam nulla eiusmod proident officia.</p>\n<p><img src="https://placekitten.com/1280/800" alt="Super wide"></p>\n<p><em>Proident sit veniam in est proident officia adipisicing</em> ea tempor cillum non cillum velit deserunt. Voluptate laborum incididunt sit consectetur Lorem irure incididunt voluptate nostrud. Commodo ut eiusmod tempor cupidatat esse enim minim ex anim consequat. Mollit sint culpa qui laboris quis consectetur ad sint esse. Amet anim anim minim ullamco et duis non irure. Sit tempor adipisicing ea laboris <code>culpa ex duis sint</code> anim aute reprehenderit id eu ea. Aute <a onclick="document.location.hash=\'\';" href="javascript:;">excepteur proident</a> Lorem minim adipisicing nostrud mollit ad ut voluptate do nulla esse occaecat aliqua sint anim.</p>\n<p><img src="https://placekitten.com/480/400" alt="Not so big"></p>\n<p>Incididunt in culpa cupidatat mollit cillum qui proident sit. In cillum aliquip incididunt voluptate magna amet cupidatat cillum pariatur sint aliqua est <em>enim <strong>anim</strong> voluptate</em>. Magna aliquip proident incididunt id duis pariatur eiusmod incididunt commodo culpa dolore sit. Culpa do nostrud elit ad exercitation anim pariatur non minim nisi <strong>adipisicing sunt <em>officia</em></strong>. Do deserunt magna mollit Lorem commodo ipsum do cupidatat mollit enim ut elit veniam ea voluptate.</p>\n<iframe width="100%" height="400" src="https://www.youtube.com/embed/PCp2iXA1uLE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n\n<p>Reprehenderit non eu quis in ad elit esse qui aute id <a onclick="document.location.hash=\'\';" href="javascript:;">incididunt</a> dolore cillum. Esse laboris consequat dolor anim exercitation tempor aliqua deserunt velit magna laboris. Culpa culpa minim duis amet mollit do quis amet commodo nulla irure.</p>\n',
    date: '1970-01-01T00:00:00.000Z',
    excerpt:
      '\nA sample page with the most common elements of an article, including headings, paragraphs, lists, and images.\nUse it as a starting point for applying your own styles.\n\n',
    printDate: 'January 1, 1970',
    printReadingTime: '11 min read',
  }

  var Mod5 = {
    title: 'Microservices patterns implementation and deployment',
    slug: 'microservices',
    html:
      '<p>Download the PDF <a href="/microservices.pdf">here</a></p>\n<p>Lathe video <a href="/videos/lathe-oscillating.mp4">here</a></p>\n',
    date: '2020-09-08',
    excerpt: '',
    printDate: 'September 8, 2020',
    printReadingTime: '1 min read',
  }

  var Mod6 = {
    title: '3-D Magnetotelluric inversion using Hadoop MapReduce',
    slug: 'mt-thesis',
    html:
      '<p>This is my Honours thesis from 2012. \nIt was not published. </p>\n<p>Some of the concepts and ideas are now outdated and have been superseded with new technologies. I include it here only for future reference and posterity.</p>\n<p>Download the PDF <a href="/mt-thesis.pdf">here</a>.</p>\n',
    date: '2020-08-20',
    excerpt: '',
    printDate: 'August 20, 2020',
    printReadingTime: '1 min read',
  }

  var Mod7 = {
    title: 'Netlify Forms',
    slug: 'netlify-forms',
    html:
      '<p>First, we build the form in Svelte.\nNothing surprising here.</p>\n<p><code>src/Contact.svelte</code></p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">let</span> reasons <span class="token operator">=</span> <span class="token punctuation">[</span>\n    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Select one...</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">EyeSpace</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Other existing project</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">New project</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Something else</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span>\n  <span class="token keyword">let</span> name <span class="token operator">=</span> <span class="token string">\'\'</span>\n  <span class="token keyword">let</span> email <span class="token operator">=</span> <span class="token string">\'\'</span>\n  <span class="token keyword">let</span> message <span class="token operator">=</span> <span class="token string">\'\'</span>\n  <span class="token keyword">let</span> selectedReason <span class="token operator">=</span> reasons<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n\n  <span class="token keyword">const</span> <span class="token function-variable function">encode</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>\n        <span class="token punctuation">(</span><span class="token parameter">key</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">encodeURIComponent</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">\'=\'</span> <span class="token operator">+</span> <span class="token function">encodeURIComponent</span><span class="token punctuation">(</span>data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">\'&amp;\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">handleSubmit</span> <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    e<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">let</span> payload <span class="token operator">=</span> <span class="token punctuation">{</span>\n      <span class="token string">\'form-name\'</span><span class="token operator">:</span> <span class="token string">\'contact\'</span><span class="token punctuation">,</span>\n      name<span class="token punctuation">,</span>\n      email<span class="token punctuation">,</span>\n      message<span class="token punctuation">,</span>\n      selectedReason<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">try</span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">\'/\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        method<span class="token operator">:</span> <span class="token string">\'POST\'</span><span class="token punctuation">,</span>\n        headers<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">\'Content-Type\'</span><span class="token operator">:</span> <span class="token string">\'application/x-www-form-urlencoded\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        body<span class="token operator">:</span> <span class="token function">encode</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>response<span class="token punctuation">.</span>url<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span><span class="token string">\'index.html\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'Intercepted by index.html. Not available locally.\'</span><span class="token punctuation">)</span>\n        <span class="token keyword">return</span>\n      <span class="token punctuation">}</span>\n      <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'Thanks for your message!\'</span><span class="token punctuation">)</span>\n      name <span class="token operator">=</span> <span class="token string">\'\'</span>\n      email <span class="token operator">=</span> <span class="token string">\'\'</span>\n      message <span class="token operator">=</span> <span class="token string">\'\'</span>\n      selectedReason <span class="token operator">=</span> reasons<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">alert</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Contact<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>If you need to get in contact with me you can fill out this form:<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>contactForm<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">bind:</span>value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{name}<span class="token punctuation">"</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>name<span class="token punctuation">"</span></span> <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Your Name<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span>\n    <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>email<span class="token punctuation">"</span></span>\n    <span class="token attr-name"><span class="token namespace">bind:</span>value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{email}<span class="token punctuation">"</span></span>\n    <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>email<span class="token punctuation">"</span></span>\n    <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Your Email<span class="token punctuation">"</span></span>\n  <span class="token punctuation">/></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span> <span class="token attr-name">for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>country<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>What is this regarding?<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>select</span> <span class="token attr-name"><span class="token namespace">bind:</span>value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{selectedReason}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    {#each reasons as reason}\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>option</span> <span class="token attr-name">value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{reason}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{reason}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>option</span><span class="token punctuation">></span></span>\n    {/each}\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>select</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>textarea</span>\n    <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>message<span class="token punctuation">"</span></span>\n    <span class="token attr-name"><span class="token namespace">bind:</span>value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{message}<span class="token punctuation">"</span></span>\n    <span class="token attr-name">rows</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>5<span class="token punctuation">"</span></span>\n    <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Message<span class="token punctuation">"</span></span>\n  <span class="token punctuation">/></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name"><span class="token namespace">on:</span>click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{handleSubmit}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Send<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">></span></span></code></pre><p>Note that the POST endpoint is just <code>&#39;/&#39;</code>.\nNetlify doesn&#39;t really mention this in the docs which is a bit strange, but it looks like they just filter out any POST requests and farm them off to their Forms endpoint.</p>\n<h2 id="netlify-forms">Netlify forms</h2>\n<p>The Netlify Forms bot parses the deployed HTML.\nUnlike the GoogleBot it doesn&#39;t try to run the JavaScript.\nYou need to give it plain HTML version of the form so that when your JavaScript sends the form data, it knows what to expect.</p>\n<p><code>public/index.html</code></p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n  <span class="token comment">&lt;!-- A little help for the Netlify post-processing bots --></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>contact<span class="token punctuation">"</span></span> <span class="token attr-name">netlify</span> <span class="token attr-name">netlify-honeypot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>bot-field<span class="token punctuation">"</span></span> <span class="token attr-name">hidden</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>name<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>email<span class="token punctuation">"</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>email<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>selectedReason<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>textarea</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>message<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>textarea</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span></code></pre>',
    date: '2020-08-13',
    excerpt: '',
    printDate: 'August 13, 2020',
    printReadingTime: '2 min read',
  }

  var Mod8 = {
    title: 'Pandoc',
    slug: 'pandoc',
    html:
      '<p>To convert Markdown to PDF, you can use Pandoc:</p>\n<pre class="language-bash"><code class="language-bash">pandoc -o out.pdf report.md</code></pre><p>This requires basictex to be installed:</p>\n<pre class="language-bash"><code class="language-bash">brew cask <span class="token function">install</span> basictex</code></pre><p>To watch the files and re-render in real time:</p>\n<pre class="language-bash"><code class="language-bash">nodemon -e md --exec <span class="token string">"pandoc -o out.pdf report.md"</span></code></pre>',
    date: '2020-08-19',
    excerpt: '',
    printDate: 'August 19, 2020',
    printReadingTime: '1 min read',
  }

  var Mod9 = {
    title: 'Plotly Dash',
    slug: 'plotly-dash',
    html:
      '<p>How do we split a Plotly Dash app into different Flask files?\nAt first, their docs on <a target="_blank" rel="nofollow" href="https://dash.plotly.com/urls">Beyond the Basics/Multi-Page Apps and URL support</a> look like they might be the place to look.</p>\n<p>But nah, there are route collisions and workarounds which throw away some neat debugging features:</p>\n<blockquote>\n<p>Since we&#39;re adding callbacks to elements that don&#39;t exist in the app.layout, Dash will raise an exception to warn us that we might be doing something wrong. In this case, we&#39;re adding the elements through a callback, so we can ignore the exception by setting suppress_callback_exceptions=True. It is also possible to do this without suppressing callback exceptions. See the example below for details.</p>\n</blockquote>\n<p>But looking a little further, <a target="_blank" rel="nofollow" href="https://dash.plotly.com/integrating-dash">this</a> kind of covers it.</p>\n<p>Here is what I did. First, we write the individual dash apps like this:</p>\n<p><code>dash_apps/app1.py</code></p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">import</span> dash\n<span class="token keyword">from</span> dash<span class="token punctuation">.</span>dash <span class="token keyword">import</span> no_update\n<span class="token keyword">from</span> dash<span class="token punctuation">.</span>dependencies <span class="token keyword">import</span> Input<span class="token punctuation">,</span> Output<span class="token punctuation">,</span> State\n<span class="token keyword">import</span> dash_daq <span class="token keyword">as</span> daq\n<span class="token keyword">import</span> dash_core_components <span class="token keyword">as</span> dcc\n<span class="token keyword">import</span> dash_html_components <span class="token keyword">as</span> html\n\n\n<span class="token keyword">def</span> <span class="token function">create_dashboard</span><span class="token punctuation">(</span>server<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    app <span class="token operator">=</span> dash<span class="token punctuation">.</span>Dash<span class="token punctuation">(</span>\n        server<span class="token operator">=</span>server<span class="token punctuation">,</span>\n        routes_pathname_prefix<span class="token operator">=</span><span class="token string">\'/upload/\'</span><span class="token punctuation">,</span>\n    <span class="token punctuation">)</span>\n\n    <span class="token decorator annotation punctuation">@app<span class="token punctuation">.</span>callback</span><span class="token punctuation">(</span>Output<span class="token punctuation">(</span><span class="token string">"output-message"</span><span class="token punctuation">,</span> <span class="token string">"children"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>Input<span class="token punctuation">(</span><span class="token string">"input1"</span><span class="token punctuation">,</span> <span class="token string">"value"</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n    <span class="token keyword">def</span> <span class="token function">update_output</span><span class="token punctuation">(</span>inputText<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">return</span> <span class="token string-interpolation"><span class="token string">f"Said: </span><span class="token interpolation"><span class="token punctuation">{</span>inputText<span class="token punctuation">}</span></span><span class="token string">"</span></span>\n\n    app<span class="token punctuation">.</span>layout <span class="token operator">=</span> html<span class="token punctuation">.</span>Div<span class="token punctuation">(</span>\n        children<span class="token operator">=</span><span class="token punctuation">[</span>\n            html<span class="token punctuation">.</span>A<span class="token punctuation">(</span><span class="token string">\'Home\'</span><span class="token punctuation">,</span> href<span class="token operator">=</span><span class="token string">\'/\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n            Input<span class="token punctuation">(</span><span class="token builtin">id</span><span class="token operator">=</span><span class="token string">"input1"</span><span class="token punctuation">,</span> <span class="token builtin">type</span><span class="token operator">=</span><span class="token string">"text"</span><span class="token punctuation">,</span> placeholder<span class="token operator">=</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n            html<span class="token punctuation">.</span>Div<span class="token punctuation">(</span><span class="token builtin">id</span><span class="token operator">=</span><span class="token string">"output-message"</span><span class="token punctuation">)</span>\n            <span class="token punctuation">]</span>\n            <span class="token punctuation">)</span>\n    <span class="token keyword">return</span> app<span class="token punctuation">.</span>server</code></pre><p>Write as many of these as you like.\nThen import them into a global index app like this:</p>\n<p><code>index.py</code></p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">from</span> flask <span class="token keyword">import</span> Flask<span class="token punctuation">,</span> render_template<span class="token punctuation">,</span> app\n<span class="token keyword">from</span> dash_apps <span class="token keyword">import</span> app1<span class="token punctuation">,</span> app2<span class="token punctuation">,</span> app3\n\n<span class="token keyword">def</span> <span class="token function">create_app</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"Creating app"</span><span class="token punctuation">)</span>\n    app <span class="token operator">=</span> Flask<span class="token punctuation">(</span>__name__<span class="token punctuation">,</span> instance_relative_config<span class="token operator">=</span><span class="token boolean">False</span><span class="token punctuation">)</span>\n\n    <span class="token decorator annotation punctuation">@app<span class="token punctuation">.</span>route</span><span class="token punctuation">(</span><span class="token string">\'/\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">def</span> <span class="token function">home</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token triple-quoted-string string">"""Landing page."""</span>\n        <span class="token keyword">return</span> <span class="token triple-quoted-string string">"""\n        &lt;a href=\'/app1\'>App 1&lt;/a>&lt;br>\n        &lt;a href=\'/app2\'>App 2&lt;/a>&lt;br>\n        &lt;a href=\'/app3\'>App 3&lt;/a>\n        """</span>\n\n    <span class="token keyword">with</span> app<span class="token punctuation">.</span>app_context<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        app <span class="token operator">=</span> app1<span class="token punctuation">.</span>create_dashboard<span class="token punctuation">(</span>app<span class="token punctuation">)</span>\n        app <span class="token operator">=</span> app2<span class="token punctuation">.</span>create_dashboard<span class="token punctuation">(</span>app<span class="token punctuation">)</span>\n        app <span class="token operator">=</span> app3<span class="token punctuation">.</span>create_dashboard<span class="token punctuation">(</span>app<span class="token punctuation">)</span>\n\n    <span class="token keyword">return</span> app</code></pre><p>Easy! </p>\n<h2 id="deploying-to-app-engine">Deploying to App Engine</h2>\n<p><code>app.yaml</code></p>\n<pre class="language-yaml"><code class="language-yaml"><span class="token key atrule">service</span><span class="token punctuation">:</span> dash<span class="token punctuation">-</span>app\n<span class="token key atrule">runtime</span><span class="token punctuation">:</span> python37\n<span class="token key atrule">entrypoint</span><span class="token punctuation">:</span> gunicorn <span class="token punctuation">-</span>b <span class="token punctuation">:</span>$PORT \'index<span class="token punctuation">:</span>create_app()\'\n<span class="token key atrule">instance_class</span><span class="token punctuation">:</span> B8\n<span class="token key atrule">basic_scaling</span><span class="token punctuation">:</span>\n  <span class="token key atrule">max_instances</span><span class="token punctuation">:</span> <span class="token number">1</span>\n  <span class="token key atrule">idle_timeout</span><span class="token punctuation">:</span> 30m</code></pre>',
    date: '2020-08-14',
    excerpt: '',
    printDate: 'August 14, 2020',
    printReadingTime: '2 min read',
  }

  var Mod10 = {
    title: 'React Hooks',
    slug: 'react-hooks',
    html:
      '<p>I&#39;m a big fan of the Syntax.fm podcast and I recently did the Level Up Tutorials <a target="_blank" rel="nofollow" href="https://www.leveluptutorials.com/tutorials/custom-react-hooks">Custom React Hooks</a> course.\nIt was really good and definitely helped me gain a deeper understanding of React Hooks, plus some best practices and code organisation techniques.</p>\n<p>In particular, Lesson #12 (Custom Hooks for Context Providers) details this method for organising and using React Context.</p>\n<p>Basically, it is a simple pattern that lets us import and use our app state like this:</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> useAppState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'../state\'</span>\n\n<span class="token keyword">const</span> <span class="token punctuation">{</span> isMenuOpen<span class="token punctuation">,</span> toggleMenu <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useAppState</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre><p>No need to import <code>useContext</code> every time!</p>\n<h2 id="defining-the-hook">Defining the hook</h2>\n<p>We start by writing the hook.\nThis is the only time you need to use either <code>createContext</code> or <code>useContext</code>.</p>\n<p><code>src/state/PageWrapper.js</code></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">import</span> React<span class="token punctuation">,</span> <span class="token punctuation">{</span> createContext<span class="token punctuation">,</span> useContext <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'react\'</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> useToggle <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'../hooks\'</span>\n\n<span class="token keyword">export</span> <span class="token keyword">const</span> AppContext <span class="token operator">=</span> <span class="token function">createContext</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  isMenuOpen<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">PageWrapper</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> children <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> isToggled<span class="token punctuation">,</span> toggle <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useToggle</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>AppContext<span class="token punctuation">.</span>Provider\n      value<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>\n        isMenuOpen<span class="token operator">:</span> isToggled<span class="token punctuation">,</span>\n        toggleMenu<span class="token operator">:</span> toggle<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">}</span>\n    <span class="token operator">></span>\n      <span class="token punctuation">{</span>children<span class="token punctuation">}</span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>AppContext<span class="token punctuation">.</span>Provider<span class="token operator">></span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">useAppState</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">useContext</span><span class="token punctuation">(</span>AppContext<span class="token punctuation">)</span></code></pre><h2 id="making-it-convenient">Making it convenient</h2>\n<p>As long as our exports above are named appropraitely, this gives us a nice way of accessing all our state hooks in one place.</p>\n<p><code>src/state/index.js</code></p>\n<pre class="language-"><code class="language-">export * from "./PageWrapper";</code></pre><h2 id="setting-it-up">Setting it up</h2>\n<p>We need to wrap our App object in the PageWrapper:</p>\n<p><code>src/state/index.js</code></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">import</span> <span class="token punctuation">{</span> PageWrapper <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./state"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>PageWrapper<span class="token operator">></span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span>\n        <span class="token operator">&lt;</span>Header<span class="token operator">></span>\n          <span class="token operator">&lt;</span>Menu <span class="token operator">/</span><span class="token operator">></span>\n          <span class="token operator">&lt;</span>h1<span class="token operator">></span>Header<span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">></span>\n          <span class="token comment">// etc</span>\n        <span class="token operator">&lt;</span><span class="token operator">/</span>Header<span class="token operator">></span>\n      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>PageWrapper<span class="token operator">></span></code></pre><h2 id="using-it">Using it</h2>\n<p>Now we can use it in any child component:</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">\'react\'</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> useAppState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'../state\'</span>\n\n<span class="token keyword">const</span> <span class="token function-variable function">Nav</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> isMenuOpen<span class="token punctuation">,</span> toggleMenu <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">useAppState</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isMenuOpen<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token keyword">null</span>\n  <span class="token keyword">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>nav\n      style<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>\n        background<span class="token operator">:</span> <span class="token string">\'var(--black)\'</span><span class="token punctuation">,</span>\n        color<span class="token operator">:</span> <span class="token string">\'white\'</span><span class="token punctuation">,</span>\n        position<span class="token operator">:</span> <span class="token string">\'fixed\'</span><span class="token punctuation">,</span>\n        width<span class="token operator">:</span> <span class="token string">\'100vw\'</span><span class="token punctuation">,</span>\n        height<span class="token operator">:</span> <span class="token string">\'100vh\'</span><span class="token punctuation">,</span>\n        left<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n        right<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">}</span>\n    <span class="token operator">></span>\n      <span class="token operator">&lt;</span>h1<span class="token operator">></span>Hello<span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">></span>\n      <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span>toggleMenu<span class="token punctuation">}</span><span class="token operator">></span>Close<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">></span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>nav<span class="token operator">></span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> Nav</code></pre>',
    date: '2020-08-13',
    excerpt: '',
    printDate: 'August 13, 2020',
    printReadingTime: '2 min read',
  }

  var Mod11 = {
    title: 'Searching in MacOS',
    slug: 'searching',
    html:
      '<p>From <a target="_blank" rel="nofollow" href="https://www.cnet.com/news/how-to-find-files-via-the-os-x-terminal/">How to find files via the OS X Terminal - CNET</a></p>\n<h2 id="delete-temp-python-files">Delete temp python files</h2>\n<pre class="language-bash"><code class="language-bash">$ <span class="token function">find</span> <span class="token builtin class-name">.</span> -name <span class="token string">\'*.pyc\'</span> -delete</code></pre><h2 id="other-examples">Other examples</h2>\n<pre class="language-bash"><code class="language-bash"><span class="token function">find</span> /Users -name “test.txt”\n</code></pre><pre class="language-bash"><code class="language-bash"><span class="token function">locate</span> NAME</code></pre><p>Or in spotlight</p>\n<pre class="language-bash"><code class="language-bash">mdfind NAME </code></pre>',
    date: '2019-06-10T00:00:00.000Z',
    excerpt: '',
    printDate: 'June 10, 2019',
    printReadingTime: '1 min read',
  }

  var Mod12 = {
    title: 'Svelte Min',
    slug: 'svelte-min',
    html:
      '<p>Svelte is a great way to build front-ends without too much overhead.\nI&#39;ve put together a bare-bones starter project that&#39;s useful for quickly spinning up HTML+Javascript for anything from coding tutorials to real projects.</p>\n<p>Just run:</p>\n<pre class="language-bash"><code class="language-bash">npx degit jakebrown/svelte-min new-project\n<span class="token builtin class-name">cd</span> new-project\n<span class="token function">npm</span> run dev</code></pre><p>Check the soure code on <a target="_blank" rel="nofollow" href="https://github.com/JakeBrown/svelte-min">GitHub</a> to see what it includes. </p>\n',
    date: '2020-08-17',
    excerpt: '',
    printDate: 'August 17, 2020',
    printReadingTime: '1 min read',
  }

  var Mod13 = {
    title: 'Svelte Routing',
    slug: 'svelte-routing',
    html:
      '<p>I use React in my day-to-day work and I&#39;m learning Svelte for fun, so my goal was to implement this site in Svelte as simply as possible.\nI decided against Sapper, and instead started with the standard <a target="_blank" rel="nofollow" href="https://github.com/sveltejs/template">Svelte template</a> and added routing using <a target="_blank" rel="nofollow" href="https://github.com/EmilTholin/svelte-routing">Svelte Routing</a>.</p>\n<p>This was all pretty easy, but the docs for Svelte Routing contained no example where the current URL was used outside of the <code>Route</code> components.\nThis was needed to style the <code>nav</code> appropriately.</p>\n<p>This was my first attempt:</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n$<span class="token operator">:</span> url <span class="token operator">=</span> window<span class="token punctuation">.</span>location<span class="token punctuation">.</span>pathname\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>header</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>nav</span> <span class="token attr-name"><span class="token namespace">use:</span>links</span><span class="token punctuation">></span></span>\n    &lt;a class={url == \'/\' ? \'selected\' : \'\'} href="/">home<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>\n    &lt;a class={url == \'/about\' ? \'selected\' : \'\'} href="/about">about<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>nav</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>header</span><span class="token punctuation">></span></span></code></pre><p>I expected this to work without issue, so there&#39;s probably an obvious gap in my understanding of how <a target="_blank" rel="nofollow" href="https://svelte.dev/tutorial/reactive-declarations">Svelte reactivity</a> works.\nWhat happens? Well <code>url</code> is just the initial url from when the javascript loads.</p>\n<blockquote>\n<p>Edit: of course it didn&#39;t work. Reactivity is triggered via <a target="_blank" rel="nofollow" href="https://svelte.dev/tutorial/updating-arrays-and-objects"><em>assignment</em></a>.</p>\n</blockquote>\n<p>So I dug a little deeper into the svelte-routing source code, and I could see that <a target="_blank" rel="nofollow" href="https://github.com/EmilTholin/svelte-routing/blob/master/src/Link.svelte"><code>&lt;Link&gt;</code></a> implemented URL retrieval using <code>contexts</code>, which was a Svelte feature I hadn&#39;t learnt about yet.\nI just needed to tap into this context.</p>\n<p>This is all I needed:</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">LOCATION</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'svelte-routing/src/contexts.js\'</span>\n  <span class="token keyword">import</span> <span class="token punctuation">{</span> getContext <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'svelte\'</span>\n  <span class="token keyword">const</span> locationContext <span class="token operator">=</span> <span class="token function">getContext</span><span class="token punctuation">(</span><span class="token constant">LOCATION</span><span class="token punctuation">)</span>\n  $<span class="token operator">:</span> url <span class="token operator">=</span> $locationContext<span class="token punctuation">.</span>pathname\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>header</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>nav</span> <span class="token attr-name"><span class="token namespace">use:</span>links</span><span class="token punctuation">></span></span>\n    &lt;a class={url == \'/\' ? \'selected\' : \'\'} href="/">home<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>\n    &lt;a class={url == \'/about\' ? \'selected\' : \'\'} href="/about">about<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>nav</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>header</span><span class="token punctuation">></span></span></code></pre><p>As long as the component calling <code>getContext</code> is inside the <code>&lt;Router&gt;</code> component, it works just fine.</p>\n<p>I&#39;m not sure why svelte-routing doesn&#39;t discuss this.\nWhile the solution is simple, it&#39;s also non-documented and presumably not part of the official API, so it could change without notice.\nI&#39;m fine using such a solution on this toy project.\nBut on a production site? There might be a better option out there.</p>\n<h2 id="other-options">Other options</h2>\n<p>What about tapping in to the browser&#39;s API to keep track of the URL ourselves?\nLet&#39;s immediately disregard polling as an option because that seems like a messy hack.\nAre there any browser events we can listen to?</p>\n<p>There&#39;s <a target="_blank" rel="nofollow" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event">this</a>:</p>\n<pre class="language-javascript"><code class="language-javascript">window<span class="token punctuation">.</span><span class="token function-variable function">onpopstate</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>\n    <span class="token string">\'location: \'</span> <span class="token operator">+</span>\n      document<span class="token punctuation">.</span>location <span class="token operator">+</span>\n      <span class="token string">\', state: \'</span> <span class="token operator">+</span>\n      <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>state<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span></code></pre><p>One problem:</p>\n<blockquote>\n<p>Note that just calling history.pushState() or history.replaceState() won&#39;t trigger a popstate event. The popstate event will be triggered by doing a browser action such as a click on the back or forward button (or calling history.back() or history.forward() in JavaScript).</p>\n</blockquote>\n<p>So we&#39;re going to miss any of the navigation that happens within our app.\nUnfortunately, it doesn&#39;t look like there are any other options, so we&#39;re stuck with tapping in to the svelte-routing context for now.</p>\n<h2 id="links">Links</h2>\n<ul>\n<li><a target="_blank" rel="nofollow" href="https://github.com/Charca/sapper-blog-template">Original Sapper template</a></li>\n<li><a target="_blank" rel="nofollow" href="https://github.com/JakeBrown/jakebrown-io/tree/sapper">This site using Sapper</a></li>\n<li><a target="_blank" rel="nofollow" href="https://github.com/JakeBrown/jakebrown-io">This site using svelte-routing</a></li>\n</ul>\n',
    date: '2020-08-10',
    excerpt: '',
    printDate: 'August 10, 2020',
    printReadingTime: '3 min read',
  }

  var Mod14 = {
    title: 'Vim and CoC',
    slug: 'vim',
    html:
      '<p>Vim is my editor of choice.\nI&#39;ve tried to switch, and although Vim-mode plugins for editors like Visual Studio Code allow you to use your well-earned muscle memory, nothing quite matches the snappiness of Vim in the terminal.</p>\n<p>CoC comes pretty close to providing a nice IDE-like experience in Vim, so maybe that is the better trade-off for me.</p>\n<h2 id="handy-commands-for-coc">Handy commands for COC</h2>\n<ul>\n<li>gd - go to definition</li>\n<li>ctrl-o - return (:help jumplist)</li>\n<li>:CocConfig - will bring up the coc json config file</li>\n<li>:CocList snippets - list snippets for current file type</li>\n</ul>\n<h2 id="getting-python-linting-working">Getting python linting working:</h2>\n<p>We need to make sure it picks the right interpreter. To do this, do:</p>\n<pre class="language-vim"><code class="language-vim"><span class="token punctuation">:</span>CocCommand <span class="token keyword">python</span><span class="token operator">.</span>setInterpreter</code></pre><p>And pick the interpreter.</p>\n<p>It also needs to pick the correct workspace file. You can do it manually like:</p>\n<ul>\n<li>Run :CocList folders.</li>\n<li>Press <cr> and edit the path to correct folder.</li>\n<li>Run :CocRestart to restart service.</li>\n<li>Save a session file to persist workspaceFolders.</li>\n<li>(<a target="_blank" rel="nofollow" href="https://github.com/neoclide/coc-python/issues/26">https://github.com/neoclide/coc-python/issues/26</a>)</li>\n</ul>\n<p>But that’s a pain because you need to manually do it each time.\nInstead, we have set our coc-config to look for Pipfile and package.json since they will work well in our monorepo.</p>\n<p>More info <a target="_blank" rel="nofollow" href="https://github.com/neoclide/coc.nvim/wiki/Using-workspaceFolders">here</a>.</p>\n<h2 id="coc-config">CoC Config</h2>\n<p>We can always do :CocLocalConfig and put a settings file in each project if we need to.</p>\n<h2 id="terminal-escape-key">Terminal escape key</h2>\n<p>Ctrl-w</p>\n<h2 id="relative-line-numbers">Relative line numbers</h2>\n<p><a target="_blank" rel="nofollow" href="https://www.google.com.au/amp/s/jeffkreeftmeijer.com/vim-number/amp.html">https://www.google.com.au/amp/s/jeffkreeftmeijer.com/vim-number/amp.html</a></p>\n<pre class="language-vim"><code class="language-vim"><span class="token punctuation">:</span><span class="token keyword">set</span> <span class="token keyword">number</span> relativenumber\n\n<span class="token punctuation">:</span>augroup numbertoggle\n<span class="token punctuation">:</span>  <span class="token builtin">autocmd</span><span class="token operator">!</span>\n<span class="token punctuation">:</span>  <span class="token builtin">autocmd</span> BufEnter<span class="token punctuation">,</span>FocusGained<span class="token punctuation">,</span>InsertLeave <span class="token operator">*</span> <span class="token keyword">set</span> relativenumber\n<span class="token punctuation">:</span>  <span class="token builtin">autocmd</span> BufLeave<span class="token punctuation">,</span>FocusLost<span class="token punctuation">,</span>InsertEnter   <span class="token operator">*</span> <span class="token keyword">set</span> norelativenumber\n<span class="token punctuation">:</span>augroup END</code></pre>',
    date: '2020-05-29T00:00:00.000Z',
    excerpt: '',
    printDate: 'May 29, 2020',
    printReadingTime: '2 min read',
  }

  var Mod15 = {
    title: 'I never wanted to be a Web Developer',
    slug: 'web-developer',
    html:
      '<p><em>Web development is a really useful skill. Even in scientific computing. But it took me a while to realise that.</em></p>\n<p><em>Originally posted <a target="_blank" rel="nofollow" href="https://medium.com/packt-hub/i-never-wanted-to-be-a-web-developer-cfbf68cc671c">here</a>. Things sure have changed, but still a good summary of my early days.</em></p>\n<p>My background is in scientific computing. \nI like Fortran. \nIt’s fast. \nI like Java, it’s fast enough, especially with Just In Time compilation and decent libraries like Apache Commons Math.\nI like Matlab. \nIt’s not fast, but prototyping in it is fast. So it makes you fast.</p>\n<p>So for a while, I never really gave a second thought to web development.\nMaybe I still saw it as the realm of designers, still coloured from the days of Dreamweaver and static websites.\nI was happy enough to say web development wasn’t part of my repertoire.\nBut in my day job I make software for designing, simulating and manufacturing contact lenses, and eventually it became apparent that a simple web app to handle the ordering process would be a huge time-saver.</p>\n<p>I had a pretty good skill-set in scientific computing, but no real knowledge of databases or web technologies.\nI stated looking int0 web-app frameworks, and jeez it was confusing.\nI had built an entire desktop application in Java but still, Java EE and JSF confused the hell out of me.\nStill does.</p>\n<p>Then I found Play Framework.\nI never wanted to be a web developer, but sometimes products and technologies come along that make it a pleasure.\nPlay was the first.\nI could use my Java knowledge to build quick and easy web applications without needing to delve into Jave EE and concern myself with all of that enterpriseyness.\nPlay supports both Java and Scala (it’s actually built in Scala).\nSo I made the switch to Scala, and my first experiences with that were really positive.\nA breath of fresh air compared to Java.</p>\n<p>Scala is great — it’s object-oriented, it’s functional, it’s concurrent… and it’s fucking confusing.\nThis is because Scala developers tend to be smart, and as far as I know there’s no Zen of Scala (see Zen of Python).\nSo without broad experience in the language, even something so simple as a function definition can look utterly confusing.\nI was an undergrad in Computational Physics at the time, and I wanted my foray into web development to be simple. Scala was not.</p>\n<p>So then came Python. Python is so readable it is basically self-documenting, so it was just what I was looking for. Plus, I’d been meaning to learn it so I could make the switch from Matlab to Numpy+Scipy. The Numpy+Scipy combo is free and open source, and an easy option for doing high performance scientific computing in the cloud (try installing Matlab via SSH on AWS — actually, don’t!).</p>\n<p>It didn’t take long for me to fall in love with Python for web development (using bottle.py and Jinja2 templates), but I soon discovered that without the refactoring support of a statically typed language, you need unit tests. So I learnt all about unit tests and test-driven-development. Great, I’d been wanting to do that anyway.</p>\n<p>As I said, I didn’t know much about databases, so for storing data I had been using NoSQL — mostly CouchDB and AWS DynamoDB. The best tool is the one you know, and I could use these just like the hash maps familiar from CS 101, with no reason to learn SQL. But eventually SQLAlchemy reared it’s pretty head, and it wasn’t so bad.</p>\n<p>So Python and bottle.py made web development a pleasure, Javascript and JQuery were easy to pick up, and SQLAlchemy wasn’t so bad after all.</p>\n<p>Hey, there’s a full-stack! Suddenly, I found myself to be happy to be a web developer.</p>\n',
    date: '2016-02-10',
    excerpt: '',
    printDate: 'February 10, 2016',
    printReadingTime: '4 min read',
  }

  var Mod16 = {
    title: 'Python zip()',
    slug: 'zip-list',
    html:
      '<pre class="language-python"><code class="language-python">list_a <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>\nlist_b <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token string">\'b\'</span><span class="token punctuation">,</span> <span class="token string">\'c\'</span><span class="token punctuation">]</span>\nzipped_list <span class="token operator">=</span> <span class="token builtin">zip</span><span class="token punctuation">(</span>list_a<span class="token punctuation">,</span> list_b<span class="token punctuation">)</span>\n<span class="token keyword">print</span><span class="token punctuation">(</span>zipped_list<span class="token punctuation">)</span> <span class="token comment"># [(1, \'a\'), (2, \'b\'), (3, \'c\')]</span></code></pre>',
    date: '2020-08-19',
    excerpt: '',
    printDate: 'August 19, 2020',
    printReadingTime: '1 min read',
  }

  var all = [
    Mod0,
    Mod1,
    Mod2,
    Mod3,
    Mod4,
    Mod5,
    Mod6,
    Mod7,
    Mod8,
    Mod9,
    Mod10,
    Mod11,
    Mod12,
    Mod13,
    Mod14,
    Mod15,
    Mod16,
  ]

  /* src/App.svelte generated by Svelte v3.24.1 */

  const { Error: Error_1$1 } = globals
  const file$a = 'src/App.svelte'

  // (77:6) <Route path="/">
  function create_default_slot_5(ctx) {
    let index
    let current
    index = new Index({ $$inline: true })

    const block = {
      c: function create() {
        create_component(index.$$.fragment)
      },
      m: function mount(target, anchor) {
        mount_component(index, target, anchor)
        current = true
      },
      i: function intro(local) {
        if (current) return
        transition_in(index.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(index.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        destroy_component(index, detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_default_slot_5.name,
      type: 'slot',
      source: '(77:6) <Route path=\\"/\\">',
      ctx,
    })

    return block
  }

  // (80:6) <Route path="/about">
  function create_default_slot_4(ctx) {
    let about
    let current
    about = new About({ $$inline: true })

    const block = {
      c: function create() {
        create_component(about.$$.fragment)
      },
      m: function mount(target, anchor) {
        mount_component(about, target, anchor)
        current = true
      },
      i: function intro(local) {
        if (current) return
        transition_in(about.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(about.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        destroy_component(about, detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_default_slot_4.name,
      type: 'slot',
      source: '(80:6) <Route path=\\"/about\\">',
      ctx,
    })

    return block
  }

  // (83:6) <Route path="/contact">
  function create_default_slot_3(ctx) {
    let contact
    let current
    contact = new Contact({ $$inline: true })

    const block = {
      c: function create() {
        create_component(contact.$$.fragment)
      },
      m: function mount(target, anchor) {
        mount_component(contact, target, anchor)
        current = true
      },
      i: function intro(local) {
        if (current) return
        transition_in(contact.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(contact.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        destroy_component(contact, detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_default_slot_3.name,
      type: 'slot',
      source: '(83:6) <Route path=\\"/contact\\">',
      ctx,
    })

    return block
  }

  // (86:6) <Route path="/demo">
  function create_default_slot_2(ctx) {
    let demo
    let current
    demo = new Demo({ $$inline: true })

    const block = {
      c: function create() {
        create_component(demo.$$.fragment)
      },
      m: function mount(target, anchor) {
        mount_component(demo, target, anchor)
        current = true
      },
      i: function intro(local) {
        if (current) return
        transition_in(demo.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(demo.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        destroy_component(demo, detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_default_slot_2.name,
      type: 'slot',
      source: '(86:6) <Route path=\\"/demo\\">',
      ctx,
    })

    return block
  }

  // (89:6) <Route>
  function create_default_slot_1(ctx) {
    let error
    let current

    error = new Error$1({
      props: { status: '404', message: 'Page not found' },
      $$inline: true,
    })

    const block = {
      c: function create() {
        create_component(error.$$.fragment)
      },
      m: function mount(target, anchor) {
        mount_component(error, target, anchor)
        current = true
      },
      p: noop,
      i: function intro(local) {
        if (current) return
        transition_in(error.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(error.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        destroy_component(error, detaching)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_default_slot_1.name,
      type: 'slot',
      source: '(89:6) <Route>',
      ctx,
    })

    return block
  }

  // (74:2) <Router url={startUrl}>
  function create_default_slot$1(ctx) {
    let header
    let t0
    let main
    let route0
    let t1
    let route1
    let t2
    let route2
    let t3
    let route3
    let t4
    let route4
    let t5
    let footer
    let span
    let t6
    let t7_value = new Date().getFullYear() + ''
    let t7
    let t8
    let a
    let current
    header = new Header({ $$inline: true })

    route0 = new Route({
      props: {
        path: '/',
        $$slots: { default: [create_default_slot_5] },
        $$scope: { ctx },
      },
      $$inline: true,
    })

    route1 = new Route({
      props: {
        path: '/about',
        $$slots: { default: [create_default_slot_4] },
        $$scope: { ctx },
      },
      $$inline: true,
    })

    route2 = new Route({
      props: {
        path: '/contact',
        $$slots: { default: [create_default_slot_3] },
        $$scope: { ctx },
      },
      $$inline: true,
    })

    route3 = new Route({
      props: {
        path: '/demo',
        $$slots: { default: [create_default_slot_2] },
        $$scope: { ctx },
      },
      $$inline: true,
    })

    route4 = new Route({
      props: {
        $$slots: { default: [create_default_slot_1] },
        $$scope: { ctx },
      },
      $$inline: true,
    })

    const block = {
      c: function create() {
        create_component(header.$$.fragment)
        t0 = space()
        main = element('main')
        create_component(route0.$$.fragment)
        t1 = space()
        create_component(route1.$$.fragment)
        t2 = space()
        create_component(route2.$$.fragment)
        t3 = space()
        create_component(route3.$$.fragment)
        t4 = space()
        create_component(route4.$$.fragment)
        t5 = space()
        footer = element('footer')
        span = element('span')
        t6 = text('© ')
        t7 = text(t7_value)
        t8 = text(' Jake Brown. Powered by\n        ')
        a = element('a')
        a.textContent = 'Svelte.'
        attr_dev(main, 'class', 'svelte-18p6jdi')
        add_location(main, file$a, 75, 4, 1590)
        attr_dev(a, 'href', 'https://svelte.dev')
        attr_dev(a, 'target', '_blank')
        attr_dev(a, 'rel', 'noopener')
        add_location(a, file$a, 96, 8, 2035)
        add_location(span, file$a, 94, 6, 1955)
        attr_dev(footer, 'class', 'svelte-18p6jdi')
        add_location(footer, file$a, 93, 4, 1940)
      },
      m: function mount(target, anchor) {
        mount_component(header, target, anchor)
        insert_dev(target, t0, anchor)
        insert_dev(target, main, anchor)
        mount_component(route0, main, null)
        append_dev(main, t1)
        mount_component(route1, main, null)
        append_dev(main, t2)
        mount_component(route2, main, null)
        append_dev(main, t3)
        mount_component(route3, main, null)
        append_dev(main, t4)
        mount_component(route4, main, null)
        insert_dev(target, t5, anchor)
        insert_dev(target, footer, anchor)
        append_dev(footer, span)
        append_dev(span, t6)
        append_dev(span, t7)
        append_dev(span, t8)
        append_dev(span, a)
        current = true
      },
      p: function update(ctx, dirty) {
        const route0_changes = {}

        if (dirty & /*$$scope*/ 16) {
          route0_changes.$$scope = { dirty, ctx }
        }

        route0.$set(route0_changes)
        const route1_changes = {}

        if (dirty & /*$$scope*/ 16) {
          route1_changes.$$scope = { dirty, ctx }
        }

        route1.$set(route1_changes)
        const route2_changes = {}

        if (dirty & /*$$scope*/ 16) {
          route2_changes.$$scope = { dirty, ctx }
        }

        route2.$set(route2_changes)
        const route3_changes = {}

        if (dirty & /*$$scope*/ 16) {
          route3_changes.$$scope = { dirty, ctx }
        }

        route3.$set(route3_changes)
        const route4_changes = {}

        if (dirty & /*$$scope*/ 16) {
          route4_changes.$$scope = { dirty, ctx }
        }

        route4.$set(route4_changes)
      },
      i: function intro(local) {
        if (current) return
        transition_in(header.$$.fragment, local)
        transition_in(route0.$$.fragment, local)
        transition_in(route1.$$.fragment, local)
        transition_in(route2.$$.fragment, local)
        transition_in(route3.$$.fragment, local)
        transition_in(route4.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(header.$$.fragment, local)
        transition_out(route0.$$.fragment, local)
        transition_out(route1.$$.fragment, local)
        transition_out(route2.$$.fragment, local)
        transition_out(route3.$$.fragment, local)
        transition_out(route4.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        destroy_component(header, detaching)
        if (detaching) detach_dev(t0)
        if (detaching) detach_dev(main)
        destroy_component(route0)
        destroy_component(route1)
        destroy_component(route2)
        destroy_component(route3)
        destroy_component(route4)
        if (detaching) detach_dev(t5)
        if (detaching) detach_dev(footer)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_default_slot$1.name,
      type: 'slot',
      source: '(74:2) <Router url={startUrl}>',
      ctx,
    })

    return block
  }

  function create_fragment$c(ctx) {
    let div
    let router
    let current

    router = new Router({
      props: {
        url: /*startUrl*/ ctx[0],
        $$slots: { default: [create_default_slot$1] },
        $$scope: { ctx },
      },
      $$inline: true,
    })

    const block = {
      c: function create() {
        div = element('div')
        create_component(router.$$.fragment)
        attr_dev(div, 'class', 'layout svelte-18p6jdi')
        add_location(div, file$a, 72, 0, 1524)
      },
      l: function claim(nodes) {
        throw new Error_1$1(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        )
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor)
        mount_component(router, div, null)
        current = true
      },
      p: function update(ctx, [dirty]) {
        const router_changes = {}

        if (dirty & /*$$scope*/ 16) {
          router_changes.$$scope = { dirty, ctx }
        }

        router.$set(router_changes)
      },
      i: function intro(local) {
        if (current) return
        transition_in(router.$$.fragment, local)
        current = true
      },
      o: function outro(local) {
        transition_out(router.$$.fragment, local)
        current = false
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div)
        destroy_component(router)
      },
    }

    dispatch_dev('SvelteRegisterBlock', {
      block,
      id: create_fragment$c.name,
      type: 'component',
      source: '',
      ctx,
    })

    return block
  }

  function instance$c($$self, $$props, $$invalidate) {
    let posts = all
      .map((post) => ({
        ...post,
        html: post.html.replace(/^\t{3}/gm, ''),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    let startUrl = window.location.pathname

    function findPost(slug) {
      var found = posts.find(function (element) {
        return element.slug == slug
      })

      return found
    }

    const writable_props = []

    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$')
        console.warn(`<App> was created with unknown prop '${key}'`)
    })

    let { $$slots = {}, $$scope } = $$props
    validate_slots('App', $$slots, [])

    $$self.$capture_state = () => ({
      Router,
      Link,
      Route,
      Header,
      Blog,
      Contact,
      Demo,
      About,
      Index,
      Post,
      Error: Error$1,
      all,
      posts,
      startUrl,
      findPost,
      url1,
    })

    $$self.$inject_state = ($$props) => {
      if ('posts' in $$props) posts = $$props.posts
      if ('startUrl' in $$props) $$invalidate(0, (startUrl = $$props.startUrl))
      if ('url1' in $$props) url1 = $$props.url1
    }

    let url1

    if ($$props && '$$inject' in $$props) {
      $$self.$inject_state($$props.$$inject)
    }

    url1 = window.location.pathname
    return [startUrl]
  }

  class App extends SvelteComponentDev {
    constructor(options) {
      super(options)
      init(this, options, instance$c, create_fragment$c, safe_not_equal, {})

      dispatch_dev('SvelteRegisterComponent', {
        component: this,
        tagName: 'App',
        options,
        id: create_fragment$c.name,
      })
    }
  }

  const app = new App({
    target: document.body,
  })

  return app
})()
//# sourceMappingURL=bundle.js.map
