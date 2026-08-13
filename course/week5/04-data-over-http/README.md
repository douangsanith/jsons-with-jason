# Week 5 · Day 4 — Data over HTTP: JSON, `fetch`, and shipping it

*Every version of this app so far has carried its data inside it. Today it asks for it — and the tool stops being
a demo.*

**You'll ship:** the finished Matter Intelligence app, fetching its matters over **HTTP** with proper loading and
error states — and a **production build** you could actually deploy.

> 👉 **Run it, then build it:**
> ```bash
> cd course/week5/matter-app
> npm run dev       # http://localhost:5173 — open DevTools → Network and watch the request
> npm run build     # type-check + bundle into dist/
> npm run preview   # serve dist/ — the production version, fetching the same way
> ```
> All of it is local. **Turn your Wi-Fi off and it still works** — that's worth doing once, to prove the request
> is genuinely a request and not a trick.

> 📝 **Reading copy:** [`App.annotated.tsx`](App.annotated.tsx) — the finished component, commented line by
> line, including every trap in `useEffect` and `fetch`.

---

## 🎯 Objectives
- Read **JSON** and explain how it relates to a JavaScript object.
- Describe the **request/response** model: URL, method, status code, body.
- Fetch data in React with **`useEffect`** + **`fetch`**, and explain the **dependency array**.
- Handle the three states every real UI has: **loading**, **error**, **data**.
- Drain a **paginated** API with a `while` loop, and know why `map` can't do it.
- Produce a **production build** and serve it.

## ⚖️ Why it matters
This is the hinge of the whole course. Your team can now build a UI (Weeks 3–5) and will soon query a warehouse
(Weeks 6–7). **JSON over HTTP is how those two halves talk** — and it's the same contract a FastAPI backend and
the Claude API both speak. Learn it once here, and the Snowflake matters table plugs into this exact component
with a changed URL.

---

## 1 · JSON — the lingua franca

**JSON** (JavaScript Object Notation) is data as *text*, so it can travel. Open
[`../matter-app/public/matters.json`](../matter-app/public/matters.json):

```json
[
  { "id": "M-1002", "client": "Brightline LLC", "billed": 42750.5, "active": true }
]
```

It looks like a JavaScript array of objects because that's what it was modelled on. The differences are small and
strict:

| JSON | JavaScript |
|---|---|
| keys **must** be in double quotes | quotes optional |
| double quotes only | `'` or `"` |
| no trailing commas | tolerated |
| no comments, no functions | allowed |

Types carry across: `42750.5` is a number, `true` is a boolean, `"M-1002"` is a string. Python speaks it too —
`json.dumps(dict)` produces exactly this, which is how a pandas DataFrame in Week 2 and this component will
eventually meet.

> **Legal analogy:** JSON is the **filed PDF**. The matter lives in your system in its own form; JSON is the
> agreed, portable version everyone can open.

## 2 · Request and response

Every fetch is one round trip:

```
GET /matters.json                 →   200 OK
                                      Content-Type: application/json
                                  ←   [ { "id": "M-1002", ... } ]
```

- **Method** — `GET` reads, `POST` sends something new. (There are others; those two cover most of it.)
- **URL** — what you're asking for.
- **Status code** — the answer's headline: **2xx** worked, **4xx** you asked wrong (`404` not found, `401` not
  authorised), **5xx** the server broke.
- **Headers** — metadata, such as `Content-Type: application/json`.
- **Body** — the JSON itself.

That contract is identical whether the other end is a static file, a FastAPI endpoint, or the Claude API. It's
why swapping one for another is a URL change.

## 3 · `useEffect` — reaching outside the component

Rendering must be **pure**: a component works out its markup and does nothing else. Fetching is a **side effect**,
so it goes in `useEffect`, which React runs *after* the render is on screen:

```tsx
useEffect(() => {
  async function load() { … }
  load();
}, []);
```

**The `[]` at the end is the most important bracket pair in React.** It's the *dependency array*:

| You write | React runs the effect |
|---|---|
| `}, []);` | **once**, after the first render |
| `}, [search]);` | after the first render, and whenever `search` changes |
| `});` — no array | after **every** render |

Get that last one by accident with a fetch inside, and you have an infinite loop: fetch → set state → re-render →
fetch. If your Network tab fills up with identical requests, this is why.

> **Common pitfalls ⚠️** — the effect callback itself can't be `async`, because React expects it to return either
> nothing or a *cleanup function*, not a promise. Declare an `async function` inside and call it — that's the
> standard shape you'll see everywhere.

## 4 · `fetch`, and the check everyone forgets

```tsx
const response = await fetch("/matters.json");
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data: Matter[] = await response.json();
```

Two awaits, on purpose: the first resolves when the **headers** arrive, the second when the **body** has been
read and parsed.

And the line in the middle is the one that matters: **`fetch` does not throw on `404` or `500`.** It only rejects
when the request couldn't be made at all. A 404 returns a perfectly successful promise carrying a failure — so
without `if (!response.ok)`, your app cheerfully tries to `.json()` an error page and dies somewhere confusing.

## 5 · Three states, always

Real data has three outcomes, and a real UI shows all three:

```tsx
const [matters, setMatters] = useState<Matter[]>([]);   // the data
const [loading, setLoading] = useState(true);           // still waiting
const [error, setError] = useState<string | null>(null); // it went wrong
```

Then Day 2's conditional rendering does the work:

```tsx
{loading ? "Loading…" : `${shown.length} of ${matters.length} matters`}
{error && <p className="error">Could not load matters: {error}</p>}
{!loading && !error && shown.length === 0 && <p className="empty">No matters match…</p>}
```

Two details worth copying. Start `matters` as `[]`, not `null` — then the `.filter` chain is safe on the very
first render with no special case. And put `setLoading(false)` in a **`finally`**, so the spinner stops whether
the request succeeded or failed.

> **Go Deeper 🔧** — the `return () => { cancelled = true; }` at the end of the effect is a **cleanup function**.
> React runs it if the component disappears before the response arrives, so the handlers know not to set state on
> something that's gone. Harmless here; essential in an app where views come and go.

## 6 · When one request isn't enough — `while` and pagination

One `fetch`, one array. For a file that's the whole truth, and `matter-app` never does more. Real APIs are
different: ask for 5,000 matters and you get the first 50 plus a note saying where the rest are. That's
**pagination**, and it's where [Week 4's `while` loop](../../week4/02-arrays-and-objects/README.md) finally earns
its keep.

You cannot write this with `map`. `map` has to know how many times it's running before it starts — and here the
only way to find out whether there's another page is to read the response to the last one.

```ts
async function loadAllMatters(): Promise<Matter[]> {
  const all: Matter[] = [];
  let url: string | null = "/api/matters?page=1";

  while (url) {                                   // ← "keep going while there's a next page"
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const page = await response.json();
    all.push(...page.results);                    // spread this page into the running list
    url = page.next;                              // the server hands back the next URL — or null
  }

  return all;
}
```

Read the loop, not the URLs. **The condition is `url` itself.** While the server keeps returning a `next`, round
you go again; the moment it returns `null`, `while (null)` is false and you drop out holding everything. That is
the entire pattern, it's the same shape in Python (`while url:`), and it's how Jira's API, Snowflake's REST API
and the Claude API's own list endpoints all work.

It then drops into the effect unchanged:

```tsx
const data = await loadAllMatters();
if (!cancelled) setMatters(data);
```

`useEffect` never knows the difference — the `await` covers all three round trips, so it's still one spinner and
one `setLoading(false)` in the `finally`. **This is the shape to recognise the first time you point that `fetch`
at a real endpoint**, and the first thing to check for when an API mysteriously returns exactly 50 rows.

> **Common pitfalls ⚠️** — **always give a paginated loop a ceiling.** If the server has a bug and page 3's `next`
> points back at page 2, `while (url)` fetches forever:
> ```ts
> let pages = 0;
> while (url && pages < 50) { …; pages++; }
> ```
> Same discipline as Week 4's infinite loop, except the runaway is now making network requests. If your Network
> tab is scrolling and won't stop, it's either this or a missing dependency array.

> **Go Deeper 🔧** — that `while` is **sequential by necessity**: you can't request page 2 until page 1 admits it
> exists. But some APIs tell you the total up front (`{ count: 340, pageSize: 50 }`) — then you can work out every
> page number without asking, and it becomes `Promise.all` over a `map`, firing all seven requests at once instead
> of waiting for each in turn. **Sequential when each step depends on the last; parallel when they don't.**

## 7 · Why this works offline

`matters.json` lives in **`public/`**, and Vite serves that folder at the site root — in `npm run dev` *and* in
the `dist/` you deploy. So `fetch("/matters.json")` is a real HTTP request to a real local server, with no
internet involved. Same mechanics as a remote API; nothing to sign up for.

Then ship it:

```bash
npm run build     # tsc type-checks, Vite bundles → dist/
npm run preview   # serve dist/ exactly as a real host would
```

`dist/` is a handful of files you could drop on Netlify, S3, or an internal server. **You have taken a Claude
artifact all the way to a deployable application.**

> **🔗 Your world & where this goes next.** `/matters.json` is a stand-in. Point that same `fetch` at a **FastAPI**
> endpoint and the component doesn't change. Have that endpoint run a `SELECT` against the **Snowflake** matters
> table — Weeks 6–7 — and *Matter Intelligence* is wired end to end: warehouse → API → the UI you just built.

---

## ✍️ Your turn — edit `App.tsx`
1. Open DevTools → **Network**, reload, and find the `matters.json` request. Note its status, `Content-Type`,
   and the response body.
2. Break the URL: `fetch("/matters-typo.json")`. Confirm the red error banner appears with `HTTP 404` — and that
   the app doesn't crash.
3. Now delete the `if (!response.ok)` line and reload with the broken URL still in place. Watch a much more
   confusing failure. Put both back.
4. Add an artificial delay so you can actually see the loading state:
   `await new Promise((r) => setTimeout(r, 1500));` just before the `fetch`.
5. Add a **Refresh** button that re-runs the load. (Hint: lift `load` out of the effect, or add a `reloadCount`
   state to the dependency array.)
6. Run `npm run build && npm run preview` and confirm the production build fetches too.
7. In the browser console, paste the fake paginated server below and drain it with a `while` loop, logging each
   page as it arrives. No network needed — it's the same loop shape against a local function.
8. **Add the `pages < 50` ceiling first**, then break the server: make `next` always return the same page. Confirm
   the loop stops at 50 instead of hanging the tab. (Do these in that order.)

<details><summary>✅ What it should look like</summary>

```tsx
// 5 — the dependency-array approach
const [reloadCount, setReloadCount] = useState(0);

useEffect(() => {
  let cancelled = false;
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/matters.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: Matter[] = await response.json();
      if (!cancelled) setMatters(data);
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (!cancelled) setLoading(false);
    }
  }
  load();
  return () => { cancelled = true; };
}, [reloadCount]);            // ← changing this re-runs the effect

<button onClick={() => setReloadCount((n) => n + 1)}>Refresh</button>
```
```js
// 7 — a fake paginated server, 2 rows per page, no network involved
const ALL = ["M-1001", "M-1002", "M-1003", "M-1004", "M-1005"];
function getPage(page) {
  const start = (page - 1) * 2;
  const results = ALL.slice(start, start + 2);
  return { results, next: start + 2 < ALL.length ? page + 1 : null };
}

const all = [];
let next = 1;
let pages = 0;
while (next && pages < 50) {          // ← the ceiling from §6
  const page = getPage(next);
  all.push(...page.results);
  console.log(`page ${next}:`, page.results, `— running total ${all.length}`);
  next = page.next;
  pages++;
}
console.log(all);                     // all 5, in order, after 3 rounds
```
In (3) you'll see something like `Unexpected token '<' … is not valid JSON` — the server returned an HTML error
page and `.json()` choked on it. That confusing message is exactly what the `response.ok` check prevents.

In (8), `next: page` instead of `page + 1` means the condition never goes false. With the ceiling in place you get
50 identical pages and a prompt back; without it, that tab is gone. That's the whole argument for the ceiling.
</details>

## 📝 Recap
- **JSON** is data as text: double-quoted keys, no trailing commas, no comments. Every language speaks it.
- A request has a **method, URL, status code, headers and body** — the same contract for a file, an API, or Claude.
- **`useEffect`** holds side effects; the **dependency array** decides how often it runs, and `[]` means once.
- **`fetch` doesn't throw on 404** — check `response.ok` yourself.
- Model **loading / error / data**; start arrays as `[]`, and stop the spinner in `finally`.
- **Paginated APIs need a `while` loop** — `map` can't, because the page count isn't known up front. Give it a
  ceiling so a bad `next` can't loop forever.
- **`npm run build`** produces a deployable `dist/`; `npm run preview` serves it.

## 🧠 Check yourself
1. What happens if you leave the dependency array off an effect that fetches? *(it runs after every render →
   fetch → set state → render → fetch: an infinite loop)*
2. Why check `response.ok` when `await fetch(...)` already succeeded? *(fetch only rejects if the request couldn't
   be made; a 404 is a successful promise carrying a failure)*
3. Why start `matters` as `[]` rather than `null`? *(the `.filter` chain runs on the first render, before any
   data — `[]` is safe, `null` crashes)*
4. Why can't you replace the pagination `while` with a `map`? *(`map` needs the number of items before it starts;
   here you only learn there's a next page by reading the previous response)*
5. What stops a paginated loop when the server's `next` is broken? *(nothing, unless you add a page ceiling —
   `while (url && pages < 50)`)*

## ➡️ Next — [Week 6: SQL, run the Snowflake way](../../week6/)
You've built the front half of *Matter Intelligence*: a real, typed, deployable UI that reads its data over HTTP.
Now for the other end of that request — **where the data actually lives.** Week 6 starts SQL, and the notebooks
return.

## 📖 Reference
- MDN — Using the Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- MDN — HTTP response status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- React — Synchronizing with effects: https://react.dev/learn/synchronizing-with-effects
- React — You might not need an effect: https://react.dev/learn/you-might-not-need-an-effect
