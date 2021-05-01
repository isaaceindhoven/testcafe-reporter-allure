import * as globby from 'globby';
import { join } from 'path';
import { readJSON } from 'fs-extra';
import { orderBy } from 'lodash';

const mapAttachments = (attachments: any[]) => attachments.map(({ source, ...attachment }) => attachment);

const mapStatusDetails = ({ trace, ...statusDetails }) => statusDetails;

const mapResults = (item: any) => {
  const { status, stage, parameters, labels, links, name, fullName, description } = item;
  let { attachments, steps, statusDetails } = item;

  if (attachments) attachments = mapAttachments(attachments);
  if (statusDetails) statusDetails = mapStatusDetails(statusDetails);
  if (steps) steps = mapResults(steps);

  return {
    status,
    statusDetails,
    stage,
    steps,
    attachments,
    parameters,
    labels,
    links,
    name,
    fullName,
    description,
  };
};

const setup = async () => {
  const files = await globby(join(process.cwd(), 'allure', 'allure-results', '*.json'));
  const allResults = await Promise.all(
    files.map(async (file) => {
      const results = await readJSON(file);
      return mapResults(results);
    }),
  );
  return orderBy(allResults, ['fullName', 'name'], ['asc', 'asc']);
};

test('Allure result snaphots', async () => {
  const results = await setup();
  expect(results).toMatchSnapshot();
});
