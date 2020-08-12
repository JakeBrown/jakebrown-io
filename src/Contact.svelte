<script>
  let name = ''
  let email = ''
  let message = ''
  let handleSubmit = (e) => {
    e.preventDefault()
    let payload = { name, email, message }
    console.log('submitting')
    console.log(payload)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', payload }),
    })
      .then(() => alert('Success!'))
      .catch((error) => alert(error))
  }
</script>

<svelte:head>
  <title>Contact</title>
</svelte:head>
<div class="container">
  <h1>Contact</h1>
  <form class="contactForm">
    <input type="hidden" name="form-name" value="contact" />
    <div class="form-group">
      <input
        type="text"
        bind:value={name}
        class="form-control"
        id="name"
        placeholder="Your Name" />
    </div>
    <div class="form-group">
      <input
        type="email"
        class="form-control"
        bind:value={email}
        id="email"
        placeholder="Your Email" />
    </div>
    <div class="form-group">
      <textarea
        class="form-control"
        name="message"
        bind:value={message}
        rows="5"
        placeholder="Message" />
    </div>
    <button on:click={handleSubmit} class="btn btn-send">Send</button>
  </form>
</div>
