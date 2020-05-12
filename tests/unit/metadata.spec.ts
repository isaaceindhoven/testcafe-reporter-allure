import { AllureTest } from 'allure-js-commons/dist/src/AllureTest';
import Metadata, { Severity } from '../../src/metadata';
import '../utils/jest-enum-matcher';
// Mock the AllureTest class to be able to test all Metadata functions.
// TODO: Change import to 'allure-js-commons', currently not possible because
// jest will then also mock Severity within Metadata.
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
  it('Should add a valid otherMeta', () => {
    const test: string = 'test';
    const test2: string = 'test2';
    const meta = { test, test2 };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.otherMeta.size).toBe(2);
  });
  it('Should ignore an invalid  otherMeta', () => {
    const test: string = 'test';
    const test2: number = 1;
    const meta = { test, test2 };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.otherMeta.size).toBe(1);
  });
});

describe('Metadata merging', () => {
  beforeEach(() => {
    mockAddLabel.mockClear();
    mockAddLink.mockClear();
    mockAddParameter.mockClear();
  });

  it('Should give priority to test than group metadata', () => {
    const test: AllureTest = new AllureTest(null);
    const localMeta = {
      severity: Severity.NORMAL,
      issue: 'Local issue',
      description: 'Local description',
      otherMeta: 'Local otherMeta',
    };
    const localMetaData: Metadata = new Metadata(localMeta);
    const groupMeta = {
      severity: Severity.BLOCKER,
      issue: 'Group issue',
      description: 'Group description',
      otherMeta: 'Group otherMeta',
    };
    const groupMetaData: Metadata = new Metadata(groupMeta);

    localMetaData.addMetadataToTest(test, groupMetaData);

    expect(localMetaData.description).toBe(localMeta.description);
    expect(localMetaData.issue).toBe(localMeta.issue);
    expect(localMetaData.severity).toBe(localMeta.severity);
    expect(localMetaData.otherMeta.get('otherMeta')).toBe(localMeta.otherMeta);

    expect(mockAddParameter).toHaveBeenCalledTimes(1);
    expect(mockAddLabel).toHaveBeenCalledTimes(1);
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
    };
    const groupMetaData: Metadata = new Metadata(groupMeta);

    localMetaData.addMetadataToTest(test, groupMetaData);

    expect(localMetaData.description).toBe(groupMeta.description);
    expect(localMetaData.issue).toBe(groupMeta.issue);
    expect(localMetaData.severity).toBe(groupMeta.severity);
    expect(localMetaData.otherMeta.get('otherMeta')).toBe(groupMeta.otherMeta);

    expect(mockAddParameter).toHaveBeenCalledTimes(1);
    expect(mockAddLabel).toHaveBeenCalledTimes(1);
    expect(mockAddLink).toHaveBeenCalledTimes(1);
  });
  it('Should only add metadata if it is defined', () => {
    const test: AllureTest = new AllureTest(null);
    const localMetaData: Metadata = new Metadata();
    const groupMetaData: Metadata = new Metadata();

    localMetaData.addMetadataToTest(test, groupMetaData);

    // No calls to AllureTest functions have been made if there is no metadata, execept for a default severity label.
    expect(mockAddParameter).toHaveBeenCalledTimes(0);
    expect(mockAddLabel).toHaveBeenCalledTimes(1);
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
