import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Transactions from "./pages/Transactions";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
// import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/"></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="dashboard" element={<Dashboard />}></Route>
        <Route path="inventory" element={<Inventory />}></Route>
        <Route path="categories" element={<Categories />}></Route>
        <Route path="products" element={<Products />}></Route>
        <Route path="transactions" element={<Transactions />}></Route>
        <Route path="add" element={<Add />}></Route>
        <Route path="edit" element={<Edit />}></Route>
        <Route path="checkout" element={<Checkout />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
