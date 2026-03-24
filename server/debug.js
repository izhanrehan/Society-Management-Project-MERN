import societyRoutes from './src/routes/society.routes.js';
import eventRoutes from './src/routes/event.routes.js';
import registrationRoutes from './src/routes/registration.routes.js';
import { pathToRegexp } from 'path-to-regexp';

const routers = { societyRoutes, eventRoutes, registrationRoutes };

for (const [name, router] of Object.entries(routers)) {
  console.log('Router', name);
  console.log('stack length', router.stack.length);
  for (const layer of router.stack) {
    if (layer.route) {
      const p = layer.route.path;
      console.log('  path:', p);
      try {
        pathToRegexp(p);
      } catch (e) {
        console.error('    compile error for', p, e.message);
      }
    } else {
      console.log('  middleware layer, name', layer.name);
    }
  }
}
