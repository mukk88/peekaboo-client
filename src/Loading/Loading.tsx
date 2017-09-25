import * as React from 'react';

declare function require(path: string): string;

export enum LoadingStates {
    LOADING,
    LOAD_SUCCESS,
    LOAD_FAILED,
}

const loadingStyle: React.CSSProperties = {
    margin: 'auto',
    marginTop: '20%',
    textAlign: 'center',
};

export const Loading = () => {
  return (
    <div style={loadingStyle}>
      <img src={require(`../img/loading.gif`)} style={{height: '5em'}}/>
    </div>
  );
};

interface ILoadingErrorProps {
  msg: string;
}

export const LoadingError = (props: ILoadingErrorProps) => {
  return (
    <div style={loadingStyle}>
      {props.msg}
    </div>
  );
};