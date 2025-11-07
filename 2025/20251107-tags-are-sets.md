Tags are sets. Many apps support tagging of content, but most of them (incl. Mastodon) treat tags only as singular/isolated topic filters, akin to a flat folder-based approach. But tagging can be so, so much more powerful when treating tags as sets and offering users the possibility to combine and query tagged content as sets (think Venn diagrams), i.e. allowing tags to be combined using AND/OR/NOT aka intersection/union/difference operations...

Below is a simple query engine to do just that in ~40 lines of code (sans comments), incl. using an extensible interpreter for a simple Lisp-like S-Expression language to define arbitrarily complex nested tag queries (the code is actually lifted & simplified from my personal knowledge graph tooling, also talked about here recently[1]...)

https://gist.github.com/postspectacular/ff997a4f1016b17bbfe9beb989984ac3

For example, the query:

`(and (or 'Alps' 'PNW') (or 'LandscapePhotography' 'NaturePhotography') (not 'Monochrome'))`

...would select all items which have been tagged with `Alps` OR `PNW`, AND have at least one of the two photography tags given, but have NOT the `Monochrome` tag.

Whilst this syntax is probably alien-looking to the average user, it'd would be fairly straightforward to create visual/structural UIs for defining such queries (over the past 20 years I've done that myself several times already), heck even a SLM (small language model) could be used to translate natural language into such query expressions — what matters here is the widespread lack of treating tags this way in terms of conceptual/data modeling in most applications. Imagine being able to use hashtags this way on Mastodon to assemble personalized timelines (and extend the system to not just deal with hashtags, but other post metadata/provenance too)...

The code example illustrates how, with the right tools, such features are actually not hard to implement (or to integrate into existing apps). The example uses the following #ThingUmbrella packages for its key functionality:

-   https://thi.ng/associative: Set-theory operations, custom Map/Set data types (unused here)
-   https://thi.ng/lispy: Customizable/extensible S-expression parser, interpreter & runtime
-   https://thi.ng/oquery: Optimized object and array pattern query engine

[1] https://mastodon.thi.ng/@toxi/115497555185158157

#Tagging #Sets #QueryEngine #Lisp #Syntax #Parser #Interpreter #TypeScript #JavaScript
