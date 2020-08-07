<style>

</style>

<script>
  function sayHello(e) {
    console.log(e)
    console.log('Hello')
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
  <p>Number: {j}</p>

  <div>
    <button on:click={sayHello}>Say hello</button>
  </div>

  <div>
    <input bind:value={name} on:click={sayHello} on:input={printInput} />
  </div>

  <div>
    <input type="number" bind:value={sleepTime} />
  </div>
</div>
