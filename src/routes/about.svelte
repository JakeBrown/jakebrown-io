<style>
  figure {
    float: right;
    margin: -3em -7em 2em 2em;
    max-width: 400px;
  }

  figure img {
    border-radius: 8px;
  }

  @media (max-width: 1020px) {
    figure {
      float: none;
      margin: 0 auto 2em;
    }
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>

<div class="container">
  <h1>About</h1>
  <figure>
    <img src='profile-pic.jpg' alt='Jake in Iceland.'>
    <figcaption>Photo by Jake Brown</figcaption>
  </figure>
  <p>
  I'm a developer living in Adelaide, South Australia.
  I'm driven to find ways to make people's jobs and their lives easier, through technology.
  </p>

  <p>In 2012 I completed Honours in High Performance Computational Phyiscs at the University of Adelaide. It's billed as <i>solving difficult Physics problems with supercomputers</i>. But for me, it was about trying to understand the world through mathematics and abstraction, and <i>finding programmatic solutions to real world problems</i>.</p>

  <p>At EyeSpace™, which I co-founded in 2010, we produce software used by eye doctors around the world for designing, simulating, and manufacturing custom contact lenses.
  Our job is to enable and assist doctors with treating difficult eye conditions, often with life-changing results.</p>

  <p>I have a deep interest in software architecture and modern development practices.</p>
  <p>Outside of this, I enjoy hiking in the great outdoors, freediving, rock climbing, and powerlifting.</p>

</div>
