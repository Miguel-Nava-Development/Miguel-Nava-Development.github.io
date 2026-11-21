# Portfolio website

A hand-built site with no framework, no build step and no page builder. It is plain HTML, CSS and JavaScript, so it runs anywhere and you can read every line.

```
index.html        Home page: three big choices, Marketing, Software and Mining
marketing.html    Marketing: a three-choice page that leads to Experience, Skills and Diplomas & Certificates
experience.html   Marketing > Experience: the companies you did the work at, each linking to its page
skills.html       Marketing > Skills: what you do, plus the apps you use (with logos)
diplomas.html     Marketing > Diplomas & Certificates: your degree, high school diploma with IB Diploma, and course certificates
tim-mcdowell.html Tim McDowell Equipment Ltd.: social media posts, plus flyers and ads you can flip through
kes.html          KES Equipment: social media posts
gold-leaf.html    Gold Leaf Financial Group: photos of you at work
valnet.html       Valnet (GameRant): videos you edited, with the tools and templates you used
software.html     Software projects
mining.html       Mining: confined space rescue at NATT Safety (Vale shutdown) and heavy equipment work at Tim McDowell
about.html        About, skills, experience
contact.html      Contact form (your email address is never shown on the site)
404.html          Shown when someone opens a link that does not exist
css/styles.css    All the styling
js/content.js     YOUR WORK: the only file you edit to add projects
js/site.js        Behaviour (viewer, flip-through reader, layout). You should not need to touch it
assets/           Your images: tme/ (Tim McDowell work), kes/ (KES work), gold-leaf/ (Gold Leaf photos), logos/ (app and programming-language logos), diplomas/ (the degree picture and PDF, and the transcripts PDF) and about/
favicon.svg       The small icon in the browser tab
```

## See it on your computer

Double-click `index.html`. It opens in your browser, no server needed.

For a nicer workflow, open the folder in VS Code, install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**. The page reloads each time you save.

## Make it yours

### 1. Replace the sample details (and switch on the contact form, see below)
Search the whole folder (in VS Code: Ctrl+Shift+F) and replace:

| Find | Replace with |
| --- | --- |
| `Miguel Nava` | Your name, exactly as you want it shown (check this one is right) |
| `Open to full-time or project-based roles` | Your availability, or delete the line |
| (optional) another profile link, for example Behance | Add `<li><a href="https://...">Behance</a></li>` to the footer list on every page and to the Contact list in `about.html`. GitHub and LinkedIn are already set, and there is no Behance link for now. |

### 2. The Marketing pages (Marketing, Experience, Skills)
Marketing has two sub tabs. They show as a drop-down under "Marketing" in the menu (on computers) and as a small tab strip on the Marketing pages (everywhere, including phones).

- `marketing.html` is a plain two-choice page: Experience and Skills.
- `skills.html` has two parts you can edit in any text editor:
  - **What I do**: six short highlights (`<li class="skill">`). Change the wording or add one by copying a block.
  - **The apps I work in**: a paragraph, then a tile for each app (`<li class="tool">`). The logos are in `assets/logos/`. To add an app, drop its logo in that folder (an SVG is best) and copy a tile. To remove one, delete its tile.
- `experience.html` has one block per company. Companies with work to show link to their own page (see below). A company without a page yet can use the plain block described in the comment above the list.

To add a job, open `experience.html`: copy one `<li>` inside `<ul class="companies">`, change the name, role, dates and text, and point the link at the new page. The comment above the list repeats these steps. The home page and the Marketing page do not list individual jobs, so you do not need to change them.

The app logos are the latest versions of each brand's icon, in the brand's colours. Brand logos belong to their owners and are used here only to show which apps you work in. The Final Cut Pro icon is a small 75 px image; if it looks soft on your screen, swap in a larger copy from Apple's own site, named `final-cut-pro.png`.

**Valnet (GameRant)** (`valnet.html`, a company under Experience like Tim McDowell, KES and Gold Leaf). Its block on `experience.html` is plain HTML (copy it to add another company). The page itself is plain HTML for the heading, the text and the small tool tiles (`assets/logos/`, one line each); the videos come from the `valnetVideos` list in `js/content.js`: one line each with a `title` and an optional `link`. Paste a full `https://` address into `link` (for example the GameRant article the video plays in) and the title becomes a link that opens in a new tab, with "Watch on GameRant" under it. A line with an empty `link` shows as plain text. To add a video, copy a line. Raise the `?v=` number on every page afterwards (see the cache note above).

**Diplomas & Certificates** (`diplomas.html`, the third tab under Marketing). It is plain HTML, with no list in `js/content.js` to edit. The two diplomas are text blocks (copy one `<li>` to add another). Under them, the certificates sit in three groups: Technology, Marketing and Other. To add a certificate, copy one `<li class="cert">` into the right group and change the title, issuer and year. If the issuer has a public verification page, copy the `<p class="cert-action">` line from one of the Coursera tiles under the issuer line and paste in the link: it shows a button that says "Click to verify". Without a link, leave the button out. Certificates show the year only.

The university degree is shown on the page as a picture (`assets/diplomas/university-degree.jpg`, about 1600 px wide) with a small "Open the degree as a PDF" link under it to `assets/diplomas/university-degree.pdf`. Both were rebuilt from the scan, so the scanner app's name and watermark are gone. To show another diploma the same way (the high school diploma, once you have it), copy the `<div class="diploma-row">` block (text on the left, the picture on the right; on a phone they stack), put the picture in `assets/diplomas/` and change the file names and the description. The "View my transcripts" button opens `assets/diplomas/high-school-transcripts.pdf`: the EARJ transcript followed by the IB diploma and its results. The site's code is public on GitHub, so the EARJ transcript was changed before it went up: the home address and student number are covered by black boxes, the page is an image only (no text layer) and the original file's hidden details were removed. Keep the original, unredacted transcript on your own computer and never upload it here. The same goes for the Ontario safety certificate's HTML file, which has your email address inside its web address: use the picture of the certificate only.


### 3. Add marketing work (Tim McDowell Equipment Ltd.)
The page `tim-mcdowell.html` has three sections, and all three are filled from `js/content.js`.

**Social media posts and videos** (`tmeSocial`)
1. Put the image in `assets/tme/social/`, named by date and title, for example `2026-08-14-cat-950-wheel-loader-rented.jpg`. Keep the original in your own folder named the same way, with the date first (`2026-08-14 CAT 950 Wheel Loader Rented.jpg`), so the files sort in the order they were posted.
2. In `js/content.js`, copy one line inside `tmeSocial` and change: `id`, `title` (the main headline on the graphic), `year` (the short date on the card, such as `"Aug 14, 2026"`), `date` (`"2026-08-14"`), `ratio` (the image's width / height in pixels), `purpose`, `link` and the image path.
3. `purpose` finishes the sentence the viewer shows: "I posted this on August 14, 2026 with the purpose of ..." so write it as, for example, `"announcing that a CAT 950 wheel loader had been rented"`.
4. For a video, add `video: "assets/tme/social/2026-08-14-title.mp4"`. The first image is its poster. Compress videos to about 640 px wide first (a few MB each) so the page stays quick.
5. Newest first. The page shows the first 18 and a "Show all" button reveals the rest, so a long list stays quick to load.

**Flyers, banners and ads** (`tmeBooklets`)
1. Export each page of the PDF as a JPG, about 1500 px tall (for example with `pdftoppm`, or "Export as JPG" in InDesign or Acrobat), and put them in a new folder such as `assets/tme/flyer-name/`, named `01.jpg`, `02.jpg` and so on. Also make a small cover image, `cover.jpg`, about 640 px wide.
2. In `js/content.js`, copy one block inside `tmeBooklets`, then change the details and list every page under `pages` with its width and height in pixels.
3. A flyer with three or more pages of the same shape opens as a flip book on a computer and one page at a time on a phone. Add `mode: "single"` to always show one page at a time (good for ads with different page shapes, or a tall banner).
4. A direct link to one flyer looks like `tim-mcdowell.html#booklet=cim-flyer-2026`.

**YouTube Posted Videos** (`youtube`)
1. Each video is one line in the `youtube` list in `js/content.js`: the `id` (the part after `v=` in the video's address), `title`, `published` date and the `views` you saw. Newest first.
2. The page shows each title as a link that opens the video on YouTube, with the view count below it. The saved `views` are what shows until live counts are switched on, and the page says "View counts as of ..." using `youtubeViewsAsOf` (change that date whenever you update the numbers by hand).
3. To make the counts update by themselves, add a free YouTube Data API key. In the Google Cloud Console: create a project, turn on "YouTube Data API v3", then Credentials > Create credentials > API key. Restrict the key to the website address `https://miguel-nava-development.github.io/*` (HTTP referrers) and to the YouTube Data API v3 only, then paste it between the quotes in `youtubeApiKey`. The key is visible in the page's code, which is why that restriction matters. Raise the `?v=` number on every page afterwards (see the cache note above).
4. With a key, the counts load fresh each time the page opens and the note changes to "View counts update automatically from YouTube." If YouTube does not answer, the saved counts show instead.

Keep the large original files (the `Companies` folder, `TME Work`, and anything ending in `.pdf`, `.indd` or `.ai`) out of the website folder you upload. They are too big for the site and only the exported images are needed.

**KES Equipment** (`kes.html`) works the same way as the social media posts above, with its own list, `kesSocial`, and images in `assets/kes/social/`. It has no flyers section.

**Gold Leaf Financial Group** (`gold-leaf.html`) shows photos of you at work, from the list `goldLeaf` in `js/content.js`, with files in `assets/gold-leaf/`. Each item needs an id, title, category ("Photos"), ratio, a one-sentence summary and its images. There are no dates or links. Remove metadata from phone photos before you add them (the copies here were resized and saved without it).

To add another company, copy `kes.html` (social posts only) or `tim-mcdowell.html` (posts plus flyers) to a new name, add its own lists in `js/content.js`, and add its block to the list in `experience.html` (step 2 above). A block only needs role and dates if you want them shown. The copy keeps the "Back to Experience" link and the Experience / Skills tab strip under the menu.

### 4. Add software projects
Each project is one block in the `software` list in `js/content.js`: a title, a short `summary` and a `stack` list of the tools used (for example `["Python", "Qt"]`). The page shows the title, then a logo tile for each tool in the stack, then the summary. To add a project, copy a block. `links` is optional (for example `{ label: "Source code", url: "https://..." }`).
Each tool name is matched to its logo in the `logos` list just above `software`. To use a tool that is not there yet, put its logo in `assets/logos/` and add one line to `logos`. A name with no logo still shows, as a plain tile.
The logos come from Simple Icons (CC0) and the Material Design Icons set (PowerShell, the Microsoft Office, SharePoint and Active Directory tiles, and the server, network and camera icons), recoloured to each brand.
**IT experience** (the second section of `software.html`) is plain HTML, not part of `js/content.js`. Each job is one block: company, role and year, a row of small logo tiles, then the text. To add a job, copy a block. A tile is one line (`<li class="stack-item"><img src="assets/logos/cisco.svg" alt="" width="44" height="44"><span>Cisco</span></li>`); put a new logo in `assets/logos/` first.

### 5. The Mining page
`mining.html` is plain HTML, like `experience.html`. It has two blocks: NATT Safety (confined space rescuer, with the certificates as white tiles) and Tim McDowell Equipment (three equipment photos, text, and a button to `tim-mcdowell.html`). To change the wording or add a certificate, edit the text or copy a `<li>` in the `certs` list. To add a video or photos of the shutdown, put them in `assets/` (short lowercase names) and ask for them to be added under the NATT Safety text. Remove metadata from phone photos first. The text comes from the résumé; the NATT Safety date is shown as just 2024 at your request.

### 6. Edit the About page
`about.html` is plain HTML. Replace the instruction text with your own. To add a résumé, put `resume.pdf` in `assets/`, then remove the comment markers around the "Download résumé" link near the bottom of the file.

### 7. Delete the samples
The About page text and the About photo are still samples. The sample image says "Sample image" in its corner; once your own photo is in, delete `assets/about/sample-portrait.svg`. The old `assets/design/` samples are no longer used and can be deleted.

## Add another tab (photography, video, illustration...)
1. Copy `tim-mcdowell.html` to a new name, for example `photography.html`.
2. In the copy, change `data-collection="tmeSocial"` to `data-collection="photography"`, update the `<title>` and headline, and delete the section you do not need.
3. In `js/content.js`, add a `photography: [ ... ]` list that follows the same format as `tmeSocial`.
4. Add `<li><a href="photography.html">Photography</a></li>` to the menu in every page. The menu on every page also lists Marketing (with its drop-down for Experience and Skills), Software, Mining, About and Contact; if you copy a page, copy the whole menu block.

## Switch on the contact form
The Contact page has a form (name, email, reason for reaching out). Visitors never see your email address: their message goes to a free form service called Web3Forms, which forwards it to your inbox.

1. Go to web3forms.com and enter the email address that should receive messages. They email you an **access key**.
2. Open `contact.html` and replace `YOUR_ACCESS_KEY_HERE` with that key. The key is safe to publish. It only lets people send messages to you, and it does not reveal your email.
3. Upload the changed file to GitHub, wait a minute, open the Contact page and send yourself a test message.

The free plan allows about 250 messages a month. If you ever get too many spam messages, Web3Forms has a free captcha you can turn on in their dashboard. Check their site for current limits.

## Fonts
The site uses **Archivo** from Google Fonts. If someone is offline, their device falls back to a similar system font and everything still works. To host the font yourself instead, download it from fonts.google.com, put the files in a `fonts/` folder, and replace the Google Fonts `<link>` in each page with an `@font-face` rule.

## Put it online for free

Two good free hosts for a site like this. Both give you HTTPS and a free web address.

### Option A: GitHub Pages (simplest)
1. Create a free account at github.com and make a new **public** repository. Name it `your-username.github.io` to get the address `https://your-username.github.io`.
2. Upload everything in this folder to the repository root, or use Git: `git init`, `git add .`, `git commit -m "First version"`, then push to GitHub.
3. In the repository go to **Settings, then Pages**. Under **Build and deployment** choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. After a minute or two the site is live. Each time you push a change, it updates.

The `.nojekyll` file in this folder tells GitHub to serve the files exactly as they are.

**If a change does not show up right away:** browsers keep a copy of the stylesheet and scripts for about 10 minutes, so for a short while a page can look half updated. Every page links them with a version number (`css/styles.css?v=20261120m`, and the same on `js/content.js` and `js/site.js`). When you change `styles.css` or a script, change that number on all the pages (for example to `20261201a`) and the new version loads at once. A hard refresh (Ctrl+F5) also fixes it on your own computer.

### Option B: Cloudflare Pages
Create a free Cloudflare account, then in **Workers & Pages** create a Pages project and either connect your GitHub repository or upload this folder directly. Cloudflare's static hosting is free with generous limits. Cloudflare has been merging Pages into Workers, so the menu names may differ a little from this README; their docs at developers.cloudflare.com show the current steps.

GitHub Pages' terms do not allow running a business on it. A job-search portfolio is fine. If you later sell services from the site, use Cloudflare Pages or another host.

## Use your own domain
A name like `miguelnava.com` looks more professional on a résumé than a `github.io` address, and it keeps working if you ever change hosts. A `.com` costs about $10 to $11 a year at registrars such as Cloudflare Registrar, Porkbun and Spaceship. Check the **renewal** price before you buy, because some registrars charge less in year one. Turn on free WHOIS privacy and two-factor sign-in.

**With GitHub Pages**
1. Buy the domain.
2. In the repository go to **Settings, then Pages, then Custom domain**, enter your domain, and save.
3. At your registrar's DNS settings, add the records GitHub lists in its docs (search "GitHub Pages custom domain"). For a bare domain these are four `A` records, and for `www` a `CNAME` pointing to `your-username.github.io`.
4. When GitHub shows the domain as verified, tick **Enforce HTTPS**. DNS changes can take from a few minutes to a day.

**With Cloudflare Pages:** add the domain in the project's **Custom domains** tab. It is simplest if you bought the domain from Cloudflare too, because DNS is already there.

Note: `404.html` uses links that start with `/`, which works at the root of a domain (your own domain or `your-username.github.io`). If you host in a sub-folder, remove the leading `/` from its links.

## Keep the site link-only (hidden from search engines)
Every page has `<meta name="robots" content="noindex, nofollow">` in its `<head>`. Google, Bing and other well-behaved search engines will not list the site, so people only find it if you give them the link. This is not a password: anyone who has or guesses the address can open it, and the repository on GitHub is public. To make the site searchable later, delete that one line from each `.html` file and push. Do not also add a `Disallow` rule in a `robots.txt`: search engines that cannot read the pages will not see the `noindex` instruction.

## Before you share the link
- [ ] Name, location and social links replaced
- [ ] Sample images and sample projects removed
- [ ] Every image has a useful `alt`
- [ ] About page filled in, and résumé link switched on if you have one
- [ ] Opened on your phone and checked each tab
- [ ] Contact form switched on, and a test message sent to yourself arrived in your inbox
