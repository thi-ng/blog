# Automatic keyboard focus

In response to an email I've got asking about forcing an applet to obtain the
keyboard focus when it launches, here's a code snippet to do just this:

```java
boolean needsFocus = true;

void loop() {
  // request focus from the system until received, but only do it once
  if (needsFocus) {
    if (!this.hasFocus()) {
      this.requestFocus();
    } else
      needsFocus = false;
  }
  // your normal code goes here...
  // ...
}
```
