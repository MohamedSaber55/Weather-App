import { createHashRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import LayOut from './components/LayOut/LayOut.jsx';
import NotFound from './NotFound/NotFound.jsx';

function App() {

  const routes = createHashRouter([
    {
      path: '/', element: <LayOut />, children: [
        { index: true, element: <Home /> },
        { path: '*', element: <NotFound /> }
      ]
    }
  ])



  return (
    <div className="App">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
