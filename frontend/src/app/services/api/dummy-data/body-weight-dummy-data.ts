import { BodyWeightMeasure } from '../../../models/body-weight-measure';

export const bodyWightMeasures: BodyWeightMeasure[] = Array.from(
  { length: 100 },
  (_, index) => ({
    date: new Date(
      2024,
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 28) + 1,
    ),
    value: parseFloat((70 + Math.random() * 30).toFixed(1)),
  }),
);
