const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Your project title',
      },
    ])
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath(`${this.answers.title}/public/index.html`),
      { title: this.answers.title }
    )

    const packageJSON = {
      dependencies: {
        react: '^16.13.1',
      },
      devDependencies: {
        eslint: '^7.6.0',
      },
    }

    this.fs.extendJSON(
      this.destinationPath(`${this.answers.title}/package.json`),
      packageJSON
    )

    // this.npmInstall(['react'], { 'save-dev': true })
    // this.npmInstall(['eslint'], { dev: true })
  }
}
