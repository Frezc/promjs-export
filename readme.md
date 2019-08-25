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

# Data model
It's almost same as [prom2json](https://github.com/prometheus/prom2json)

```typescript
declare type Labels = Record<string, string>;
interface HistogramValue {
    labels?: Labels;
    buckets: Record<string, number>;
    count: number;
    sum: number;
}
interface CounterValue {
    labels?: Labels;
    value: number;
}
declare type MetricObject = {
    name: string;
    help: string;
} & ({
    type: 'GAUGE' | 'COUNTER';
    metrics: CounterValue[];
} | {
    type: 'HISTOGRAM';
    metrics: HistogramValue[];
});
/**
 *
 * @param registry registry.data is private, so we should break ts type check here
 */
export declare function exportMetrics(registry: any): MetricObject[];
```