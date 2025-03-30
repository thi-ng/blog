# May the Forth be with you!

8 years ago I partially started going back to my roots to begin working on a
number of Forth based DSLs & REPLs for livecoding... not just for audio/music,
but also generative art, shaders, geometry and GUI/layout generation. Even
today, I still think Forth-like concatenative languages have unique potential &
freedoms and are severely under-explored in all of those domains mentioned. Even
though all of the examples in this post are early, pretty rough prototypes, I'd
like to share some videos/screenrecs of my previous research, maybe also to
inspire others exploring this approach of programming more...

## WebAudio

First off, a WebAudio prototype from 2015, made in the browser REPL at
http://forth.thi.ng (audio starts at ~2:15)

There's only a single audio buffer used here (boilerplate setup for that in the
first 2 mins of the video) and all subsequent operations just write to that
buffer or manipulate its contents...

## Synth for STM32

Also in 2015, aka my year of Forth, I started writing a modular synth (first
graph-based, then stack-based), including another Forth-like VM with a bunch of
audio & music-theory related syntax additions, all with the aim of creating a
livecoding env for STM32. The VM is written in C11 and (should be) platform
independent. It automatically does word inlining, peephole optimizations,
supports floating point ops, disassembly etc.

The attached image shows some Forth sourcecode defining an 2-oscillator DSP
stack for a bass synth (with FX) and a semi-randomized sequencer...

Project repo:
https://github.com/thi-ng/synstack

Project page:
https://hackaday.io/project/9374-stm32f4f7-synstack

Live performances (using the earlier, C-based graph based version of the synth
running on an STM32F746 board):

https://www.youtube.com/watch?v=3lL-ZxyrHiE

...with the Korg Nanocontrol used as sequencer and for param control):
https://www.youtube.com/watch?v=41FKE3PYjnE

Inspired by Brad Nelson's old Forth Haiku Salon
(http://www.forthsalon.appspot.com/) and wanting to put my "North" (as in
Forth-but-Not-Forth) implementation more through its paces, I wrote a
Forth-to-GLSL transpiler (in Forth), which can see in action here (demo from
~2:04)

Btw. More examples and the full source code for the VM, the REPL & transpiler
and demos can be found here:

https://github.com/thi-ng/charlie

Concatenation of words in Forth is same as functional composition. Wanting to
experiment with more concatenative concepts & operators directly from within
TypeScript, I took a somewhat unusual approach to first create a
(dual-)stack-based, but otherwise functional, embedded DSL, providing a pretty
large core vocab (~160 words) as normal TypeScript functions and then added an
optional separate layer for the actual Forth syntax, parser & runtime.

-   https://thi.ng/pointfree
-   https://thi.ng/pointfree-lang

(Btw. Both packages have pretty extensive readmes...)

This setup then made it very easy to create new syntax additions & language
extensions, both harnessing other JS/TS packages. The example shown in the video
(from 2020) is a short livecoding session demonstrating a custom vocab to
generate complex 2D geometries, using https://thi.ng/geom under the hood...
