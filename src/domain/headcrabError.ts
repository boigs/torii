import HeadCrabErrorType from './headcrabErrorType';

interface HeadcrabError {
  readonly type: HeadCrabErrorType;
  readonly title: string;
  readonly detail: string;
}

export default HeadcrabError;
