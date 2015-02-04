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
	var finalPosition = 0; // 0 | 1 | 2
	var id = paramObj.id;
	var animationFrameId = null;
	var animationSpeed = 1;
	var animationMaxSpeed = 100;
	var accelaration = 1;
	var finalPosition = null; // final position in px


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
		else if(speedIncrement > animationMaxSpeed) {
			speedIncrement = animationMaxSpeed;
		}

		switch ($.browser.name) {
		case 'chrome':
			currentYposition = parseInt(domElements.slot.css('background-position-y'));

			currentYposition = currentYposition + speedIncrement;

			domElements.slot.css('background-position-y', currentYposition + "px");
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

	function calcLastPos(currentPosition) {
		var remaingTurns = currentPosition % 300;

		var displacment = stopPositions[finalPosition] - remaingTurns;

		return currentPosition + displacment;
	}

	function animateAndStop() {
		cancelAnimationFrame(animationFrameId);

		animationFrameId = window.requestAnimationFrame(animateAndStop);

		var currentPos = parseInt(domElements.slot.css('background-position-y'));

		if(parseInt(domElements.slot.css('background-position-y')) < finalPosition) {


			domElements.slot.css('background-position-y', ++currentPos);

		}else if(parseInt(domElements.slot.css('background-position-y')) > finalPosition) {
			domElements.slot.css('background-position-y', --currentPos);
		}
		else {
			cancelAnimationFrame(animationFrameId);
			reset();

			myObj.onStop(id);
		}

	}

	function gotoLastPosition() {
		var currentPosition = parseInt(domElements.slot.css('background-position-y'));

		finalPosition = calcLastPos(currentPosition);


		animateAndStop();

		//domElements.slot.css('background-position-y', calcLastPos(currentPosition) + "px");

		//reset();

		//myObj.onStop(id);
	}

	function stopAngGoToLastPosition() {
		cancelAnimationFrame(animationFrameId);

		gotoLastPosition();
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
		finalPosition = paramObj.stopPosition;
		console.log('slot starting and set to stop at: ', finalPosition);
		startSpining();
	};

	this.stop = function() {
		console.log("Slot", id, "stopping...");
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