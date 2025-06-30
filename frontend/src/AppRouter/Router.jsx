import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import HomePage from "../pages/Home/Home-page";
import Register from "../pages/register/register";
import FirstPage from "../pages/First Page/firstpage";
import AddGroupDetails from "../pages/View Page/view-page";


const Router = () => {
    return ( <><BrowserRouter>
    <Routes>
        <Route path="/" element={<FirstPage/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ViewGroup" element={<AddGroupDetails/>} />
    </Routes>
    </BrowserRouter>
    </> )
}

export default Router;