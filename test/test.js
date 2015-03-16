var should = require('chai').should();

describe('Complex', function(){
	var Complex = require('../Complex');

	it('calculate expression', function() {
		var complex = Complex(Complex.prototype.add, 1, [2, 3], '4 + 5i', new Complex(6, 7));

		complex.should.be.instanceof(Complex);

		complex.should.have.property('re', 13);
		complex.should.have.property('im', 15);


		complex = Complex(Complex.prototype.add, 1, Complex(Complex.prototype.mul, [2, 3], '4 + 5i'), new Complex(6, 7));

		complex.should.have.property('re', 0);
		complex.should.have.property('im', 29);
	});

	describe('constructor', function(){
		it('return instance of Complex', function() {
			var complex = new Complex(1, 1);
			complex.should.be.instanceof(Complex);
		});

		it('from nothing', function(){
			var complex = new Complex();
			complex.should.have.property('re', 0);
			complex.should.have.property('im', 0);
		});

		it('from number', function(){
			var complex = new Complex(2);
			complex.should.have.property('re', 2);
			complex.should.have.property('im', 0);
		});

		it('from string', function() {
			var complex;

			complex = new Complex('1 + i');
			complex.should.have.property('re', 1);
			complex.should.have.property('im', 1);

			complex = new Complex('i');
			complex.should.have.property('re', 0);
			complex.should.have.property('im', 1);

			complex = new Complex('-i');
			complex.should.have.property('re', 0);
			complex.should.have.property('im', -1);

			complex = new Complex('-i-2');
			complex.should.have.property('re', -2);
			complex.should.have.property('im', -1);

			complex = new Complex('-i-2+4-13.3i');
			complex.should.have.property('re', 2);
			complex.should.have.property('im', -14.3);

			complex = new Complex('-.1i+.4');
			complex.should.have.property('re', 0.4);
			complex.should.have.property('im', -0.1);
		});

		it('clone from complex', function(){
			var complex = new Complex(2, -1);
			var complexCopy = new Complex(complex);

			complexCopy.should.be.not.equal(complex);

			complexCopy.should.have.property('re', complex.re);
			complexCopy.should.have.property('im', complex.im);
		});

		it('from array', function() {
			var complex = new Complex([2, -1.3]);

			complex.should.have.property('re', 2);
			complex.should.have.property('im', -1.3);
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

	describe('.sum()', function() {
		it('calculate sum of arguments', function() {
			var complex = Complex.sum(1, [2, 3], '4 + 5i', new Complex(6, 7));

			complex.should.have.property('re', 13);
			complex.should.have.property('im', 15);
		});
	})

	describe('#abs', function() {
		it('get absolute value', function() {
			var complex = new Complex(3, 4);
			complex.should.have.property('abs', 5);
		});

		it('set absolute value', function() {
			var complex = new Complex(0);

			complex.abs = 10;
			complex.should.have.property('re', 10);
			complex.should.have.property('im', 0);

			complex.abs = 0;
			complex.should.have.property('re', 0);
			complex.should.have.property('im', 0);
		});
	});

	describe('#arg', function() {
		it('get argument', function() {
			var complex;

			complex = new Complex(13, 13);
			complex.should.have.property('arg', Math.PI / 4);

			complex = new Complex(-10, 0);
			complex.should.have.property('arg', Math.PI);
		});

		it('set argument', function() {
			var complex = new Complex(3, 4);

			complex.arg = Math.PI;
			complex.should.have.property('re', 5 * Math.cos(Math.PI));
			complex.should.have.property('im', 5 * Math.sin(Math.PI));
		});
	});

	describe('#toString()', function() {
		it('return string', function() {
			(new Complex(12, -3) + '').should.be.equal('12-3i');
			(new Complex(0, -2) + '').should.be.equal('-2i');
			(new Complex(5) + '').should.be.equal('5');
			(new Complex(0) + '').should.be.equal('0');
		});
	});
});