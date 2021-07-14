import { Severity } from 'allure-js-commons';
import { AllureTest } from 'allure-js-commons/dist/src/AllureTest';
import Metadata from '../../../src/reporter/metadata';
import '../../utils/jest-enum-matcher';
// Mock the AllureTest class to be able to test all Metadata functions.
// TODO: Change import to 'allure-js-commons', currently not possible because
// jest will then also mock Severity.
const mockAddLabel = jest.fn();
const mockAddLink = jest.fn();
const mockAddParameter = jest.fn();
jest.mock('allure-js-commons/dist/src/AllureTest', () => {
  return {
    AllureTest: jest.fn().mockImplementation(() => {
      return {
        constructor: () => {},
        addLabel: mockAddLabel,
        addLink: mockAddLink,
        addParameter: mockAddParameter,
      };
    }),
  };
});

describe('Metadata validation', () => {
  it('Should be empty if no meta is given.', () => {
    const metadata: Metadata = new Metadata();

    expect(metadata).toBeDefined();
    expect(metadata.severity).not.toBeDefined();
    expect(metadata.description).not.toBeDefined();
    expect(metadata.issue).not.toBeDefined();
    expect(metadata.parent_suite).not.toBeDefined();
    expect(metadata.suite).not.toBeDefined();
    expect(metadata.sub_suite).not.toBeDefined();
    expect(metadata.epic).not.toBeDefined();
    expect(metadata.feature).not.toBeDefined();
    expect(metadata.story).not.toBeDefined();
  });
  it('Should add a valid severity', () => {
    const meta = { severity: Severity.NORMAL };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.severity).toBe(Severity.NORMAL);
  });
  it('Should ignore an invalid severity', () => {
    const meta = { severity: 'INVALID' };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.severity).not.toBeDefined();
  });
  it('Should add a valid description', () => {
    const description: string = 'Valid Description';
    const meta = { description };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.description).toBe(description);
  });
  it('Should ignore an invalid description', () => {
    const description: number = 1;
    const meta = { description };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.description).not.toBeDefined();
  });
  it('Should add a valid issue', () => {
    const issue: string = 'Valid Issue';
    const meta = { issue };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.issue).toBe(issue);
  });
  it('Should ignore an invalid issue', () => {
    const issue: number = 1;
    const meta = { issue };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.issue).not.toBeDefined();
  });
  it('Should add a valid BDD', () => {
    const epic: string = 'Valid Epic';
    const feature: string = 'Valid Feature';
    const story: string = 'Valid Story';
    const meta = { epic, feature, story };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.epic).toBe(epic);
    expect(metadata.feature).toBe(feature);
    expect(metadata.story).toBe(story);
  });
  it('Should ignore an invalid BDD', () => {
    const epic: number = 1;
    const feature: number = 2;
    const story: number = 3;
    const meta = { epic, feature, story };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.epic).not.toBeDefined();
    expect(metadata.feature).not.toBeDefined();
    expect(metadata.story).not.toBeDefined();
  });
  it('Should add a valid suite to the correct variable', () => {
    const suite: string = 'Valid Suite';
    const meta = { suite };

    const metadataTest: Metadata = new Metadata(meta, true);
    const metadataGroup: Metadata = new Metadata(meta, false);

    expect(metadataTest.sub_suite).toBe(suite);
    expect(metadataGroup.parent_suite).toBe(suite);
  });
  it('Should not add invalid suite', () => {
    const suite: number = 1;
    const meta = { suite };

    const metadataTest: Metadata = new Metadata(meta, true);
    const metadataGroup: Metadata = new Metadata(meta, false);

    expect(metadataTest.sub_suite).not.toBeDefined();
    expect(metadataTest.parent_suite).not.toBeDefined();
    expect(metadataGroup.sub_suite).not.toBeDefined();
    expect(metadataGroup.parent_suite).not.toBeDefined();
  });
  it('Should ignore an invalid suite', () => {
    const test: string = 'test';
    const test2: number = 1;
    const meta = { test, test2 };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.otherMeta.size).toBe(1);
  });
  it('Should add a valid otherMeta', () => {
    const test: string = 'test';
    const test2: string = 'test2';
    const meta = { test, test2 };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.otherMeta.size).toBe(2);
  });
  it('Should ignore an invalid otherMeta', () => {
    const test: string = 'test';
    const test2: number = 1;
    const meta = { test, test2 };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.otherMeta.size).toBe(1);
  });
});

describe('Metadata merging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should give priority to test than group metadata', () => {
    const test: AllureTest = new AllureTest(null);
    const localMeta = {
      severity: Severity.NORMAL,
      issue: 'Local issue',
      description: 'Local description',
      otherMeta: 'Local otherMeta',
      epic: 'Local epic',
      feature: 'Local feature',
      story: 'Local story',
      suite: 'Local Suite',
    };
    const localMetaData: Metadata = new Metadata(localMeta, true);
    const groupMeta = {
      severity: Severity.BLOCKER,
      issue: 'Group issue',
      description: 'Group description',
      otherMeta: 'Group otherMeta',
      epic: 'Group epic',
      feature: 'Group feature',
      story: 'Group story',
      suite: 'Group Suite',
    };
    const groupMetaData: Metadata = new Metadata(groupMeta);
    localMetaData.suite = 'Local Suite';

    localMetaData.addMetadataToTest(test, groupMetaData);

    expect(localMetaData.description).toBe(localMeta.description);
    expect(localMetaData.issue).toBe(localMeta.issue);
    expect(localMetaData.severity).toBe(localMeta.severity);
    expect(localMetaData.otherMeta.get('otherMeta')).toBe(localMeta.otherMeta);
    expect(localMetaData.epic).toBe(localMeta.epic);
    expect(localMetaData.feature).toBe(localMeta.feature);
    expect(localMetaData.story).toBe(localMeta.story);

    // Suite is dependant on if it is a test or group suite and should be present within both.
    expect(localMetaData.sub_suite).toBe(localMeta.suite);
    expect(localMetaData.suite).toBe('Local Suite');
    expect(localMetaData.parent_suite).toBe(groupMeta.suite);

    expect(mockAddParameter).toHaveBeenCalledTimes(1);
    expect(mockAddLabel).toHaveBeenCalledTimes(9);
    expect(mockAddLink).toHaveBeenCalledTimes(1);
  });
  it('Should use group metadata if local is missing them', () => {
    const test: AllureTest = new AllureTest(null);
    const localMetaData: Metadata = new Metadata();
    const groupMeta = {
      severity: Severity.BLOCKER,
      issue: 'Group issue',
      description: 'Group description',
      otherMeta: 'Group otherMeta',
      epic: 'Group epic',
      feature: 'Group feature',
      story: 'Group story',
      suite: 'Group Suite',
    };
    const groupMetaData: Metadata = new Metadata(groupMeta);
    groupMetaData.suite = 'Group Suite';

    localMetaData.addMetadataToTest(test, groupMetaData);

    expect(localMetaData.description).toBe(groupMeta.description);
    expect(localMetaData.issue).toBe(groupMeta.issue);
    expect(localMetaData.severity).toBe(groupMeta.severity);
    expect(localMetaData.otherMeta.get('otherMeta')).toBe(groupMeta.otherMeta);
    expect(localMetaData.epic).toBe(groupMeta.epic);
    expect(localMetaData.feature).toBe(groupMeta.feature);
    expect(localMetaData.story).toBe(groupMeta.story);

    // Suite is dependant on if it is a test or group suite and sub_suite should be empty if no local suite is given.
    expect(localMetaData.sub_suite).not.toBeDefined();
    expect(localMetaData.suite).toBe('Group Suite');
    expect(localMetaData.parent_suite).toBe(groupMeta.suite);

    expect(mockAddParameter).toHaveBeenCalledTimes(1);
    expect(mockAddLabel).toHaveBeenCalledTimes(8); // One less than above test because sub_suite is not defined
    expect(mockAddLink).toHaveBeenCalledTimes(1);
  });
  it('Should only add metadata if it is defined', () => {
    const test: AllureTest = new AllureTest(null);
    const localMetaData: Metadata = new Metadata();
    const groupMetaData: Metadata = new Metadata();

    localMetaData.addMetadataToTest(test, groupMetaData);

    // No calls to AllureTest functions have been made if there is no metadata, execept for a default severity label.
    expect(mockAddParameter).toHaveBeenCalledTimes(0);
    expect(mockAddLabel).toHaveBeenCalledTimes(3);
    expect(mockAddLink).toHaveBeenCalledTimes(0);
  });
  it('Should validate if the groupMetadata object is valid', () => {
    const test: AllureTest = new AllureTest(null);
    const localMetaData: Metadata = new Metadata();
    const groupMetaData: Metadata = null;

    expect(() => {
      localMetaData.addMetadataToTest(test, groupMetaData);
    }).toThrow();
  });
});
