import * as path from 'path';
import * as rimraf from 'rimraf';
import Config from './config';

const reporterConfig = Config();

function DeleteFolderContents(dataPath: string) {
  if (dataPath) {
    rimraf(`${dataPath}/*`, () => {});
  }
}

export default function CleanAllureFolders(): any {
  if (reporterConfig.CLEAN_RESULT_DIR) {
    DeleteFolderContents(path.resolve(process.cwd(), reporterConfig.RESULT_DIR));
  }
  if (reporterConfig.CLEAN_REPORT_DIR) {
    DeleteFolderContents(path.resolve(process.cwd(), reporterConfig.REPORT_DIR));
  }
}
