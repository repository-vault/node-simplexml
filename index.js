"use strict";

const fs    = require('fs');
const parse = require('xml-parser');


const SYMB_PARENT = Symbol("parent");
const SYMB_BODY   = Symbol("body");


class Config {

  constructor(config, parent) {

    var subfile = config.attributes && config.attributes["file"];
    if(subfile) {
      let [subpath, node] = subfile.split(" ", 2);
      var sub = Config.load_file(subpath);
      if(node)
        sub = sub[node];
      sub[SYMB_BODY].attributes = Object.assign({}, config.attributes, sub[SYMB_BODY].attributes);
      delete sub[SYMB_BODY].attributes["file"];
      return sub;
    }

    var ret = new Proxy(this, this);

    this[SYMB_BODY]   = config;
    this[SYMB_PARENT] = parent;
    return ret;
  }


  get(obj, prop) {
    if(prop == SYMB_BODY)
      return this[SYMB_BODY];

    if(prop == Symbol.iterator) {
      //then we must have siblings
      var self = this;

      return function* () {
        for(var child of self[SYMB_PARENT][SYMB_BODY].children) {
          if(child.name == self[SYMB_BODY].name)
            yield new Config(child, self[SYMB_PARENT]);
        }
      };
    }

    //cast as string
    if(prop === Symbol.toPrimitive) {
      var args = [], list = this[SYMB_BODY].attributes || {};
      for(var k in list)
        args.push(`${k}="${list[k]}"`);

      return () => `<${this[SYMB_BODY].name}${args.length ? ' ' : ''}${args.join(' ')}/>`;
    }

    if(this[SYMB_BODY].attributes) {

      if(this[SYMB_BODY].attributes[prop])
        return this[SYMB_BODY].attributes[prop];
    }


    if(this[SYMB_BODY].children) {

      for(var key in this[SYMB_BODY].children) {
        let child = this[SYMB_BODY].children[key];
        if(child.name == prop)
          return new Config(child, this);
      }
    }

    return null;
    //return new Config({name : prop});
  }



  static load_file(config_path) {
    if(Config.cache[config_path])
      return Config.cache[config_path];

    var body = fs.readFileSync(config_path, 'utf-8');
    var bar = Config.load_string(body);

    Config.cache[config_path] = bar;
    return bar;
  }

  static load_string(body) {

    var config = new Config(parse(body).root);
    return config;
  }
}


Config.cache = {};
module.exports = Config;
