# termynal.js: A lightweight and modern animated terminal window

Typing animations are nothing new and Termynal isn't particularly revolutionary. I wrote it because I needed a modern and lightweight version with minimal JavaScript and without messy, nested `setTimeout` calls. Most of the existing libraries rely on JavaScript for both the rendering, styling and animation, or even require jQuery. This is inconvenient, especially if you're using the animation as part of your software's documentation. If a user has JavaScript disabled, they will only see a blank window.

Termynal uses **`async` and `await`**, which is now [supported](http://caniuse.com/#feat=async-functions) pretty much across all major browsers. Termynal lets you write all input and output in **plain HTML**, and all styling in **plain CSS**. Non-JS users will still see the **complete code**, just no animation. The width and height of the terminal window is read off the original container. This means you won't have to worry about sizing or layout reflows. Termynal also comes with a **flexible HTML API**, so you can use it without having to write a single line of JavaScript yourself.

![termynal](https://user-images.githubusercontent.com/13643239/26935530-7f4e1152-4c6c-11e7-9e1a-06df36d4f9c9.gif)

![termynal2](https://user-images.githubusercontent.com/13643239/26937306-4d851274-4c71-11e7-94cc-015d30a92e53.gif)


## Examples

* **Simple example:** [CodePen demo](https://codepen.io/ines/full/MoaRYM/), [`example.html`](example.html)
* **Custom example:** [CodePen demo](https://codepen.io/ines/pen/mwegrX), [`example2.html`](example2.html)

## Usage

First, you need to create a container. Each container should have a unique class or ID that tells Termynal where to find the lines to animate. Terminal will find the lines via their `data-ty` attribute and will then animate their text content. Apart from that, it won't mess with your markup – so you're free to add additional styling and attributes.

```html
<div id="termynal" data-termynal>
    <span data-ty="input">pip install spaCy</span>
    <span data-ty="progress"></span>
    <span data-ty>Successfully installed spacy</span>
</div>
```

When you include [`termynal.js`](termynal.js), you can specify the container(s) as the `data-termynal-container` attribute. To initialise Termynal for more than one container, simply add the selectors separated by a `|`, for example `#termynal1|#termynal2`.

```html
<script src="termynal.js" data-termynal-container="#termynal"></script>
```

You also need to include the stylesheet, [`termynal.css`](termynal.css)  in your site's `<head>`:

```html
<link rel="stylesheet" href="termynal.css">
```

That's it!

### Customising Termynal

On each container, you can specify a number of settings as data attributes, and overwrite the animation delay after a line on each individual element.

```html
<div id="termynal" data-ty-startDelay="600" data-ty-cursor="▋">
    <span data-ty="input"> pip install spacy</span>
    <span data-ty data-ty-delay="250">Installing spaCy...</span>
</div>
```

If you don't want to use the HTML API, you can also initialise Termynal in JavaScript. The constructor takes two arguments: the query selector of the container, and an optional object of settings.

```javascript
var termynal = new Termynal('#termynal', { startDelay: 600 })
```

The following settings are available:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `prefix` | string | `ty` | Prefix to use for data attributes. |
| `startDelay` | number | `600` | Delay before animation, in ms. |
| `typeDelay` | number | `90` | Delay between each typed character, in ms. |
| `lineDelay` | number | `1500` | Delay between each line, in ms. |
| `progressLength` | number | `40` | Number of characters displayed as progress bar. |
| `progressChar` | string | `'█'` | Character to use for progress bar. |
| `cursor` | string | `'▋'` | Character to use for cursor. |
| `noInit` | boolean | `false` | Don't initialise the animation on load. This means you can call `Termynal.init()` yourself whenever and however you want.
| `lineData` | Object[] | `null` | [Dynamically load](#dynamically-loading-lines) lines at instantiation.

## Prompts and animations

Each `<span>` within the container represents a line of code. You can customise the way it's rendered and animated via its data attributes. To be rendered by Termynal, each line needs at least an empty `data-ty` attribute.

### `data-ty`: display and animation style

| Value | Description | Example |
| --- | --- | --- |
| - | Simple output, no typing. | `<span data-ty>Successfuly installed spacy</span>` |
| `input` | Simple prompt with user input and cursor | `<span data-ty="input">pip install spacy</span>` |
| `progress` | Animated progress bar | `<span data-ty="progress"></span>` |

### `data-ty-prompt`: prompt style

The prompt style specifies the characters that are displayed before each line, for example, to indicate command line inputs or interpreters (like `>>>` for Python). By default, Termynal displays a `$` before each user input line.

| Attributes |  Output |
| --- | --- |
| `data-ty="input"` | `$ hello world` |
| `data-ty="input" data-ty-prompt="~"` | `~ hello world` |
| `data-ty="input" data-ty-prompt=">>>"` | `>>> hello world` |
| `data-ty="input" data-ty-prompt=">"` | `> hello world` |
| `data-ty="input" data-ty-prompt="▲"` | `▲ hello world` |
| `data-ty="input" data-ty-prompt="(.env)"` | `(.env) hello world` |
| `data-ty="input" data-ty-prompt="~/user >"` | `~/user > hello world` |

You can also use custom prompts for non-animated output.

To make prompts easy to customise and style, they are defined as `:before` pseudo-elements. Pseudo-elements are not selectable, so the user can copy-paste the commands and won't have to worry about stray `$` or `>>>` characters.

You can change the style by customising the elements in [termynal.css](terminal.css), or add your own rules for specific elements only.

```css
/* Default style of prompts */
[data-ty="input"]:before,
[data-ty-prompt]:before {
    margin-right: 0.75em;
    color: var(--color-text-subtle);
}

/* Make only >>> prompt red */
[data-ty-prompt=">>>"]:before {
    color: red;
}
```

### `data-ty-progressPercent`: set max percent of progress

| Attributes |  Output |
| --- | --- |
| `data-ty="progress"` | `████████████████████████████████████████ 100%` |
| `data-ty="progress" data-ty-progressPercent="81"` | `█████████████████████████████████ 83%` |

### `data-ty-cursor`: display a cursor

Each line set to `data-ty="input"` will be rendered with an animated cursor. Termynal does this by adding a `data-ty-cursor` attribute, and removing it when the line animation has completed (after the delay specified as `lineDelay`). The value of the `data-ty-cursor` sets the cursor style – by default, a small unicode block is used: `▋`. You can set a custom cursor character in the global settings, or overwrite it on a particular line:

```html
<div id="#termynal" data-termynal data-ty-cursor="|">
    <span data-ty="input">Animated with cursor |</span>
    <span data-ty="input" data-ty-cursor="▋">Animated with cursor ▋</span>
</div>
```

You can also change the cursor style and animation in [`termynal.css`](termynal.css):

```css
[data-ty-cursor]:after {
    content: attr(data-ty-cursor);
    font-family: monospace;
    margin-left: 0.5em;
    -webkit-animation: blink 1s infinite;
            animation: blink 1s infinite;
}
```

### Dynamically loading lines

Lines can be dynamically loaded by passing an array of line data objects, using the [attribute suffixes](#data-ty-prompt-prompt-style), as a property of the [settings](#customising-termynal) object.

```javascript
var termynal = new Termynal('#termynal',
    {
        lineData: [
            { type: 'input', value: 'pip install spacy' },
            { value: 'Are you sure you want to install \'spaCy\'?' },
            { type: 'input',  typeDelay: 1000, prompt: '(y/n)', value: 'y' },
            { delay: 1000, value: 'Installing spaCy...' }
        ]
    }
)
```