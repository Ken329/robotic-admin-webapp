const selectApp = state => state.app;

export const selectUserData = state => selectApp(state).userData;

export const selectToken = state => selectApp(state).token;

export const selectUserName = state => selectUserData(state)?.email;

export const selectUserRole = state => selectUserData(state)?.role;

export const selectUserStatus = state => selectUserData(state)?.status;
