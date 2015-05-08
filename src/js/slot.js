/**
 * Slot abstraction
 *
 * @param paramObj
 * @constructor
 *
 *
 */
function AbstSlot(paramObj) {

	'use strict'

	var ICON_DIM = {
		width: 100,
		height: 100
	};
	var id;
	var iconNum;
	var slotPositions = [];
	var animationFrameId = null;
	var animationSpeed = 1;
	var animationMaxSpeed = 100;
	var accelaration = 1;
	var finalPosition = null; // final position in px
	var currentPosition = 0;

	function calcSlotPositions() {
		var value = ICON_DIM.height;

		var arrayLength = slotPositions.length;
		for(var i = 0; i < arrayLength; i++) {
			slotPositions.push(value);

			value = 200;
		}
	}

	function increaseSpeed() {
		animationSpeed = (animationSpeed < animationMaxSpeed) ? animationSpeed++ : animationMaxSpeed;
	}

	function decreaseSpeed() {
		animationSpeed = animationSpeed--;
	}

	this.getSlotPositions = function() {
		return slotPositions;
	}

	this.getId = function() {
		return id;
	}

	function init(paramObj) {
		id = paramObj.id;
		iconNum = paramObj.iconNum;
		slotPositions = calcSlotPositions();
	}

	init(paramObj);
}


/**
 * Reprensets a three icon slot
 *
 * @param paramObj
 * @param paramObj.id {Number} Slot id
 * @param paramObj.slotDom {HTMLelement} The html element this slot should manage. Expects to manage its background image position.
 *
 */
function Slot(paramObj) {
	var myObj = this;
	var stopPositions= [100, 300, 500]; // y pixel positions to stop at each possible final position
	var finalPositionIndex = 0; // 0 | 1 | 2 The final icon index to place in the middle of the slot
	var id = paramObj.id;
	var animationFrameId = null;
	var animationSpeed = 1;
	var animationMaxSpeed = 100;
	var accelaration = 1;
	var finalPosition = null; // final position in px
	var currentPosition = 0;

	var domElements ={
			slot: paramObj.slotDom
	};

	function increaseSpeed() {
		var speed = (animationSpeed < animationMaxSpeed) ? animationSpeed++ : animationMaxSpeed;

		$('#speed'+id).html(speed);

		return speed;
	}

	function decreaseSpeed() {
		var speed = animationSpeed--;

		$('#speed'+id).html(speed);

		return speed;
	}

	function calcSpeedIncrement() {
		return (accelaration > 0) ? increaseSpeed() : decreaseSpeed();
	}

	function render() {
		var currentYposition;

		var speedIncrement = calcSpeedIncrement();

		if(speedIncrement === 0) {
			stopAngGoToLastPosition();
			return;
		}

		switch ($.browser.name) {
		case 'chrome':
			currentPosition = parseInt(domElements.slot.css('background-position-y')) + speedIncrement;

			domElements.slot.css('background-position-y', currentPosition + "px");
			break;
		case 'mozilla': // :( not working in mozilla... suprised for jquery not doing this right...
			currentYposition = parseInt(domElements.slot.css('background-position').split(" ")[0]);

			currentYposition = (currentYposition + 10) + "px";

			domElements.slot.css('background-position', '0px '+ currentYposition);

			break;
		default:
			break;
		}
	};

	function calcLastPos() {
		var remaingTurns = currentPosition % 300;

		$("#turns"+id).html(remaingTurns);

		console.log('remaining turns', remaingTurns);

		var displacment = stopPositions[finalPositionIndex] - remaingTurns;

		console.log('finalPosition', finalPositionIndex, stopPositions[finalPositionIndex], "-", remaingTurns, 'displacement', displacment);

		return currentPosition + displacment;
	}

	function animateAndStop() {
		cancelAnimationFrame(animationFrameId);

		animationFrameId = window.requestAnimationFrame(animateAndStop);

		if(parseInt(currentPosition) < finalPosition) {
			domElements.slot.css('background-position-y', ++currentPosition);

		}else if(parseInt(currentPosition) > finalPosition) {
			domElements.slot.css('background-position-y', --currentPosition);
		}
		else {
			cancelAnimationFrame(animationFrameId);
			reset();

			myObj.onStop(id);
		}
	}

	function stopAngGoToLastPosition() {
		cancelAnimationFrame(animationFrameId);

		currentPosition = parseInt(domElements.slot.css('background-position-y'));

		finalPosition = calcLastPos();

		animateAndStop();
	}

	function reset() {
		animationSpeed = 1;
		accelaration = 1;
	};

	function startSpining() {
		animationFrameId = window.requestAnimationFrame(startSpining);
		render();
	};

	this.start = function(paramObj) {
		finalPositionIndex = paramObj.stopPosition;

		startSpining();
	};

	this.stop = function() {
		accelaration = -1;

		$('#acceleration'+id).html(accelaration);
	};

	/**
	 * Basic event implementation.
	 * Meant to be overridden by SlotMachine
	 *
	 * Fired at the end of stop() method and will pass this slot id as argument.
	 *
	 */
	this.onStop = function() {};
}

Slot.prototype = new AbstSlot({iconNum: 3})