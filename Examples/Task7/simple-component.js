AFRAME.registerComponent("simple-component", {
  init: function () {
    // Do something when component first attached.

    this.vibrotactile = this.el.components.vibrotactile;

    var redbox = document.querySelector("#redbox");
    var sphere = document.querySelector("#sphere");
    var cylinder = document.querySelector("#cylinder");

    this.onClick = this.onClick.bind(this);

    redbox.addEventListener("click", this.onClick);

    // Complete the remaining code for the cylinder and for the sphere
  },

  onClick: function () {
    var sin = {
      frequency: 5,
      amplitude: 1,
    };
    this.vibrotactile.sin(sin, { duration: 500 });
  },
});
