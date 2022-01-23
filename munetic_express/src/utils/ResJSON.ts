export interface ResponseData {}

export default class ResJSON {
  public readonly message: string;

  constructor(public readonly data: ResponseData = {}) {
    this.message = 'request success';
  }
}
