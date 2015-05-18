(function(global) {
	var Complex = (function(buildOptions) {
		'use strict';

		var math = (function () {
			var math;

			math = {
				sinh: Math.sinh || function(angle) {
					var temp = Math.exp(angle);
					return (temp - 1/temp) / 2;
				},

				cosh: Math.cosh || function(angle) {
					var temp = Math.exp(angle);
					return (temp + 1/temp) / 2;
				},

				sin: Math.sin,
				cos: Math.cos
			};

			return math;
		})();

		var Enum = {
			errors: {
				ONLY_COMPLEX_LIKE: 'Arguments should be numbers or Complex-like',
				WRONG_ARGUMENTS_NUMBER: 'Must be more than one arguments',
				WRONG_OPERATOR: 'Operator must be a function'
			}
		};

		function parsePart (string) {
			var number = parseFloat(string);
			if (isNaN(number)) {
				if (string.indexOf('-') !== -1) {
					number = -1;
				} else {
					number = 1;
				}
			}
			return number;
		}

		function registerAliases (publics, map, properties) {
			var methodName, i, aliases, alias;
			for (methodName in map) {
				aliases = map[methodName];
				for (i = 0; i < aliases.length; i++) {
					alias = aliases[i];

					if (properties && properties[methodName]) {
						Object.defineProperty(publics, alias, properties[methodName]);
					} else {
						publics[alias] = publics[methodName];
					}
				}
			}
		}

		function parseAndRun (callback, a, b) {
			var re = 0;
			var im = 0;

			var values;
			var value;
			var i;

			if (a instanceof Complex) {
				re = a._re;
				im = a._im;
			} else if ((typeof a == 'number' || a == null) && (typeof b == 'number' || b == null)) {
				re = a || re;
				im = b || im;
			} else if (typeof a == 'string') {
				values = a.match(/([-+]?(?:\d*\.?\d+)?i)|([-+]?\d*\.?\d+)/g);
				for (i = 0; i < values.length; i++) {
					value = parsePart(values[i]);
					if (values[i].indexOf('i') !== -1) {
						im += value;
					} else {
						re += value;
					}
				}
			} else if (Object.prototype.toString.call(a) == '[object Array]') {
				re = +a[0];
				im = +a[1];
			} else {
				throw new TypeError(Enum.errors.ONLY_COMPLEX_LIKE);
			}

			return callback(re, im);
		}

		function wrapToParseArgs (method) {
			return function wrap (a, b) {
				return parseAndRun(method.bind(this), a, b);
			};
		}

		function wrapOneArgumentMethods (method) {
			return calcExpr.bind(null, method);
		}

		function calcExpr (operator, firstOperand) {
			var REST_INDEX = 2;

			if (typeof operator != 'function') {
				throw new TypeError(Enum.errors.WRONG_OPERATOR);
			}

			if (arguments.length < REST_INDEX) {
				throw new RangeError(Enum.errors.WRONG_ARGUMENTS_NUMBER);
			}

			var i;
			var length = arguments.length;

			var operands = new Array(length - REST_INDEX);
			var result = new Complex(firstOperand);

			for (i = REST_INDEX; i < length; i++) {
				operator.call(result, arguments[i]);
			}

			return result;
		}

		function merge (object, source, customizer) {
			var key;

			for (key in source) {
				object[key] = typeof customizer == 'function' ? customizer(source[key]) : source[key];
			}
		}

		function Complex (re, im) {
			if (this instanceof Complex) {
				this.set.call(this, re, im);
			} else {
				return calcExpr.apply(null, arguments);
			}
		}

		function ComplexFromPolar (abs, arg) {
			this.re = abs * math.cos(arg);
			this.im = abs * math.sin(arg);
		}

		var statics = {
			fromPolar: ComplexFromPolar
		};

		var publics = {
			toString: function() {
				var text = '',
					re = this.re,
					im = this.im;

				if (re !== 0) {
					text += re;
				}

				if (im > 0) {
					text += (re === 0 ? '' : '+') + (im === 1 ? '' : im) + 'i';
				} else if (im < 0) {
					text += im + 'i';
				}

				return text || '0';
			},

			toArray: function() {
				return [this.re, this.im];
			},

			clone: function() {
				return new Complex(this);
			},

			conj: function() {
				this.im = -this.im;
				return this;
			},

			sqrt: function() {
				var r = this.abs,
					re, im;

				if (this.re >= 0) {
					re = 0.5 * Math.sqrt(2 * (r + this.re));
				} else {
					re = Math.abs(this.im) / Math.sqrt(2 * (r - this.re));
				}

				if (this.re <= 0) {
					im = 0.5 * Math.sqrt(2 * (r - this.re));
				} else {
					im = Math.abs(this.im) / Math.sqrt(2 * (r + this.re));
				}

				if (this.im >= 0) {
					this.re = re;
					this.im = im;
				} else {
					this.re = re;
					this.im = -im;
				}

				return this;
			},

			neg: function() {
				this.re = -this.re;
				this.im = -this.im;
				return this;
			},

			sin: function() {
				var re = this.re,
					im = this.im;

				this.re = math.sin(re) * math.cosh(im);
				this.im = math.cos(re) * math.sinh(im);
				return this;
			},

			cos: function() {
				var re = this.re,
					im = this.im;

				this.re = math.cos(re) * math.cosh(im);
				this.im = - math.sin(re) * math.sinh(im);
				return this;
			},

			sinh: function() {
				var re = this.re,
					im = this.im;

				this.re = math.sinh(re) * math.cos(im);
				this.im = math.cosh(re) * math.sin(im);
				return this;
			},

			cosh: function() {
				var re = this.re,
					im = this.im;

				this.re = math.cosh(re) * math.cos(im);
				this.im = math.sinh(re) * math.sin(im);
				return this;
			},

			tan: function() {
				var re = this.re,
					im = this.im,
					divider = math.cos(2 * re) + math.cosh(2 * im);

				this.re = math.sin(2 * re) / divider;
				this.im = math.sinh(2 * im) / divider;
				return this;
			},

			tanh: function() {
				var re = this.re,
					im = this.im,
					divider = math.cosh(2 * a) + math.cos(2 * b);

				this.re = math.sinh(2 * re) / divider;
				this.im = math.sin(2 * im) / divider;
				return this;
			},

			log: function(base) {
				var re, im;

				base = base || 0;

				re = Math.log(this.abs);
				im = this.arg + base * 2 * Math.PI;

				this.re = re;
				this.im = im;

				return this;
			},

			exp: function() {
				Complex.fromPolar.call(this, Math.exp(this.re), this.im);

				return this;
			}
		};

		var publicsWithComplexArg = {
			set: function(re, im) {
				this._re = re;
				this._im = im;

				return this;
			},

			add: function(re, im) {
				this._re += re;
				this._im += im;

				return this;
			},

			sub: function(re, im) {
				this._re -= re;
				this._im -= im;

				return this;
			},

			mul: function(re, im) {
				var x, y;

				if (im === 0) {
					this._re *= re;
					this._im *= re;
				} else {
					x = this._re;
					y = this._im;

					this._re = x * re - y * im;
					this._im = y * re + x * im;
				}

				return this;
			},

			div: function(re, im) {
				var x, y, divider;

				if (im === 0) {
					this._re /= re;
					this._im /= re;
				} else {
					x = this._re;
					y = this._im;

					divider = re * re + im * im;

					if (x === 1 && y === 0) {
						this._re = re / divider;
						this._im = -(im / divider);
					} else {
						this._re = (x * re + y * im) / divider;
						this._im = (y * re - x * im) / divider;
					}
				}

				return this;
			},

			dot: function(re, im) {
				return this._re * re + this._im * im;
			},

			pow: function(re, im) {
				var x = new Complex(Math.log(this.abs), this.arg).mul(re, im),
					r = Math.exp(x.re);

				this._re = r * math.cos(x.im);
				this._im = r * math.sin(x.im);

				return this;
			},

			equal: function(re, im) {
				return this._im === im && this._re === re;
			}
		};

		var properties = {
			re: {
				get: function () {
					return this._re;
				},

				set: function (number) {
					this._re = number;
				},
			},

			im: {
				get: function () {
					return this._im;
				},

				set: function (number) {
					this._im = number;
				}
			},

			abs: {
				get: function () {
					return Math.sqrt(this.re * this.re + this.im * this.im);
				},

				set: function (abs) {
					Complex.fromPolar.call(this, abs, this.arg);
				}
			},

			arg: {
				get: function () {
					return Math.atan2(this.im, this.re);
				},

				set: function (arg) {
					Complex.fromPolar.call(this, this.abs, arg);
				}
			}

		};

		var aliases = {
			clone: ['copy'],
			re: ['x'],
			im: ['y'],
			arg: ['angle', 'phase'],
			abs: ['magnitude']
		};

		// Building

		function build (options) {
			var constructor = options.constructors[0]; // First constructor is main
			var length = options.constructors.length;
			var i;

			options.publics.constructor = constructor;

			for (i = 0; i < length; i++) {
				options.constructors[i].prototype = options.publics;
			}

			if (options.statics) {
				merge(constructor, options.statics);
			}

			if (options.publics) {

				if (options.properties) {
					Object.defineProperties(options.publics, options.properties);
				}

				if (options.aliases) {
					registerAliases(options.publics, options.aliases, options.properties);
				}
			}

			return constructor;
		}

		merge(publics, publicsWithComplexArg, wrapToParseArgs);
		merge(statics, {
			sum: publics.add,
			diff: publics.sub,
			prod: publics.mul,
			quot: publics.div
		}, wrapOneArgumentMethods);

		return build({
			constructors: [Complex, ComplexFromPolar],
			publics: publics,
			statics: statics,
			properties: properties,
			aliases: aliases
		});
	})({});

	if (typeof module != 'undefined' && module.exports) {
		module.exports = Complex;
	} else {
		global.Complex = Complex;
	}
}).call(null, this);
