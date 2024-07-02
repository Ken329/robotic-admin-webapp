import { createSelector } from "@reduxjs/toolkit";

const selectPosts = (state) => state.posts;

export const makeSelectBlogsData = () =>
  createSelector(selectPosts, (appState) => appState.blogs);

export const makeSelectFilesData = () =>
  createSelector(selectPosts, (appState) => appState.files);
