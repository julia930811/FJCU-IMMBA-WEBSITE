# Fu Jen imMBA website

A redesigned official website for the MBA Program in International Management (imMBA), College of Management, Fu Jen Catholic University.

The information architecture matches the current site:

- Home with news and gallery
- About, admissions, curriculum, faculty
- Student guide, graduation, dual degrees, exchange
- News list and detail, photo gallery, contact form, search
- Chinese / English

The visual system is quieter: navy, cream, and gold; bilingual typography; fewer side widgets.

## Run locally

```bash
cd ~/Projects/fjcu-immba-website
python3 -m http.server 8765
```

Open http://127.0.0.1:8765/

## Notes

- Contact form opens the visitor’s email client to `imMBA@mail.fju.edu.tw` (no server backend).
- Gallery images are placeholders and should be replaced with official photos.
- Application forms, thesis templates, and timetables still link to the current college site where files are hosted.
