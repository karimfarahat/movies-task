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
const statsModule = {
  data: null,
  init: function () {
    eventsMediator.on("page.changed", this.fetchData.bind(this));
    eventsMediator.on("fetch.movies", this.render.bind(this));
    console.log("started init stats");

    // this.fetchData(1);
  },
  getData: function () {
    console.log(this.data);
    return this.data;
  },
  setData: function (newData) {
    this.data = newData;
    console.log("about to emit the fetch");
    eventsMediator.emit("fetch.movies", newData);
  },
  onData: function (response) {
    console.log("in done function");

    var data = response;
    data.topItem = this.topRatedMovie(data);

    this.setData(data);
  },
  fetchData: function (page) {
    console.log("in fetch data");
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzgzZDBlZjJlMGYxOWE2ODhiNjFjMzFlYmQ1ZGE0NSIsInN1YiI6IjY0Nzc0NTIxODlkOTdmMDExNjJiMDU1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6AFGoZPD2gSyIesK36Si4gE8e7zlpkp-8KMI_RRXrhw",
      },
    };
    $.ajax(settings).done(this.onData.bind(this));
  },

  topRatedMovie: function (newData) {
    tempTopRating = 0;
    topItem = null;

    for (let i = 0; i < newData.results.length; i++) {
      if (tempTopRating <= newData.results[i].vote_average) {
        tempTopRating = newData.results[i].vote_average;
        topItem = newData.results[i];
      }
    }

    return topItem;
  },
  render: function (data) {
    console.log("in render");
    console.log("Module A view:", data);

    var template = $("#stats-template").html();
    var rendered = Mustache.render(template, { data });
    $("#stats").html(rendered);
    // this.getData();
  },
};

// Movie Module
const moviesModule = {
  init: function () {
    eventsMediator.on("fetch.movies", this.render.bind(this));
  },

  render: function (data) {
    console.log("in movies render");
    console.log("Module A view:", data);
    const { results } = data;
    var template = $("#movies-template").html();
    // console.log(template);
    var rendered = Mustache.render(template, { results });
    $("#movies").html(rendered);
    $(".card").click(function (e) {
      e.preventDefault();
      eventsMediator.emit(
        "movie.clicked",
        moviesModule.chosenMovie(e.currentTarget.id)
      );
    });
    // this.getData();
  },
  chosenMovie: function (id) {
    return this.selectedMovie(id, statsModule.data);
  },
  selectedMovie: function (id, newData) {
    for (let i = 0; i < newData.results.length; i++) {
      if (id == newData.results[i].id) {
        return newData.results[i];
      }
    }
  },
};
// Modal View
const modalModule = {
  init: function () {
    eventsMediator.on("movie.clicked", this.render.bind(this));
  },

  render: function (data) {
    console.log("in modal render");
    console.log("Modal view:", data);
    // const { results } = data;
    var template = $("#modal-template").html();
    // console.log(template);
    var rendered = Mustache.render(template, { data });
    $("#my-modal").html(rendered);
    // this.getData();
  },
};
const footerModule = {
  page: 0,
  init: function () {
    eventsMediator.on("page.changed", this.render.bind(this));
    this.pageNext();
    this.buttonHandle();
    // this.render();

    console.log("footerINIT............ " + this.page);
  },

  buttonHandle: function () {
    $("#next").on("click", this.pageNext.bind(this));
    $("#previous").on("click", this.pagePrev.bind(this));
  },

  render: function () {
    console.log("footer render " + this.page);
    if (this.page <= 1) {
      $("#previous").hide();
    } else {
      $("#previous").show();
    }
  },
  pageNext: function () {
    this.page++;
    console.log(this.page + " incremented already");

    eventsMediator.emit("page.changed", this.page);
  },
  pagePrev: function () {
    if (this.page > 1) {
      this.page--;
    }
    // this.page = 1 ? 1 : this.page--;
    console.log(this.page + " decrement");

    eventsMediator.emit("page.changed", this.page);
  },
};

statsModule.init();
moviesModule.init();
modalModule.init();
footerModule.init();
