# Obsidian Auto Code Fence Language

Obsidian plugin that automatically detects and adds programming languages to unlabeled code fences.

Powered by [guesslang-js](https://github.com/ray-d-song/guesslang-js).

## How it works

When you save a file containing code blocks like:

<pre>
```
function hello() {
    console.log("Hello World");
}
```
</pre>

The plugin automatically detects the language and updates it to:

<pre>
```javascript
function hello() {
  console.log("Hello World");
}
```
</pre>

## Known issues

Lack of support for template languages (e.g., JSX, TSX, Vue) due to limitations in the underlying model.
