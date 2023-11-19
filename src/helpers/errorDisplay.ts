import { HeadCrabErrorType, HeadcrabError } from 'src/websocket/in';

export const headcrabErrorToDisplay = (error: HeadcrabError): string => {
  switch (error.type) {
    case HeadCrabErrorType.GameDoesNotExist:
      return error.detail;
    case HeadCrabErrorType.PlayerAlreadyExists:
      return error.detail;
    case HeadCrabErrorType.Internal:
      return error.detail;
    default:
      return error.detail;
  }
};
