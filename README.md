# Tox client (Electron)
A quick prototype of a Tox client powered by JS running everywhere.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/SkyzohKey/Tox-client
# Go into the repository
cd Tox-client
# Install dependencies and run the app
npm install && npm run dev
```

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/latest).

## Compiling for your OS
You can use any of the following commands to create distributable ready builds.
1. Install `npm install -g electron-packager`

### Linux
```shell
cd Tox-client
npm run build:linux
```

### OSX
```shell
cd Tox-client
npm run build:osx
```

### Windows
```shell
cd Tox-client
npm run build:windows
```

#### License [MIT](LICENSE.md)
