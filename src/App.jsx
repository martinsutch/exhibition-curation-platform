import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import HomePage from "../components/HomePage";
import ItemPage from "../components/ItemPage";
import AccountPage from "../components/AccountPage";
import CollectionPage from "../components/CollectionPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/id/:id" element={<ItemPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/collection/:collection" element={<CollectionPage />} />
      </Routes>
    </>
  );
}

export default App;
