import http from 'http';
import os from 'os';
import path from 'path';
import type { Express } from 'express';

export function createTestRequester(app: Express) {
  const socketPath =
    process.platform === 'win32'
      ? `\\\\.\\pipe\\paypilot-test-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      : path.join(os.tmpdir(), `paypilot-test-${Date.now()}-${Math.floor(Math.random() * 10000)}.sock`);

  let server: http.Server | null = null;

  const start = () =>
    new Promise<void>((resolve, reject) => {
      server = http.createServer(app);
      server.listen(socketPath, () => resolve());
      server.on('error', reject);
    });

  const stop = () =>
    new Promise<void>((resolve) => {
      if (server) {
        server.close(() => resolve());
      } else {
        resolve();
      }
    });

  function makeRequest(method: string, urlPath: string, payload?: unknown) {
    return new Promise<{ status: number; body: any; headers: http.IncomingHttpHeaders }>((resolve, reject) => {
      const dataString = payload !== undefined ? JSON.stringify(payload) : undefined;
      const headers: Record<string, string | number> = {};
      if (dataString !== undefined) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(dataString);
      }

      const req = http.request(
        {
          socketPath,
          path: urlPath,
          method,
          headers,
        },
        (res) => {
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            let parsedBody: any = rawData;
            try {
              parsedBody = rawData ? JSON.parse(rawData) : {};
            } catch {
              // keep as string
            }
            resolve({
              status: res.statusCode || 200,
              body: parsedBody,
              headers: res.headers,
            });
          });
        }
      );

      req.on('error', reject);
      if (dataString) {
        req.write(dataString);
      }
      req.end();
    });
  }

  const requester = {
    get: (urlPath: string) => makeRequest('GET', urlPath),
    post: (urlPath: string) => ({
      send: (payload: unknown) => makeRequest('POST', urlPath, payload),
    }),
  };

  return {
    start,
    stop,
    req: () => requester,
  };
}

