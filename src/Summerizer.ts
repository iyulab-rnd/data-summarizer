import { List } from 'immutable';
import linq from 'linq';
import math, { MathNumericType } from 'mathjs';

interface DataItem {
  [key: string]: string | MathNumericType;
}

interface SummarizerOptions {
  data: DataItem[];
  groupby: string[];
  fields: {
    type: 'SUM' | 'COUNT' | 'AVG' | 'MEAN' | 'MEDIAN' | 'MIN' | 'MAX' | 'STD' | 'VARIANCE';
    field: string;
  }[];
}

interface AggregatedData {
  [key: string]: MathNumericType;
}

interface ExecutionResult {
  key: string;
  value: AggregatedData;
}

class Summerizer {
  private options: SummarizerOptions;

  constructor(options: SummarizerOptions) {
    this.options = options;
  }

  public execute(): ExecutionResult[] {
    const { data, groupby } = this.options;
    const immutableData = List(data);
    const groupedData = this.groupBy(immutableData, groupby);
    return this.select(groupedData);
  }

  private groupBy(data: List<DataItem>, groupby: string[]): linq.IEnumerable<linq.IGrouping<string, DataItem>> {
    return linq.from(data.toArray())
      .groupBy(item => groupby.map(key => item[key]).join('|'));
  }  
  
  private select(groupedData: linq.IEnumerable<linq.IGrouping<string, DataItem>>): ExecutionResult[] {
    const { fields } = this.options;
    let stdResult: MathNumericType[] | MathNumericType | number;
    let varianceResult: MathNumericType[] | MathNumericType | number;
    
    return groupedData
      .select(group => {
        const aggregatedData: AggregatedData = {};
        fields.forEach(field => {
          const fieldData = group.getSource().map(item => {
            const value = item[field.field];
            return parseFloat(typeof value === 'string' ? value : value.toString());
          });

          switch (field.type) {
            // 합계
            case 'SUM':
              aggregatedData[field.field] = math.sum(fieldData);
              break;
            // 건수
            case 'COUNT':
              aggregatedData['count'] = fieldData.length;
              break;
            // 평균
            case 'AVG':
            case 'MEAN':
              aggregatedData[field.field] = math.mean(fieldData);
              break;
            // 중앙값
            case 'MEDIAN':
              aggregatedData[field.field] = math.median(fieldData);
              break;
            // 최소값
            case 'MIN':
              aggregatedData[field.field] = math.min(fieldData);
              break;
            // 최대값
            case 'MAX':
              aggregatedData[field.field] = math.max(fieldData);
              break;
            // 표준편차
            case 'STD':
              stdResult = math.std(fieldData);
              aggregatedData[field.field] = typeof stdResult === 'number' ? stdResult : NaN;
              break;
            // 분산
            case 'VARIANCE':
              varianceResult = math.variance(fieldData);
              aggregatedData[field.field] = typeof varianceResult === 'number' ? varianceResult : NaN;
              break;
          }
        });
        return { key: group.key(), value: aggregatedData };
      })
      .toArray();
  }  
}

export { Summerizer, SummarizerOptions };