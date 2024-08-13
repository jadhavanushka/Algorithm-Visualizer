import { Outlet, Link } from "react-router-dom";
import errorillustration from '../Images/404-error-illustration.jpg';
import { color } from "chart.js/helpers";

const noPage = () => {
    return (
        <>
        <div style={{display:"inline-flex",flexDirection:"column", justifyContent:"center"}}>
        <img src={errorillustration} alt="404" style={{width:"600px"}}/>
        <button className="visualize-btn"><Link to="/" style={{color:"#fff"}}>Go back to home</Link></button>
        </div>
        <Outlet />
    </>
    );
  };
  
  export default noPage;
  