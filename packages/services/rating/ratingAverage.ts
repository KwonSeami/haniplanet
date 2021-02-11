interface IRating {
  id: number;
  name: string;
  rating_count: number;
  sum_score: number;
}

export interface IAverage {
  ratings: IRating[];
  rating_count: number;
}

const ratingAverage = (extension: IAverage) => {
    if(!!extension) {
      const {ratings, rating_count} = extension;
      const {length} = ratings;

      return rating_count > 0
        ? Math.round(
        ratings
          .reduce((prev, {sum_score, rating_count: _rating_count}) =>
            prev + (sum_score / (_rating_count || rating_count)), 0) / length * 100) / 100
        : 0;
    }
    return 0;
};

export default ratingAverage;