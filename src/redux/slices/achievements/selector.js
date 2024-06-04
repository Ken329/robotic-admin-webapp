import { createSelector } from "@reduxjs/toolkit";

const selectAchievements = (state) => state.achievements;

export const makeSelectAchievementsData = () =>
  createSelector(selectAchievements, (appState) => appState.achievements);
