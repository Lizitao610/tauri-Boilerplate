import { createBrowserRouter } from "react-router-dom";
import Main from "../views/main/index";
import Root, { loader } from "../views/root";
import ErrorPage from "../views/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: loader,
    children: [
      {
        index: true,
        element: <Main />,
      },
    ],
  },
]);

export default router;
