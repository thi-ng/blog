# Of umbrellas, transducers, reactive streams & mushrooms (Pt.2)

A 5k-word look under the bonnet of Transducer Model S

This is part 2 of an ongoing series introducing & discussing projects of the
[thi.ng/umbrella](http://thi.ng/umbrella) monorepo. Other parts:

-   [Part 1](./20190304-of-umbrellas-transducers-reactive-streams-pt1.md) — Project & series overview
-   [Part 3](./20190310-of-umbrellas-transducers-reactive-streams-pt3.md) — Convolution, 1D/2D Cellular Automata
-   [Part 4](./20190314-of-umbrellas-transducers-reactive-streams-pt4.md) — Disjoint Sets, Graph analysis, Signed Distance Fields

As promised last time, in this installment we shall lay the technical
foundations used throughout the rest of this tutorial series, to prepare for
some terraforming of [Shroomania](https://demo.thi.ng/shroomania/), the
mini-game going to be built up here. However, the game itself is just used to
contextualize these more generally useful-to-know concepts, which for this part
are: functional programming basics (some, this is not an FP tutorial as such),
ES6 iterables, reducers & transducers. Since that's already a lot of material
(this post is 5k+ words), I've moved Cellular Automata & terrain generation to
the next part of this series to cover them in more detail.

## Higher order functions 101

There's more to Functional programming than the often cited semi-scary terms
from algebra and category theory (which we will largely avoid here, functors,
monoids — I'm looking at you). Firstly, the ability to pass functions as
arguments to other functions is a pre-requisite for any FP language. Functions
here are first class citizens, are standalone and can be dealt with just like
other types of data. Functions, which either accept other functions as arguments
(inputs) and/or yield a new function as their result (output), are called
[Higher-order Functions](https://en.wikipedia.org/wiki/Higher-order_function)
(HOFs), and as such are one of the principal mechanisms for other concepts,
including application, currying, composition, memoization, trampolining etc.

A basic example, familiar to probably anyone in the JS crowd:

```ts
// HOF to build & return a preconfigured multiplier function
const mul = (n) => (x) => x * n;

// build a times 10 multiplier function
const mul10 = mul(10);

// use
mul10(4.2);
// 42

// Array.map() itself is a HOF which applies the given
// user function to each array value and produces a new array
[1, 2, 3, 4].map(mul10);
// [10, 20, 30, 40]
```

HOFs are the bread & butter of processing data in a functional manner and a
stylistic (though not always a performance) improvement over iterative code like
this:

```ts
const mulArray = (arr, x) => {
    const n = arr.length;
    const res = new Array(n);
    for (let i = 0; i < n; i++) {
        res[i] = arr[i] * x;
    }
    return res;
};

mulArray([1, 2, 3, 4], 10);
// [10, 20, 30, 40]
```

One of the obvious benefits of the functional version is the separation of
iteration logic and the actual transformation task, which in the iterative
version are fully entangled. Though, we will soon see how to separate this even
further.

Using the built-in HOFs of `Array`, we can easily construct array transformation
pipelines:

```ts
// Simple transformation pipeline using built-in HOFs
[1, 2, 3, 4]
    .filter((x) => x & 1) // keep odd numbers only
    .map(mul(14)) // multiply (using fn from above)
    .filter((x) => x > 40) // apply lower threshold
    .map((x) => `answer: ${x}`); // format

// ["answer: 42"]
```

This construct works just fine, though is subtly hiding at least two issues:

1.  It's merely a clever [fluent
    API](https://en.wikipedia.org/wiki/Fluent_interface) application of the
    Array class' prototype methods. Apart from `map` and `filter` being HOFs,
    the larger construct is not strictly functional. In other words, the
    individual processing steps are not standalone functions and they only work
    with arrays, but no other data types. E.g., there's no `map` for objects,
    strings or sets...
2.  Each transformation step creates a new (temporary) array, which in turn
    needs to be iterated over again. In the above example, the data
    flow is this:

```text
input  -> [1, 2, 3, 4]
filter -> [1, 3]
map    -> [14, 42]
filter -> [42]
map    -> ["answer: 42"]
```

For larger arrays and longer pipelines, these allocations can quickly add up and
cause unnecessary pressure on the garbage collector. Yet, this is by far the
most popular approach used in JS...

## Reductions

In addition to mapping (transforming) and filtering data collections, a
so-called _reduction_ is another fundamental (and more important) operation,
i.e. a stepwise "boiling down" of a data source into a final **single** result:

```ts
const sum = (acc, x) => acc + x;

// Sum all array items
[1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1].reduce(sum, 0);
// 42
```

As with `map`, `reduce` too processes the input array in a stepwise manner. Only
here, the user-supplied function passed to `reduce` is always called with 2
arguments: the current intermediate result (often called _accumulator_) and the
next value from the data source (i.e. the array to be reduced). The last
argument (here, `0`) is the initial result and will be used as the accumulator
in the reduction step of the first array value. Also, if the source array is
empty, this initial value will be the final result of `reduce`.

```ts
[].reduce(sum, 100);
// 100
```

In principle, we've now clarified what a reduction function is. Only finite data
sources can be reduced, of course. The idea of a "single" result might initially
feel misleading since a reduction itself can take many forms. In the next
example, we compute a [histogram](https://en.wikipedia.org/wiki/Histogram) of
word frequencies. The histogram object **is** the single final value, but itself
contains several sub-results (which could be reduced even further, e.g. summing
up the values to obtain the total word count):

```ts
"to be or not to be".split(" ").reduce(
    // reducing function
    (acc, x) => (acc[x] ? acc[x]++ : (acc[x] = 1), acc),
    // initial (empty) reduction result
    {}
);

// { to: 2, be: 2, or: 1, not: 1 }
```

As an extension of `reduce`, and to lead on to our main topic, we could create a
different version of `reduce`, one which wraps and augments our normal reduction
function to produce an array of _all_ intermediate results (not just the final
one) and so possibly helps us better understand how the reduction process
actually operates. Let's call this function `reductions`:

```ts
// takes an array, reduction function and initial result
const reductions = (src, rfn, initial) =>
    src.reduce(
        (acc, x) => (acc.push(rfn(acc[acc.length - 1], x)), acc),
        [initial]
    );

// returns all results
reductions([1, 2, 3, 4, 5], (acc, x) => acc + x, 0);
// [ 0, 1, 3, 6, 10, 15 ]

// returns only last result
[1, 2, 3, 4, 5].reduce((acc, x) => acc + x, 0);
// 15
```

At this point, one can argue that `reductions` somewhat behaves both as a
`map`-like, as well as a `reduce`-like operation. In fact, we can re-implement
`map` and `filter` (and maaany other operations) in terms of `reduce` like this:

```ts
const map = (src, f) => src.reduce((acc, x) => (acc.push(f(x)), acc), []);

const filter = (src, f) =>
    src.reduce((acc, x) => (f(x) && acc.push(x), acc), []);

map(
    filter([1, 2, 3, 4], (x) => x & 1),
    (x) => x * 10
);
// [ 10, 30 ]
```

And this, ladies and gentlemen, is the crucial insight leading us to
transducers, an augmentation and generalization of reduction functions on
\<insert-hallucinogenic-drug-of-choice\>...

## Transducers & Reducers

Maybe a direct result of one of the hard problems in CS (i.e. naming things),
there're multiple meanings of the word
[transduction](https://en.wikipedia.org/wiki/Transduction), mostly not CS
related at all. The one we're dealing with here simply is an amalgamation of
"transforming reducer" and was [initially
coined](http://blog.cognitect.com/blog/2014/8/6/transducers-are-coming) and
implemented in Clojure by Rich Hickey as an extension of his earlier work on
Reducers, and who succinctly summarized it as:

> "A transducer is a transformation from one reducing function to
> another."
> — Rich Hickey

I too like the more [physics-oriented definition on
Wikipedia](https://en.wikipedia.org/wiki/Transducer):

> "A transducer is a device that converts energy from one form to
> another."

Data & code are our forms of energy and transducers are a powerful tool to
transform either — after all, code is data and vice versa. Personally, using
transducers (initially only in Clojure) not only has been one of the most
eye-opening experiences about the beauty & elegance of the functional
programming approach, but they too have turned out to be a super flexible key
ingredient in the thi.ng/umbrella project and are used extensively by several of
its packages.

There's already a number (dozens) of older transducer libraries available for
JavaScript. With
[thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/master/packages/transducers)
(and its sibling packages) I was aiming for an alternative, more comprehensive,
yet lightweight and OOP-free implementation, and one which fully embraces ES6
iterables. All transducers implemented by this package are heavily using
TypeScript's generics to allow **building fully typed (end-to-end)
transformation pipelines**. With all the additions to TypeScript's type
inferencer over the last years, the use of generics also means we often don't
even have to declare argument types anymore.

More generally, the aim of transducers cleanly falls into the domain of
[Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns),
i.e. to separate the different processing stages of a reduction process and take
into account that the user might not have supplied an initial reduction result
(so it's then the reducer's responsibility to provide a default). Furthermore,
unlike JavaScript's built-in `Array.reduce()`, other versions, like Clojure's
`reduce` support the idea of early termination, i.e. the ability to not having
to process the full input, and stop the reduction at any given moment by
wrapping a result as `(reduced x)`. That's a super useful feature as we will see
later on.

```clj
;; Clojure reduction w/ early termination once result >= 10
;; (the last 2 values 5,6 will not be processed)
(reduce
  (fn [acc x]
    (let [sum (+ acc x)]
      (if (>= sum 10) (reduced sum) sum)))
  [1 2 3 4 5 6])

;; 10
```

Let's summarize some other advantages of Transducers over the more traditional
chained application of `Array.map()`, `Array.filter()` and `Array.reduce()` and
variations of that theme, supplied by many related JS libs:

1.  **Transducers separate the actual transformation and (optional) reduction
    from their inputs.** In other words, they do not deal with the process of
    obtaining a source value to transform, nor with the process applied to a
    transformed value — the latter is the role of Reducers (which we will
    discuss later). Rich Hickey's key insight was that many common data
    processing operations can be expressed as a form of augmented reduction. The
    `Array.map()` operation, for example, can be logically split into: 1) the
    part obtaining a value from the data source (array), 2) the actual
    transformation of that value via the user-supplied function and 3) the
    piecewise construction of the result array (really a form of reduction, as
    we've seen earlier). Transducer functions exclusively only deal with the
    second step (transformation) and so have a much wider scope of application
    and are more reusable.
2.  **Transducers can be composed (using functional composition) to form
    re-usable transformation pipelines**, which generally avoid (or at least
    drastically minimize) the creation of intermediate result arrays. This is
    amplified even more by using ES6 generators instead of large arrays as data
    source. In a multi-stage transformation pipeline, each new source value is
    processed as far as possible and then only reduced once (if at all).
3.  **Transducers can be executed in a single-step manner**, i.e. only
    processing a single value instead of transforming an entire collection. This
    makes them amenable to use in async processes, yet still retain all the
    other benefits mentioned here.
4.  **Transducers are built around Reducers and can cause early termination of
    the entire processing pipeline**. As with the previous point, this too
    enables interesting use cases, as we will see later on.
5.  **Transducers can lead to much better code reuse** across the board (use
    cases) because there's no reliance on certain input data types. This avoids
    the vast and IMHO partially unnecessary code repetition going on across the
    JS community. E.g. how many libraries with custom datatypes are
    re-implementing their own versions of `map`, `filter`, `reduce` etc.?
    [thi.ng/transducers](http://thi.ng/transducers) works with all ES6 iterables
    (i.e. arrays, strings, maps, sets, generators) and any other custom datatype
    which implements `Symbol.iterator` or the `IReducible` interface (a single
    function) to provide custom/optimized reduction logic. For array-like inputs
    (arrays, typed arrays, strings) a fast route is provided.
6.  **The separation of concerns in a transducer process makes it easy/easier
    to parallelize processing**, at least partially, e.g. via workers. This too
    is helped by the fact that the majority of transformation functions are
    usually pure, i.e. only depend on their given arguments and do (usually) not
    mutate any global/external state.

Remember the definition of a transducer from earlier:

> "A transducer is a transformation from one reducing function to another."

Combining all these above qualities and requirements, we can finally take a look
at a `Reducer` interface definition in TypeScript, the way it's been implemented
in the
[\@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/master/packages/transducers)
library:

```ts
interface Reducer<A, B> extends Array<any> {
    /**
     * Initialization, e.g. to provide a suitable initial
     * accumulator value, only called when no initial result
     * has been provided by the user.
     */
    [0]: () => A;
    /**
     * Completion. When called usually just returns `acc`,
     * but stateful transformers should flush/apply their
     * outstanding results.
     */
    [1]: (acc: A) => A;
    /**
     * Reduction step. Combines new input with accumulator.
     * If reduction should terminate early, wrap result via
     * `reduced()`
     */
    [2]: (acc: A, x: B) => A | Reduced<A>;
}
```

So we have a 3-element array of simple functions, each responsible for a
different processing stage. Based on some of the above examples, we can define
some simple reducers like:

```ts
const sum = () => [() => 0, (acc) => acc, (acc, x) => acc + x];

const push = () => [() => [], (acc) => acc, (acc, x) => (acc.push(x), acc)];

const histogram = () => [
    () => ({}),
    (acc) => acc,
    (acc, x) => (acc[x] ? acc[x]++ : (acc[x] = 1), acc),
];
```

Not taking into account early termination for now, we could then write a basic
version of `reduce` like this:

```ts
const reduce = (reducer, initial, xs) => {
    // use reducer's default init if not user provided
    let acc = initial != null ? initial : reducer[0]();
    // reduce all inputs
    for (let x of xs) {
        acc = reducer[2](acc, x);
    }
    // call completion fn to post-process final result
    return reducer[1](acc);
};

// then use like:

// no initial result provided, so use reducer default init
reduce(sum(), null, [1, 2, 3, 4]);
// 10

// with initial result of 100
reduce(sum(), 100, [1, 2, 3, 4]);
// 110

// reduction of a ES6 Set
reduce(sum(), 0, new Set([1, 2, 2, 1, 1, 3, 4, 3, 2]));
// 10

// strings are iterable too
reduce(histogram(), null, "reducers");
// { r: 2, e: 2, d: 1, u: 1, c: 1, s: 1 }
```

Using a `for..of` loop automatically makes our `reduce` much more flexible,
since we can now work with **any** ES6 iterable, including generators...

```ts
// ES6 generator to produce `n` random values from given `opts`
function* choices<T>(opts: ArrayLike<T>, n: number) {
    while (--n >= 0) {
        yield opts[(Math.random() * opts.length) | 0];
    }
}

[...choices("abcd", 10)];
// [ "a", "c", "d", "c", "a", "b", "c", "b", "b", "b" ]

reduce(histogram(), null, choices("abcd", 100));
// { a: 29, b: 27, c: 25, d: 19 }
```

Above we defined the `Reducer` interface using generics, stating the reducer's
reducing function consumes values of type `B` and produces results of type `A`.
For a `Transducer` the situation is similar, only we need a 3rd type, for which
we use `any`, since for an individual transducer, we can't prescribe what kind
of result is being produced/reduced at the very end. If this is still unclear,
the following examples will hopefully help.

```ts
type Transducer<A, B> = (r: Reducer<any, B>) => Reducer<any, A>;
```

...or in less formal terms, a transducer is a function which accepts a reducer
accepting inputs of type `B`, and returns a new reducer accepting inputs of type
`A` --- a transformation of a reducer, indeed.

Now we can redefine `map` in transducer form (with types, for clarity):

```ts
function map<A, B>(fn: (x: A) => B): Transducer<A, B> {
    return (r: Reducer<any, B>) => [
        r[0],
        r[1],
        (acc, x: A) => r[2](acc, fn(x)),
    ];
}

// or without types
map = (f) => (r) => [r[0], r[1], (acc, x) => r[2](acc, f(x))];
```

Without going into even more detail now (there're a lot of other blog posts
about the topic), we've reached the last remaining piece of the puzzle:
`transduce`. This function is actually rather trivial and merely combines all
the other elements discussed thus far: It takes the same arguments as `reduce`,
with an additional transducer (like `map` above) as the first argument. It then
simply composes the given transducer with the reduction step and then just
delegates to `reduce`. The reason for this user-side separation between
transduction and reduction steps will become more obvious very soon.

```ts
// composes transducer `xform` with reducer `rfn`
// then calls reduce
const transduce = (xform, rfn, initial, xs) => reduce(xform(rfn), initial, xs);
```

Some basic examples, both using the same transducer, but different reducers:

```ts
// pre-build a times 10 standalone transducer for re-use
const mul10 = map((x) => x * 10);

// Replicate Array.map()
transduce(mul10, push(), null, [1, 2, 3, 4]);
// [10, 20, 30, 40]

// or sum up values
transduce(mul10, sum(), null, [1, 2, 3, 4]);
// 100
```

Earlier I mentioned that transducers can be composed to form transformation
pipelines. Composition (together with Application) is one of the primary
constructs in functional programming, in short: `comp(f,g)(x) = f(g(x))`. For
that reason thi.ng/transducers provides an [optimized `comp`
function](https://github.com/thi-ng/umbrella/blob/master/packages/compose/src/comp.ts)
(which actually is part of the [thi.ng/compose](http://thi.ng/compose) package),
allowing arbitrary numbers of transducers to be combined.

In this next example, we're using `comp` to compose the following transducers in
series to perform some simplistic CSV parsing.

**Important:** The entire transducer pipeline is executed as far as possible for
each line of the CSV string **before** the next line is processed. This is in
direct contrast to the earlier mentioned popular array method chaining approach,
in which each transformation step processes all inputs before passing the
transformed result collection to the next step.

```ts
import * as tx from "@thi.ng/transducers";

const parseCSV = (csv, fieldMappers = {}, delim = ",") => {
    const [header, ...body] = csv.trim().split("\n");
    return tx.transduce(
        tx.comp(
            // filter out empty lines
            tx.filter((x) => x.length > 0),
            // tokenize
            tx.map((x) => x.split(",")),
            // convert to object using column names from header
            tx.rename(header.split(delim)),
            // apply any column transformations
            tx.mapKeys(fieldMappers, false)
        ),
        // collect all results into an array (final reduction)
        tx.push(),
        // input lines
        body
    );
};

const src = `
id,lang,rating
js,JavaScript,6
ts,TypeScript,8
clj,Clojure,7.5
go,Go,7
c,C,6.5
cpp,C++,5`;

// parse src and transform `ratings` field
const doc = parseCSV(src, { rating: (x) => parseFloat(x) });
// [ { rating: 6, lang: "JavaScript", id: "js" },
//   { rating: 8, lang: "TypeScript", id: "ts" },
//   { rating: 7.5, lang: "Clojure", id: "clj" },
//   { rating: 7, lang: "Go", id: "go" },
//   { rating: 6.5, lang: "C", id: "c" }
//   { rating: 5, lang: "C++", id: "cpp" } ]
```

After splitting each CSV line into an array of strings, the `rename` transducer
is used to convert each array into an object, using the column names provided in
the first line. In isolation:

```ts
tx.transduce(tx.rename(["a", "b", "c"]), tx.push(), [
    [10, 11, 12],
    [13, 14, 15],
]);
// [ { c: 12, b: 11, a: 10 }, { c: 15, b: 14, a: 13 } ]

// or rename & extract object keys
tx.transduce(tx.rename({ aa: "a", cc: "c" }), tx.push(), [
    { a: 1, b: 1 },
    { a: 1, b: 2, c: 3 },
]);
// [ { aa: 1 }, { cc: 3, aa: 1 } ]
```

The `mapKeys` transducer takes an object of transformation functions and then
for each input transforms the values of the given keys:

```ts
tx.transduce(
    tx.mapKeys({ id: (x) => `id-${x}`, name: (x) => x.toUpperCase() }),
    tx.push(),
    [
        { id: 1, name: "alice", age: 84 },
        { id: 2, name: "bob", age: 66 },
    ]
);
// [ { id: "id-1", name: "ALICE", age: 84 },
//   { id: "id-2", name: "BOB", age: 66 } ]
```

Altogether, the [**thi.ng/transducers**](http://thi.ng/transducers) base package
provides \~60 different transducers, 25 reducers, and 22 iterators/generators.
We will look at some of these next, but will also encounter more interesting
ones over the coming parts of this article series. The package README and doc
strings of various functions have many more examples too.

Additionally, there are the following extension packages, providing transducers
and related functions for more specific use cases:

-   [**thi.ng/transducers-binary**: Binary data related (bits, bytes, structured
    data, hexdump, utf8, base64 etc.)]
-   [**thi.ng/transducers-stats**: Technical/statistical/financial analysis
    transducers (moving averages, Bollinger bands, Donchian channel, MACD, RSI
    etc.)]
-   [**thi.ng/transducers-fsm**: Finite State Machine transducer (soon will be
    merged/replaced by the more advanced thi.ng/fsm package)]
-   [**thi.ng/transducers-hdom**: Transducer based thi.ng/hdom UI update (we
    will use this feature starting in one of the next articles)]

## ES6 iterables

Browsing through various JavaScript repos on GitHub, it seems that ES6
generators (and more generally, `Symbol.iterator`) are seemingly rather
under-appreciated (to put it mildly) in this community. I find this very odd
since they both are some of my favorite features of the language and also play
an important role as data sources in the context of transducers.

For example, many transformations require some form of counter input. So we
could use one of the `range` generators to drive it:

```ts
[...tx.range(10)]
// [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

[...tx.range(10, 20, 2)]
// [ 10, 12, 14, 16, 18 ]

[...tx.range(10,0)]
// [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]
```

Above we've used the ES6 spread operator purely for demonstration purposes, to
force the evaluation of the range. However, this is only to see the results
easier in the REPL. For transduction, we **don't** require these ranges as
arrays, but only need the input to be iterable (which includes ES6 generators).
Using generators avoids the need & creation of those temporary counter arrays
entirely!

The Es6 spread operator in an array is essentially a reduction operation:

```ts
const spread = <T>(acc: T[], src: Iterable<T>) => {
    const iter = src[Symbol.iterator]();
    let v: IteratorResult<T>;
    while (!(v = iter.next()).done) {
        acc.push(v.value);
    }
    return acc;
};

spread([], tx.range(10));
// [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

[...tx.range(5), ...tx.range(10, 15)];
// [ 0, 1, 2, 3, 4, 10, 11, 12, 13, 14 ]

spread(spread([], tx.range(5)), tx.range(10, 15));
// [ 0, 1, 2, 3, 4, 10, 11, 12, 13, 14 ]
```

In addition to simple numeric counters, there're also 2D, 3D and normalized
versions (see docs for details):

```ts
[...tx.range2d(4, 3)];
// [ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ],
//   [ 0, 1 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ],
//   [ 0, 2 ], [ 1, 2 ], [ 2, 2 ], [ 3, 2 ] ]

[...tx.normRange(10)];
// [ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1 ]
```

Normalized counters are useful for all sorts of use cases, e.g. here to compute
vertices of a regular 2D polygon:

```ts
import { TAU, cossin } from "@thi.ng/math";

const makePoly = (n, r) =>
    tx.transduce(
        tx.map((i) => cossin(i * TAU, r)),
        tx.push(),
        tx.normRange(n, false)
    );

makePoly(3, 100);
// [ [ 100, 0 ],
//   [ -49.99999999999998, 86.60254037844388 ],
//   [ -50.00000000000004, -86.60254037844385 ] ]
```

(The above `cossin` function computes
both the cosine & sine of the given angle and scales result to
`r` (radius))

To avoid/minimize boilerplate, most (not all) transducers and reducers
in **thi.ng/transducers** support an optional source iterable. If this
is given, the returned function will not be a transducer/reducer
anymore, but instead becomes a transforming iterator of the input. So we
could rewrite the above as:

```ts
const makePolyIter = (n, r) =>
    tx.map((i) => cossin(i * TAU, r), tx.normRange(n, false));

[...makePolyIter(3, 100)];
// [ [ 100, 0 ],
//   [ -49.99999999999998, 86.60254037844388 ],
//   [ -50.00000000000004, -86.60254037844385 ] ]
```

Once we will start building a UI for our game, we will make more repeated use of
this iterator feature. For now, just file it under "good to know"...

## Multiple inputs

The overall usage pattern of a reduction is the usual:

> input → process → output

But what if we want to consume data from multiple sources? For that reason, most
FP libraries/languages have a so-called `zip` operator, which combines multiple
inputs into tuples, like so:

```ts
[...tx.zip(tx.range(), "abcd", tx.choices("xyz"))];
// [
//     [ 0, "a", "y" ],
//     [ 1, "b", "x" ],
//     [ 2, "c", "z" ],
//     [ 3, "d", "x" ]
// ]
```

zip only yields values until one of its inputs is exhausted. In the above code,
both `range` and `choices` are infinite, however `"abcd"` isn't...

## Multiple outputs

Sometimes, a transformation needs to produce multiple results for a single
input, either in series or in parallel. thi.ng/transducers has several options
for each (not all & not all options discussed here/yet):

```ts
// repeat each input
tx.transduce(tx.duplicate(2), tx.push(), [1, 2, 3]);
// [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ]

// chunk input into non-overlapping groups
tx.transduce(tx.partition(3), tx.push(), tx.range(10));
// [ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ] ]

// overlaps can be achieved via optional step size
tx.transduce(tx.partition(3, 1), tx.push(), tx.range(10));
// [
//     [0, 1, 2],
//     [1, 2, 3],
//     [2, 3, 4],
//     [3, 4, 5],
//     [4, 5, 6],
//     [5, 6, 7],
//     [6, 7, 8],
//     [7, 8, 9]
// ]

// process chunks & re-flatten results
tx.transduce(
    tx.comp(
        tx.partition(3, 3, true),
        tx.mapIndexed((i, p) => [i, p]),
        tx.mapcat(([i, p]) => tx.map((x) => x + i * 100, p))
    ),
    tx.push(),
    tx.range(10)
);
// [ 0, 1, 2, 103, 104, 105, 206, 207, 208, 309 ]
```

Also falling under this category is the idea of functional juxtaposition, i.e. a
higher-order function, which takes a number of transformation functions and
returns a new function, which when called, applies all given functions to the
input and returns a tuple (array) of the results:

```ts
import { juxt } from "@thi.ng/compose";

const neighbors = juxt(
    (x) => x - 1,
    (x) => x,
    (x) => x + 1
);

neighbors(100);
// [ 99, 100, 101 ]
```

That same concept can also be applied to execute multiple transducers for each
input and that way, create a kind of multiple processing lane system (maybe
temporarily only and fused back later on...). The higher-order transducers
`multiplex` and `multiplexObj` are doing exactly that:

```ts
// import moving averages transducers
import { sma, ema, wma } from "@thi.ng/transducers-stats";

tx.transduce(
    tx.comp(
        // compute simple, exponential and weighted MA
        tx.multiplex(sma(5), ema(5), wma(5)),
        // drop/skip the first 4 values (due to MA lag)
        tx.drop(4)
    ),
    tx.push(),
    // generate 10 random values as input
    tx.repeatedly(() => Math.random() * 100, 10)
);
// [ [ 64.54710049259242, 64.54710049259242, 63.446878766675205 ],
//  [ 67.95324272855098, 76.16013450864521, 75.05991278272799 ],
//  [ 64.28349996851921, 70.18377375668821, 71.81918262413573 ],
//  [ 63.93406328379683, 48.96377633421058, 52.56594313104779 ],
//  [ 49.85688603190547, 37.937601265093676, 36.549672412068794 ],
//  [ 42.86881994710021, 36.73100495201606, 31.36998117672058 ] ]
```

Note: Because a moving average of period `n` can only produce values after `n`
inputs, we have to skip `n-1` inputs here, because `multiplex` does no filtering
and so the first 4 results each are: `[undefined, undefined, undefined]`.

## Infinity & early termination

Infinity is a unique aspect of generator-based data sources, not achievable with
the purely-array based data transformation approach. E.g. here're some easy ways
to crash your browser tab/node REPL:

```ts
[...tx.range()];
[...tx.iterate((x) => x + 1, 0)];
[...tx.cycle([1, 2, 3])];
```

All of these (and more) are examples of infinite generators. `range`, when
called without arguments, yields an infinite sequence of monotonically
increasing values, which of course can't fit into a memory-cached array. Yet,
there're many dynamic programming use cases, where we might want to work with an
initially infinite source, but then somehow stop when a given condition occurs
(see Douglas Adams' Hitchhikers Guide to the Galaxy for literary example). This
is why `reduce` in thi.ng/tranducers also provides several operators to bail out
of a transduction/reduction process.

### take()

This transducer consumes a maximum of `n` given values, then terminates the
entire reduction process:

```ts
[...tx.take(5, tx.range())];
// [ 0, 1, 2, 3, 4 ]

// nested iterators of 1st 5 positive odd ints
[
    ...tx.take(
        5,
        tx.filter((x) => !!(x & 1), tx.range())
    ),
];
// [ 1, 3, 5, 7, 9 ]

// same, but via transducer composition
const first5odds = tx.comp(
    tx.filter((x) => !!(x & 1)),
    tx.take(5)
);

// use `iterator` for composed transducers
[...tx.iterator(first5odds, tx.range())];

// or via standard transduce
tx.transduce(first5odds, tx.add(), tx.range());
// 25
```

### takeWhile()

This transducer terminates when the given predicate returns false. `iterate` is
another infinite generator...

```ts
[
    ...tx.takeWhile(
        (x) => x < 2000,
        tx.iterate((x) => x * 2, 1)
    ),
];
// [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ]
```

### converge()

Similar to `takeWhile`, but the predicate is given 2 values: the previous and
current input. Terminates when predicate returns true.

```ts
// leaky integrator which stops when difference between
// prev/curr goes below 1
[
    ...tx.converge(
        (a, b) => Math.abs(a - b) < 1e-3,
        tx.iterate((x) => x + (100 - x) * 0.5, 0)
    ),
];
// [ 0, 50, 75, 87.5, 93.75, 96.875, 98.4375, 99.21875 ]
```

There're many other options available, however, this post is already getting too
long and I will have to defer you until the next articles and/or the readme
files for further examples. Under the hood, this early-termination-on-demand is
achieved by a transducer wrapping its result in `reduced()`, just as it's done
in the Clojure version as well.

```ts
[...tx.map((x) => (x < 5 ? x * 10 : tx.reduced(x * 10)), tx.range())];
// [ 0, 10, 20, 30, 40, 50 ]
```

The presence of such a wrapped result value will then stop downstream
propagation of the result to any other transformations in the pipeline and
terminate the overall reduction process entirely. Only the "completion" function
of the given reducer will still be executed to finalize the overall result.

## Laziness & stepwise execution

In the `take` example, we've seen the use of `iterator`, which is an alternative
way to `transduce` to execute transducers. A watchful reader might have noticed
though that we did not provide a reducer to this function. In fact, the
signature for `iterator` is:

```ts
iterator<A, B>(xform: Transducer<A, B>, xs: Iterable<A>): IterableIterator<B>;
```

The reducer is omitted, because, here the iterator itself is fulfilling the
reduction role, producing transformed values via the standard ES6 iterator
protocol. However, being a generator, obtaining transformed values is a pull
(not push) based operation. In other words, we only want to process/transform
new values from the actual data source, when a downstream / userland process
demands it.

To achieve this, `iterator` uses the `step` (higher-order) function, which we
can also use directly:

```ts
const xf = tx.step(
    tx.comp(
        tx.filter((x) => x >= 0),
        tx.map((x) => x * 10)
    )
);

xf(1);
// 10
xf(-2);
// undefined
xf(3);
// 30
```

Here we can see that the returned step function returns nothing if the wrapped
transducer did not produce any value(s). As we've seen earlier, some transducers
can also produce multiple results per input. In this case, the stepper returns
an array of results:

```ts
const xf = tx.step(tx.partition(2));

xf(1);
// undefined (waiting for partition to fill)
xf(2);
// [1, 2]
xf(3);
// undefined
xf(4);
// [3, 4]
```

Another example (taken from the [**thi.ng/lsys**](http://thi.ng/lsys) package)
illustrating laziness:

```ts
const rules = { a: "ab", b: "a" };

// iterator recursively expanding / replacing rule "a"
const expanded = tx.last(
    tx.take(
        8,
        tx.iterate((syms) => tx.mapcat((x) => rules[x] || x, syms), "a")
    )
);
// Object [Generator]{}
```

At this point, `expanded` is completely unrealized and nothing more than a
recipe for a composed, future computation. It's a generator. Only once we start
requesting values from that generator is when the expansion process actually
starts/runs:

```ts
[...expanded].join("");
// "abaababaabaababaababaabaababaabaab"
```

## Outlook

Even though we've just merely scratched the surface here, I hope this article
provided some more clarity about the basics of this (IMHO) fascinating topic. In
the next part, we will put some of these concepts to more practical use by
combining them will Cellular Automata to produce the terrain for our game.

https://twitter.com/thing_umbrella/status/1100391690681102337

Lastly, if you have any questions or feedback about any of the projects
mentioned, please do get in touch via
[Twitter](https://twitter.com/thing_umbrella), the [GH issue
tracker](https://github.com/thi-ng/umbrella/issues) and/or join our [Discord
channel](https://t.co/mbKeDzEC7e).

Other parts:

-   [Part 1](./20190304-of-umbrellas-transducers-reactive-streams-pt1.md) — Project & series overview
-   [Part 3](./20190310-of-umbrellas-transducers-reactive-streams-pt3.md) — Convolution, 1D/2D Cellular Automata
-   [Part 4](./20190314-of-umbrellas-transducers-reactive-streams-pt4.md) — Disjoint Sets, Graph analysis, Signed Distance Fields
