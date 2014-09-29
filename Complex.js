function Complex (re, im) {
	if (this instanceof Complex) {
		this.re = re;
		this.im = im !== undefined ? im : 0;
	} else if (im === undefined && re instanceof Complex) {
		return new Complex(re.re, re.im);
	} else {
		return new Complex(re, im);
	}
};

Complex.toComplex = function toComplex (number) {
	if (number instanceof Complex) {
		return number;
	} else {
		return Complex(number);
	}
};

Complex.rect = function rect (r, phi) {
	var re = r * Math.cos(phi),
		im = r * Math.sin(phi);
	return Complex(re, im);
};

Complex.sinh = function sinh (number) {
	if (typeof Math.sinh === 'function') {
		return Math.sinh(number);
	} else {
		var y = Math.exp(number);
		return (y - 1/y) / 2;
	}
};

Complex.cosh = function cosh (number) {
	if (typeof Math.cosh === 'function') {
		return Math.cosh(number);
	} else {
		var y = Math.exp(number);
		return (y + 1/y) / 2;
	}
};

Complex.prototype.add = function add (number) {
	var complex = Complex.toComplex(number);

	this.re += complex.re;
	this.im += complex.im;

	return this;
};


Complex.prototype.sub = function sub (number) {
	var complex = Complex.toComplex(number);

	this.re -= complex.re;
	this.im -= complex.im;

	return this;
};

Complex.prototype.mul = function mul (number) {
	var complex = Complex.toComplex(number);

	var a = this.re,
		b = this.im,
		c = complex.re,
		d = complex.im;

	this.re = a * c - b * d;
	this.im = b * c + a * d;

	return this;
};

Complex.prototype.div = function div (number) {
	var complex = Complex.toComplex(number);

	var a = this.re,
		b = this.im,
		c = complex.re,
		d = complex.im,
		divider = c * c + d * d,
		result;

	if (a === 1 && b === 0) {
		this.re = c / divider;
		this.im = -(d / divider);
	} else {
		this.re = (a * c + b * d) / divider;
		this.im = (b * c - a * d) / divider;
	}

	return this;
};

Complex.prototype.conj = function conj () {
	this.im = -this.im;
	return this;
};

Complex.prototype.pow = function pow (number) {
	var complex = Complex.toComplex(number);

	var temp1 = Complex(Math.log(Math.sqrt(this.re * this.re + this.im * this.im)), Math.atan2(this.im, this.re)),
		temp2 = temp1.mul(complex),
		r = Math.exp(temp2.re);

	this.re = r * Math.cos(temp2.im);
	this.im = r * Math.sin(temp2.im);

	return this;
};

Complex.prototype.sqrt = function sqrt () {
	var r = Math.sqrt(this.re * this.re + this.im * this.im),
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
};

Complex.prototype.abs = function abs () {
	return Math.sqrt(this.re * this.re + this.im * this.im);
};

Complex.prototype.mod = Complex.prototype.abs;

Complex.prototype.arg = function arg () {
	return Math.atan2(this.im, this.re);
};

Complex.prototype.neg = function neg () {
	this.re = -this.re;
	this.im = -this.im;
	return this;
};

Complex.prototype.sin = function sin () {
	var re = this.re,
		im = this.im;

	this.re = Math.sin(re) * Complex.cosh(im);
	this.im = Math.cos(re) * Complex.sinh(im);
};

Complex.prototype.cos = function cos () {
	var re = this.re,
		im = this.im;

	this.re = Math.cos(re) * Complex.cosh(im);
	this.im = - Math.sin(re) * Complex.sinh(im);
};

Complex.prototype.sinh = function sinh () {
	var re = this.re,
		im = this.im;

	this.re = Complex.sinh(re) * Math.cos(im);
	this.im = Complex.cosh(re) * Math.sin(im);
};

Complex.prototype.cosh = function cosh () {
	var re = this.re,
		im = this.im;

	this.re = Complex.cosh(re) * Math.cos(im);
	this.im = Complex.sinh(re) * Math.sin(im);
};

Complex.prototype.is = function is (number) {
	var complex = Complex.toComplex(number);

	return this.re === complex.re && this.im === complex.im;
};