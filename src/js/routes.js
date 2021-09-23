import AboutPage from "../pages/about.jsx";
import RequestAndLoad from "../pages/request-and-load.jsx";
import NotFoundPage from "../pages/404.jsx";
import homeComponent from "../pages/home.jsx";
import loginComponent from "../pages/login.jsx";
import Profile from "../pages/profile";
import History from "../pages/history";
import { useSelector } from "react-redux";
import { selectToken } from "./store_redux.js";
import { store } from "./store_redux.js";

var routes = [
  {
    path: "/",
    async({ resolve }) {
      // let token = localStorage.getItem('x-mover-token');
      let token = store.getState().token;

      function goTo(reactComponent) {
        resolve({ component: reactComponent });
      }

      if (token) {
        goTo(homeComponent);
      } else {
        goTo(loginComponent);
      }
    },
  },
  {
    path: "/about/",
    component: AboutPage,
  },
  {
    path: "/profile/",
    component: Profile,
  },
  {
    path: "/history/",
    component: History,
  },
  {
    path: "/request-and-load/user/:userId/",
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: "Vladimir",
          lastName: "Kharlampidi",
          about: "Hello, i am creator of Framework7! Hope you like it!",
          links: [
            {
              title: "Framework7 Website",
              url: "http://framework7.io",
            },
            {
              title: "Framework7 Forum",
              url: "http://forum.framework7.io",
            },
          ],
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            },
          }
        );
      }, 1000);
    },
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
