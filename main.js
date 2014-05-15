// Generated by CoffeeScript 1.7.1
(function() {
  var DEFAULT_OPTIONS, SUPPORTED_EXTENSIONS, childProcess, flattenArguments, fs, spawnCutyCapt, transformArguments, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  fs = require('fs');

  childProcess = require('child_process');

  DEFAULT_OPTIONS = {
    java: true,
    plugins: true,
    privateBrowsing: false,
    jsCanOpenWindows: false,
    jsCanAccessClipboard: false
  };

  SUPPORTED_EXTENSIONS = ['svg', 'ps', 'pdf', 'itext', 'html', 'rtree', 'png', 'jpeg', 'mng', 'tiff', 'gif', 'bmp', 'ppm', 'xbm', 'xpm'];

  transformArguments = function(options) {
    var cmdKey, cmdValue, key, value;
    if (options == null) {
      options = {};
    }
    for (key in DEFAULT_OPTIONS) {
      value = DEFAULT_OPTIONS[key];
      if (!(key in options)) {
        options[key] = value;
      }
    }
    for (key in options) {
      value = options[key];
      cmdKey = '--' + key.replace(/[A-Z]/g, function(char) {
        return "-" + (char.toLowerCase());
      });
      cmdValue = value === true ? 'on' : value === false ? 'off' : value === null ? null : value.toString();
      delete options[key];
      options[cmdKey] = cmdValue;
    }
    return options;
  };

  flattenArguments = function(args) {
    var flattened, key, value;
    flattened = [];
    for (key in args) {
      value = args[key];
      if (value === null) {
        flattened.push("" + key);
      } else {
        flattened.push("" + key + "=" + value);
      }
    }
    return flattened;
  };

  spawnCutyCapt = function(path, site, out, options, cb) {
    var cutyCapt, key, tmpOptions, value, _ref;
    if (options == null) {
      options = {};
    }
    if (!path) {
      throw new Error('path must be set');
    }
    if (!site) {
      throw new Error('site must be set');
    }
    if (!out) {
      throw new Error('out must be set');
    }
    if (arguments.length === 4 && typeof options === 'function') {
      cb = options;
      options = {};
    }
    tmpOptions = {};
    for (key in options) {
      value = options[key];
      tmpOptions[key] = value;
    }
    options = tmpOptions;
    _ref = [site, out], options.url = _ref[0], options.out = _ref[1];
    options = transformArguments(options);
    options = flattenArguments(options);
    cutyCapt = childProcess.spawn(path, options);
    cutyCapt.stderr.on('data', function(data) {
      if (data.toString().match(/^execvp/)) {
        throw new Error('error starting CutyCapt, please ensure path is correctly set');
      }
    });
    return cutyCapt.on('exit', function(code) {
      var error;
      if (code) {
        error = new Error("CutyCapt exited with return value " + code);
      }
      return typeof cb === "function" ? cb(error || false) : void 0;
    });
  };

  exports.path = 'CutyCapt';

  exports.options = {};

  exports.capture = function(site, out, cb) {
    var extension;
    if (!site) {
      throw new Error('site must be set');
    }
    if (!out) {
      throw new Error('out must be set');
    }
    if (!url.parse(site).protocol) {
      site = "http://" + site;
    }
    extension = out.substring(out.lastIndexOf('.') + 1 || out.length);
    if (__indexOf.call(SUPPORTED_EXTENSIONS, extension) < 0) {
      throw new Error("out must have one of the following extentions: " + (SUPPORTED_EXTENSIONS.join(', ')));
    }
    return spawnCutyCapt(exports.path, site, out, exports.options, cb);
  };

}).call(this);
