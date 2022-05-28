import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

import { ReturnOriginal, ReturnPrediction } from '@/components/Charts';

interface IChart {
  data: ReturnOriginal[] | ReturnPrediction[];
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

const Chart: React.FC<IChart> = ({ data: original }) => {
  //console.log(tasks,ondelete)
  // const [original, setOriginal] = use(data);
  // const original = useRef(data);
  const [state, setState] = useState({
    data: original,
    left: 'dataMin',
    right: 'dataMax',
    top: 'dataMax+200',
    bottom: 'dataMin-200',
    top2: 'dataMax+200',
    bottom2: 'dataMin-200',
    animation: true,
  });
  const [refAreaLeft, setRefAreaLeft] = useState<string | number | undefined>(
    ''
  );
  const [refAreaRight, setRefAreaRight] = useState<string | number | undefined>(
    ''
  );

  useEffect(() => {
    //   setOriginal(data);
    //   console.log(original)
    setState({
      data: original,
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+200',
      bottom: 'dataMin-200',
      top2: 'dataMax+200',
      bottom2: 'dataMin-200',
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

  const zoom = () => {
    const { data } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    // xAxis domain
    if ((refAreaLeft as number) > (refAreaRight as number)) {
      const t = refAreaLeft;
      setRefAreaLeft(refAreaRight);
      setRefAreaRight(t);
    }

    // yAxis domain
    const [bottom, top] = getAxisYDomain(
      refAreaLeft as number,
      refAreaRight as number,
      'predicted',
      10
    );
    let [bottom2, top2] = ['', ''] as [string | number, string | number];
    if (state.data[0] && (state.data[0] as any).actual)
      [bottom2, top2] = getAxisYDomain(
        refAreaLeft as any,
        refAreaRight as any,
        'actual',
        10
      );
    setState({
      data: data.slice((refAreaLeft as any) - 1, refAreaRight as any),
      left: (data[refAreaLeft as any] as any).date,
      right: (data[refAreaRight as any] as any).date,
      bottom,
      top,
      bottom2,
      top2,
    } as any);
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const zoomOut = () => {
    // const { data } = state;
    setState({
      data: original.slice(),
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+200',
      bottom: 'dataMin-200',
      top2: 'dataMax+200',
      bottom2: 'dataMin-200',
    } as any);
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  return (
    <div
      className='highlight-bar-charts'
      style={{ userSelect: 'none', width: '100%' }}
    >
      {state.data[0] && (state.data[0] as any).actual ? (
        <button type='button' className='btn update' onClick={zoomOut}>
          Zoom Out
        </button>
      ) : null}

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
          onMouseDown={(e: CategoricalChartState) => {
            //   console.log(e);
            setRefAreaLeft(e.activeTooltipIndex);
          }}
          onMouseMove={(e) => {
            refAreaLeft && setRefAreaRight(e.activeTooltipIndex);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onMouseUp={zoom}
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
          <YAxis
            orientation='right'
            allowDataOverflow
            domain={[state.bottom2, state.top2]}
            type='number'
            yAxisId='2'
          />
          <Tooltip labelFormatter={dateFormatter} />
          <Line
            yAxisId='1'
            type='natural'
            dataKey='predicted'
            stroke='#8884d8'
            animationDuration={300}
          />
          {state.data[0] && (state.data[0] as any).actual ? (
            <Line
              yAxisId='2'
              type='natural'
              dataKey='actual'
              stroke='#82ca9d'
              animationDuration={300}
            />
          ) : null}
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              yAxisId='1'
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default Chart;
