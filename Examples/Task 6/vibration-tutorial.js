const FREEZING_ZONE = 3;
const COLD_ZONE = 2;
const HOT_ZONE = 1;

AFRAME.registerComponent("gps", {
  init: function () {
    // Do something when component first attached.

    this.tempOMeter = FREEZING_ZONE;
    this.currentAngle = 0;
    this.currentIntensity = 0;
    this.vibrotactile = this.el.components.vibrotactile;

    this.lightHouse = document.querySelector("#objective");
    this.cam = document.querySelector("#cam");
    this.onKeyDown = this.onKeyDown.bind(this);

    window.addEventListener("keydown", this.onKeyDown);
  },

  remove: function () {
    window.removeEventListener("keydown", this.onKeyDown);
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.

    var lightHousePosition = this.lightHouse.object3D.position;
    var userPosition = this.cam.object3D.position;
    var distance = userPosition.distanceTo(lightHousePosition);

    if (distance < 10) this.tempOMeter = HOT_ZONE;
    if (distance > 10 && distance < 25) this.tempOMeter = COLD_ZONE;
    else this.tempOMeter = FREEZING_ZONE;
  },

  onKeyDown: function (evt) {
    var keyPressed =
      evt.keyCode === 87 ||
      evt.keyCode === 65 ||
      evt.keyCode === 83 ||
      evt.keyCode === 68 ||
      evt.keyCode === 38 ||
      evt.keyCode === 37 ||
      evt.keyCode === 40 ||
      evt.keyCode === 39;

    if (!keyPressed) {
      return;
    }
    this.sendVibration();
  },
  sendVibration: function () {
    switch (this.tempOMeter) {
      case COLD_ZONE:
        console.log("Sending Vibrations X in actuators 5 6 ");
        break;
      case FREEZING_ZONE:
        console.log("Sending X vibrations in actuator 3 4 5 6");
        break;
      case HOT_ZONE:
        console.log("Sending sin vibrations in all actuators");
        break;
      default:
        break;
    }
    return;
  },
});
