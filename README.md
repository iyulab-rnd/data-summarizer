# data-summarizer

This library provides a simplified simulation of MongoDB's aggregation framework in TypeScript. It allows for filtering, grouping, sorting, and limiting of in-memory data collections, mimicking the behavior of database operations but in a lightweight, local context.

## Installation

To use the Data Aggregator library in your project, you can install it via npm. Run the following command in your project directory:

```bash
npm install @iyulab/data-summerizer
```

Make sure you have Node.js and npm installed on your system. You can download and install Node.js (npm included) from https://nodejs.org/.

## Features

The Data Aggregator library provides the following features:

Filtering ($match): Filter your data based on specified criteria.
Grouping and Aggregation ($group): Group your data by specific fields and count the number of documents in each group.
Sorting ($sort): Sort your data based on one or more fields.
Limiting ($limit): Limit the number of documents to return.
Usage
Below is a simple example demonstrating how to use the Aggregation class to perform data operations:

```typescript
import { aggregation, AggregationOptions } from "@iyulab/data-summerizer";

// Sample data
const data = [
  { id: 1, name: "Alice", age: 30 },
  { id: 2, name: "Bob", age: 25 },
  { id: 3, name: "Charlie", age: 35 },
  { id: 4, name: "David", age: 40 },
];

// Create an instance of Aggregation with options
const options: AggregationOptions = {
  $match: { age: { $gt: 30 } }, // Filtering: age greater than 30
  $group: { _id: "$age" }, // Grouping by age
  $sort: { age: 1 }, // Sorting by age in ascending order
  $limit: 2, // Limiting to 2 documents
};

// Execute the aggregation
const result = aggregation(data, options);

console.log(result);
```

This will output the processed data based on the provided aggregation options.
See [Aggregation Tests](./tests/Aggregation.test.ts)

## Contribution

Contributions are welcome! Please feel free to submit pull requests or open issues to improve the library or add new features.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
