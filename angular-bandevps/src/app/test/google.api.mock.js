window.google = {
  maps: {
    LatLng: function (lat, lng) {
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),

        lat: function () {
          return this.latitude;
        },
        lng: function () {
          return this.longitude;
        }
      };
    },
    LatLngBounds: function (ne, sw) {
      return {
        getSouthWest: function () {
          return sw;
        },
        getNorthEast: function () {
          return ne;
        }
      };
    },
    OverlayView: function () {
      return {};
    },
    InfoWindow: function () {
      return {
        addListener() {},
        setOptions() {}
      };
    },
    Marker: function () {
      return {
        addListener() {},
        setOptions() {}
      };
    },
    MarkerImage: function () {
      return {};
    },
    Map: function () {
      return {
        setOptions() {},
        setCenter() {},
        setZoom() {},
        addListener() {}
      };
    },
    Point: function () {
      return {};
    },
    Size: function () {
      return {};
    }
  }
};
