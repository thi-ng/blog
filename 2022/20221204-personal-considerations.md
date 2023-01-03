---
date: 2022-12-04
tags: generative, art, manifesto, process, materiality, feedback-loop, serendipity, research, toxi, work, 2022
---

# Personal considerations for creating generative art

### For informational purposes only

This is a fluid document, compiled from different notes/docs, originally started
in ~2008, having grown slowly from my more [general
manifesto](https://gist.github.com/postspectacular/914163322bef712510dec09244beccd2)
of that period and frequently been revised to help steer my own practice (the
artistic parts) ever since.

All of the things listed here are "soft" guidelines & considerations, not an
exhaustive set of hard rules! Various omissions and exceptions do exist, and the
latter are explicitly encouraged! Yet, I do not imagine there'll be even minor
agreement about these highly subjective, **personal** stances — in fact I'm very
much expecting the opposite... So I'm also not publishing these bullet points to
start any form of debate, but, after all these years, it's important for me to
openly document how I myself have been approaching generative art projects, the
topics & goals I've been trying to research & learn about, also including some
of the hard lessons learned, in the hope some of these considerations might be
useful for others too.

Since that list already has become rather long, there're also a bunch of other
considerations & clarifications I've had to omit for now. Please keep that in
mind when reading, and if some sections are maybe a little too brief/unclear...

### About language & poetry

Given the topic (art creation & predominantly via code) and inherent social
biases related to it, from the few people who've seen various iterations of this
list in the past, I do know that the language used here has been called "too
abstract", "too technical" and "rather unpoetic" — however, this is how I _am_
thinking about these topics!

Attempting to be precise, structured, rational, disciplined about the process of
art making is not to be conflated with being disinterested in or eschewing
poetry, wonder or not striving for strong emotional audience responses. Maybe
it's exactly the inverse: With very few exceptions (i.e. where it's been made
clear human inputs/nature/effects _are_ playing an active role in the work), I
mostly do not (just cannot, anymore) stomach the various, often times strenuous,
"humanizing" references given in the descriptions of digital & generative art.
To me these references largely feel overly calculated, misleading and aimed at
specific audience & media biases, for which I've been developing a bad allergic
reaction.

There're myriad ways to see, view, encounter & interpret generative art.
Personally, I'm most engaged & interested in the conceptual, systemic aspects of
generative art, rather than their literal visualization (or general
representation). Likely this is a pretty niche attitude/behavior. But maybe
similar to how a musician/producer/composer is unconsciously and automatically
deconstructing a piece of music whilst listening, often I too can't help but
doing the same kind of semi-conscious deconstruction when viewing generative
art. Often, I'm trying to insert myself mentally into the work/system, be part
of that generative process, follow along, try to observe & understand what is
going on, how and why. And if that deconstruction is so effortless and completed
in just a fraction of a moment's time, without causing any further amazement,
wonder, emotional reaction or even just further questions, then sadly there's
not much else left to keep my attention and/or enjoyment...

So for this kind of mindset, the conceptual filters & thresholds implicit in
**the following guidelines are indirectly all about encouraging a deep(er)
emotional resonance and poetry, i.e. the poetry, beauty and complexity of an
underlying generative system!**

This poetry I've been searching & still very much yearning for _is_ indeed a
very different, more subtle, but also more raw, honest and pure form of poetry —
and when I encounter it, it feels _categorically_ different than the oftentimes
[superficial, romanticized generative creation
stories](#avoid-fake-post-rationalizations) told by some contemporaries about
their spiritual use of such conceptually & emotionally charged concepts like
flow fields, noise, randomness, dithering, grid subdivisions and/or prompt
engineering...

---

## Art is process, culture, research

-   Art creation isn't a special status activity, avoid treating it as such!
-   Art process is highly personal & subjective, but not about ego!
-   Art work = art process, not merely outputs/results of that process
    -   Art market/media often has only interest in latter
-   Art is freeform learning/experimenting/growing/sharing
-   Art is finding/creating/exploiting interdisciplinary connections
-   Peers should never be main source of inspiration or influence(!)
    -   Avoid group-think, even if part of a "scene"
    -   Diversity of ideas will beat monoculture eventually
    -   Be critical, especially with yourself!
    -   Try again, try harder, look elsewhere!
-   Focus energy on researching/selecting [suitable starting points](#concept-first)
-   What will the work contribute to my life or that of others?
-   What does the work communicate (even if abstract/indirect)?
-   Will I or others learn something new from this project?
-   Can aspects of it be shared or re-used by myself/others?
-   Will the work lead to any valuable answers or at least further questions or
    (personal) research?
-   Are there potential positive/negative side effects of creating the work?
    -   Energy consumption/waste
    -   Transport/travel
    -   Can materials be recycled
    -   Social impact/feedback
    -   All just merely an ego trip, worth the other factors?

## Document everything

-   Start on day 0
-   Use any tool/media available
    -   Screenshots/recordings
    -   Photography, print, plots
    -   Scan/catalog notes/sketches/diagrams
    -   Prototypes
    -   Bill of materials, software/hardware specs, tool versions
-   Prepare for [bit & link rot](https://en.wikipedia.org/wiki/Software_rot)
    -   Minimize/control dependencies
        -   Esp. be careful with Web APIs (sooner or later deprecated)
        -   Use bundlers & dead code elimination to only keep what's used
    -   Use "dumb" media to document (images/video/audio)
        -   Lowest common denominator for longevity
    -   Prepare offline LTS (Long-term Support) machine/setup
        -   If possible port to Raspberry PI or similar hardware
    -   Blockchains will not help, too inefficient
-   Multiple backups (e.g. AWS Glacier)
-   Friedrich Kittler:
    -   _"Media determine our situation. What remains of people is what media can
        store and communicate."_

## Version everything

-   Create a (Git) repo for every new project
-   Even if not used for versioning per se, use the commit log as diary/devnotes
    -   Adopt [Conventional Commits](https://conventionalcommits.org) method to enable tooling
-   Frequent commits reduce fear & danger of ending up in a creative cul de sac
    -   Pragmatism always wins over procrastination!
-   Use branches for exploratory work/experiments
    -   Abandon branches when getting stuck, but don't delete
    -   Might be useful starting points in near/distant future
-   Use tags to document (& later retrieve) key snapshots/releases
    -   Reproducibility (esp. important for installations)
-   Daily backups to remote (apart from media, since Git LFS sucks)

## Process is everything

-   Primary goal of generative work/project is to explore a model/concept/process
-   Time is inherent in every process
-   Behavior is inherent in every process
-   Relationships, context & environment is inherent in every process
-   Every project aspect/element considered a verb/action/process
    -   It's an artist responsibility to shape & connect all of these
-   Use "adverbs" to refine verbs (processes), add details
    -   Adverbs = additional params or layered sub-processes
    -   Functional techniques can enable or simplify this
-   [Representation](#representations) is primary for audience, but secondary
    conceptually
    -   initially undefined/loose
    -   always changeable
    -   role of art process is to find/define representation(s)

## Concept First

-   Form follows function (as in causality)
    -   80/20 initial starting premise
-   Figure out later if and/or how much form can influence function
-   Focus on simple concepts/setups/algorithms
    -   Encourage complexity in results, not in system design
-   Try starting with a strong/clear concept/premise for framing the work
    -   Adapt/revise as necessary, but always do so consciously & intently
-   Try to understand core principles of the concept
    -   Ask more questions than searching for concrete answers
    -   Answers follow questions follow answers
-   Avoid early lazy shortcuts, unless leading somewhere conceptually
    interesting

## Avoid classic archetypes & primitives

-   The potential of generative art is **not** about:
    -   Automation
    -   Compensation for a lack of physical dexterity and/or art/craft skills
    -   Uncritically re-implementing old/existing art styles/expressions/algorithms
    -   Copy & paste algorithm-based clip art
    -   Aim higher, add something new, something unseen!
-   Text-book use of classic techniques/algorithms strongly discouraged
    -   Recipe for triteness, increase personal acceptance threshold
-   Do not give in to cheap clichés/tropes or skeuomorphism
    -   ...unless the subject of an explicit reference/statement/commentary
    -   Instead spend more energy on finding [interesting
        concepts](#concept-first)
-   Avoid simplistic cultural/semiotic sampling and/or use of strenuous historical/stylistic references
    -   aka avoid "Affinity via proximity"
    -   What is achieved/communicated by creating arbitrary relationships to older
        art styles?
    -   Be brave, don't follow herd instincts re: popular aesthetic biases
-   Avoid simulacra of irrelevant representational aspects/materials/techniques
    -   Whenever possible [learn & work with real materials](#embrace-materiality) instead
    -   What does this simulacra/texture/cliché achieve or add to the work?
    -   What happens to the overall concept if the simulacra is left out?
    -   Is there anything interesting left of the work without it (the simulacra)?
-   Replace classic shape/form primitives with (at least parametric) processes
    -   Functional approach provides further dimensions of expression
    -   Use computation to maximize generative aspects
    -   Bauhaus was novel 100 years ago, you're living & working in the Now

## Feedback loops everywhere

-   Allow & encourage feedback loops on/over as many levels as possible
    -   Applies to runtime/execution/performance of the piece
    -   Also applies to the creation process itself!
-   Every complex system has [shearing layers](https://en.wikipedia.org/wiki/Shearing_layers)
    -   Different system & process aspects exist/move at different timescales
    -   Be aware of them and utilize their dynamics
-   All processes have a time domain
    -   Encourage & explore temporal interactions between sub-systems
    -   Find ways to represent those interactions meaningfully

## Intentionality vs serendipity

-   Have an opinion about who retains active control over the system/outcome
    -   Impossible task if system isn't understood
    -   Aim of the project/work is/should be to understand the system
    -   Doesn't apply if model/concept is all about surrendering human control
-   Encourage serendipity through system design
-   Avoid succumbing to serendipity caused by sheer ignorance
-   Avoid randomness for randomness' sake
    -   If using randomness, always prefer using weights/probabilities/distributions
    -   Attempt using reactions/interactions between parameters/sub-systems as replacement for PRNG
        -   Offers another axis of expression
        -   More malleable
-   Find balance between intentional & accidental decisions

## Generative properties

-   Generative processes run in opposite direction of abstraction
    -   Abstraction can be a useful starting point though
    -   Don't get stuck there!
-   Practice & employ Bottom-Up design strategies
    -   Additive vs. reductionism
    -   Synthesis vs. sampling
    -   Extrapolation, layering
    -   Complexity & emergence arises from assemblages of simple constructs
-   Research disciplines/subjects with inherent generative properties, e.g.
    -   Biology, chemistry, geology, neurology, physics
    -   Evolution, symbiosis
    -   Maths, geometry, rule systems
    -   Music theory
-   Does the chosen concept have **any** inherent generative or emergent qualities?
    -   If so, what can/must I do to make those the central focus of the work?
    -   If not, move on regardless, but stop pretending to treat project as
        "generative"...
        -   Not about dogma, only being realistic & honest about process used
        -   Also see: [Avoid post-rationalizations](#avoid-fake-post-rationalizations)
-   Find, embrace & explore the edges/limitations of the generative process

## Generative aesthetics are emergent

-   Generative work focused on constructing artificial/conceptual micro-universes
    -   First & foremost about exploring process aspects
    -   Preferably focused on hitherto unknown/untried combinations
-   Image, NOT pre-image (inverse)!
    -   _"The image of a function is the set of all output values it may produce."_
    -   https://en.wikipedia.org/wiki/Image_(mathematics)
-   Each constellation of processes offers infinite representation potential
-   Representational aspects are allowed/encouraged to impact/drive/refine model
    -   MVC is useful, but do not succumb to it!
    -   Prefer process elements to define/inform aesthetics
    -   [See section on feedback loops](#feedback-loops-everywhere)
-   Concept/model can be based on 3rd party aesthetic references
    -   but not allowed to be dictated/defined/limited by it

## System connectome

-   Consider generative systems as layers of interconnected tissue
-   Encourage & allow connections to form
    -   via the design of the system
    -   via feedback loops
-   Explore unexpected, surprising, maybe illogical ways of connecting:
    -   parameters/behaviors/concentrations
    -   relationships between sub-systems
    -   rules & rhythms of interactions
-   Deeply analyze used core algorithms, attempt to alter/customize/hack
    -   _All_ classic algos used in generative art are cliché by now
    -   Not an limitation of the algorithms but of/how most people keep using them

## Model, Representations, Controls

### Model

-   Conceptual driver/framework
-   Describes overall system/universe of what will become "the work"
-   Agents, algorithms, data structures, entities
-   Behaviors
-   Customization points/processes
-   Architecture/networks/layers/relations
-   Key algorithm analysis
    -   What are the interesting exploitable properties?
    -   Representation potential (e.g. visualization)
    -   Customization potential (see [controls](#controls))
        -   Always aim for untried/unseen results
    -   Range of possible results
        -   Consider exponential growth if combined with other algos/controls/systems
    -   Algorithmic complexity (scaling behavior)
    -   Memory vs. time complexity
    -   Greedy vs. non-greedy
    -   Parallelizable vs. strictly serial
-   [Role & nature of time](#process-is-everything)
    -   Expected life time (or run time) vs. creation time
    -   Realtime vs offline (non-realtime generation)
    -   Time slicing computations
-   Hardware limitations/assumptions
    -   These limitations can be greatest source of inspiration & framing
    -   Exploit known behaviors/limits (as counter point to "responsive design")

### Representation(s)

-   Observable "views" of the model's state/progression/evolution
    -   Likely the "art work" (output) presented publicly, but also other views
    -   General representation, not necessarily visual
-   Defines all purely aesthetic decision aspects & sub-systems
-   Separation from model enables exploration of multiple, alternative views:
    -   Multiple output formats (resolutions, vectors, fabrication)
    -   Multiple media types (sonification vs. visualization)
    -   Static snapshots of otherwise time-based processes
    -   A/B testing (e.g. measuring impact of param changes)
    -   Debug art, experimental visualizations

### Controls

-   Entire set of system parameters/limits/membranes
    -   Decide on global vs local scopes of impact
-   Rules of engagement
    -   between parameters
    -   between system components
-   Responsiveness/reactions to internal/external stimuli
-   Human/agent vs. agent/agent interactions
-   Networked/connectivity
    -   include outages/disconnections as core design element
-   [Feedback loops](#feedback-loops)
-   Also:
    -   Events, triggers
    -   Potentials, differentials
    -   Gradients, falloffs
    -   Distributions, densities, decimation
    -   Failure modes
-   Is the system self-sufficient/standalone?
-   What does human/external input enable or hinder in the system?

## Mapping & navigating the opportunity space

-   Each unique output a point in n-dimensional opportunity space
-   Perform manual or automated searches for hotspots/regions of interest
    -   Use binary searches to quickly narrow down intervals
    -   Use findings to refine model aspects
    -   Rinse & repeat (see [feedback loops](#feedback-loops))
-   During exploration only ever change one thing at a time
-   Use batch generation & dimensionality reduction to sample & visualize scope

## Embrace materiality

(When positing work in the physical world...)

-   Learn as much as possible about different methods of make available to you
-   Respect, explore & exploit material and/or fabrication behaviors/limits
    -   Include these learnings & properties as core part of the model/process
    -   Do not treat merely as after-thought!
    -   If in doubt, ask experts
-   If possible, try multiple material options, pick most interesting/feasible
    -   A contrasting material/method can lead to entirely new creative direction
-   Modify consumer hardware/fabrication tools to achieve unusual/unexpected results

## Avoid fake post-rationalizations

-   Creative works should speak for themselves (or not at all)
-   Curate your outputs
    -   Not every project needs/should be published
    -   Less is more
-   Treat audience with respect & honesty about process & outcomes
    -   Be honest about [non-intentional results](#intentionality-vs-serendipity)
-   Explain (but not over-explain) core philosophy
    -   approach
    -   behaviors
    -   causes/effects
    -   important conceptual linkages/relationships
    -   research references
-   Abstain from romanticized post-rationalizations
    -   No compensation for a lack of conceptual/aesthetic depth of the work
-   Avoid appeals to luddite audience biases
    -   Esp. applies to balance between human/algorithm (or "AI")
    -   No blatant over-simplifications
-   Document & share creation process, learnings, insights, code
    -   But be (very!) aware of obvious limitations in our capitalist
        environment

---

## Epilogue

Congratulations for getting this far! As mentioned earlier, this list of
considerations is fluid, incomplete and highly subjective! I absolutely do not
intend for it to be used as a discussion starter, but hope at least some parts
are food for thought for some readers...

Still, if you do want to share some feedback, you can find me at:

-   [@toxi@mastodon.thi.ng](https://mastodon.thi.ng/@toxi) (preferred)
-   [@toxi@twitter.com](https://twitter.com/toxi) (since 12/2022 rarely checked)
