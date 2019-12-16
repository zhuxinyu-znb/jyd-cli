const stageReducer = (state, action) => {
    switch (action.type) {
    case 'STAGE_DATA':
        return {
            ...state,
            stagecode: action.stagecode,
        };
    default:
        return state;
    }
};
export default stageReducer;
