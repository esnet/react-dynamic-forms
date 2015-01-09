This repository contains a set of React based forms components which are used within the internal ESDB (ESnet Database) project, but could be used generally by any React based project.

Usage
-----

This repository doesn't currently build a standalone library component.  Instead it provides a top-level file [entry.js](./entry.js), that can be used (via require) in any webpack project (after npm installing this repository).

Examples
--------

To run the examples you first need to run:

```npm install```

This will install the development dependencies into your node_modules directory.

You can then start up the test server, as well as automatic source building, by doing:

```npm start```

And now, for the magic, point your browser to:

http://localhost:8080/webpack-dev-server/

From now on, if you change the source code, webpack will rebuild the examples bundle and the browser will refresh itself. Errors will also be reported in the browser window.
