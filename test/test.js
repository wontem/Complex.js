var should = require('chai').should();

describe('Complex', function(){
	var Complex = require('../Complex');

	describe('constructor', function(){
		it('return instance of Complex', function() {
			var complex = new Complex(1, 1);
			complex.should.be.instanceof(Complex);
		});

		it('return zero complex if no args', function(){
			var complex = new Complex();
			complex.should.have.property('re', 0);
			complex.should.have.property('im', 0);
		});

		it('create object with zero Im if only number arg', function(){
			var complex = new Complex(2);
			complex.should.have.property('re', 2);
			complex.should.have.property('im', 0);
		});

		it('create copy of complex number if only complex arg', function(){
			var complex = new Complex(2, -1);
			var complexCopy = new Complex(complex);

			complexCopy.should.be.not.equal(complex);

			complexCopy.should.have.property('re', complex.re);
			complexCopy.should.have.property('im', complex.im);
		});
	});

	describe('.fromString()', function() {
		it('return instance of Complex', function() {
			var complex = new Complex.fromString('1 + i');
			complex.should.be.instanceof(Complex);
		});

		it('create complex number from valid string', function() {
			var complex;

			complex = new Complex.fromString('1 + i');
			complex.should.have.property('re', 1);
			complex.should.have.property('im', 1);

			complex = new Complex.fromString('i');
			complex.should.have.property('re', 0);
			complex.should.have.property('im', 1);

			complex = new Complex.fromString('-i');
			complex.should.have.property('re', 0);
			complex.should.have.property('im', -1);

			complex = new Complex.fromString('-i-2');
			complex.should.have.property('re', -2);
			complex.should.have.property('im', -1);

			complex = new Complex.fromString('-i-2+4-13.3i');
			complex.should.have.property('re', 2);
			complex.should.have.property('im', -14.3);

			complex = new Complex.fromString('-.1i+.4');
			complex.should.have.property('re', 0.4);
			complex.should.have.property('im', -0.1);
		});
	});

	describe('.fromPolar()', function() {
		it('return instance of Complex', function() {
			var complex = new Complex.fromPolar(1, Math.PI / 2);
			complex.should.be.instanceof(Complex);
		});

		it('create complex number from polar coordinates', function() {
			var abs = 2.2;
			var arg = Math.PI / 4;
			var complex = new Complex.fromPolar(abs, arg);

			complex.should.have.property('re', abs * Math.cos(arg));
			complex.should.have.property('im', abs * Math.sin(arg));
		});
	});

	describe('.toComplex()', function() {
		it('return the complex if it is argument', function() {
			var complexA = new Complex(12, -1);
			var complexB = Complex.toComplex(complexA);

			complexA.should.be.equal(complexB);
		});

		it('convert number into complex number', function() {
			var complex = Complex.toComplex(9);

			complex.should.have.property('re', 9);
			complex.should.have.property('im', 0);
		});

		it('convert array into complex number', function() {
			var complex;

			complex = Complex.toComplex([1, 2]);
			complex.should.have.property('re', 1);
			complex.should.have.property('im', 2);

			complex = Complex.toComplex([13.2]);
			complex.should.have.property('re', 13.2);
			complex.should.have.property('im', 0);
		});

		it('convert string into complex number', function() {
			var complex = Complex.toComplex('-i-2+4-13.3i');
			complex.should.have.property('re', 2);
			complex.should.have.property('im', -14.3);
		});
	});
});