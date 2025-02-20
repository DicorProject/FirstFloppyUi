import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import cors from 'cors';

export function app(): express.Express {
  const server = express();

  // Paths to the server and browser folders
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  const commonEngine = new CommonEngine();

  // Enable CORS (if required)
  server.use(cors());

  // Serve static files before handling SSR rendering
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y', // Cache static files for 1 year
  }));

    // Serve sitemap.xml
    server.get('/sitemap.xml', (req, res) => {
      const sitemapPath = join(browserDistFolder, 'sitemap.xml');
      res.sendFile(sitemapPath, (err) => {
        if (err) {
          console.error('Error serving sitemap.xml:', err);
          res.status(404).send('Sitemap not found');
        }
      });
    });

  // Example API endpoint
  server.get('/api/test', (req, res) => {
    res.json({ load: true });
  });

  // Redirection logic
  server.get('*', (req, res, next) => {
    const redirects = [
      { old: '/Laptop', new: '/itrental' },
      { old: '/desktop', new: '/itrental' },
      { old: '/server', new: '/itrental' },
      { old: '/printer', new: '/itrental' },
      { old: '/networking', new: '/itrental' },
      { old: '/other', new: '/cctv' },
      { old: '/LaptopPCRepair', new: '/itrental' },
      { old: '/projector', new: '/itrental' },
      { old: '/HomeAppliance', new: '/washingmachinerepair' },
      { old: '/kitchenappliance', new: '/refrigeratorrepair' },
      { old: '/aconrent', new: '/acrepairandservice' },
      { old: '/acrepairservice', new: '/acrepairandservice' },
      { old: '/SofaCleaning', new: '/cleaningservice' },
      // { old: '/pestcontrol', new: '/pestcontrol' },
      { old: '/homecleaning', new: '/cleaningservice' },
      { old: '/watertankcleaner', new: '/cleaningservice' },
      { old: '/officechaircleaningservices', new: '/cleaningservice' },
      { old: '/bathroomcleaning', new: '/cleaningservice' },
      { old: '/Bed', new: '/' }
    ];

    const redirect = redirects.find(r => req.url.includes(r.old));
    if (redirect) {
      res.redirect(302, redirect.new); // Use temporary redirects to prevent caching issues
      return;
    }

    next(); // Proceed to SSR rendering
  });

  // Fallback for Angular routes with SSR
  server.get('*', (req, res) => {
    const protocol = req.protocol;
    const { originalUrl, baseUrl } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${req.get('host')}${originalUrl}`,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => {
        console.error('Error rendering Angular app:', err);
        res.status(500).send('An error occurred while rendering the page.');
      });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
