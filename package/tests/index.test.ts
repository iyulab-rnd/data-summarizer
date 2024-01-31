// index.test.ts
import { Summerizer, SummarizerOptions } from '../src/Summerizer';

// 테스트를 위한 샘플 데이터
const sampleData = [
  { Kind: 'S1', Price: 10 },
  { Kind: 'S1', Price: 20 },
  { Kind: 'S2', Price: 30 },
];

describe('Summerizer Tests', () => {
  test('SUM aggregation', () => {
    const options: SummarizerOptions = {
      data: sampleData,
      groupby: ['Kind'],
      fields: [{ type: 'SUM', field: 'Price' }]
    };
    const summerizer = new Summerizer(options);
    const result = summerizer.execute();
    console.log('SUM Result:', result);
    expect(result.find(r => r.key === 'S1').value.Price).toBe(30);
    expect(result.find(r => r.key === 'S2').value.Price).toBe(30);
  });

  test('COUNT aggregation', () => {
    const options: SummarizerOptions = {
      data: sampleData,
      groupby: ['Kind'],
      fields: [{ type: 'COUNT', field: '*' }]
    };
    const summerizer = new Summerizer(options);
    const result = summerizer.execute();
    console.log('COUNT Result:', result);
    expect(result.find(r => r.key === 'S1').value.count).toBe(2);
    expect(result.find(r => r.key === 'S2').value.count).toBe(1);
  });

  // 다른 집계 유형에 대한 테스트 추가
  // 예: AVG, MEAN, MEDIAN, MIN, MAX, STD, VARIANCE 등

});

