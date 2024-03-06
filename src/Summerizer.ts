// src/Summerizer.ts
import { List } from 'immutable';
import linq from 'linq';
import * as math from 'mathjs'; // mathjs 전체를 임포트
import { MathNumericType } from 'mathjs';

interface DataItem {
  [key: string]: string | MathNumericType;
}

interface SummarizerOptions {
  data: DataItem[];
  groupby: string[];
  fields: {
    aggregation: 'SUM' | 'COUNT' | 'AVG' | 'MEAN' | 'MEDIAN' | 'MIN' | 'MAX' | 'STD' | 'VARIANCE';
    field: string;
  }[];
  filters?: {
    field: string;
    condition: 'EQUAL' | 'NOT_EQUAL' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_THAN_OR_EQUAL' | 'LESS_THAN_OR_EQUAL';
    value: string | number;
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

    // 필터링 적용
    const filteredData = this.applyFilters(immutableData);
    
    const groupedData = this.groupBy(filteredData, groupby);
    return this.select(groupedData);
  }

  private groupBy(data: List<DataItem>, groupby: string[]): linq.IEnumerable<linq.IGrouping<string, DataItem>> {
    return linq.from(data.toArray())
      .groupBy(item => groupby.map(key => item[key]).join('|'));
  }  
  
  private select(groupedData: linq.IEnumerable<linq.IGrouping<string, DataItem>>): ExecutionResult[] {
    const { fields } = this.options;
    
    return groupedData
      .select(group => {
        const aggregatedData: AggregatedData = {};
        fields.forEach(field => {
          const fieldData = group.getSource().map(item => {
            const value = item[field.field];
            return parseFloat(typeof value === 'string' ? value : value.toString());
          });

          switch (field.aggregation) {
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
              const stdResult = math.std(fieldData) as unknown as number;
              aggregatedData[field.field] = !isNaN(stdResult) ? stdResult : NaN;
              break;
            // 분산
            case 'VARIANCE':
              const varianceResult = math.variance(fieldData) as unknown as number;
              aggregatedData[field.field] = !isNaN(varianceResult) ? varianceResult : NaN;
              break;
          }
        });
        return { key: group.key(), value: aggregatedData };
      })
      .toArray();
  }  

  private applyFilters(data: List<DataItem>): List<DataItem> {
    let filteredData = data;
    if (this.options.filters) {
      this.options.filters.forEach(filter => {
        filteredData = filteredData.filter(item => {
          switch (filter.condition) {
            case 'EQUAL':
              return item[filter.field] === filter.value;
            case 'NOT_EQUAL':
              return item[filter.field] !== filter.value;
            case 'GREATER_THAN':
              return parseFloat(item[filter.field] as string) > parseFloat(filter.value as string);
            case 'LESS_THAN':
              return parseFloat(item[filter.field] as string) < parseFloat(filter.value as string);
            case 'GREATER_THAN_OR_EQUAL':
              return parseFloat(item[filter.field] as string) >= parseFloat(filter.value as string);
            case 'LESS_THAN_OR_EQUAL':
              return parseFloat(item[filter.field] as string) <= parseFloat(filter.value as string);
            default:
              return true;
          }
        });
      });
    }
    return filteredData;
  }
}

export { Summerizer, SummarizerOptions };
