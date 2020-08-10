<style>

</style>

<script>
  function sayHello(e) {
    alert(`Hello ${name}`)
  }
  function resetInput(e) {
    name = 'Jake'
    sleepTime = 1000
  }
  function resetCounter(e) {
    j = 0
  }
  function printInput(e) {
    console.log(e.target.value)
  }
  let sleepTime = 1000
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  let name = 'Jake'
  let j = 0
  async function run() {
    while (true) {
      j = j + 1
      await sleep(sleepTime)
      console.log('Updating on schedule: ' + sleepTime)
    }
  }
  run()
</script>

<svelte:head>
  <title>Demo</title>
</svelte:head>

<div class="container">
  <h1>Demo page</h1>
  <p>Just a page to play around with some Svelte features.</p>
  <p>Counter: {j}</p>

  <div>
    <label>Sleep time:</label>
    <input type="number" bind:value={sleepTime} />
  </div>

  <div>
    <label>Name:</label>
    <input bind:value={name} on:input={printInput} />
  </div>

  <div>
    <button on:click={sayHello}>Say hello</button>
    <button on:click={resetInput}>Reset Input</button>
    <button on:click={resetCounter}>Reset Counter</button>
  </div>

</div>
