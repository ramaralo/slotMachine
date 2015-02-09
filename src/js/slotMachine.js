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
		var stopTimeout = 5000;
		var slotStopIntervalTimeout = 1000;
		var isRunning = false;
		var slotNumbers = [1,2,3];
		var sequence = [];

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
		 * // TODO update comment. when done it should generate n => 0 < 3
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

				var pos = Math.floor((Math.random() * initArgs.yIcons));

				$('#stop'+s).html(pos);

				positionArray.push(pos);
			}

			return positionArray;
		}

		function stop() {
			slots[0].stop(); // calling stop on first slot
		};

		function getSequence(stopPositions) {
			sequence = [slotNumbers[stopPositions[0]], slotNumbers[stopPositions[1]], slotNumbers[stopPositions[2]], slotNumbers[stopPositions[3]], slotNumbers[stopPositions[4]]];

			$('#seq0').html(sequence[0]);
			$('#seq1').html(sequence[1]);
			$('#seq2').html(sequence[2]);
			$('#seq3').html(sequence[3]);
			$('#seq4').html(sequence[4]);

		}

		/**
		 * Starts slotMachine by calling start() on each slot.
		 * Before all slots are started, their stop positions are already predefined
		 *
		 *
		 */
		function start() {
			var stopPositions = getSlotStopPostions(); // stop positions for all slots

			getSequence(stopPositions);

			var slotNum = slots.length;
			for ( var s = 0; s < slotNum; s++) {
				slots[s].start({stopPosition: stopPositions[s]}); // calling start on the slot, and assigning a stop position
			}

			isRunning = true;
			setTimeout(stop, stopTimeout); // schedule stop
		};

		init(paramObj);
	}

	slotMachine = new SlotMachine({xSlots: 5, yIcons: 3});
})();