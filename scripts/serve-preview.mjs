import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('dist');
const headers = JSON.parse(await readFile('.astro/security-headers.json', 'utf8'));
const redirects = JSON.parse(await readFile('.astro/redirects.json', 'utf8'));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const route = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (redirects[route]) {
    response.writeHead(301, { ...headers, Location: redirects[route] });
    response.end();
    return;
  }
  let file = resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(400);
    response.end();
    return;
  }
  let status = 200;
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    await stat(file);
  } catch {
    file = resolve(root, pathname.startsWith('/it/') ? 'it/404/index.html' : '404.html');
    status = 404;
  }
  try {
    response.writeHead(status, {
      ...headers,
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
    });
    response.end(await readFile(file));
  } catch {
    response.writeHead(500);
    response.end('Preview file unavailable');
  }
});
server.listen(4322, '127.0.0.1', () => console.log('Production preview: http://127.0.0.1:4322/'));
