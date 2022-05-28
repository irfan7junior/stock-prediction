/* eslint-disable @typescript-eslint/no-empty-interface */
export interface NotionDBQuery {
  object: string;
  results: Result[];
  next_cursor: null;
  has_more: boolean;
  type: string;
  page: Page;
}

interface Page {}

interface Result {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: TedBy;
  last_edited_by: TedBy;
  cover: null;
  icon: null;
  parent: Parent;
  archived: boolean;
  properties: Properties;
  url: string;
}

interface TedBy {
  object: string;
  id: string;
}

interface Parent {
  type: string;
  database_id: string;
}

interface Properties {
  original_data: OriginalData;
  validation_and_future_prediction: OriginalData;
  stock_name: StockName;
}

interface OriginalData {
  id: string;
  type: string;
  files: FileElement[];
}

interface FileElement {
  name: string;
  type: string;
  file: FileFile;
}

interface FileFile {
  url: string;
  expiry_time: string;
}

interface StockName {
  id: string;
  type: string;
  title: Title[];
}

interface Title {
  type: string;
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href: null;
}

interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

interface Text {
  content: string;
  link: null;
}
