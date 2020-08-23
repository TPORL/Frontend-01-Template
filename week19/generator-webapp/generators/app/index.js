const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.argument('appname', { type: String, required: true })
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'project name',
        default: this.options.appname,
      },
      {
        type: 'input',
        name: 'description',
        message: 'description',
        default: '',
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'keywords',
        default: '',
      },
      {
        type: 'input',
        name: 'author',
        message: 'author',
        default: '',
      },
      {
        type: 'input',
        name: 'license',
        message: 'license',
        default: 'MIT',
      },
      {
        type: 'confirm',
        name: 'useTest',
        message: 'Would you like to use unit test (jest)',
        default: false,
      },
    ])
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('base'),
      this.destinationPath(this.options.appname),
      {
        name: this.answers.name,
      },
      null,
      {
        globOptions: {
          dot: true,
        },
      }
    )

    this.fs.copyTpl(
      this.templatePath('webpack'),
      this.destinationPath(this.options.appname),
      null,
      null,
      {
        globOptions: {
          dot: true,
        },
      }
    )

    this.fs.copyTpl(
      this.templatePath('eslint'),
      this.destinationPath(this.options.appname),
      null,
      null,
      {
        globOptions: {
          dot: true,
        },
      }
    )

    if (this.answers.useTest) {
      this.fs.copyTpl(
        this.templatePath('test'),
        this.destinationPath(this.options.appname),
        null,
        null,
        {
          globOptions: {
            dot: true,
          },
        }
      )
    }

    const pkgJson = {
      name: this.answers.name,
      version: '0.1.0',
      description: this.answers.description,
      scripts: {
        lint: 'eslint src/**/*.js --fix',
        serve: 'webpack-dev-server --config build/webpack.config.dev.js',
        build: 'webpack --config build/webpack.config.prod.js',
      },
      keywords: this.answers.keywords.split(' ').filter((keyword) => keyword),
      author: this.answers.author,
      license: this.answers.license,
      dependencies: {
        ['@babel/runtime']: '^7.11.2',
        ['core-js']: '^3.6.5',
      },
      devDependencies: {
        ['@babel/core']: '^7.11.1',
        ['@babel/plugin-transform-runtime']: '^7.11.0',
        ['@babel/preset-env']: '^7.11.0',
        ['babel-loader']: '^8.1.0',
        ['css-loader']: '^4.2.1',
        ['eslint']: '^7.7.0',
        ['eslint-config-prettier']: '^6.11.0',
        ['eslint-plugin-prettier']: '^3.1.4',
        ['html-webpack-plugin']: '^4.3.0',
        ['prettier']: '^2.0.5',
        ['webpack']: '^4.44.1',
        ['webpack-cli']: '^3.3.12',
        ['webpack-dev-server']: '^3.11.0',
      },
    }

    if (this.answers.useTest) {
      pkgJson.scripts['test'] = 'jest --coverage'
      pkgJson.devDependencies['babel-jest'] = '^26.3.0'
      pkgJson.devDependencies['jest'] = '^26.4.0'
    }

    this.fs.extendJSON(
      this.destinationPath(`${this.options.appname}/package.json`),
      pkgJson
    )
  }

  install() {
    this.npmInstall(null, null, { cwd: this.options.appname })
  }
}
