# Zig pointer types cheatsheet

Hello (Zig) World!

since I'm still not automatically remembering all the various combinatorial
possibilities of different types of pointers, slices, `const`ness and optionals,
I've finally taken the plunge and created a little cheatsheet for quick
reference. It's not exhaustive, but should cover most real world cases... nobody
said it'd be easy! :)

```zig
const Cheatsheet = struct {
    /// single u8 value
    a: u8,
    /// single optional u8 value
    b: ?u8,
    /// array of 2 u8 values
    c: [2]u8,
    /// zero-terminated array of 2 u8 values
    d: [2:0]u8,
    /// slice of u8 values
    e: []u8,
    /// slice of optional u8 values
    f: []?u8,
    /// optional slice of u8 values
    g: ?[]u8,
    /// pointer to u8 value
    h: *u8,
    /// pointer to optional u8 value
    i: *?u8,
    /// optional pointer to u8 value
    j: ?*u8,
    /// pointer to immutable u8 value
    k: *const u8,
    /// pointer to immutable optional u8 value
    l: *const ?u8,
    /// optional pointer to immutable u8 value
    m: ?*const u8,
    /// pointer to multiple u8 values
    n: [*]u8,
    /// pointer to multiple zero-terminated u8 values
    o: [*:0]u8,
    /// array of 2 u8 pointers
    p: [2]*u8,
    /// pointer to array of 2 u8 values
    q: *[2]u8,
    /// pointer to zero-terminated array of 2 u8 values
    r: *[2:0]u8,
    /// pointer to immutable array of 2 u8 values
    s: *const [2]u8,
    /// pointer to slice of immutable u8 values
    t: *[]const u8,
    /// slice of pointers to u8 values
    u: []*u8,
    /// slice of pointers to immutable u8 values
    v: []*const u8,
    /// pointer to slice of pointers to immutable optional u8 values
    w: *[]*const ?u8,
};
```

### Extern struct limitations

In `extern struct`s optionals can only be used if in pointer-like form (but
**not** directly for optional values), i.e. the following cases are all fine:

-   `?*u8`
-   `*?u8`
-   `*const ?u8`
-   `?*const u8`
-   `[]?u8`
-   `[]const ?u8`

On the other hand, a plain `?u8` field isn't allowed in extern structs...
