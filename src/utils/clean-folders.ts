import * as path from 'path';
import rimraf from 'rimraf';
import { loadReporterConfig } from './config';

const reporterConfig = loadReporterConfig();

async function deleteFolderContents(dataPath: string): Promise<void> {
  if (dataPath) {
    await rimraf(`${dataPath}/*`, () => {});
  }
}

export default async function cleanAllureFolders(): Promise<void> {
  if (reporterConfig.CLEAN_RESULT_DIR) {
    await deleteFolderContents(path.resolve(process.cwd(), reporterConfig.RESULT_DIR));
  }
  if (reporterConfig.CLEAN_REPORT_DIR) {
    await deleteFolderContents(path.resolve(process.cwd(), reporterConfig.REPORT_DIR));
  }
  if (reporterConfig.CLEAN_SCREENSHOT_DIR) {
    await deleteFolderContents(path.resolve(process.cwd(), reporterConfig.SCREENSHOT_DIR));
  }
}
