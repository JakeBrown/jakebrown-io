---
title: "I never wanted to be a Web Developer"
date: "2016-02-10"
draft: false
path: "/blog/i-never-wanted-to-be-a-web-developer"
---

*Web development is a really useful skill. Even in scientific computing. But it took me a while to realise that.*

*Originally posted [here](https://medium.com/packt-hub/i-never-wanted-to-be-a-web-developer-cfbf68cc671c). Things sure have changed, but still a good summary of my early days.*

My background is in scientific computing. 
I like Fortran. 
It’s fast. 
I like Java, it’s fast enough, especially with Just In Time compilation and decent libraries like Apache Commons Math.
I like Matlab. 
It’s not fast, but prototyping in it is fast. So it makes you fast.

So for a while, I never really gave a second thought to web development.
Maybe I still saw it as the realm of designers, still coloured from the days of Dreamweaver and static websites.
I was happy enough to say web development wasn’t part of my repertoire.
But in my day job I make software for designing, simulating and manufacturing contact lenses, and eventually it became apparent that a simple web app to handle the ordering process would be a huge time-saver.

I had a pretty good skill-set in scientific computing, but no real knowledge of databases or web technologies.
I stated looking int0 web-app frameworks, and jeez it was confusing.
I had built an entire desktop application in Java but still, Java EE and JSF confused the hell out of me.
Still does.

Then I found Play Framework.
I never wanted to be a web developer, but sometimes products and technologies come along that make it a pleasure.
Play was the first.
I could use my Java knowledge to build quick and easy web applications without needing to delve into Jave EE and concern myself with all of that enterpriseyness.
Play supports both Java and Scala (it’s actually built in Scala).
So I made the switch to Scala, and my first experiences with that were really positive.
A breath of fresh air compared to Java.

Scala is great — it’s object-oriented, it’s functional, it’s concurrent… and it’s fucking confusing.
This is because Scala developers tend to be smart, and as far as I know there’s no Zen of Scala (see Zen of Python).
So without broad experience in the language, even something so simple as a function definition can look utterly confusing.
I was an undergrad in Computational Physics at the time, and I wanted my foray into web development to be simple. Scala was not.

So then came Python. Python is so readable it is basically self-documenting, so it was just what I was looking for. Plus, I’d been meaning to learn it so I could make the switch from Matlab to Numpy+Scipy. The Numpy+Scipy combo is free and open source, and an easy option for doing high performance scientific computing in the cloud (try installing Matlab via SSH on AWS — actually, don’t!).

It didn’t take long for me to fall in love with Python for web development (using bottle.py and Jinja2 templates), but I soon discovered that without the refactoring support of a statically typed language, you need unit tests. So I learnt all about unit tests and test-driven-development. Great, I’d been wanting to do that anyway.

As I said, I didn’t know much about databases, so for storing data I had been using NoSQL — mostly CouchDB and AWS DynamoDB. The best tool is the one you know, and I could use these just like the hash maps familiar from CS 101, with no reason to learn SQL. But eventually SQLAlchemy reared it’s pretty head, and it wasn’t so bad.

So Python and bottle.py made web development a pleasure, Javascript and JQuery were easy to pick up, and SQLAlchemy wasn’t so bad after all.

Hey, there’s a full-stack! Suddenly, I found myself to be happy to be a web developer.
