import { AllureTest } from 'allure-js-commons/dist/src/AllureTest';
import Metadata, { Severity } from '../../src/metadata';
import '../utils/jest-enum-matcher';
// Mock the AllureTest class to be able to test all Metadata functions.
// TODO: Change import to 'allure-js-commons', currently not possible because
// jest will then also mock Severity within Metadata.
const mockAddLabel = jest.fn();
const mockAddLink = jest.fn();
jest.mock('allure-js-commons/dist/src/AllureTest', () => {
  return {
    AllureTest: jest.fn().mockImplementation(() => {
      return {
        constructor: () => {},
        addLabel: mockAddLabel,
        addLink: mockAddLink,
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
  it('Should add a valid story', () => {
    const story: string = 'Valid Story';
    const meta = { story };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.story).toBe(story);
  });
  it('Should ignore an invalid story', () => {
    const story: number = 1;
    const meta = { story };

    const metadata: Metadata = new Metadata(meta);

    expect(metadata.story).not.toBeDefined();
  });
});

describe('Metadata merging', () => {
  beforeEach(() => {
    mockAddLabel.mockClear();
    mockAddLink.mockClear();
  });

  it('Should give priority to test than group metadata', () => {
    const test: AllureTest = new AllureTest(null);
    const localMeta = {
      severity: Severity.NORMAL,
      story: 'Local story',
      description: 'Local description',
    };
    const localMetaData: Metadata = new Metadata(localMeta);
    const groupMeta = {
      severity: Severity.BLOCKER,
      story: 'Group story',
      description: 'Group description',
    };
    const groupMetaData: Metadata = new Metadata(groupMeta);

    localMetaData.addMetadataToTest(test, groupMetaData);

    expect(localMetaData.description).toBe(localMeta.description);
    expect(localMetaData.story).toBe(localMeta.story);
    expect(localMetaData.severity).toBe(localMeta.severity);

    expect(mockAddLabel).toHaveBeenCalledTimes(1);
    expect(mockAddLink).toHaveBeenCalledTimes(1);
  });
  it('Should use group metadata if local is missing them', () => {
    const test: AllureTest = new AllureTest(null);
    const localMetaData: Metadata = new Metadata();
    const groupMeta = {
      severity: Severity.BLOCKER,
      story: 'Group story',
      description: 'Group description',
    };
    const groupMetaData: Metadata = new Metadata(groupMeta);

    localMetaData.addMetadataToTest(test, groupMetaData);

    expect(localMetaData.description).toBe(groupMeta.description);
    expect(localMetaData.story).toBe(groupMeta.story);
    expect(localMetaData.severity).toBe(groupMeta.severity);

    expect(mockAddLabel).toHaveBeenCalledTimes(1);
    expect(mockAddLink).toHaveBeenCalledTimes(1);
  });
  it('Should only add metadata if it is defined', () => {
    const test: AllureTest = new AllureTest(null);
    const localMetaData: Metadata = new Metadata();
    const groupMetaData: Metadata = new Metadata();

    localMetaData.addMetadataToTest(test, groupMetaData);

    // No calls to AllureTest functions have been made if there is no metadata.
    expect(mockAddLabel).toHaveBeenCalledTimes(0);
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
