---
title: Astro View Transitions
description: An introduction to View Transitions API, Astro's implementation and goal of this series.
tableOfContents: false
next: true
sidebar:
  order: 0
  label: Introduction
banner:
  content: This page is part of a work in progress series. Come back later for more content!
---

[View Transitions API][MDN docs] is an [experimental feature][compat table] that is being
introduced on browsers to allow developers to create smooth transitions between DOM
states.
The API was proposed and is actively beind developed with intention of providing a
simpler, more reliable and easier solution for solving this problem that, historically,
required a significant amount of JavaScript and CSS to be written for handling the
animation, positioning, user interaction and execution of external code during the
transition.

[Astro] is an early-adopter of multiple technologies and already provides integration with
this API for users of the framework to take advantage of.
It also provides an abstraction on top of that API that does most of the heavy-lifting and
wiring of the API, implements an alternative for browsers that don't yet supprot it, and
exposes both a declarative way of using its features and lifecycle events that are more
ergonomic than the lower level API from the browser.

In this series of articles, we will be exploring Astro's View Transitions API and its many
features. More specifically, we'll be looking not only at how to use it, but also how it
works under the hood, how it is implemented, how can it be extended and the trade-offs
of using each of the declarative directives versus writing some code yourself.

Some things to look forward to in this series:

- What does it mean to maintain a state of a component during a transition and how does
  Astro do it?
- What happens when the browser doesn't support the View Transitions API?
  - And how does Astro provide a consistent API for both cases?
- What can be done while handling each lifecycle event of a transition?
- How do transitions affect scripts injected in your page by third-parties?
- How to persist an element transition to a page without that element?

While the focus of this series is on the details and inner workings of Astro's View
Transitions API, if you want to know more about the API itself and how to use it in your
own project, you can check out:

- The [MDN docs][MDN docs] for the low-level API itself.
- The [Astro docs][astro comp docs] for the `<ViewTransition />` component, directives and
  lifecycle events.
- The [Bag of Tricks] for Astro's View Transitions API.

---

_This series is my first time publishing such deep dives, I normally write them for myself
and keep them in my notes. I'm still figuring out the best way to structure and write
these to make the content clear and understandable for everyone. If you have any feedback,
please let me know!_

[MDN docs]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
[compat table]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#browser_compatibility
[Astro]: https://astro.build
[astro comp docs]: https://docs.astro.build/en/guides/view-transitions/
[Bag of Tricks]: https://events-3bg.pages.dev/
