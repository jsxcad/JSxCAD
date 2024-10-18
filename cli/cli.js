import {
  addOnEmitHandler,
  clearFileCache,
  getTimes,
  read,
  reportTimes,
  resolvePending,
  setLocalFilesystem,
  watchLog,
  write,
} from '@jsxcad/sys';

import api, { evaluate, execute } from '@jsxcad/api';
import { argv } from 'process';
import express from 'express';
import fs from 'fs';
import path from 'path';

import { readFileSync, writeFileSync } from 'fs';

Error.stackTraceLimit = Infinity;

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

const run = async (scriptPath, ...args) => {
  const outputMap = new Map();
  for (const arg of args) {
    if (arg.startsWith('--input=')) {
      const [filename, path] = arg.substr('--input='.length).split(':');
      const data = readFileSync(filename);
      await write(`source/${path}`, data);
    }
    if (arg.startsWith('--output=')) {
      const [filename, path] = arg.substr('--output='.length).split(':');
      outputMap.set(filename, path);
    }
  }
  const cwd = process.cwd();
  setLocalFilesystem(
    'https://raw.githubusercontent.com/jsxcad/JSxCAD/master/',
    cwd
  );
  const script = readFileSync(scriptPath, 'utf8');
  const lines = script.split('\n')
  const ecmascript = lines.slice(1).join('\n');
  const logWatcher = ({ type, source, text }) => {
    console.log(`[${type}] ${source} ${text}`);
  };
  watchLog(logWatcher);
  try {
    const emittedNotes = [];
    const onEmitHandler = addOnEmitHandler((notes) => emittedNotes.push(...notes));
    const path = scriptPath;
    await execute(ecmascript, { api, path, evaluate });
    await resolvePending();
    for (const note of emittedNotes) {
      if (!note.view || !note.view.download) {
        continue;
      }
      for (const entry of note.view.download.entries) {
        const outputPath = outputMap.get(entry.filename);
        if (!outputPath) {
          continue;
        }
        console.log(`QQ/writing ${entry.filename} to ${outputPath}`);
        const data = await read(entry.path);
        writeFileSync(outputPath, data);
      }
    }
  } catch (error) {
    console.log(`ER/1: ${JSON.stringify(error)}`);
    console.log(`Failed with error: ${error.message}`);
    console.log(error.stack);
  }
};

run(...argv.slice(2));
