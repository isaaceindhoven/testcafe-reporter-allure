# Contributing

Thank you for wanting to contribute to this project!

There are multiple ways you can help improve this package: Reporting bug, suggesting features, and contributing code implementing said features and bug requests.

## Reporting bugs

Before submitting a bug request, please check if this bug has already been reported by checking the existing [issues](https://github.com/isaaceindhoven/testcafe-reporter-allure/labels/bug).

Please adhere to the Bug Report template provided in the repository when creating a new issue. This will help us with organizing, reproducing, and ultimately solving the bug.

## Suggesting features

Before submitting a feature suggestion, please check if this feature has already been suggested by checking the existing [issues](https://github.com/isaaceindhoven/testcafe-reporter-allure/labels/feature).

Please adhere to the Feature Request template provided in the repository when creating a new issue. This will help us in organizing, prioritizing, and implementing new features. 

Note that a feature request can have three different  outcomes:
- The feature request is accepted and will be implemented.
- The feature request is accepted; however, the implementation priority is low. With these features, external developers are welcomed to implement this feature themselves and create a Pull Request.
- The feature request is rejected. The suggested feature may be deemed not to be beneficial to the project as a whole if implemented. Pull Requests containing this feature will not be merged. If you feel that this feature should still be implemented, with this being an open-source project, feel free to create a fork with the feature included.

## Creating a pull request

Contributors are welcome to create Pull Requests implementing new features or bug fixes. To ensure that the Pull Request will be merged, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change. 

Please adhere to the Pull Request template provided in the repository when creating a new Pull Request. This will help us with validating the Pull Request. 

To ensure a smooth code review and merging process please check if the Pull Request satisfies the following steps:
- The latest development version has been merged into the feature branch.
- New code or fixed bugs are tested via unit-tests to ensure the code works, and future developers do not accidentally break the code.
- The GitHub Action pipeline concludes successfully:
  - The code follows the style guide used within this project. This can be tested locally by running: `npm run test:lint`.
  - The code passes all unit tests. This can be tested locally by running: `npm run test:unit`.
- The change does not break the example e2e tests. This can be tested locally by running `npm run test:e2e:allure`.

You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.
