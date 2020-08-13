<style>
  /* Style inputs with type="text", select elements and textareas */
  input[type='text'],
  input[type='email'],
  select,
  textarea {
    width: 100%; /* Full width */
    padding: 12px; /* Some padding */
    border: 1px solid #ccc; /* Gray border */
    border-radius: 4px; /* Rounded borders */
    box-sizing: border-box; /* Make sure that padding and width stays in place */
    margin-top: 6px; /* Add a top margin */
    margin-bottom: 16px; /* Bottom margin */
    resize: vertical; /* Allow the user to vertically resize the textarea (not horizontally) */
    font-size: 1rem;
  }

  select {
    height: 2rem;
  }

  /* Style the submit button with a specific background color etc */
  button {
    background-color: #4caf50;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  /* When moving the mouse over the submit button, add a darker green color */
  button:hover {
    background-color: #45a049;
  }

  /* Add a background color and some padding around the form */
  .container {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
  }
</style>

<script>
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
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]),
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
      'selectedReason[]': selectedReason,
    }
    console.log(payload)
    console.log('Selected reason: ' + selectedReason)
    try {
      let response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      })
      console.log(response)
      console.log(response.url)
      if (response.url.includes('index.html')) {
        alert('Intercepted by index.html. Not available locally.')
        return
      }
      alert('Thanks for your message!')
      name = ''
      email = ''
      message = ''
      selectedReason = reasons[0]
    } catch (err) {
      alert(err)
    }
  }
</script>

<svelte:head>
  <title>Contact</title>
</svelte:head>
<div class="container">
  <h1>Contact</h1>
  <p>If you need to get in contact with me you can fill out this form:</p>
  <form class="contactForm">
    <input type="text" bind:value={name} id="name" placeholder="Your Name" />
    <input
      type="email"
      bind:value={email}
      id="email"
      placeholder="Your Email" />
    <label for="country">What is this regarding?</label>
    <select bind:value={selectedReason}>
      {#each reasons as reason}
        <option value={reason}>{reason}</option>
      {/each}
    </select>
    <textarea
      name="message"
      bind:value={message}
      rows="5"
      placeholder="Message" />
    <button on:click={handleSubmit} class="btn btn-send">Send</button>
  </form>
</div>
