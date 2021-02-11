# rating services
Wrap the code used in evaluation systems

## Purpose of use
- ratingAverage.ts : Calculate the average of multiple ratings
- Gauge.tsx : Visualize your scores and display them with gauge bars

## Usage
```
import {ratingAverage, Gauge} from "@hanii/planet-rating";

ratingAverage(object) // object include ratings([]) and rating_count(number)    

<Gauge
    max={max} // Maximum score
    curr={curr} // Score to display
    width={width} // Gauge size
    height={height} //Gauge height
/>
```