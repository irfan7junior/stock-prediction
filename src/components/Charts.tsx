import React, { useEffect, useState } from 'react';

import Chart from '@/components/Chart';

interface ICharts {
  OriginalDataUrl: string;
  ValidationAndFuturePredictionUrl: string;
}

export type ReturnOriginal = {
  date: Date;
  actual: number;
  predicted: number;
};

export type ReturnPrediction = {
  data: Date;
  predicted: number;
};

const Charts: React.FC<ICharts> = ({
  OriginalDataUrl,
  ValidationAndFuturePredictionUrl,
}) => {
  const [original, setOriginal] = useState<ReturnOriginal[]>([]);
  const [prediction, setPrediction] = useState<ReturnPrediction[]>([]);

  const fetchData = async (url: string): Promise<any> => {
    try {
      const output = {} as any;
      const response = await fetch(url);
      const text = await response.text();
      const file = text.split('\n');
      for (let i = 0; i < file.length; i++) {
        const data = file[i].split(',');
        if (data[1]) output[data[0]] = Number(data[1].trim());
      }
      return output;
    } catch (error) {
      console.log({ error });
    }
  };

  const loadData = async () => {
    const originalData = await fetchData(OriginalDataUrl);
    const processedData = await fetchData(ValidationAndFuturePredictionUrl);
    // console.log(originalData)
    const temp = [] as any;
    const t2 = [] as any;
    for (let i = 0; i < Object.keys(processedData).length; i++) {
      const element = Object.keys(processedData)[i];
      if (originalData[element])
        temp.push({
          date: new Date(element),
          predicted: processedData[element],
          actual: originalData[element],
        });
      else {
        t2.push({
          date: new Date(element),
          predicted: processedData[element],
        });
      }
    }
    // console.log(temp)
    setOriginal(temp);
    setPrediction(t2);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Chart data={original} />
      <Chart data={prediction} />
    </>
  );
};
export default Charts;
