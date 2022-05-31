import React, { useEffect, useState } from 'react';

import AllChart from '@/components/AllChart';
import Chart from '@/components/Chart';
import PredictionChart from '@/components/PredictionChart';

interface ICharts {
  DataURL: string;
}

export type ReturnAll = {
  date: Date;
  actual: number;
};

export type ReturnTraining = {
  date: Date;
  actual: number;
  predicted: number;
};

export type ReturnPrediction = {
  date: Date;
  predicted: number;
};

interface FetchedData {
  stock_name: string;
  future_prediction_start: string;
  future_prediction_end: string;
  bounded_error_upper: number;
  bounded_error_lower: number;
  original_data: {
    date: [string];
    price: [number];
  };
  validation_and_future_prediction: {
    date: [string];
    price: [number];
  };
}

const Charts: React.FC<ICharts> = ({ DataURL }) => {
  const [all, setAll] = useState<ReturnAll[]>([]);
  const [training, setTraining] = useState<ReturnTraining[]>([]);
  const [prediction, setPrediction] = useState<ReturnPrediction[]>([]);
  const [boundedError, setBoundedError] = useState<[number, number]>([0, 0]);

  const fetchData = async (url: string): Promise<FetchedData | null> => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.log({ error });
      return null;
    }
  };

  const loadData = async () => {
    const fetchedData = await fetchData(DataURL);
    if (!fetchData) return;
    const tempAll: ReturnAll[] = [];
    const tempTraining: ReturnTraining[] = [];
    const tempPrediction: ReturnPrediction[] = [];
    let j = 0;
    for (let i = 0; i < (fetchedData?.original_data.date.length || 0); i++) {
      const date1 = fetchedData?.original_data.date[i];
      const actual = fetchedData?.original_data.price[i] || 0;
      let predicted = -1;
      const date2 = fetchedData?.validation_and_future_prediction.date[j];
      if (date1 === date2) {
        predicted =
          fetchedData?.validation_and_future_prediction.price[j++] || 0;
        tempTraining.push({
          date: new Date(date1 || 0),
          actual,
          predicted,
        });
      }
      tempAll.push({
        date: new Date(date1 || 0),
        actual,
      });
    }
    while (
      j < (fetchedData?.validation_and_future_prediction.date.length || 0)
    ) {
      tempPrediction.push({
        date: new Date(
          fetchedData?.validation_and_future_prediction.date[j] || 0
        ),
        predicted:
          fetchedData?.validation_and_future_prediction.price[j++] || 0,
      });
    }
    // console.log(temp)
    setAll(tempAll);
    setTraining(tempTraining);
    setPrediction(tempPrediction);
    setBoundedError([
      fetchedData?.bounded_error_lower || 0,
      fetchedData?.bounded_error_upper || 0,
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h2>All Data</h2>
      <AllChart data={all} />
      <hr />
      <h2>Training Data</h2>
      <Chart data={training} />
      <hr />
      <h2>Final Prediction</h2>
      <PredictionChart data={prediction} boundedError={boundedError} />
    </>
  );
};
export default Charts;
