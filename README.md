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

## Installation

### Manual install via git

1. Clone this repository into your vault's plugins folder:

   ```sh
   git clone https://github.com/botre/obsidian-auto-code-fence-language.git \
     <your-vault>/.obsidian/plugins/auto-code-fence-language
   ```

2. Install dependencies and build the plugin:

   ```sh
   cd <your-vault>/.obsidian/plugins/auto-code-fence-language
   npm install
   npm run build
   ```

   This produces the `main.js` file required by Obsidian, alongside the
   `manifest.json` already in the repository.

3. Reload Obsidian (or restart it), then enable **Auto Code Fence Language**
   under **Settings → Community plugins**.

To update later, run `git pull` followed by `npm run build` in the plugin
folder.

## Known issues

- Lack of support for template languages (e.g., JSX, TSX, Vue) due to limitations
  in the underlying model.
- Short code blocks may not be detected. The underlying model needs a fair amount
  of code to make a confident prediction; very short snippets often fall below the
  detection confidence threshold and are left unlabeled.
