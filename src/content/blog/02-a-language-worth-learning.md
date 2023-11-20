---
title: 'A Language Worth Learning'
description: 'What makes a language worth learning.'
tags: ['studying', 'philosophy']
pubDateTime: 2023-06-17
madeByAI:
  tags: false
  title: false
---

> A language that doesn't affect the way you think about programming, is not worth
> knowing.
>
> -- _Alan J. Perlis, 1982[^1]_

[^1]:
    19th epigram from: Alan J. Perlis. 1982. Special Feature: Epigrams on programming.
    SIGPLAN Not. 17, 9 (September 1982), 7–13. https://doi.org/10.1145/947955.1083808

I found this quote when reading the
excellent [article](http://www.norvig.com/21-days.html) by Peter Norvig about the path of
learning how to program. It is right in the beggining, setting the stage for his post.
This post is independent of the one by Peter, but do check it out as well.

The article presents this quote in the context of an example. A programmer versed in BASIC
might need to work on some code base written in C; if that programmer only learns C
syntax, they can perform the task. By learning solely the language's syntax, the
programmer would not know how things can be done differently in C compared to BASIC; they
would be programmers in BASIC using C syntax, not programming in C.
The author believes that this situation is not what learning a new language means; it is
merely completing a task.

Suppose a language has a different syntax than one you already know but doesn't add any
new value, new constructs, or alternative to existing constraints, constructs, and
functionalities. In that case, it won't expand your ability to think about the problems
you solve. The time spent learning that language would be just assigning new symbols to
existing ideas, which could be postponed until required. More recently, with AI, it can
even be automated by tools like Codex and Code-DaVinci.

If you spend time learning a language that introduces you to new paradigms and new ways of
thinking about your program, the value of learning that language goes far beyond just when
you complete a task in that language. It gives you a more diverse forest of existing
solutions to tap into when solving a new problem, even in languages you were already
profoundly versed in, maybe even considered an expert.

A recent example of this exact effect that I participated in first-hand was when a
colleague was working on our File Storage abstraction. He was tasked with optimizing a
feature that would, as part of its workflow, make a copy of a file.

The existing abstractions were just this:

```ts
export interface Blob {
  getContentType(): Promise<string | undefined>;

  toBuffer(): Promise<Buffer>;
}

export interface ReadOnlyFileStorage {
  read(identifier: string): Promise<Blob | null>;
}

export interface FileStorage extends ReadOnlyFileStorage {
  save(identifier: string, data: Blob): Promise<void>;

  delete(identifier: string): Promise<void>;
}
```

Copying is already perfectly possible with this; you just read the file from one place and
save it to the new place; this fits perfectly with the workflow that was being added:

1. Component A gets the Blob of a file from storage X and gives it to component B.
1. Component B checks what to do with the Blob it received and decides to write its
   content into storage Y.

There is a clear general solution, read the source file and write it to the destination
file. This works regardless of what you are copying, where you are copying from, and where
you are copying to, which is excellent for mixing arbitrary storage systems, but here is
the thing... we don't usually use different storage systems for the same workflow.

When we are copying things, most of the time is just because something should be available
under two different names, and many storage systems allow that. Some storage systems even
have routines to de-duplicate files with the same content by making them point to the same
place.

But on the implementation of a particular system, we already know that it can just make
two references to the data, so the copy operation could be almost free. How could we make
this more efficient without an actual copy operation if it is caused by an external read
and save? That was the goal of the task. However, the task didn't include how we could
detect that the save operation could be a copy in those systems without breaking the
interface or the abstraction; such constraints were not even mentioned anywhere. It was
left to the interpretation of whoever got the task that such conditions were more
important than extreme optimizations if it came to it, which was my mistake.

So my colleague spent more than a day's worth of effort changing the interface, making it
generic of the type of `Blob` it returns and adding an extra copy operation that can
receive only the same type of `Blob` so each implementation could have the optimized
version or delegate to the general solution if there was no optimization. The callers of
the interface then had to check if the optimized path could be taken and call the
appropriate method (`copy` or `save`), or they assumed that the optimization would be
possible and had to be generic over the `Blob` type of their implementation detail.

After all that, I looked at the code and told him there was a straightforward solution
that didn't require any changes in the interfaces or call site. The possibility of a
compile-time check for the optimization was not a positive addition since the
implementation to be used was chosen dynamically, and although we know that it currently
never mixes storage systems, that is entirely possible by changing just the configuration.
This means we require a runtime check anyway, so why not make the implementations
specialize themselves without the caller even having to be aware of it?

We reverted everything back to the initial interface and made the optimization change only
on the `save` implementation of the storage systems that could benefit from it. One of
them is Google Cloud Storage (GCS), which can make a copy of a file with a single API
call. This is the complete change:

```ts
export class GcsBlob implements Blob {
  // Existing methods unchanged

  // Added this new method to the class, not part of the interface
  public async copyTo(other: File): Promise<void> {
    // `this.handle` is the handle to the original file,
    // which was already present in this class
    await this.handle.copy(other);
  }
}

export class GcsFileStorage implements FileStorage {
  // Other methods unchanged

  public async save(identifier: string, data: Blob): Promise<void> {
    const file = this.bucket.file(identifier);

    // Added this conditional, if the original Blob is from GCS,
    // we just send the copy request without reading anything.
    if (data instanceof GcsBlob) {
      return data.copyTo(file);
    }

    // Continues to the existing general save solution by downloading
    // the data and uploading it to GCS
  }
}
```

Simple, right? Well... although the solution is short and straightforward, that doesn't
mean it is obvious.

Is my colleague not thoughtful for not seeing this? No, he is wicked smart but was new to
the code base, and none of the projects he worked on involved making an internal
specialization like this, so he had no reference to ground his work.

Am I a genius for solving the problem in such a simple way?
Hell no! I take no credit for this. I just replicated it from somewhere else.
Here is the deal, I don't code just in JS. One of the other languages I know is Go,
and Go solved this problem very beautifully in their standard library, so it applies to
every Go code base.
In fact, Go does it in such a way that the source and the destination might even be in
different systems,
and either can optimize for each other.

Let's look into that. Go has
a [function `io.Copy` that accepts any `Writer` and any `Reader`][io.Copy src]
reads from the reader and writes to the writer. That is the general implementation
mentioned before,
implemented independently of which reader or writer is used. The brilliant part is that
the writer can
also [implement `WriterTo`][WriterTo optimization], allowing it to receive the reader and
optimize to
any specific implementation it might want. The same for the reader;
it may [implement `ReaderFrom`][ReaderFrom optimization] that receives the writer and can
optimize for it.

This is entirely transparent for the caller;
want to copy from a file to a gRPC stream?
From a WebSocket to a raw unix socket?
From an API request to an in-memory buffer?
From a TCP socket to a file?
You can do it all with the same function, `io.Copy`.
If they can specialize for your scenario, they will, and they do:

- Copying from one file to another specializes to [`copy` syscalls][file-to-file].
- Copying from a TCP or Unix socket to a TCP connection specializes
  to [`splice` syscalls][stream-to-tcp].
- Copying from a file to a TCP connection specialized to
  the [`sendfile` syscall][file-to-tcp] becoming the famous Zero-Copy network operation.

There are many other optimizations there. Nearly all the cases I mentioned before have
specializations, and some have even more fine-grained optimizations. But all of that is
entirely transparent for the caller.

Creating that is the work of multiple distinguished minds that collectively built Go. I
just read it and copied a small piece of it. It might seem impressive at first glance if
you've had no contact with it before, but copying others is not remarkable. It is positive
to know what is out there and when to copy it to save your and your team's time; that is
indeed a skill, but a very different skill than creating something from scratch.

The point here is that knowing a language can help you solve problems more effectively in
_every_ language. And if a language does not benefit you that way, it is not worth
studying. If you already know Java, C#, PHP, and Go, learning Python, JavaScript, or even
TypeScript will, at most, teach you different a syntax for things you already know; maybe
it won't be a good use of your time. Learning Rust will teach you a lot about memory, what
allocates or not, when to use each, and how memory works in a multithreaded system due to
the borrow checker and variable lifetimes; it will also introduce a good amount about
types because of its traits. Learning C or Zig will teach you another lot about memory,
this time about the different ways to manage it manually, how different allocators behave,
and when to use them. Learning Haskell will teach you a new world of techniques and
paradigms and bring you to a much deeper dive into type theory and its applications.

What is worth learning is heavily dependent on what you _already_ know.

I will even dare to say that this applies to speaking languages just as well, not just
programming languages. For me, a native Brazilian, learning Spanish is good but adds very little
in terms of how I think since both languages are very similar in structure and ancestry; learning
English, on the other hand, makes my mind work in an entirely different mode. Thoughts are
formed by language, and knowing how to architect your thoughts with multiple structures
enables you to think more diversely.

This is one of the reasons why I didn't choose French or Italian when I was picking a new
language to study. Although clearly distinct, they share much with the languages I already
know. I was more inclined to learn Japanese, Korean, or Thai because they differ entirely
from everything I knew, which meant more to understand and improve. I am currently
studying Thai, and loving all the process.

[io.Copy src]: https://cs.opensource.google/go/go/+/refs/tags/go1.20.5:src/io/io.go;l=373-385;drc=dc8e2a6a8ec94f2c98ba20edd57932eba284efb1
[WriterTo optimization]: https://cs.opensource.google/go/go/+/refs/tags/go1.20.5:src/io/io.go;l=406-410;drc=dc8e2a6a8ec94f2c98ba20edd57932eba284efb1
[ReaderFrom optimization]: https://cs.opensource.google/go/go/+/refs/tags/go1.20.5:src/io/io.go;l=411-414;drc=dc8e2a6a8ec94f2c98ba20edd57932eba284efb1
[file-to-file]: https://cs.opensource.google/go/go/+/refs/tags/go1.20.5:src/os/readfrom_linux.go;l=31-45;drc=0844ff8eef81e124c1fecba82dd5843745427fa4
[stream-to-tcp]: https://cs.opensource.google/go/go/+/refs/tags/go1.20.5:src/net/splice_linux.go;l=12-44;drc=8d6a455df42b016ed2f7071e70718cad940937f9
[file-to-tcp]: https://cs.opensource.google/go/go/+/refs/tags/go1.20.5:src/net/sendfile_linux.go;l=13-53;drc=27c38142756902c9a2e281ff1dd0f2e0a7273f75
