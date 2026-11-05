#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repository = path.resolve(project, '../..');
const localPython = path.join(repository, '.venv', 'bin', 'python');
const executable = process.platform === 'win32' ? 'python' : existsSync(localPython) ? localPython : 'python3';
const result = spawnSync(executable, process.argv.slice(2), {stdio: 'inherit'});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
