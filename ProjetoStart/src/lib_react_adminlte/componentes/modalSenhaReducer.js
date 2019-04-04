export default (state = {}, action) => {
  if (action.type === 'mudar_senha') {
    return { ...action };
  }
  return state;
};
