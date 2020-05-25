/* eslint-disable jest/no-disabled-tests */
import cleanAllureFolders from '../../../src/utils/clean-folders';

// Avoid unittests deleting files by mocking the clean-folders function.
jest.mock('rimraf');

const mockResolve = jest.fn(); // .mockImplementation((...pathSegments: string[]) => console.log(pathSegments));
jest.mock('path', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return { resolve: mockResolve };
    }),
  };
});

// const mockConfig = jest
//   .fn()
//   .mockImplementationOnce(() => {
//     return {
//       CLEAN_RESULT_DIR: true,
//       CLEAN_REPORT_DIR: true,
//     };
//   })
//   .mockImplementationOnce(() => {
//     return {
//       CLEAN_RESULT_DIR: false,
//       CLEAN_REPORT_DIR: false,
//     };
//   });
// jest.mock('../../../src/utils/config', () => {
//   return jest.fn().mockImplementation(() => {
//     return { loadConfig: mockConfig };
//   });
// });

describe.skip('Folder Cleanup', () => {
  beforeEach(() => {
    // mockResolve.mockClear();
    // mockConfig.mockClear();
  });
  it('Should contain valid statuses', async () => {
    await cleanAllureFolders();
    // expect(mockConfig).toBeCalledTimes(1);
    expect(mockResolve).toBeCalledTimes(2);
  });
});
