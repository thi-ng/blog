# Progress bar for applet loading

Just came across some special `<param>` tags used by Sun's Java browser plug-in,
one of which enables a (configurable) progressbar shown while the applet is
still loading. Simply add this inside the `<applet>` tag in the exported html
file:

```html
<param name="progressbar" value="true" />
<param name="progresscolor" value="#000000" />
```

More info and various other options can be found on [this
page](https://web.archive.org/web/20040219163835/http://java.sun.com/j2se/1.4.2/docs/guide/plugin/developer_guide/special_attributes.html).

Again, this is only available for users with a recent Java plugin. The default
Microsoft JVM used by IE will ignore these settings.
