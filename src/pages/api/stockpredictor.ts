import { Client } from '@notionhq/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { NotionDBQuery } from '@/lib/types/databasequery';

export default async function get_csv(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const notion = new Client({
    auth: process.env.NOTION_ACCESS_TOKEN,
  });

  const response = (await notion.databases.query({
    database_id: process.env.DATABASE_ID as string,
  })) as unknown as NotionDBQuery;

  const stock_name = req.query.stock_name.toString().toLowerCase();

  let original_data_url: undefined | string = undefined;
  let validation_and_future_prediction_url: undefined | string = undefined;

  response.results.forEach((result) => {
    if (
      stock_name ===
      result.properties.stock_name.title[0].text.content.toLowerCase()
    ) {
      original_data_url = result.properties.original_data.files[0].file.url;
      validation_and_future_prediction_url =
        result.properties.validation_and_future_prediction.files[0].file.url;
    }
  });

  if (
    validation_and_future_prediction_url === undefined &&
    original_data_url === undefined
  ) {
    res.status(404).json({
      error: 'Stock not found',
    });
    return;
  }

  res
    .status(200)
    .json({ validation_and_future_prediction_url, original_data_url });
}
