# Installation

Install with npm:

```sh
npm install --save-dev testcafe-reporter-allure@npm:@isaac.frontend/testcafe-reporter-allure
```

::: tip Note
This package is namespaced. Therefore the following command can be used to install the reporter in a way that TestCafé can detect it.  ([Related issue in TestCafé repository](https://github.com/DevExpress/testcafe/issues/4692))
:::

### Optional
The [Allure Commandline](https://www.npmjs.com/package/allure-commandline) is needed to convert the Allure-Results into an Allure-Report. This package can be installed with the following command:

```sh
npm install --save-dev allure-commandline
```
::: tip Note
The `allure-commandline` npm package is a wrapper around a Java-based utility. The system you are running on needs a Java installation.
:::