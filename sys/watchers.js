import { qualifyPath } from './filesystem.js';

const fileChangeWatchers = new Set();
const fileChangeWatchersByPath = new Map();
const fileCreationWatchers = new Set();
const fileDeletionWatchers = new Set();
const fileReadWatchers = new Set();

const runFileChangeWatchersByPath = async (path, workspace) => {
  const entry = fileChangeWatchersByPath.get(qualifyPath(path, workspace));
  if (entry === undefined) {
    return;
  }
  const { watchers } = entry;
  if (watchers === undefined) {
    return;
  }
  for (const watcher of watchers) {
    await watcher(path, workspace);
  }
};

export const runFileCreationWatchers = async (path, workspace) => {
  for (const watcher of fileCreationWatchers) {
    await watcher(path, workspace);
  }
  return runFileChangeWatchersByPath(path, workspace);
};

export const runFileDeletionWatchers = async (path, workspace) => {
  for (const watcher of fileDeletionWatchers) {
    await watcher(path, workspace);
  }
  return runFileChangeWatchersByPath(path, workspace);
};

export const runFileReadWatchers = async (path, workspace) => {
  for (const watcher of fileReadWatchers) {
    await watcher(path, workspace);
  }
};

export const runFileChangeWatchers = async (path, workspace) => {
  for (const watcher of fileChangeWatchers) {
    await watcher(path, workspace);
  }
  return runFileChangeWatchersByPath(path, workspace);
};

export const watchFile = async (path, workspace, thunk) => {
  if (thunk) {
    const qualifiedPath = qualifyPath(path, workspace);
    let entry = fileChangeWatchersByPath.get(qualifiedPath);
    if (entry === undefined) {
      entry = { path, workspace, watchers: new Set() };
      fileChangeWatchersByPath.set(qualifiedPath, entry);
    }
    entry.watchers.add(thunk);
    return thunk;
  }
};

export const unwatchFile = async (path, workspace, thunk) => {
  if (thunk) {
    const qualifiedPath = qualifyPath(path, workspace);
    const entry = fileChangeWatchersByPath.get(qualifiedPath);
    if (entry === undefined) {
      return;
    }
    entry.watchers.delete(thunk);
    if (entry.watchers.size === 0) {
      fileChangeWatchersByPath.delete(qualifiedPath);
    }
  }
};

export const unwatchFileChange = async (thunk) => {
  fileChangeWatchers.delete(thunk);
  return thunk;
};

export const unwatchFileCreation = async (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};

export const unwatchFileDeletion = async (thunk) => {
  fileCreationWatchers.delete(thunk);
  return thunk;
};

export const unwatchFileRead = async (thunk) => {
  fileReadWatchers.delete(thunk);
  return thunk;
};

export const watchFileChange = async (thunk) => {
  fileChangeWatchers.add(thunk);
  return thunk;
};

export const watchFileCreation = async (thunk) => {
  fileCreationWatchers.add(thunk);
  return thunk;
};

export const watchFileDeletion = async (thunk) => {
  fileDeletionWatchers.add(thunk);
  return thunk;
};

export const watchFileRead = async (thunk) => {
  fileReadWatchers.add(thunk);
  return thunk;
};
