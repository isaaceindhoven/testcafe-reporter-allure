# Jenkins

Because the testcafe-reporter-allure package used Allure to visualize the reports, it is also compatible with the [Allure-Jenkins](https://plugins.jenkins.io/allure-jenkins-plugin/) allowing for the reports to be added to each pipeline run.

An example [Jenkinsfile](https://github.com/isaaceindhoven/testcafe-reporter-allure/blob/master/examples/base-implementation/Jenkinsfile) implementing this can be found in the [examples/base-implementation](https://github.com/isaaceindhoven/testcafe-reporter-allure/tree/master/examples/base-implementation). These pipeline stages can be added to your own projects Jenkinsfile to implement the plugins features. Within the `test:e2e` stage, the environment property `TESTCAFE_BROWSER` can be set to define the browser used within the test run. 

Do note that these browsers behave differently because they are running within a docker container. For example, Chrome needs the `--no-sandbox` tag to function properly; otherwise, the following error will occur: `Error: Unable to establish one or more of the specified browser connections. This can be caused by network issues or remote device failure.` This issue is further detailed [here](https://github.com/DevExpress/testcafe/issues/1133#issuecomment-350775990).

To avoid running the browsers within the docker container, using a service like [BrowserStack]( https://devexpress.github.io/testcafe/documentation/guides/concepts/browsers.html#browsers-in-cloud-testing-services) is recommended.

Lastly, all browsers have to be run in `:headless` mode, as can be seen within the Jenkinsfile example.