import HeadCrabErrorType from './headcrabErrorType';

class HeadcrabError {
  private readonly _type: HeadCrabErrorType;
  private readonly _title: string;
  private readonly _detail: string;

  constructor(type: HeadCrabErrorType, title: string, detail: string) {
    this._type = type;
    this._title = title;
    this._detail = detail;
  }

  get type(): HeadCrabErrorType {
    return this._type;
  }

  get title(): string {
    return this._title;
  }

  get detail(): string {
    return this._detail;
  }
}

export default HeadcrabError;
