import { createSelector } from "@reduxjs/toolkit";

const selectCentres = (state) => state.centres;

export const makeSelectCentresData = () =>
  createSelector(selectCentres, (appState) => appState.centres);
