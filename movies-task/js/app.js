var eventsMediator = {
  events: {},
  on: function (eventName, callbackfn) {
    this.events[eventName] = this.events[eventName]
      ? this.events[eventName]
      : [];
    this.events[eventName].push(callbackfn);
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (callBackfn) {
        callBackfn(data);
      });
    }
  },
};

// eventsMediator.on("fetch.movies", function () {});

// eventsMediator.emit("fetch.movies", this.data);

// Module A
const moduleA = (function () {
  // topRatedMovie = this.topRatedMovie(response.results);
  //   data = [];
  // Model
  const model = {
    data: null,
    getData: function () {
      return this.data;
    },
    setData: function (newData) {
      //   this.data.topItem = controller.topRatedMovie(newData);
      this.data = newData;
      eventsMediator.emit("fetch.movies", newData);
    },
    fetchData: function (page) {
      const settings = {
        async: true,
        crossDomain: true,
        url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${{
          page,
        }}&sort_by=popularity.desc`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzgzZDBlZjJlMGYxOWE2ODhiNjFjMzFlYmQ1ZGE0NSIsInN1YiI6IjY0Nzc0NTIxODlkOTdmMDExNjJiMDU1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6AFGoZPD2gSyIesK36Si4gE8e7zlpkp-8KMI_RRXrhw",
        },
      };
      //   console.log(this);
      //   topRatedMovie = this.topRatedMovie(response.results);

      $.ajax(settings).done(function (response) {
        data = response;
        data.topItem = controller.topRatedMovie(data);
        // console.log(data);
        // data = [topRatedMovie, response];
        // console.log(data);
        // eventsMediator.emit("fetch.movies", data);
        // eventsMediator.emit("top.movie", topRatedMovie);

        model.setData(data);
      });
    },

    // ////////////////////////////////
    // fetchData: function () {
    //   const settings = {
    //     async: true,
    //     crossDomain: true,
    //     url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
    //     method: "GET",
    //     headers: {
    //       accept: "application/json",
    //       Authorization:
    //         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzgzZDBlZjJlMGYxOWE2ODhiNjFjMzFlYmQ1ZGE0NSIsInN1YiI6IjY0Nzc0NTIxODlkOTdmMDExNjJiMDU1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6AFGoZPD2gSyIesK36Si4gE8e7zlpkp-8KMI_RRXrhw",
    //     },
    //   };

    //   $.ajax(settings).done(function (response) {
    //     data = response;
    //     console.log(data);
    //   });
    // },
  };

  // View
  const view = {
    init: function () {
      eventsMediator.on("fetch.movies", this.render);
    },
    render: function (data) {
      console.log("Module A view:", data);
      // Render the data in the UI

      var template = $("#stats-template").html();
      var rendered = Mustache.render(template, { data });
      $("#stats").html(rendered);
    },
  };

  // Controller
  const controller = {
    init: function () {
      // console.log(this)
      view.init();
      eventsMediator.on("fetch.movies", this.topRatedMovie);
      model.fetchData(1);
      //   this.fetchData(1);
      //   this.topRatedMovie(data);
      //   this.setData();
      //   data = [this.topRatedMovie(res), res];
      //   //   console.log(data);
      //   eventsMediator.emit("fetch.movies", data);
    },
    topRatedMovie: function (newData) {
      tempTopRating = 0;
      topItem = null;

      for (let i = 0; i < newData.results.length; i++) {
        // console.log(newData.results[i].vote_average);
        if (tempTopRating <= newData.results[i].vote_average) {
          tempTopRating = newData.results[i].vote_average;
          topItem = newData.results[i];
        }
      }

      //   model.setData(newData);

      return topItem;
    },
    // setData: function (newData) {
    //   this.data = newData;
    //   eventsMediator.emit("fetch.movies", newData);
    // },
    // fetchData: function (page) {
    //   const settings = {
    //     async: true,
    //     crossDomain: true,
    //     url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${{
    //       page,
    //     }}&sort_by=popularity.desc`,
    //     method: "GET",
    //     headers: {
    //       accept: "application/json",
    //       Authorization:
    //         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzgzZDBlZjJlMGYxOWE2ODhiNjFjMzFlYmQ1ZGE0NSIsInN1YiI6IjY0Nzc0NTIxODlkOTdmMDExNjJiMDU1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6AFGoZPD2gSyIesK36Si4gE8e7zlpkp-8KMI_RRXrhw",
    //     },
    //   };
    //   //   console.log(this);
    //   //   topRatedMovie = this.topRatedMovie(response.results);

    //   $.ajax(settings).done(function (response) {
    //     data = response;
    //     this.setData(data);
    //     // data = [topRatedMovie, response];
    //     // console.log(data);
    //     // eventsMediator.emit("fetch.movies", data);
    //     // eventsMediator.emit("top.movie", topRatedMovie);
    //   });
    // },
  };

  // Public interface
  return {
    controller: controller,
  };
})();

// Usage
moduleA.controller.init();

// moduleA.model.getData();
