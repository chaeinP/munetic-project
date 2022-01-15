export interface ResponseData {}

export default class ResJSON {
  constructor(
    public readonly message: string,
    public readonly data: ResponseData = {},
  ) {}
}
