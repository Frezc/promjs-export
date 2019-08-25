
type Labels = Record<string, string>;

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

type MetricObject = {
  name: string;
  help: string;
} & ({
  type: 'GAUGE' | 'COUNTER';
  metrics: CounterValue[];
} | {
  type: 'HISTOGRAM';
  metrics: HistogramValue[];
})

/**
 * 
 * @param registry registry.data is private, so we should break ts type check here
 */
export function exportMetrics(registry: any): MetricObject[] {
  const result: MetricObject[] = [];

  if (registry && typeof registry.data === 'object') {
    Object.keys(registry.data).map((type) => {
      const metrics = registry.data[type];
      Object.keys(metrics).map((name) => {
        const metric = metrics[name];
        const values = metric.instance.collect();
        if (type === 'histogram') {
          result.push({
            name,
            help: metric.help,
            type: 'HISTOGRAM',
            metrics: (values || []).filter((m: any) => m.value.count > 0).map((m: any) => {
              const re: HistogramValue = {
                count: m.value.count,
                sum: m.value.sum,
                buckets: m.value.entries
              }
              if (m.labels) {
                re.labels = m.labels;
              }
              return re;
            })
          });
        } else if (type === 'counter' || type === 'gauge') {
          result.push({
            name,
            help: metric.help,
            type: type === 'counter' ? 'COUNTER' : 'GAUGE',
            metrics: values.map((m: any) => {
              const re: CounterValue = {
                labels: m.labels,
                value: m.value,
              };
              if (m.labels) {
                re.labels = m.labels;
              }
              return re;
            })
          });
        }
      })
    })
  } else {
    console.error('You should pass correct registry to exportMetrics')
  }

  return result;
}