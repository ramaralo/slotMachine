/**
 * Reprensets a three icon slot
 *
 * @param paramObj
 * @param paramObj.id {Number} Slot id
 * @param paramObj.slotDom {HTMLelement} The html element this slot should manage. Expects to manage its background image position.
 *
 */
function Slot(paramObj) {
	var stopPositions= [0, 100, 200];
	var finalPosition = 0;
	var id = paramObj.id;
	var animationFrameId = null;
	var animationSpeed = 10;


	var domElements ={
			slot: paramObj.slotDom
	};

	function render() {
		var currentYposition;

		switch ($.browser.name) {
		case 'chrome':
			currentYposition = parseInt(domElements.slot.css('background-position-y'));

			currentYposition = currentYposition + animationSpeed++;

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

	function reset() {
		animationSpeed = 10;
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
		cancelAnimationFrame(animationFrameId);

		domElements.slot.css('background-position-y', stopPositions[finalPosition-1] + "px");

		reset();

		this.onStop(id);
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