window.Complex = (function() {

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

	function registerAliases (options, properties) {
		var method, i, aliases, alias;
		for (method in options) {
			aliases = options[method];
			for (i = 0; i < aliases.length; i++) {
				alias = aliases[i];

				if (properties[method]) {
					Object.defineProperty(Complex.prototype, alias, properties[method]);
				} else {
					Complex.prototype[alias] = Complex.prototype[method];
				}
			}
		}
	}

	function Complex (re, im) {
		if (typeof re === 'number') {
			this.re = re;
			this.im = im === undefined ? 0 : im;
		} else if (re instanceof Complex) {
			this.re = re.re;
			this.im = re.im;
		}
	}

	Complex.fromPolar = function Complex (abs, arg) {
		this.re = abs * math.cos(arg);
		this.im = abs * math.sin(arg);
	};

	Complex.fromString = function Complex (string) {
		var complexRegexp = /([-+]?(?:\d*\.?\d+)?i)|([-+]?\d*\.?\d+)/g,
			values = string.match(complexRegexp),
			i, value,
			re = 0,
			im = 0;

		for (i = 0; i < values.length; i++) {
			value = parsePart(values[i]);
			if (values[i].indexOf('i') !== -1) {
				im += value;
			} else {
				re += value;
			}
		}

		this.re = re;
		this.im = im;
	};

	Complex.toComplex = function (value) {
		if (value instanceof Complex)  {
			return value;
		} else if (typeof value === 'number') {
			return new Complex(value);
		} else if (typeof value.length !== undefined) {
			return new Complex(value[0], value[1]);
		} else if (typeof value === 'string') {
			return new Complex.fromString(value);
		}
	};

	Complex.prototype =
	Complex.fromPolar.prototype =
	Complex.fromString.prototype = {
		constructor: Complex,

		getVector: function() {
			return [this.re, this.im];
		},

		clone: function() {
			return new Complex(this);
		},

		set: function(re, im) {
			var complex;

			if (typeof re === 'number') {
				im = im === undefined ? 0 : im;
				this.re = re;
				this.im = im;
			} else {
				complex = Complex.toComplex(re);
				this.re = complex.re;
				this.im = complex.im;
			}

			return this;
		},

		add: function(re, im) {
			var complex;

			if (typeof re === 'number') {
				im = im === undefined ? 0 : im;
				this.re += re;
				this.im += im;
			} else {
				complex = Complex.toComplex(re);
				this.re += complex.re;
				this.im += complex.im;
			}

			return this;
		},

		sub: function(re, im) {
			var complex;

			if (typeof re === 'number') {
				im = im === undefined ? 0 : im;
				this.re -= re;
				this.im -= im;
			} else {
				complex = Complex.toComplex(re);
				this.re -= complex.re;
				this.im -= complex.im;
			}

			return this;
		},

		mul: function(re, im) {
			var a, b, c, d, complex;

			if (typeof re === 'number' && (im === undefined || im === 0)) {
				this.re *= re;
				this.im *= re;
			} else {
				complex = re instanceof Complex ? re : new Complex(re, im);
				a = this.re;
				b = this.im;
				c = complex.re;
				d = complex.im;

				this.re = a * c - b * d;
				this.im = b * c + a * d;
			}

			return this;
		},

		div: function(re, im) {
			var a, b, c, d, divider, complex;

			if (typeof re === 'number' && (im === undefined || im === 0)) {
				this.re /= re;
				this.im /= re;
			} else {
				complex = re instanceof Complex ? re : new Complex(re, im);
				a = this.re;
				b = this.im;
				c = complex.re;
				d = complex.im;
				divider = c * c + d * d;

				if (a === 1 && b === 0) {
					this.re = c / divider;
					this.im = -(d / divider);
				} else {
					this.re = (a * c + b * d) / divider;
					this.im = (b * c - a * d) / divider;
				}
			}

			return this;
		},

		dot: function(re, im) {
			if (typeof re === 'number') {
				im = im === undefined ? 0 : im;
				return this.re * re + this.im * im;
			}
			return this.re * number.re + this.im * number.im;
		},

		conj: function() {
			this.im = -this.im;
			return this;
		},

		pow: function(re, im) {
			var x = new Complex(Math.log(this.abs), this.arg).mul(re, im),
				r = Math.exp(x.re);

			this.re = r * math.cos(x.im);
			this.im = r * math.sin(x.im);

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
		},

		is: function(re, im) {
			var result = false,
				complex;

			if (typeof re === 'number') {
				im = im === undefined ? 0 : im;
				result = this.im === im && this.re === re;
			} else {
				complex = Complex.toComplex(re);
				result = this.im === complex.im && this.re === complex.re;
			}

			return result;
		},

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
		is: ['equals'],
		re: ['x'],
		im: ['y'],
		arg: ['angle', 'phase'],
		abs: ['magnitude']
	};

	Object.defineProperties(Complex.prototype, properties);
	registerAliases(aliases, properties);

	return Complex;
})();
