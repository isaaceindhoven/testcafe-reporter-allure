module.exports = () => {
  return {
    async reportTaskStart(): Promise<void> {
      this.write('Task has been started').newline();
    },

    async reportFixtureStart(name: string): Promise<void> {
      this.write(`Fixture "${name}" has been started`).newline();
    },

    async reportTestStart(name: string): Promise<void> {
      this.write(`Test "${name}" has been started`).newline();
    },

    async reportTestDone(name: string): Promise<void> {
      this.write(`Test "${name}" has been finished`).newline();
    },

    async reportTaskDone(): Promise<void> {
      this.write('Task has been completed').newline();
    },
  };
};
