// Generated by LiveScript 1.3.1

import request from 'superagent';
import Promise from 'bluebird';
import EventEmitter from 'eventemitter3';

let toString$ = {}.toString;
let auth = {
  token: localStorage.token || null
};

let promisifyReq = function (req) {
  return new Promise((resolve, reject) => {
    return req
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', auth.token ? 'Bearer ' + auth.token : null)
      .end((error, res) => {
        if (error || res.status >= 400) {
          if (res.status === 401) {
            types.session.del();
          }
          return reject(res) || error;
        } else {
          return resolve(res.body);
        }
      });
  });
};

let httpGet = (uri, opts) => {
  return promisifyReq(request.get(uri).query(opts));
};
let httpPost = curry$((uri, data) => {
  return promisifyReq(request.post(uri).send(data));
});
let httpPut = curry$((uri, data) => {
  return promisifyReq(request.put(uri).send(data));
});
let httpDel = (uri) => {
  return promisifyReq(request.del(uri));
};
let url = function (type, id) {
  var parts;
  parts = [module.exports.baseUrl || '/api', type, id].filter(function (it) {
    return it !== undefined;
  });

  return parts.join('/');
};
let statusByName = {
  ok: 200,
  created: 201,
  notAuthorized: 401,
  notFound: 404,
  conflict: 409,
  badRequest: 400
};
let res$ = {};
for (let key in statusByName) {
  const value = statusByName[key];
  res$[value] = key;
}
let statusByNumber = res$;
let baseApi = {
  get(id) {
    var that, this$ = this;
    switch (false) {
    case !(that = this.cache[id]):
      return Promise.resolve(that);
    default:
      return baseApi.doGet.call(this, this.type, id).then(function () {
        return this$.cache[id];
      }).catch((e, a) => console.log(e, a));
    }
  },
  find(opts = {}) {
    return baseApi.doGet.call(this, this.type, void 8, opts);
  },
  update(id, data) {
    var this$ = this;
    return baseApi.doPut.call(this, this.type, id, data).then(function () {
      return this$.cache[id];
    });
  },
  create(data) {
    switch (false) {
    case !(this.findSimilar && this.findSimilar(data)):
      return Promise.reject({
        status: status.conflict,
        message: 'This ' + this.type + ' already exists'
      });
    default:
      return baseApi.doPost.call(this, this.type, data);
    }
  },
  del(id) {
    return baseApi.doDel.call(this, this.type, id);
  },
  doGet(type, id, opts) {
    return httpGet(url(this.type, id), opts).then(d => responseToCaches(type, d));
  },
  doPost(type, data) {
    var this$ = this;
    return httpPost(url(type), data)['catch'](function (it) {
      var status, ref$, data, ref1$;
      status = it.status || ((ref$ = it.body) != null ? ref$.status : void 8);
      data = {
        statusCode: status,
        status: statusByNumber[status],
        message: ((ref1$ = it.body) != null ? ref1$.message : void 8) || statusByName[status]
      };
      throw mergeInto(data, it);
    }).then((d) => responseToCaches(type,d)).then(function (it) {
      return this$.get(it.id);
    });
  },
  doPut(type, id, data) {
    var this$ = this;
    return httpPut(url(this.type, id), data)['catch'](function (it) {
      var status, ref$, data, ref1$;
      status = it.status || it.statusCode || ((ref$ = it.body) != null ? ref$.status : void 8);
      data = {
        statusCode: status,
        status: statusByNumber[status],
        message: ((ref1$ = it.body) != null ? ref1$.message : void 8) || statusByName[status]
      };
      throw mergeInto(data, it);
    }).then((d) => responseToCaches(type,d)).then(function () {
      return this$.get(data.id);
    });
  },
  doDel(type, id) {
    return httpDel(url(type, id));
  }
};
let types = {
  person: {},
  course: {},
  enrollment: {},
  term: {},
  school_year: {},
  assignmentGroup: {},
  assignment: {},
  grade: {},
  school: {},
  account: {}
};
let cacheSet = function (cache, data) {
  switch (false) {
  case !cache[data.id]:
    return mergeInto(data, cache[data.id]);
  case !data.id:
    return cache[data.id] = data;
  default:
    throw new Error('cannot set item without id .' + JSON.stringify(data));
  }
};
let responseToCaches = function (type, data) {
  var i$, len$, item;
  if (data === null) {
    return;
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
    item = data[i$];
    cacheSet(types[type].cache, item);
  }

  return data;
};
let mergeInto = function (source, target) {
  var key, value;
  for (key in source) {
    value = source[key];
    target[key] = (fn$());
  }
  return target;

  function fn$() {
    switch (toString$.call(value).slice(8, -1)) {
    case 'Array':
      return (target[key] || []).concat(value);
    case 'String':
      return value;
    case 'Number':
      return value;
    case 'Null':
      return value;
    case 'Object':
      return mergeInto(value, target[key] || {});
    default:
      return value;
    }
  }
};
for (let i$ in types) {
  (fn$.call(this, i$, types[i$]));
}
types.session = {
  cache: [],
  get() {
    switch (false) {
    case !localStorage.token:
      return localStorage.token;
    default:
      return null;
    }
  },
  del() {
    var ref$;
    return ref$ = localStorage.token, delete localStorage.token, ref$;
  },
  create: function ({
    email, password
  }) {
    return new Promise(function (resolve, reject) {
      return request.post(url('session')).send({
        email: email,
        password: password
      }).set('Accept', 'application/json').set('Content-Type', 'application/json').end(function (error, resp) {
        var statusCode, message, ref$;
        if (error || resp === null || (resp != null ? resp.status : void 8) >= 400) {
          statusCode = (resp != null ? resp.satus : void 8) || 400;
          message = (resp != null ? (ref$ = resp.body) != null ? ref$.message : void 8 : void 8) || statusByNumber[statusCode];
          return reject({
            statusCode: statusCode,
            message: message
          });
        } else {
          auth.token = resp != null ? resp.body.token : void 8;
          types.session.cache[0] = resp != null ? resp.body : void 8;
          return resolve(resp);
        }
      });
    });
  }
};
types.auth = auth;
module.exports = types;

function curry$(f, bound) {
  var context,
    _curry = function (args) {
      return f.length > 1 ? function () {
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
          f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
  return _curry();
}

function fn$(key, thing) {
  thing.events = new EventEmitter();
  thing.cache = {};
  thing.type = key;
  thing.get = function (id) {
    return baseApi.get.call(this, id);
  };
  thing.find = function (opts) {
    return baseApi.find.call(this, opts);
  };
  thing.create = function (data) {
    return baseApi.create.call(this, data).then((it) => {
      this.events.emit('change', this.cache);
      return it;
    });
  };
  thing.update = function (id, data) {
    return baseApi.update.call(this, id, data).then(() => {
      return this.events.emit('change', this.cache);
    });
  };
  thing.del = function (id) {
    return baseApi.del.call(this, id)
      .then(() => {
        delete this.cache[id];
        this.events.emit('change', this.cache);
      }).return(true);
  };
}
