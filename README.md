# Portfolio website

A hand-built site with no framework, no build step and no page builder. It is plain HTML, CSS and JavaScript, so it runs anywhere and you can read every line.

```
index.html        Graphic design (the home page)
software.html     Software projects
about.html        About, skills, experience, contact
404.html          Shown when someone opens a link that does not exist
css/styles.css    All the styling
js/content.js     YOUR WORK: the only file you edit to add projects
js/site.js        Behaviour (filters, viewer, layout). You should not need to touch it
assets/           Your images, in design/, software/ and about/
favicon.svg       The small icon in the browser tab
```

## See it on your computer

Double-click `index.html`. It opens in your browser, no server needed.

For a nicer workflow, open the folder in VS Code, install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**. The page reloads each time you save.

## Make it yours

### 1. Replace the sample details
Search the whole folder (in VS Code: Ctrl+Shift+F) and replace:

| Find | Replace with |
| --- | --- |
| `Miguel Nava` | Your name, exactly as you want it shown (check this one is right) |
| `you@example.com` | Your real email |
| `Open to full-time roles` | Your availability, or delete the line |
| `href="#"` on GitHub, LinkedIn, Behance | Your profile links (in `index.html`, `software.html`, `about.html`) |

### 2. Add graphic design work
1. Put your images in `assets/design/`. Use short lowercase names with no spaces, such as `coffee-brand-1.jpg`.
2. Open `js/content.js` and copy one block inside the `design` list. Change the details and image paths.
3. Set `ratio` to match your cover image: `"4 / 5"` tall, `"1 / 1"` square, `"3 / 2"` wide, `"16 / 9"` banner.
4. Save and refresh.

Each `category` you use becomes a filter button automatically. Add more images to `images` to show a series. People can click any project to open it large, move between projects with the arrow keys, and you can send someone a direct link to one piece, for example `yoursite.com/#project=poster-series`.

Image tips: export JPG or WebP at about 1600 px on the long side, aim for under 400 KB each, and write a short `alt` that describes what is in the picture.

### 3. Add software projects
Same idea: copy a block inside the `software` list in `js/content.js`. Put a screenshot in `assets/software/`. Replace the `"#"` in `links` with the real address, or delete a link you do not have.

### 4. Edit the About page
`about.html` is plain HTML. Replace the instruction text with your own. To add a résumé, put `resume.pdf` in `assets/`, then remove the comment markers around the "Download résumé" link near the bottom of the file.

### 5. Delete the samples
Every sample image says "Sample image" in its corner. Once your own work is in, delete the `sample-*.svg` files and the sample entries in `js/content.js`.

## Add another tab (photography, video, illustration...)
1. Copy `index.html` to a new name, for example `photography.html`.
2. In the copy, change `data-collection="design"` to `data-collection="photography"`, update the `<title>`, and replace the headline with plain text.
3. In `js/content.js`, add a `photography: [ ... ]` list that follows the same format as `design`.
4. Add `<li><a href="photography.html">Photography</a></li>` to the menu in every page.

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

## Before you share the link
- [ ] Name, email, location and social links replaced
- [ ] Sample images and sample projects removed
- [ ] Every image has a useful `alt`
- [ ] About page filled in, and résumé link switched on if you have one
- [ ] Opened on your phone and checked each tab
- [ ] Tested the email link (it should open a new message to you)
