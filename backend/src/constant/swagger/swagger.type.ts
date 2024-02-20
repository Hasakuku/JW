type Operation = {
  summary: string;
};

type Response = {
  status: number;
  description: string;
  type?: any;
};

type Examples = {
  summary: string;
  value: any;
};

type Body = {
  type?: any;
  description?: string;
  examples?: Record<string, Examples>;
};

type Query = {
  type: any;
  description: string;
  example: string;
};

export type Swagger = {
  op: Operation;
  res: Record<number, Response>;
  body?: Body;
  query?: Query;
};
