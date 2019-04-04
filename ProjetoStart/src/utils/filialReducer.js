export default (state = [], action) => {
    if (action.type === 'set_filiais') {
      return action.dados;
    }
    return state;
  };
  