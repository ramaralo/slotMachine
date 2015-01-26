(function() {
	var slotMachine;

	/**
	 * Represents a StotMachine.
	 * Responsible for Slot instances management.
	 *
	 * @param {Object}
	 * @param.xSlots {Number} Number of slots (x like in x axis)
	 * @param.yIcons {Number} Number icons of each slot
	 */
	function SlotMachine(paramObj) {
		var initArgs = paramObj;
		var slots = [];
		var domElements = {
				startButton: $('#startButton'),
				slots: $('.slotsContainer').children()
		};
		var stopTimeout = 2000;
		var slotStopIntervalTimeout = 1000;
		var isRunning = false;

		function assignSlotInstanceStopBehaviour(slotInstance) {
			slotInstance.onStop = function(slotId) {
				if(slotId <= slots.length && isRunning && slots[slotId + 1] !== undefined) {
					function stopCallback() {
						slots[slotId + 1].stop();
					};

					window.setTimeout(stopCallback, slotStopIntervalTimeout); // sequential slot stops

				}

			};
		};

		function init(paramObj) {
			for ( var xs = 0; xs < paramObj.xSlots; xs++) {
				var slotInstance = new Slot({
					slotDom: $(domElements.slots[xs]),
					id: xs
				});

				slots.push(slotInstance);

				assignSlotInstanceStopBehaviour(slotInstance);
			};

			domElements.startButton.on('click', start);
		};

		/**
		 * Generates an array of stop positions.
		 * Generates a number between 1 and the number of slot icons.
		 * This number is used as a stop postion for each slot.
		 *
		 * @returns {Array}
		 */
		function getSlotStopPostions() {
			var positionArray =[];

			var slotNumerb = slots.length;
			for ( var s = 0; s < slotNumerb; s++) {
				positionArray.push(Math.floor((Math.random() * initArgs.yIcons) + 1));
			}
			return positionArray;
		}

		function stop() {
			console.log("SlotMachine stopping...");
			slots[0].stop(); // calling stop on first slot
		};

		/**
		 * Starts slotMachine by calling start() on each slot.
		 * Before all slots are started, their stop positions are already predefined
		 *
		 *
		 */
		function start() {
			var stopPostions = getSlotStopPostions(); // stop positions for all slots

			var slotNum = slots.length;
			for ( var s = 0; s < slotNum; s++) {
				slots[s].start({stopPosition: stopPostions[s]}); // calling start on the slot, and assigning a stop position
			}

			isRunning = true;
			setTimeout(stop, stopTimeout); // schedule stop
		};

		init(paramObj);
	}

	slotMachine = new SlotMachine({xSlots: 5, yIcons: 3});
})();