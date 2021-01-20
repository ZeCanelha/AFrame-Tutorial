/* global AFRAME */

if (typeof AFRAME === "undefined") {
  throw new Error(
    "Component attempted to register before AFRAME was available."
  );
}

/**
 * Vibrotactile component for A-Frame.
 */

const BASE_URL = "http://localhost:3003/api";
const ENDPOINT = "/vibrate";
const DEFAULT_SAMPLING_RATE = 5;
const DEFAULT_NUMBER_OF_ACTUATORS = 6;
const DEFAULT_ACTUATORS = [0, 1, 2, 3, 4, 5];
const DEFAULT_STARTING_TIME = 0;
const DEFAULT_DURATION = 1000;
const DEFAULT_AMPLITUDE = 1;
const DEFAULT_FREQUENCY = 5;
const DEFAULT_PHASE = 0;
const DEFAULT_INITIAL_INTENSITY = 0;
const DEFAULT_FINAL_INTENSITY = 100;

// Logger messages

const LOGGER = {
  WARNING_FILE: "Warning: No vibration file specified.",
  WARNING_EVENT: "Warning: No event associated.",
  ERROR_LOADING:
    "Error: Could not load the vibration file. Check your path for errors.",
};

AFRAME.registerComponent("vibrotactile", {
  schema: {
    src: { type: "string" },
    event: { type: "string" },
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    var self = this;

    // If src is defined, load the vibrations
    if (this.data.src)
      this.vibrations = this.loadVibrationsByURL(this.data.src);

    this.vibrationHandler = function () {
      self.sendVibrations(self.vibrations);
    };
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    // "event updated": Remove the previous event listener if it exists
    if (oldData.event && data.event !== oldData.event) {
      el.removeEventListener(oldData.event, this.vibrationHandler);
    }

    // updated vibration file
    if (oldData.src && data.src !== oldData.src) {
      this.vibrations = this.loadVibrationsByURL(data.src);
    }

    if (data.event) {
      el.addEventListener(data.event, this.vibrationHandler);
    } else {
      console.log(LOGGER.WARNING_EVENT);
    }
    if (!data.src) {
      console.log(LOGGER.WARNING_FILE);
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    var data = this.data;
    var el = this.el;
    // Remove the event listener
    if (data.event) {
      el.removeEventListener(data.event, this.vibrationHandler);
    }
  },

  loadVibrationsByURL: async function (path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(LOGGER.ERROR_LOADING);
    } else {
      console.log(
        "Vibrations from " + this.data.src + " attached with success"
      );
    }
    const body = await response.json();
    return body;
  },

  sendVibrations: function () {
    vibrations = arguments[0] || this.vibrations;

    fetch(BASE_URL + ENDPOINT, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(vibrations),
    })
      .then((data) => {
        if (data.status === 200) {
          return data.json();
        } else console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  },

  /**
   *
   * @param {Object} vibrations Custom vibration intensity for a given actuator(s) during a time period
   * @param {Number} samplingRate Sampling rate
   * @param {Number} numberOfActuators Number of total actuators
   */

  customVibrations: function (
    vibrations,
    samplingRate = 5,
    numberOfActuators = 6
  ) {
    var channel = [];

    vibrations.forEach((element) => {
      var datapoints = [];
      var pattern = [];
      datapoints.push({ time: 0, intensity: element.intensity });
      datapoints.push({ time: element.duration, intensity: element.intensity });

      const patternData = {
        datapoints: datapoints,
        startingTime: element.startingTime,
        duration: element.duration,
      };

      pattern.push(patternData);
      channel.push({ patterns: pattern, actuators: element.actuators });
    });

    const body = {
      samplingRate: samplingRate,
      numberOfActuators: numberOfActuators,
      channels: channel,
    };

    // this.sendVibrations(body);
    console.log("Vibration send with " + JSON.stringify(vibrations));
  },

  /**
   * @param {Object} sin  Sin properties
   * @param {Number} sin.amplitude Sin amplitude value
   * @param {Number} sin.frequency Sin frequency value
   * @param {Number} sin.options Common parameters
   */

  sin: function (sin, options) {
    var options = options || {};
    var actuators = options.actuators || DEFAULT_ACTUATORS;
    var startingTime = options.startingTime || DEFAULT_STARTING_TIME;
    var duration = options.duration || DEFAULT_DURATION;
    var samplingRate = options.samplingRate || DEFAULT_SAMPLING_RATE;
    var numberOfActuators =
      options.numberOfActuators || DEFAULT_NUMBER_OF_ACTUATORS;

    var sin = sin || {};
    var amplitude = sin.amplitude || DEFAULT_AMPLITUDE;
    var frequency = sin.frequency || DEFAULT_FREQUENCY;
    var phase = sin.phase || DEFAULT_PHASE;

    var channel = [];
    var pattern = [];

    const sinVibration = {
      frequency: frequency,
      amplitude: amplitude,
      phase: phase,
    };
    const patternData = {
      sin: sinVibration,
      startingTime: startingTime,
      duration: duration,
    };

    pattern.push(patternData);
    channel.push({ patterns: pattern, actuators: actuators });

    const body = {
      samplingRate: samplingRate,
      numberOfActuators: numberOfActuators,
      channels: channel,
    };

    // this.sendVibrations(body);
    console.log(
      "Sin vibration send with  " +
        JSON.stringify(sinVibration) +
        " on actuators: [ " +
        actuators +
        "]"
    );
  },

  /**
   *
   * @param {Object} ramp - Ramp function intensity values
   * @param {Number} ramp.initialIntensity Initial vibration intensity value
   * @param {Number} ramp.finalIntensity Final vibration intensity value
   * @param {Object} options Common parameters
   */

  ramp: function (ramp, options) {
    var options = options || {};
    var ramp = ramp || {};
    var actuators = options.actuators || DEFAULT_ACTUATORS;
    var startingTime = options.startingTime || DEFAULT_STARTING_TIME;
    var duration = options.duration || DEFAULT_DURATION;
    var samplingRate = options.samplingRate || DEFAULT_SAMPLING_RATE;
    var numberOfActuators =
      options.numberOfActuators || DEFAULT_NUMBER_OF_ACTUATORS;

    var initialIntensity = ramp.initialIntensity || DEFAULT_INITIAL_INTENSITY;
    var finalIntensity = ramp.finalIntensity || DEFAULT_FINAL_INTENSITY;

    var channel = [];
    var pattern = [];

    const rampVibrations = {
      initialIntensity: initialIntensity,
      finalIntensity: finalIntensity,
    };
    const patternData = {
      ramp: rampVibrations,
      startingTime: startingTime,
      duration: duration,
    };

    pattern.push(patternData);
    channel.push({ patterns: pattern, actuators: actuators });

    const body = {
      samplingRate: samplingRate,
      numberOfActuators: numberOfActuators,
      channels: channel,
    };

    //this.sendVibrations(body);
    console.log(body);
  },
});
