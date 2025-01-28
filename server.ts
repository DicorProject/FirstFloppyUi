import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1d', // Cache static files for 1 day
  }));

  server.get('*', (req, res, next) => {
    // Handle redirection
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
      { old: '/pestcontrol', new: '/pestcontrol' },
      { old: '/homecleaning', new: '/cleaningservice' },
      { old: '/watertankcleaner', new: '/cleaningservice' },
      { old: '/officechaircleaningservices', new: '/cleaningservice' },
      { old: '/bathroomcleaning', new: '/cleaningservice' },
      { old: '/Bed', new: '/' }
    ];
  
    // Match the URL with the redirection rules
    const redirect = redirects.find(r => req.url.includes(r.old));
    if (redirect) {
      res.redirect(301, redirect.new);
      return;
    }
  
    // Continue to the Universal engine for rendering
    next();
  });
  

  // All API routes (Example: Adjust if you have specific APIs)
  server.get('/api/**', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found.' });
  });

  // Handle Angular Routes
  server.get('*', (req, res) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
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

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
