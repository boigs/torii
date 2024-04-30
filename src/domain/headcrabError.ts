import HeadcrabErrorType from './headcrabErrorType';

interface HeadcrabError {
  readonly type: HeadcrabErrorType;
  readonly title: string;
  readonly detail: string;
}

export default HeadcrabError;
