import prom from 'promjs';
import { exportMetrics } from '../src';

describe('promjs-export', () => {
  it('convert counter & gauge', () => {
    const registry = prom();
    const pageRequestCounter = registry.create('counter', 'page_requests', 'A counter for page requests');
    pageRequestCounter.inc();
    const memoryGauge = registry.create('gauge', 'memory_used_size', 'A gauge for used memory');
    memoryGauge.set(114514, { browser: 'firefox' });
    expect(exportMetrics(registry)).toEqual([
      {
        name: 'page_requests',
        help: 'A counter for page requests',
        type: 'COUNTER',
        metrics: [
          {
            value: 1,
          }
        ]
      },
      {
        name: 'memory_used_size',
        help: 'A gauge for used memory',
        type: 'GAUGE',
        metrics: [
          {
            labels: { browser: 'firefox' },
            value: 114514,
          }
        ]
      }
    ])
  });

  it('convert histogram', () => {
    const registry = prom();
    const resDurHistogram = registry.create('histogram', 'resource_duration', 'A histogram for resource fetching duration', [100, 200, 400, 800]);
    resDurHistogram.observe(88, { name: 'main.js' });
    resDurHistogram.observe(212, { name: 'main.js' });
    resDurHistogram.observe(111, { name: 'main.js' });
    resDurHistogram.observe(500, { name: 'main.js' });
    resDurHistogram.observe(1400, { name: 'main.js' });
    expect(exportMetrics(registry)).toEqual([
      {
        name: 'resource_duration',
        help: 'A histogram for resource fetching duration',
        type: 'HISTOGRAM',
        metrics: [
          {
            labels: { name: 'main.js' },
            count: 5,
            sum: 88 + 212 + 111 + 500 + 1400,
            buckets: {
              '100': 1,
              '200': 2,
              '400': 3,
              '800': 4,
              '+Inf': 5,
            }
          }
        ]
      },
    ])
  })
})