import { loadReporterConfig } from './config';

const reporterConfig = loadReporterConfig();

export default function log(reporter: any, text: string): void {
  if (reporterConfig.ENABLE_LOGGING) {
    reporter.write(text).newline();
  }
}
