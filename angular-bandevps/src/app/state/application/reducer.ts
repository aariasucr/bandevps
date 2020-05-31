import * as ApplicationActions from './actions';

export interface State {
  isActive: boolean;
}

const initialState: State = {
  isActive: false
};

export function reducer(state = initialState, action: ApplicationActions.All): State {
  switch (action.type) {
    case ApplicationActions.LOG_OUT: {
      return {
        ...state,
        isActive: false
      };
    }

    case ApplicationActions.LOG_IN: {
      return {
        ...state,
        isActive: true
      };
    }

    default: {
      return state;
    }
  }
}
