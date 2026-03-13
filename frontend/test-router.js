import { matchRoutes } from "react-router-dom";

const routes = [
  { path: "/", element: "Navigate" },
  { path: "/login", element: "Login" },
  {
    id: "layout",
    element: "AppLayout",
    children: [
      { path: "dashboard", element: "Dashboard" },
      { path: "capture", element: "Capture" },
      { path: "attendance", element: "Attendance" }
    ]
  }
];

const matches = matchRoutes(routes, "/attendance");
console.log("Matches for /attendance:");
console.log(matches);
