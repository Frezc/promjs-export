This is a export function for [promjs](https://github.com/weaveworks/promjs)

# Intall
```shell
yarn add promjs-export
```

# Usage
```js
import { exportMetrics } from 'promjs-export';
import prom from 'promjs';

const registry = prom();
const pageRequestCounter = registry.create('counter', 'page_requests', 'A counter for page requests');
pageRequestCounter.inc();

console.log(exportMetrics(registry));
```
