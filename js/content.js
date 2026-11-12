/*
  YOUR WORK LIVES HERE.
  This is the only file you need to edit to add, remove or reorder projects.
  Everything below is sample content: replace it with your own.

  Tips
  - Keep each project inside { ... } and put a comma after it.
  - Images go in the assets/ folder. Use short lowercase names with no spaces,
    for example assets/design/coffee-brand-1.jpg
  - "ratio" is the shape of the thumbnail in the grid: "4 / 5" (tall), "1 / 1" (square),
    "3 / 2" (wide), "16 / 9" (banner). Match it to your image so nothing gets cropped.
  - The first image of a design project is its cover. Add more images to show a series.
  - Projects appear in the order you list them. Newest first works well.
*/

window.PORTFOLIO = {

  /* ---------- Graphic design (index.html) ---------- */
  design: [
    {
      id: "brand-identity-system",          // unique, lowercase, no spaces: used in the share link
      title: "Brand identity system",
      category: "Branding",                  // becomes a filter button. Keep to 3 or 4 broad groups
      year: 2025,
      client: "Sample client",
      role: "Art direction and design",
      tools: ["Illustrator", "InDesign"],
      summary: "Sample description. Say what the brief was, what you made, and what changed because of it. Two or three sentences is plenty.",
      ratio: "4 / 5",
      images: [
        { src: "assets/design/sample-brand-identity.svg", alt: "Blue brand identity board with a yellow circular mark and colour swatches" },
        { src: "assets/design/sample-logo-collection.svg", alt: "Grid of twelve simple logo marks in six colours" },
        { src: "assets/design/sample-packaging.svg", alt: "Purple product box with a yellow circular label" }
      ]
    },
    {
      id: "poster-series",
      title: "Poster series",
      category: "Print",
      year: 2025,
      client: "Sample client",
      role: "Design",
      tools: ["Photoshop", "Illustrator"],
      summary: "Sample description. A two-image project shows how a series looks in the viewer.",
      ratio: "2 / 3",
      images: [
        { src: "assets/design/sample-poster-series.svg", alt: "Red poster with white bars and a large black circle" },
        { src: "assets/design/sample-event-banner.svg", alt: "Black banner with orange stripes and a large orange circle" }
      ]
    },
    {
      id: "social-media-campaign",
      title: "Social media campaign",
      category: "Digital",
      year: 2024,
      client: "Sample client",
      role: "Design",
      tools: ["Figma", "After Effects"],
      summary: "Sample description. Four square tiles designed to work as a grid on a profile page.",
      ratio: "1 / 1",
      images: [
        { src: "assets/design/sample-social-campaign.svg", alt: "Four square social tiles in green, black, white and yellow with simple shapes" }
      ]
    },
    {
      id: "editorial-spread",
      title: "Editorial spread",
      category: "Print",
      year: 2024,
      client: "Sample client",
      role: "Layout and typography",
      tools: ["InDesign"],
      summary: "Sample description. A magazine spread with a large image, a headline and two columns of text.",
      ratio: "3 / 2",
      images: [
        { src: "assets/design/sample-editorial-layout.svg", alt: "Two-page magazine spread with a blue image block and text columns" }
      ]
    },
    {
      id: "packaging-concept",
      title: "Packaging concept",
      category: "Print",
      year: 2024,
      client: "Personal project",
      role: "Design",
      tools: ["Illustrator", "Blender"],
      summary: "Sample description. A product box concept with a simple circular label.",
      ratio: "1 / 1",
      images: [
        { src: "assets/design/sample-packaging.svg", alt: "Purple product box with a yellow circular label on a pink background" }
      ]
    },
    {
      id: "logo-collection",
      title: "Logo collection",
      category: "Branding",
      year: 2023,
      client: "Various",
      role: "Design",
      tools: ["Illustrator"],
      summary: "Sample description. A selection of marks from different projects.",
      ratio: "4 / 5",
      images: [
        { src: "assets/design/sample-logo-collection.svg", alt: "Grid of twelve simple logo marks in six colours" }
      ]
    },
    {
      id: "event-banner",
      title: "Event banner",
      category: "Print",
      year: 2023,
      client: "Sample client",
      role: "Design",
      tools: ["Photoshop"],
      summary: "Sample description. A wide banner for a live event.",
      ratio: "16 / 9",
      images: [
        { src: "assets/design/sample-event-banner.svg", alt: "Black banner with orange stripes and a large orange circle" }
      ]
    },
    {
      id: "landscape-illustration",
      title: "Landscape illustration",
      category: "Digital",
      year: 2023,
      client: "Personal project",
      role: "Illustration",
      tools: ["Procreate", "Illustrator"],
      summary: "Sample description. Layered hills under a yellow sun.",
      ratio: "3 / 2",
      images: [
        { src: "assets/design/sample-illustration.svg", alt: "Pink sky with a yellow sun above three layers of purple hills" }
      ]
    },
    {
      id: "type-specimen",
      title: "Type specimen",
      category: "Print",
      year: 2022,
      client: "Personal project",
      role: "Design",
      tools: ["Illustrator", "Glyphs"],
      summary: "Sample description. A specimen sheet showing a typeface at large and small sizes.",
      ratio: "2 / 3",
      images: [
        { src: "assets/design/sample-type-specimen.svg", alt: "Specimen sheet with a very large Aa and lines of small text" }
      ]
    }
  ],

  /* ---------- Software development (software.html) ---------- */
  software: [
    {
      id: "team-task-board",
      title: "Team task board",
      kind: "Web app",                       // small label above the screenshot
      year: 2025,
      role: "Full-stack developer",
      summary: "Sample description. Say what the app does, who it is for, and the hardest problem you solved while building it.",
      stack: ["JavaScript", "React", "Node.js", "PostgreSQL"],
      ratio: "16 / 10",
      image: { src: "assets/software/sample-task-board.svg", alt: "Task board with three columns of cards" },
      links: [
        { label: "Live site", url: "#" },    // replace "#" with the real address, or delete the line
        { label: "Source code", url: "#" }
      ]
    },
    {
      id: "analytics-dashboard",
      title: "Analytics dashboard",
      kind: "Web app",
      year: 2025,
      role: "Front-end developer",
      summary: "Sample description. A dashboard with summary tiles and a bar chart built from a live data feed.",
      stack: ["TypeScript", "D3", "Python", "FastAPI"],
      ratio: "16 / 10",
      image: { src: "assets/software/sample-dashboard.svg", alt: "Dashboard with three summary tiles and a bar chart" },
      links: [
        { label: "Live site", url: "#" },
        { label: "Source code", url: "#" }
      ]
    },
    {
      id: "rest-api-service",
      title: "REST API service",
      kind: "Back end",
      year: 2024,
      role: "Back-end developer",
      summary: "Sample description. A documented API with authentication, tests and a Docker setup.",
      stack: ["Node.js", "Express", "Docker"],
      ratio: "16 / 10",
      image: { src: "assets/software/sample-api-terminal.svg", alt: "Terminal window showing colourful code and an API request" },
      links: [
        { label: "Source code", url: "#" }
      ]
    },
    {
      id: "habit-tracker",
      title: "Habit tracker",
      kind: "Mobile app",
      year: 2024,
      role: "Design and development",
      summary: "Sample description. A mobile app I designed and built end to end.",
      stack: ["React Native", "Firebase"],
      ratio: "16 / 10",
      image: { src: "assets/software/sample-mobile-app.svg", alt: "Two phone screens showing lists of habits" },
      links: [
        { label: "Source code", url: "#" }
      ]
    }
  ]
};
