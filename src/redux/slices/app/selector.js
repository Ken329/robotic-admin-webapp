import { createSelector } from "@reduxjs/toolkit";

const selectApp = (state) => state.app;

export const makeSelectUserData = () =>
  createSelector(selectApp, (appState) => appState.userData);

export const makeSelectStudentList = () =>
  createSelector(selectApp, (appState) => appState.students);

export const makeSelectCentresList = () =>
  createSelector(selectApp, (appState) => appState.centres);

export const makeSelectUserName = () =>
  createSelector(selectApp, (appState) => appState.userData?.fullName);

export const makeSelectUserRole = () =>
  createSelector(selectApp, (appState) => appState.userData?.role);

export const makeSelectUserStatus = () =>
  createSelector(selectApp, (appState) => appState.userData?.status);
