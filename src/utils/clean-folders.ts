import * as path from 'path';
import * as rimraf from 'rimraf';
import loadConfig from './config';

const reporterConfig = loadConfig();

function deleteFolderContents(dataPath: string) {
  if (dataPath) {
    rimraf(`${dataPath}/*`, () => {});
  }
}

export default function cleanAllureFolders(): any {
  if (reporterConfig.CLEAN_RESULT_DIR) {
    deleteFolderContents(path.resolve(process.cwd(), reporterConfig.RESULT_DIR));
  }
  if (reporterConfig.CLEAN_REPORT_DIR) {
    deleteFolderContents(path.resolve(process.cwd(), reporterConfig.REPORT_DIR));
  }
}
