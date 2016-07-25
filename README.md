# Tox client (Electron)
A quick prototype of a Tox client powered by JS running everywhere.

# Screenshots
![Tox client main window screenshot](http://i.imgur.com/y0Jea5J.png)

## To use

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

## Moaaar screenshots!
![Tox client add friend modal screenshot](http://i.imgur.com/csbDNWd.png)

## Compiling for your OS
You can use any of the following commands to create distributable ready builds.

1. Install `npm install -g electron-packager`

###### Linux
```shell
# Go into the repository
cd Tox-client
# Start the build for linux
npm run build:linux
```

###### OSX
```shell
# Go into the repository
cd Tox-client
# Start the build for OSX
npm run build:osx
```

###### Windows
```shell
# Go into the repository
cd Tox-client
# Start the build for Windows
npm run build:windows
```

# License
[The MIT License](LICENSE.md).
