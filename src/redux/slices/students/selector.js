import { createSelector } from "@reduxjs/toolkit";

const selectStudents = (state) => state.students;

export const makeSelectStudentData = () =>
  createSelector(selectStudents, (appState) => appState.students);

export const makeSelectLevelsData = () =>
  createSelector(selectStudents, (appState) => appState.levels);
