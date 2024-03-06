import { Summerizer, SummarizerOptions } from '../src/Summerizer';

describe('Summerizer', () => {
  // 테스트용 데이터
  const testData: SummarizerOptions = {
    data: [
      { id: '1', value: 10 },
      { id: '1', value: 20 },
      { id: '2', value: 20 }
    ],
    groupby: ['id'],
    fields: [
      { aggregation: 'SUM', field: 'value' }
    ]
  };

  // Summerizer 클래스 인스턴스 생성
  const summerizer = new Summerizer(testData);

  // execute 메서드 테스트
  describe('execute', () => {
    it('should return correct aggregated data', () => {
      const result = summerizer.execute();
      // 결과 확인
      expect(result).toEqual([
        { key: "1", value: { value: 30 } },
        { key: "2", value: { value: 20 } }
      ]);
    });
  });

  // 다른 테스트 케이스들을 추가할 수 있음
});
