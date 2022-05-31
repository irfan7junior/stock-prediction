import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ReturnPrediction } from '@/components/Charts';

interface IChart {
  data: ReturnPrediction[];
  boundedError: [number, number];
}

const dateFormatter = (date: Date) => {
  return date.toLocaleDateString();
};

// const dataReducer = (data) => {
//   if (data.length < 20) return data;
//   const reducedData = [];
//   const k = data.length / 10;
//   for (let i = 0; i < data.length; i += k) {
//     reducedData.push(data[i]);
//   }
//   return reducedData;
// };

const PredictionChart: React.FC<IChart> = ({ data: original }) => {
  //console.log(tasks,ondelete)
  // const [original, setOriginal] = use(data);
  // const original = useRef(data);
  const [state, setState] = useState({
    data: original,
    left: 'dataMin',
    right: 'dataMax',
    top: 'dataMax+200',
    bottom: 'dataMin-200',
    animation: true,
  });

  useEffect(() => {
    //   setOriginal(data);
    //   console.log(original)
    setState({
      data: original,
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+200',
      bottom: 'dataMin-200',
      animation: true,
    });
  }, [original]);

  const getAxisYDomain = (
    from: number,
    to: number,
    ref: any,
    offset: number
  ) => {
    const refData = state.data.slice(from - 1, to);

    let [bottom, top] = [(refData[0] as any)[ref], (refData[0] as any)[ref]];

    refData.forEach((d: any) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  return (
    <div
      className='highlight-bar-charts'
      style={{ userSelect: 'none', width: '100%' }}
    >
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          width={800}
          height={400}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          data={state.data}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            allowDataOverflow
            dataKey='date'
            domain={[state.left, state.right]}
            type={'date' as any}
            scale='time'
            tickFormatter={dateFormatter}
          />
          <YAxis
            allowDataOverflow
            domain={[state.bottom, state.top]}
            type='number'
            yAxisId='1'
          />
          <Tooltip labelFormatter={dateFormatter} />
          <Line
            yAxisId='1'
            type='natural'
            dataKey='predicted'
            stroke='#8884d8'
            animationDuration={300}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default PredictionChart;
