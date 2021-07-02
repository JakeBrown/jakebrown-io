---
title: Netlify Forms
date: '2020-08-13'
---

First, we build the form in Svelte.
Nothing surprising here.

`src/Contact.svelte`

```html
<script>
    let reasons = [
        `Select one...`,
        `EyeSpace`,
        `Other existing project`,
        `New project`,
        `Something else`
    ];
    let name = '';
    let email = '';
    let message = '';
    let selectedReason = reasons[0];

    const encode = (data) => {
        return Object.keys(data)
            .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let payload = {
            'form-name': 'contact',
            name,
            email,
            message,
            selectedReason
        };
        try {
            let response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encode(payload)
            });
            if (response.url.includes('index.html')) {
                alert('Intercepted by index.html. Not available locally.');
                return;
            }
            alert('Thanks for your message!');
            name = '';
            email = '';
            message = '';
            selectedReason = reasons[0];
        } catch (err) {
            alert(err);
        }
    };
</script>

<h1>Contact</h1>
<p>If you need to get in contact with me you can fill out this form:</p>
<form class="contactForm">
    <input type="text" bind:value="{name}" id="name" placeholder="Your Name" />
    <input type="email" bind:value="{email}" id="email" placeholder="Your Email" />
    <label for="country">What is this regarding?</label>
    <select bind:value="{selectedReason}">
        {#each reasons as reason}
        <option value="{reason}">{reason}</option>
        {/each}
    </select>
    <textarea name="message" bind:value="{message}" rows="5" placeholder="Message" />
    <button on:click="{handleSubmit}">Send</button>
</form>
```

Note that the POST endpoint is just `'/'`.
Netlify doesn't really mention this in the docs which is a bit strange, but it looks like they just filter out any POST requests and farm them off to their Forms endpoint.

## Netlify forms

The Netlify Forms bot parses the deployed HTML.
Unlike the GoogleBot it doesn't try to run the JavaScript.
You need to give it plain HTML version of the form so that when your JavaScript sends the form data, it knows what to expect.

`public/index.html`

```html
<body>
    <!-- A little help for the Netlify post-processing bots -->
    <form name="contact" netlify netlify-honeypot="bot-field" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="selectedReason" />
        <textarea name="message"></textarea>
    </form>
</body>
```
