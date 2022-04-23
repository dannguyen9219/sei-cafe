import { useState } from 'react'; // using curly braces because it is a named function in React
import NewOrderPage from '../NewOrderPage/NewOrderPage';
import AuthPage from '../AuthPage/AuthPage';
import OrderHistoryPage from '../OrderHistoryPage/OrderHistoryPage';
import './App.module.css';
import { Routes, Route } from 'react-router-dom';

function App() {

  const [user, setUser] = useState(null); // useState returns an array, so we are destructuring on the left; value of null will be stored in the first item in the array // w18d02 2:35 take lots of notes // null is falsy value


  return (
    <main className="App">
      {
        user ?
        <Routes>
          <Route path="/orders/new" element={<NewOrderPage/>}></Route>
          <Route path="/orders" element={<OrderHistoryPage/>}></Route>
        </Routes>
        :
        <AuthPage setUser={setUser} />
      }
    </main>
  );
};
// If there is no user, you cannot see the NewOrderPage. It is impossible. user ? means that if user is NOT falsy becausee we put useState(null).

export default App;
