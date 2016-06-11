
  var Getopt, ParsedOption,
    __hasProp = {}.hasOwnProperty,
    __matches = null;

  ParsedOption = (function() {

    function ParsedOption(argv, options) {
      this.argv = argv;
      this.options = options;
    }

    ParsedOption.prototype.empty = function() {
      var k, v, _ref;
      if (this.argv.length) {
        return false;
      }
      _ref = this.options;
      for (k in _ref) {
        if (!__hasProp.call(_ref, k)) continue;
        v = _ref[k];
        return false;
      }
      return true;
    };

    return ParsedOption;

  })();

  Getopt = (function() {

    Getopt.HAS_ARGUMENT = true;

    Getopt.NO_ARGUMENT = false;

    Getopt.MULTI_SUPPORTED = true;

    Getopt.SINGLE_ONLY = false;

    Getopt.VERSION = '0.2.3';

    function Getopt(options) {
      var comment, definition, has_argument, long_name, multi_supported, name, option, optional, short_name, _i, _len, _ref;
      this.options = options;
      this.short_options = {};
      this.long_options = {};
      this.long_names = [];
      this.events = {};
      this.event_names = [];
      this.errorFunc = function(e) {
        throw (e.message);
        //console.log(e.message);
        //return sys.exit(1);
      };
      if (process.argv[1]) {
        this.help = "Usage: ic9 " + (process.argv[1].match(/(?:.*[\/\\])?(.*)$/)[1]) + "\n\n[[OPTIONS]]\n";
      } else {
        this.help = "[[OPTIONS]]";
      }
      _ref = this.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        short_name = option[0], definition = option[1], comment = option[2];
        if (comment == null) {
          comment = '';
        }
        if (definition == null) {
          definition = '';
        }
        if (short_name == null) {
          short_name = '';
        }
        (__matches = definition.match(/^([\w\-]*)/));
        long_name = __matches[1];
        has_argument = definition.indexOf('=') !== -1;
        multi_supported = definition.indexOf('+') !== -1;
        optional = /\[=.*?\]/.test(definition);
        long_name = long_name.trim();
        short_name = short_name.trim();
        if (optional && short_name) {
          throw new Error('optional argument can only work with long option');
        }
        if (!long_name) {
          long_name = short_name;
        }
        name = long_name;
        if (long_name === '') {
          throw new Error("empty option found. the last option name is " + (this.long_names.slice(-1)));
        }
        if (this.long_options[long_name] == null) {
          this.long_names.push(long_name);
          this.long_options[long_name] = {
            name: name,
            short_name: short_name,
            long_name: long_name,
            has_argument: has_argument,
            multi_supported: multi_supported,
            comment: comment,
            optional: optional,
            definition: definition
          };
        } else {
          throw new Error("option " + long_name + " redefined.");
        }
        if (short_name !== '') {
          if (short_name.length !== 1) {
            throw new Error('short option must be single characters');
          }
          this.short_options[short_name] = this.long_options[long_name];
        }
      }
      this;
    }

    Getopt.prototype.on = function(name, cb) {
      this.events[name] = cb;
      this.event_names.push(name);
      return this;
    };

    Getopt.prototype.emit = function(name, cb) {
      if (this.events[name]) {
        return this.events[name].call(this, this.parsedOption.argv, this.parsedOption.options);
      } else {
        throw new Error("Getopt trigger '" + name + "' is not found");
      }
    };

    Getopt.prototype.trigger_events_ = function() {
      var name, options, _i, _len, _ref;
      options = this.parsedOption.options;
      _ref = this.event_names;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (options[name] != null) {
          this.emit(name);
        }
      }
      return this;
    };

    Getopt.prototype.save_option_ = function(options, option, argv) {
      var name, names, value, _i, _len, _ref;
      if (option.has_argument) {
        if (argv.length === 0) {
          throw new Error("option " + option.long_name + " need argument");
        }
        value = argv.shift();
      } else {
        value = true;
      }
      names = [option.name];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        if (option.multi_supported) {
          if ((_ref = options[name]) == null) {
            options[name] = [];
          }
          options[name].push(value);
        } else {
          options[name] = value;
        }
      }
      return this;
    };

    Getopt.prototype.parse = function(argv) {
      var arg, i, long_name, option, rt_argv, rt_options, short_name, short_names, value, _i, _len;
      try {
        argv = argv.slice(0);
        rt_options = {};
        rt_argv = [];
        while ((arg = argv.shift()) != null) {
          if ((__matches = arg.match(/^-(\w[\w\-]*)/))) {
            short_names = __matches[1];
            for (i = _i = 0, _len = short_names.length; _i < _len; i = ++_i) {
              short_name = short_names[i];
              option = this.short_options[short_name];
              if (!option) {
                throw new Error("Invalid option " + short_name);
              }
              if (option.has_argument) {
                if (i < arg.length - 2) {
                  argv.unshift(arg.slice(i + 2));
                }
                this.save_option_(rt_options, option, argv);
                break;
              } else {
                this.save_option_(rt_options, option, argv);
              }
            }
          } else if ((__matches = arg.match(/^--(\w[\w\-]*)((?:=.*)?)$/))) {
            long_name = __matches[1];
            value = __matches[2];
            option = this.long_options[long_name];
            if (!option) {
              throw new Error("invalid option " + long_name);
            }
            if (value !== '') {
              value = value.slice(1);
              argv.unshift(value);
            } else if (option.optional) {
              argv.unshift('');
            }
            this.save_option_(rt_options, option, argv);
          } else if (arg === '--') {
            rt_argv = rt_argv.concat(argv);
            break;
          } else {
            rt_argv.push(arg);
          }
        }
      } catch (e) {
        this.errorFunc(e);
      }
      this.parsedOption = new ParsedOption(rt_argv, rt_options);
      this.trigger_events_();
      return this.parsedOption;
    };

    Getopt.prototype.parse_system = function() {
      return this.parse(process.argv.slice(2));
    };

    Getopt.prototype.parseSystem = function() {
      return this.parse_system();
    };

    Getopt.prototype.setHelp = function(help) {
      this.help = help;
      return this;
    };

    Getopt.prototype.getHelp = function() {
      var comment, definition, long_name, opt, option, options, short_name, strs, ws, _i, _len, _ref;
      ws = [];
      options = [];
      _ref = this.long_names;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        long_name = _ref[_i];
        option = this.long_options[long_name];
        short_name = option.short_name, long_name = option.long_name, comment = option.comment, definition = option.definition;
        if (short_name && short_name === long_name) {
          opt = "-" + short_name;
        } else if (short_name) {
          opt = "-" + short_name + ", --" + definition;
        } else {
          opt = "    --" + definition;
        }
        ws[0] = Math.max(ws[0] >> 0, opt.length);
        options.push([opt, comment]);
      }
      strs = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = options.length; _j < _len1; _j++) {
          option = options[_j];
          opt = option[0], comment = option[1];
          while (opt.length < ws[0]) {
            opt += ' ';
          }
          _results.push("  " + opt + "  " + comment);
        }
        return _results;
      })();
      return this.help.replace('[[OPTIONS]]', strs.join("\n"));
    };

    Getopt.prototype.showHelp = function() {
      console.log(this.getHelp());
      return this;
    };

    Getopt.prototype.bindHelp = function(help) {
      if (help) {
        this.setHelp(help);
      }
      this.on('help', function() {
        this.showHelp();
        return sys.exit(0);
      });
      return this;
    };

    Getopt.prototype.getVersion = function() {
      return Getopt.VERSION;
    };

    Getopt.prototype.error = function(errorFunc) {
      this.errorFunc = errorFunc;
      return this;
    };

    Getopt.getVersion = function() {
      return this.VERSION;
    };

    Getopt.create = function(options) {
      return new Getopt(options);
    };

    return Getopt;

  })();