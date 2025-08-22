# Obsidian Auto Code Fence Language

Obsidian plugin that automatically detects and adds programming languages to unlabeled code fences.

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

## Supported languages

The plugin currently supports detection for the following languages:

- bash
- c
- cpp
- csharp
- css
- go
- html
- java
- javascript
- json
- markdown
- php
- python
- ruby
- rust
- shell
- sql
- typescript
- xml
- yaml

Feel free to request additional languages.

## Known issues

Lack of support for template languages (e.g., JSX, TSX, Vue) due to limitations in the Magika model.
